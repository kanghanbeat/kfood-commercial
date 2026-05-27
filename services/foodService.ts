import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mockFoods } from '@/services/mockData';
import { createServiceResult } from '@/services/serviceHelpers';
import type { FoodRecommendation, ServiceResult } from '@/services/types';

type FoodRow = {
  id: string;
  region_id: string | null;
  name_ko: string;
  name_en: string | null;
  category: string | null;
  description: string | null;
  is_active: boolean;
};

type RegionRow = {
  id: string;
  name_ko: string;
  name_en: string | null;
  province: string | null;
  city: string | null;
};

function warnAndFallback(message: string, error?: string | null): void {
  console.warn(`[Supabase Foods] ${message}${error ? ` ${error}` : ''}`);
}

function mapFood(row: FoodRow, regionsById: Record<string, RegionRow | undefined>): FoodRecommendation {
  const region = row.region_id ? regionsById[row.region_id] : undefined;

  return {
    id: row.id,
    region: region?.name_en ?? region?.city ?? region?.province ?? region?.name_ko ?? 'Korea',
    name: row.name_en ?? row.name_ko,
    category: row.category ?? 'K-Food',
    description: row.description ?? '',
    tags: [row.category, region?.name_en ?? region?.city].filter((tag): tag is string => Boolean(tag)),
  };
}

export async function listFoodsByRegion(
  region?: string
): Promise<ServiceResult<FoodRecommendation[]>> {
  const mockFallback = region ? mockFoods.filter((food) => food.region === region) : mockFoods;

  if (!isSupabaseConfigured) {
    warnAndFallback('Missing environment variables. Returning mock foods.');
    return createServiceResult(mockFallback);
  }

  const [{ data: foodRows, error: foodError }, { data: regionRows, error: regionError }] = await Promise.all([
    supabase.from<FoodRow>('foods').select('id,region_id,name_ko,name_en,category,description,is_active', {
      params: {
        is_active: 'eq.true',
      },
      order: 'created_at.desc',
    }),
    supabase.from<RegionRow>('regions').select('id,name_ko,name_en,province,city'),
  ]);

  if (foodError || regionError || !foodRows) {
    warnAndFallback('Food query failed. Returning mock foods.', foodError?.message ?? regionError?.message);
    return createServiceResult(mockFallback, foodError?.message ?? regionError?.message ?? 'Food query failed.');
  }

  const regionsById = Object.fromEntries((regionRows ?? []).map((item) => [item.id, item]));
  const foods = foodRows.map((item) => mapFood(item, regionsById));
  const filteredFoods = region ? foods.filter((food) => food.region === region) : foods;

  return createServiceResult(filteredFoods, null, 'supabase-ready');
}
