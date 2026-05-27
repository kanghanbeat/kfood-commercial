import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { logBackendFallback } from '@/services/serviceHelpers';
import { getMockRegionBadges } from '@/services/stampService';
import type { Badge, RecordRegionProgressParams, RegionProgress, UserBadge } from '@/types/gamification';

function assertSupabaseConfigured(scope: string): void {
  if (!isSupabaseConfigured) {
    throw new Error(`${scope}: Supabase environment variables are not configured.`);
  }
}

function getMockRegionProgress(userId: string): RegionProgress[] {
  return getMockRegionBadges().map((badge) => ({
    id: `mock-region-progress-${badge.id}`,
    user_id: userId,
    region_id: badge.id.replace('badge-', 'region-'),
    completed_action_count: badge.progressCurrent,
    target_action_count: badge.progressTarget,
    progress_percent: badge.progressPercent,
    last_action_at: badge.isUnlocked ? '2026-05-14T09:00:00.000Z' : null,
    completed_at: badge.isUnlocked ? '2026-05-14T09:00:00.000Z' : null,
    created_at: '2026-05-10T09:00:00.000Z',
    updated_at: '2026-05-14T09:00:00.000Z',
  }));
}

function getMockUserBadges(userId: string): UserBadge[] {
  return getMockRegionBadges()
    .filter((badge) => badge.isUnlocked)
    .map((badge) => ({
      id: `mock-user-badge-${badge.id}`,
      user_id: userId,
      badge_id: badge.id,
      earned_at: '2026-05-14T09:00:00.000Z',
      source_table: 'mock_region_progress',
      source_id: badge.id,
    }));
}

export async function getActiveBadges(): Promise<Badge[]> {
  try {
    assertSupabaseConfigured('gamificationService.getActiveBadges');

    const { data, error } = await supabase.from<Badge>('badges').select('*', {
      params: {
        is_active: 'eq.true',
      },
      order: 'created_at.asc',
    });

    if (error || !data) {
      throw new Error(error?.message ?? 'Badges not found.');
    }

    return data;
  } catch (error) {
    logBackendFallback('gamificationService.getActiveBadges', error instanceof Error ? error.message : null);
    return getMockRegionBadges().map((badge) => ({
      id: badge.id,
      code: badge.id,
      name: badge.badgeName,
      description: badge.description,
      badge_type: 'region',
      region_id: badge.id.replace('badge-', 'region-'),
      food_id: null,
      required_progress: badge.progressTarget,
      reward_points: badge.isUnlocked ? 50 : 0,
      is_active: true,
      created_at: '2026-05-10T09:00:00.000Z',
      updated_at: '2026-05-14T09:00:00.000Z',
    }));
  }
}

export async function getMyRegionProgress(userId: string): Promise<RegionProgress[]> {
  try {
    assertSupabaseConfigured('gamificationService.getMyRegionProgress');

    const { data, error } = await supabase.from<RegionProgress>('region_progress').select('*', {
      params: {
        user_id: `eq.${userId}`,
      },
      order: 'updated_at.desc',
    });

    if (error || !data) {
      throw new Error(error?.message ?? 'Region progress not found.');
    }

    return data;
  } catch (error) {
    logBackendFallback('gamificationService.getMyRegionProgress', error instanceof Error ? error.message : null);
    return getMockRegionProgress(userId);
  }
}

export async function getMyUserBadges(userId: string): Promise<UserBadge[]> {
  try {
    assertSupabaseConfigured('gamificationService.getMyUserBadges');

    const { data, error } = await supabase.from<UserBadge>('user_badges').select('*', {
      params: {
        user_id: `eq.${userId}`,
      },
      order: 'earned_at.desc',
    });

    if (error || !data) {
      throw new Error(error?.message ?? 'User badges not found.');
    }

    return data;
  } catch (error) {
    logBackendFallback('gamificationService.getMyUserBadges', error instanceof Error ? error.message : null);
    return getMockUserBadges(userId);
  }
}

export async function recordRegionProgressAction(params: RecordRegionProgressParams): Promise<RegionProgress> {
  try {
    assertSupabaseConfigured('gamificationService.recordRegionProgressAction');

    const { data, error } = await supabase.rpc<RegionProgress>('record_region_progress_action', {
      p_user_id: params.userId,
      p_region_id: params.regionId,
      p_source_table: params.sourceTable,
      p_source_id: params.sourceId,
    });

    if (error || !data) {
      throw new Error(error?.message ?? 'Region progress action failed.');
    }

    return data;
  } catch (error) {
    logBackendFallback('gamificationService.recordRegionProgressAction', error instanceof Error ? error.message : null);
    return getMockRegionProgress(params.userId).find((progress) => progress.region_id === params.regionId) ?? getMockRegionProgress(params.userId)[0];
  }
}
