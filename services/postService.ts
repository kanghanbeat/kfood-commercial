import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mockPosts } from '@/services/mockData';
import { createServiceResult } from '@/services/serviceHelpers';
import type { FoodPost, ServiceResult } from '@/services/types';

type PostRow = {
  id: string;
  user_id: string;
  region_id: string | null;
  food_id: string | null;
  title: string;
  content: string | null;
  status: 'draft' | 'published' | 'hidden' | 'deleted';
  created_at: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
};

type RegionRow = {
  id: string;
  name_ko: string;
  name_en: string | null;
  city: string | null;
};

type FoodRow = {
  id: string;
  name_ko: string;
  name_en: string | null;
};

function warnAndFallback(message: string, error?: string | null): void {
  console.warn(`[Supabase Posts] ${message}${error ? ` ${error}` : ''}`);
}

function mapPost(
  row: PostRow,
  profilesById: Record<string, ProfileRow | undefined>,
  regionsById: Record<string, RegionRow | undefined>,
  foodsById: Record<string, FoodRow | undefined>,
): FoodPost {
  const region = row.region_id ? regionsById[row.region_id] : undefined;
  const food = row.food_id ? foodsById[row.food_id] : undefined;
  const profile = profilesById[row.user_id];

  return {
    id: row.id,
    authorId: row.user_id,
    authorName: profile?.display_name ?? 'K-Food Traveler',
    region: region?.name_en ?? region?.city ?? region?.name_ko ?? 'Korea',
    dishName: food?.name_en ?? food?.name_ko ?? row.title,
    note: row.content ?? row.title,
    stampCount: 0,
    pointCount: 0,
    createdAt: row.created_at,
  };
}

async function loadPostLookups(): Promise<{
  profilesById: Record<string, ProfileRow | undefined>;
  regionsById: Record<string, RegionRow | undefined>;
  foodsById: Record<string, FoodRow | undefined>;
}> {
  const [profiles, regions, foods] = await Promise.all([
    supabase.from<ProfileRow>('profiles').select('id,display_name'),
    supabase.from<RegionRow>('regions').select('id,name_ko,name_en,city'),
    supabase.from<FoodRow>('foods').select('id,name_ko,name_en'),
  ]);

  if (profiles.error) {
    warnAndFallback('Profile lookup was blocked or failed. Using anonymous author names.', profiles.error.message);
  }

  if (regions.error) {
    warnAndFallback('Region lookup failed. Using fallback region names.', regions.error.message);
  }

  if (foods.error) {
    warnAndFallback('Food lookup failed. Using post title as dish name.', foods.error.message);
  }

  return {
    profilesById: Object.fromEntries((profiles.data ?? []).map((item) => [item.id, item])),
    regionsById: Object.fromEntries((regions.data ?? []).map((item) => [item.id, item])),
    foodsById: Object.fromEntries((foods.data ?? []).map((item) => [item.id, item])),
  };
}

export async function listPosts(): Promise<ServiceResult<FoodPost[]>> {
  if (!isSupabaseConfigured) {
    warnAndFallback('Missing environment variables. Returning mock posts.');
    return createServiceResult(mockPosts);
  }

  const { data, error } = await supabase.from<PostRow>('posts').select('id,user_id,region_id,food_id,title,content,status,created_at', {
    params: {
      status: 'eq.published',
    },
    order: 'created_at.desc',
  });

  if (error || !data) {
    warnAndFallback('Post query failed. Returning mock posts.', error?.message);
    return createServiceResult(mockPosts, error?.message ?? 'Post query failed.');
  }

  const lookups = await loadPostLookups();
  return createServiceResult(
    data.map((post) => mapPost(post, lookups.profilesById, lookups.regionsById, lookups.foodsById)),
    null,
    'supabase-ready',
  );
}

export async function getPostById(postId: string): Promise<ServiceResult<FoodPost | null>> {
  const mockPost = mockPosts.find((item) => item.id === postId) ?? null;

  if (!isSupabaseConfigured) {
    warnAndFallback('Missing environment variables. Returning mock post.');
    return createServiceResult(mockPost, mockPost ? null : 'Post not found.');
  }

  const { data, error } = await supabase.from<PostRow>('posts').select('id,user_id,region_id,food_id,title,content,status,created_at', {
    params: {
      id: `eq.${postId}`,
    },
    limit: 1,
  });

  if (error || !data) {
    warnAndFallback('Post detail query failed. Returning mock post.', error?.message);
    return createServiceResult(mockPost, error?.message ?? (mockPost ? null : 'Post not found.'));
  }

  const row = data[0];

  if (!row) {
    return createServiceResult(mockPost, mockPost ? null : 'Post not found.', 'supabase-ready');
  }

  const lookups = await loadPostLookups();
  return createServiceResult(mapPost(row, lookups.profilesById, lookups.regionsById, lookups.foodsById), null, 'supabase-ready');
}
