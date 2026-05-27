import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mockStampProgress } from '@/services/mockData';
import { createBackendServiceError, createServiceResult, logBackendFallback } from '@/services/serviceHelpers';
import type { ServiceResult, StampProgress } from '@/services/types';
import type { StampProgressResult, UserStampProgress } from '@/types/gamification';
import type { RegionBadge, Stamp, StampSummary } from '@/types/stamp';

const mockStamps: Stamp[] = [
  {
    id: 'stamp-seoul-market',
    name: 'Seoul Market Starter',
    description: 'Logged a street food route in Seoul.',
    category: 'region',
    regionName: 'Seoul',
    icon: '🥢',
    isCollected: true,
    collectedAt: '2026-05-10T09:00:00.000Z',
    earnHint: 'Post a journal from a Seoul market route.',
  },
  {
    id: 'stamp-busan-seafood',
    name: 'Busan Seafood Walk',
    description: 'Saved or reviewed a Busan seafood place.',
    category: 'food',
    regionName: 'Busan',
    foodTag: 'seafood',
    icon: '🐟',
    isCollected: true,
    collectedAt: '2026-05-11T09:00:00.000Z',
    earnHint: 'Visit a Busan seafood market and create a food journal.',
  },
  {
    id: 'stamp-jeonju-classic',
    name: 'Jeonju Classic Bowl',
    description: 'Completed a traditional Jeonju food action.',
    category: 'region',
    regionName: 'Jeonju',
    foodTag: 'bibimbap',
    icon: '🍚',
    isCollected: true,
    collectedAt: '2026-05-12T09:00:00.000Z',
    earnHint: 'Log Jeonju Bibimbap or Kongnamul Gukbap.',
  },
  {
    id: 'stamp-jeju-seasonal',
    name: 'Jeju Seasonal Bite',
    description: 'Try a seasonal Jeju recommendation.',
    category: 'seasonal',
    regionName: 'Jeju',
    icon: '🍊',
    isCollected: false,
    earnHint: 'Discover and save a seasonal Jeju food route.',
  },
  {
    id: 'stamp-hidden-gem',
    name: 'Hidden Gem Finder',
    description: 'Find a lesser-known local food place.',
    category: 'event',
    icon: '✨',
    isCollected: false,
    earnHint: 'Create a journal tagged hidden gem.',
  },
];

const mockRegionBadges: RegionBadge[] = [
  {
    id: 'badge-seoul',
    regionName: 'Seoul',
    badgeName: 'Seoul Snack Scout',
    description: 'Explore market snacks across Seoul.',
    icon: '🏙️',
    isUnlocked: true,
    progressCurrent: 5,
    progressTarget: 5,
    progressPercent: 100,
    earnHint: 'Collect 5 Seoul food stamps.',
  },
  {
    id: 'badge-busan',
    regionName: 'Busan',
    badgeName: 'Busan Seafood Seeker',
    description: 'Track coastal food discoveries.',
    icon: '🌊',
    isUnlocked: true,
    progressCurrent: 4,
    progressTarget: 4,
    progressPercent: 100,
    earnHint: 'Collect 4 Busan seafood or market stamps.',
  },
  {
    id: 'badge-jeju',
    regionName: 'Jeju',
    badgeName: 'Jeju Seasonal Explorer',
    description: 'Discover seasonal island foods.',
    icon: '🍊',
    isUnlocked: false,
    progressCurrent: 2,
    progressTarget: 5,
    progressPercent: 40,
    earnHint: 'Collect 5 Jeju seasonal food stamps.',
  },
  {
    id: 'badge-gyeonggi',
    regionName: 'Gyeonggi',
    badgeName: 'Gyeonggi Day Tripper',
    description: 'Find commuter-friendly food trips.',
    icon: '🚇',
    isUnlocked: false,
    progressCurrent: 1,
    progressTarget: 4,
    progressPercent: 25,
    earnHint: 'Save 4 Gyeonggi food routes.',
  },
  {
    id: 'badge-gangwon',
    regionName: 'Gangwon',
    badgeName: 'Gangwon Mountain Table',
    description: 'Explore mountain and seasonal dishes.',
    icon: '⛰️',
    isUnlocked: false,
    progressCurrent: 0,
    progressTarget: 4,
    progressPercent: 0,
    earnHint: 'Create journals for 4 Gangwon local foods.',
  },
  {
    id: 'badge-jeolla',
    regionName: 'Jeolla',
    badgeName: 'Jeolla Flavor Keeper',
    description: 'Complete traditional food missions.',
    icon: '🥘',
    isUnlocked: true,
    progressCurrent: 6,
    progressTarget: 6,
    progressPercent: 100,
    earnHint: 'Collect 6 Jeolla traditional food stamps.',
  },
  {
    id: 'badge-gyeongsang',
    regionName: 'Gyeongsang',
    badgeName: 'Gyeongsang Local Route',
    description: 'Discover local markets and soups.',
    icon: '🍲',
    isUnlocked: false,
    progressCurrent: 2,
    progressTarget: 5,
    progressPercent: 40,
    earnHint: 'Collect 5 Gyeongsang food stamps.',
  },
  {
    id: 'badge-chungcheong',
    regionName: 'Chungcheong',
    badgeName: 'Chungcheong Slow Food',
    description: 'Explore relaxed regional routes.',
    icon: '🌾',
    isUnlocked: false,
    progressCurrent: 1,
    progressTarget: 4,
    progressPercent: 25,
    earnHint: 'Collect 4 Chungcheong route stamps.',
  },
];

