import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mockRankings } from '@/services/mockData';
import { createBackendServiceError, createServiceResult, logBackendFallback } from '@/services/serviceHelpers';
import type { RankingEntry, ServiceResult } from '@/services/types';
import type { RankingPeriod as BackendRankingPeriod, RankingSnapshot, UserRankingStats } from '@/types/gamification';
import type { RankingPeriod, RankingUser } from '@/types/ranking';

const baseRankingUsers: Omit<RankingUser, 'rank'>[] = [
  {
    id: 'rank-user-mina',
    displayName: 'Mina',
    avatarEmoji: '🥇',
    points: 4280,
    stampCount: 34,
    badgeCount: 7,
    regionTitle: 'Jeolla Flavor Keeper',
  },
  {
    id: 'rank-user-joon',
    displayName: 'Joon',
    avatarEmoji: '🍜',
    points: 3920,
    stampCount: 31,
    badgeCount: 6,
    regionTitle: 'Seoul Snack Scout',
  },
  {
    id: 'rank-user-sora',
    displayName: 'Sora',
    avatarEmoji: '🐟',
    points: 3660,
    stampCount: 29,
    badgeCount: 6,
    regionTitle: 'Busan Seafood Seeker',
  },
  {
    id: 'rank-user-demo',
    displayName: 'Demo Traveler',
    avatarEmoji: '🍚',
    points: 1840,
    stampCount: 12,
    badgeCount: 3,
    regionTitle: 'Regional Taster',
  },
  {
    id: 'rank-user-hana',
    displayName: 'Hana',
    avatarEmoji: '🍊',
    points: 1680,
    stampCount: 11,
    badgeCount: 2,
    regionTitle: 'Jeju Seasonal Explorer',
  },
  {
    id: 'rank-user-tae',
    displayName: 'Tae',
    avatarEmoji: '🥢',
    points: 1490,
    stampCount: 10,
    badgeCount: 2,
    regionTitle: 'Market Explorer',
  },
];

function getPeriodMultiplier(period: RankingPeriod): number {
  if (period === 'weekly') {
    return 0.32;
  }

  if (period === 'monthly') {
    return 0.68;
  }

  return 1;
}

function withRanks(users: Omit<RankingUser, 'rank'>[]): RankingUser[] {
  return [...users]
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
}

export function getRankings(period: RankingPeriod): RankingUser[] {
  const multiplier = getPeriodMultiplier(period);

  return withRanks(
    baseRankingUsers.map((user, index) => ({
      ...user,
      points: Math.round(user.points * multiplier + (period === 'weekly' ? (baseRankingUsers.length - index) * 35 : 0)),
      stampCount: Math.max(1, Math.round(user.stampCount * multiplier)),
      badgeCount: Math.max(1, Math.round(user.badgeCount * multiplier)),
    })),
  );
}

export function getTopThree(period: RankingPeriod): RankingUser[] {
  return getRankings(period).slice(0, 3);
}

export function getRankingsAfterTopThree(period: RankingPeriod): RankingUser[] {
  return getRankings(period).slice(3);
}

export async function listRankings(region?: string): Promise<ServiceResult<RankingEntry[]>> {
  const rankings = region ? mockRankings.filter((entry) => entry.region === region) : mockRankings;
  return createServiceResult(rankings);
}

function assertSupabaseConfigured(scope: string): void {
  if (!isSupabaseConfigured) {
    throw createBackendServiceError(scope, 'Supabase environment variables are not configured.');
  }
}

function getRankingOrder(period: BackendRankingPeriod): string {
  if (period === 'weekly') {
    return 'weekly_points.desc';
  }

  if (period === 'monthly') {
    return 'monthly_points.desc';
  }

  return 'total_points.desc';
}

function toMockRankingStats(period: BackendRankingPeriod, limit: number): UserRankingStats[] {
  return getRankings(period === 'all' ? 'allTime' : period).slice(0, limit).map((user) => ({
    user_id: user.id,
    total_points: user.points,
    current_points: user.points,
    post_count: 0,
    approved_food_image_count: 0,
    stamp_count: user.stampCount,
    badge_count: user.badgeCount,
    weekly_points: period === 'weekly' ? user.points : Math.round(user.points * 0.32),
    monthly_points: period === 'monthly' ? user.points : Math.round(user.points * 0.68),
    last_rank_calculated_at: null,
  }));
}

