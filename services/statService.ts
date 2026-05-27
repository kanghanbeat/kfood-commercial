import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { createBackendServiceError, logBackendFallback } from '@/services/serviceHelpers';
import type { FoodPopularityScore, PostStats, RegionPopularityScore } from '@/types/analytics';

function assertSupabaseConfigured(scope: string): void {
  if (!isSupabaseConfigured) {
    throw createBackendServiceError(scope, 'Supabase environment variables are not configured.');
  }
}

function getMockPostStats(postId: string): PostStats {
  return {
    post_id: postId,
    view_count: 96,
    like_count: 18,
    comment_count: 4,
    save_count: 9,
    share_count: 2,
    report_count: 0,
    recommendation_score: 84,
    popularity_score: 116.6,
    updated_at: new Date().toISOString(),
  };
}

function getMockFoodPopularityScore(foodId: string): FoodPopularityScore {
  return {
    food_id: foodId,
    view_count: 142,
    post_count: 16,
    approved_image_count: 11,
    stamp_earned_count: 7,
    search_count: 21,
    popularity_score: 155.7,
    updated_at: new Date().toISOString(),
  };
}

function getMockRegionPopularityScore(regionId: string): RegionPopularityScore {
  return {
    region_id: regionId,
    view_count: 220,
    post_count: 31,
    stamp_earned_count: 18,
    search_count: 34,
    popularity_score: 222,
    updated_at: new Date().toISOString(),
  };
}

export async function incrementPostView(postId: string): Promise<PostStats> {
  try {
    assertSupabaseConfigured('statService.incrementPostView');

    const { data, error } = await supabase.rpc<PostStats>('increment_post_view', {
      p_post_id: postId,
    });

    if (error || !data) {
      throw createBackendServiceError('statService.incrementPostView', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('statService.incrementPostView', error instanceof Error ? error.message : null);
    return getMockPostStats(postId);
  }
}

export async function incrementFoodView(foodId: string): Promise<FoodPopularityScore> {
  try {
    assertSupabaseConfigured('statService.incrementFoodView');

    const { data, error } = await supabase.rpc<FoodPopularityScore>('increment_food_view', {
      p_food_id: foodId,
    });

    if (error || !data) {
      throw createBackendServiceError('statService.incrementFoodView', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('statService.incrementFoodView', error instanceof Error ? error.message : null);
    return getMockFoodPopularityScore(foodId);
  }
}

export async function incrementRegionView(regionId: string): Promise<RegionPopularityScore> {
  try {
    assertSupabaseConfigured('statService.incrementRegionView');

    const { data, error } = await supabase.rpc<RegionPopularityScore>('increment_region_view', {
      p_region_id: regionId,
    });

    if (error || !data) {
      throw createBackendServiceError('statService.incrementRegionView', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('statService.incrementRegionView', error instanceof Error ? error.message : null);
    return getMockRegionPopularityScore(regionId);
  }
}

export async function recalculatePostPopularity(postId: string): Promise<PostStats> {
  try {
    assertSupabaseConfigured('statService.recalculatePostPopularity');

    const { data, error } = await supabase.from<PostStats>('post_stats').select('*', {
      params: {
        post_id: `eq.${postId}`,
      },
      limit: 1,
    });

    if (error || !data?.[0]) {
      throw createBackendServiceError('statService.recalculatePostPopularity', error?.message ?? 'Post stats row not found.');
    }

    const row = data[0];
    const popularityScore =
      row.like_count * 3 + row.save_count * 5 + row.comment_count * 2 + row.view_count * 0.1 - row.report_count * 10;

    const updated = await supabase.from<PostStats>('post_stats').update(
      {
        popularity_score: popularityScore,
      },
      {
        params: {
          post_id: `eq.${postId}`,
        },
      },
    );

    if (updated.error || !updated.data?.[0]) {
      throw createBackendServiceError('statService.recalculatePostPopularity', updated.error?.message);
    }

    return updated.data[0];
  } catch (error) {
    logBackendFallback('statService.recalculatePostPopularity', error instanceof Error ? error.message : null);
    return getMockPostStats(postId);
  }
}

export async function recalculateFoodPopularity(foodId: string): Promise<FoodPopularityScore> {
  try {
    assertSupabaseConfigured('statService.recalculateFoodPopularity');

    const { data, error } = await supabase.from<FoodPopularityScore>('food_popularity_scores').select('*', {
      params: {
        food_id: `eq.${foodId}`,
      },
      limit: 1,
    });

    if (error || !data?.[0]) {
      throw createBackendServiceError('statService.recalculateFoodPopularity', error?.message ?? 'Food stats row not found.');
    }

    const row = data[0];
    const popularityScore =
      row.approved_image_count * 5 +
      row.post_count * 3 +
      row.stamp_earned_count * 4 +
      row.view_count * 0.1 +
      row.search_count * 0.5;

    const updated = await supabase.from<FoodPopularityScore>('food_popularity_scores').update(
      {
        popularity_score: popularityScore,
      },
      {
        params: {
          food_id: `eq.${foodId}`,
        },
      },
    );

    if (updated.error || !updated.data?.[0]) {
      throw createBackendServiceError('statService.recalculateFoodPopularity', updated.error?.message);
    }

    return updated.data[0];
  } catch (error) {
    logBackendFallback('statService.recalculateFoodPopularity', error instanceof Error ? error.message : null);
    return getMockFoodPopularityScore(foodId);
  }
}

export async function recalculateRegionPopularity(regionId: string): Promise<RegionPopularityScore> {
  try {
    assertSupabaseConfigured('statService.recalculateRegionPopularity');

    const { data, error } = await supabase.from<RegionPopularityScore>('region_popularity_scores').select('*', {
      params: {
        region_id: `eq.${regionId}`,
      },
      limit: 1,
    });

    if (error || !data?.[0]) {
      throw createBackendServiceError('statService.recalculateRegionPopularity', error?.message ?? 'Region stats row not found.');
    }

    const row = data[0];
    const popularityScore = row.post_count * 3 + row.stamp_earned_count * 5 + row.view_count * 0.1 + row.search_count * 0.5;

    const updated = await supabase.from<RegionPopularityScore>('region_popularity_scores').update(
      {
        popularity_score: popularityScore,
      },
      {
        params: {
          region_id: `eq.${regionId}`,
        },
      },
    );

    if (updated.error || !updated.data?.[0]) {
      throw createBackendServiceError('statService.recalculateRegionPopularity', updated.error?.message);
    }

    return updated.data[0];
  } catch (error) {
    logBackendFallback('statService.recalculateRegionPopularity', error instanceof Error ? error.message : null);
    return getMockRegionPopularityScore(regionId);
  }
}
