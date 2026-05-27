import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { createBackendServiceError, logBackendFallback } from '@/services/serviceHelpers';
import type { StampProgressResult } from '@/types/gamification';

export type ApprovedFoodImageSignalParams = {
  userId: string;
  foodId: string;
  regionId?: string;
  foodCategory?: string;
  sourceId: string;
};

export type ApprovedFoodImageSignalResult = {
  awarded_points: number;
  updated_food_score: number;
  stamp_results: StampProgressResult[];
  ranking_refreshed: boolean;
  message: string;
};

type ApprovedFoodImageSignalRpcResult = {
  awarded_points: number;
  updated_food_score: number;
  stamp_results: StampProgressResult[];
  ranking_refreshed: boolean;
  message: string;
};

function assertSupabaseConfigured(scope: string): void {
  if (!isSupabaseConfigured) {
    throw createBackendServiceError(scope, 'Supabase environment variables are not configured.');
  }
}

function getMockApprovedFoodImageSignalResult(params: ApprovedFoodImageSignalParams): ApprovedFoodImageSignalResult {
  return {
    awarded_points: 120,
    updated_food_score: 155.7,
    stamp_results: [
      {
        stamp_id: `mock-stamp-${params.foodCategory ?? 'food'}`,
        code: `mock-${params.foodCategory ?? 'food'}-approved`,
        name: 'Food Image Approved',
        current_value: 1,
        condition_value: 1,
        is_completed: true,
        reward_points: 30,
        awarded_points: true,
      },
    ],
    ranking_refreshed: true,
    message: 'Mock fallback: approved food image signal was not persisted.',
  };
}

export async function handleApprovedFoodImageSignal(
  params: ApprovedFoodImageSignalParams,
): Promise<ApprovedFoodImageSignalResult> {
  try {
    assertSupabaseConfigured('aiApprovalSignalService.handleApprovedFoodImageSignal');

    const { data, error } = await supabase.rpc<ApprovedFoodImageSignalRpcResult[]>('handle_approved_food_image_signal', {
      p_user_id: params.userId,
      p_food_id: params.foodId,
      p_region_id: params.regionId,
      p_food_category: params.foodCategory,
      p_source_id: params.sourceId,
    });

    if (error || !data?.[0]) {
      throw createBackendServiceError('aiApprovalSignalService.handleApprovedFoodImageSignal', error?.message);
    }

    return {
      awarded_points: data[0].awarded_points,
      updated_food_score: data[0].updated_food_score,
      stamp_results: data[0].stamp_results,
      ranking_refreshed: data[0].ranking_refreshed,
      message: data[0].message,
    };
  } catch (error) {
    logBackendFallback('aiApprovalSignalService.handleApprovedFoodImageSignal', error instanceof Error ? error.message : null);
    return getMockApprovedFoodImageSignalResult(params);
  }
}