export function getMockStamps(): Stamp[] {
  return mockStamps.map((stamp) => ({ ...stamp }));
}

export function getMockRegionBadges(): RegionBadge[] {
  return mockRegionBadges.map((badge) => ({ ...badge }));
}

export function getStampSummary(): StampSummary {
  const collected = 12;
  const total = 50;

  return {
    collected,
    total,
    completionPercent: Math.round((collected / total) * 100),
  };
}

export function getUnlockedBadges(): RegionBadge[] {
  return getMockRegionBadges().filter((badge) => badge.isUnlocked);
}

export function getLockedBadges(): RegionBadge[] {
  return getMockRegionBadges().filter((badge) => !badge.isUnlocked);
}

export async function listStampProgress(userId: string): Promise<ServiceResult<StampProgress[]>> {
  const progress = mockStampProgress.filter((stamp) => stamp.userId === userId);
  return createServiceResult(progress);
}

function assertSupabaseConfigured(scope: string): void {
  if (!isSupabaseConfigured) {
    throw createBackendServiceError(scope, 'Supabase environment variables are not configured.');
  }
}

function getMockStampProgressResults(actionType: string, category: string): StampProgressResult[] {
  return getMockStamps()
    .filter((stamp) => stamp.category === category || stamp.foodTag === category || stamp.regionName === category)
    .slice(0, 3)
    .map((stamp) => ({
      stamp_id: stamp.id,
      code: stamp.id,
      name: stamp.name,
      current_value: stamp.isCollected ? 1 : 0,
      condition_value: 1,
      is_completed: stamp.isCollected,
      reward_points: actionType === 'food_image_approved' ? 30 : 10,
      awarded_points: false,
    }));
}

export async function checkAndIncrementStampProgress(
  userId: string,
  actionType: string,
  category: string,
): Promise<StampProgressResult[]> {
  try {
    assertSupabaseConfigured('stampService.checkAndIncrementStampProgress');

    const { data, error } = await supabase.rpc<StampProgressResult[]>('check_and_increment_stamp_progress', {
      p_user_id: userId,
      p_action_type: actionType,
      p_category: category,
    });

    if (error || !data) {
      throw createBackendServiceError('stampService.checkAndIncrementStampProgress', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('stampService.checkAndIncrementStampProgress', error instanceof Error ? error.message : null);
    return getMockStampProgressResults(actionType, category);
  }
}

export async function getMyStampProgress(userId: string): Promise<UserStampProgress[]> {
  try {
    assertSupabaseConfigured('stampService.getMyStampProgress');

    const { data, error } = await supabase.from<UserStampProgress>('user_stamp_progress').select('*', {
      params: {
        user_id: `eq.${userId}`,
      },
      order: 'updated_at.desc',
    });

    if (error || !data) {
      throw createBackendServiceError('stampService.getMyStampProgress', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('stampService.getMyStampProgress', error instanceof Error ? error.message : null);
    return getMockStamps().map((stamp) => ({
      id: `mock-progress-${stamp.id}`,
      user_id: userId,
      stamp_id: stamp.id,
      action_type: 'mock',
      category: stamp.category,
      current_value: stamp.isCollected ? 1 : 0,
      condition_value: 1,
      is_completed: stamp.isCollected,
      completed_at: stamp.collectedAt ?? null,
      created_at: stamp.collectedAt ?? new Date().toISOString(),
      updated_at: stamp.collectedAt ?? new Date().toISOString(),
    }));
  }
}

export async function getCompletedStamps(userId: string): Promise<UserStampProgress[]> {
  try {
    assertSupabaseConfigured('stampService.getCompletedStamps');

    const { data, error } = await supabase.from<UserStampProgress>('user_stamp_progress').select('*', {
      params: {
        user_id: `eq.${userId}`,
        is_completed: 'eq.true',
      },
      order: 'completed_at.desc',
    });

    if (error || !data) {
      throw createBackendServiceError('stampService.getCompletedStamps', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('stampService.getCompletedStamps', error instanceof Error ? error.message : null);
    return getMockStamps()
      .filter((stamp) => stamp.isCollected)
      .map((stamp) => ({
        id: `mock-progress-${stamp.id}`,
        user_id: userId,
        stamp_id: stamp.id,
        action_type: 'mock',
        category: stamp.category,
        current_value: 1,
        condition_value: 1,
        is_completed: true,
        completed_at: stamp.collectedAt ?? new Date().toISOString(),
        created_at: stamp.collectedAt ?? new Date().toISOString(),
        updated_at: stamp.collectedAt ?? new Date().toISOString(),
      }));
  }
}