function toMockRankingSnapshots(period: BackendRankingPeriod, limit: number): RankingSnapshot[] {
  return toMockRankingStats(period, limit).map((user, index) => ({
    id: `mock-ranking-snapshot-${period}-${user.user_id}`,
    period,
    rank_position: index + 1,
    user_id: user.user_id,
    points: period === 'weekly' ? user.weekly_points : period === 'monthly' ? user.monthly_points : user.total_points,
    post_count: user.post_count,
    stamp_count: user.stamp_count,
    badge_count: user.badge_count,
    snapshot_at: '2026-05-15T00:00:00.000Z',
  }));
}

export async function getTopRankings(
  period: BackendRankingPeriod,
  limit = 20,
): Promise<UserRankingStats[]> {
  try {
    assertSupabaseConfigured('rankingService.getTopRankings');

    const { data, error } = await supabase.from<UserRankingStats>('user_ranking_stats').select('*', {
      order: getRankingOrder(period),
      limit,
    });

    if (error || !data) {
      throw createBackendServiceError('rankingService.getTopRankings', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('rankingService.getTopRankings', error instanceof Error ? error.message : null);
    return toMockRankingStats(period, limit);
  }
}

export async function getMyRankingSummary(userId: string): Promise<UserRankingStats | null> {
  try {
    assertSupabaseConfigured('rankingService.getMyRankingSummary');

    const { data, error } = await supabase.from<UserRankingStats>('user_ranking_stats').select('*', {
      params: {
        user_id: `eq.${userId}`,
      },
      limit: 1,
    });

    if (error) {
      throw createBackendServiceError('rankingService.getMyRankingSummary', error.message);
    }

    return data?.[0] ?? null;
  } catch (error) {
    logBackendFallback('rankingService.getMyRankingSummary', error instanceof Error ? error.message : null);
    return toMockRankingStats('all', 20).find((ranking) => ranking.user_id === userId) ?? null;
  }
}

export async function refreshUserRankingStats(userId: string): Promise<UserRankingStats> {
  try {
    assertSupabaseConfigured('rankingService.refreshUserRankingStats');

    const { data, error } = await supabase.rpc<UserRankingStats>('refresh_user_ranking_stats', {
      p_user_id: userId,
    });

    if (error || !data) {
      throw createBackendServiceError('rankingService.refreshUserRankingStats', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('rankingService.refreshUserRankingStats', error instanceof Error ? error.message : null);
    return toMockRankingStats('all', 20).find((ranking) => ranking.user_id === userId) ?? toMockRankingStats('all', 1)[0];
  }
}

export async function getRankingSnapshots(
  period: BackendRankingPeriod,
  limit = 20,
): Promise<RankingSnapshot[]> {
  try {
    assertSupabaseConfigured('rankingService.getRankingSnapshots');

    const { data, error } = await supabase.from<RankingSnapshot>('ranking_snapshots').select('*', {
      params: {
        period: `eq.${period}`,
      },
      order: 'snapshot_at.desc,rank_position.asc',
      limit,
    });

    if (error || !data) {
      throw createBackendServiceError('rankingService.getRankingSnapshots', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('rankingService.getRankingSnapshots', error instanceof Error ? error.message : null);
    return toMockRankingSnapshots(period, limit);
  }
}

export async function refreshRankingSnapshot(period: BackendRankingPeriod, limit = 100): Promise<number> {
  try {
    assertSupabaseConfigured('rankingService.refreshRankingSnapshot');

    const { data, error } = await supabase.rpc<number>('refresh_ranking_snapshot', {
      p_period: period,
      p_limit: limit,
    });

    if (error || typeof data !== 'number') {
      throw createBackendServiceError('rankingService.refreshRankingSnapshot', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('rankingService.refreshRankingSnapshot', error instanceof Error ? error.message : null);
    return Math.min(limit, toMockRankingSnapshots(period, limit).length);
  }
}
