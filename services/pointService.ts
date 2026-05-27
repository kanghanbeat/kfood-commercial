import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { createBackendServiceError, logBackendFallback, sanitizeJsonRecord } from '@/services/serviceHelpers';
import type {
  AntiFarmingEvent,
  AwardPointsParams,
  DeductPointsParams,
  PointTransaction,
  UserPointSummary,
} from '@/types/gamification';
import type { UserLevel, UserProfile } from '@/types/user';

type PointHistoryItem = {
  id: string;
  title: string;
  points: number;
  createdAt: string;
};

type PointTransactionInsert = {
  user_id: string;
  event_type: PointTransaction['event_type'];
  points: number;
  source_table?: string;
  source_id?: string;
  reason?: string;
  idempotency_key?: string;
  metadata?: PointTransaction['metadata'];
};

type ProfilePointRow = {
  id: string;
  current_points: number;
  total_accumulated_points: number;
};

const levelThresholds = [
  { level: 1, label: 'K-Food Rookie', minPoints: 0 },
  { level: 2, label: 'Market Explorer', minPoints: 500 },
  { level: 3, label: 'Regional Taster', minPoints: 1200 },
  { level: 4, label: 'Stamp Collector', minPoints: 2500 },
  { level: 5, label: 'K-Food Master', minPoints: 5000 },
];

const pointAwardAllowlist: Partial<Record<PointTransaction['event_type'], number>> = {
  post_created: 80,
  food_image_uploaded: 20,
  food_image_approved: 100,
  stamp_earned: 120,
  region_progress: 10,
  badge_earned: 50,
  post_liked: 5,
};

export function calculateUserLevel(totalPoints: number): UserLevel {
  const currentLevel =
    [...levelThresholds].reverse().find((threshold) => totalPoints >= threshold.minPoints) ?? levelThresholds[0];
  const nextLevel = levelThresholds.find((threshold) => threshold.minPoints > currentLevel.minPoints);
  const nextLevelPoints = nextLevel?.minPoints ?? currentLevel.minPoints;
  const pointsInLevel = totalPoints - currentLevel.minPoints;
  const pointsNeeded = nextLevel ? nextLevel.minPoints - currentLevel.minPoints : Math.max(totalPoints, 1);
  const progressPercent = nextLevel ? Math.min(100, Math.round((pointsInLevel / pointsNeeded) * 100)) : 100;

  return {
    level: currentLevel.level,
    label: currentLevel.label,
    currentPoints: totalPoints,
    minPoints: currentLevel.minPoints,
    nextLevelPoints,
    progressPercent,
  };
}

export function getMockUserProfile(): UserProfile {
  const totalPoints = 1840;

  return {
    id: 'user-demo-traveler',
    displayName: 'Demo Traveler',
    email: 'traveler@example.com',
    role: 'user',
    avatarEmoji: '🍜',
    totalPoints,
    level: calculateUserLevel(totalPoints),
    collectedStampCount: 12,
    totalStampCount: 50,
    unlockedBadgeCount: 3,
  };
}

export function getPointHistory(): PointHistoryItem[] {
  return [
    { id: 'point-journal-seoul', title: 'Posted Seoul market journal', points: 80, createdAt: '2026-05-14T08:00:00.000Z' },
    { id: 'point-stamp-jeonju', title: 'Collected Jeonju local food stamp', points: 120, createdAt: '2026-05-13T09:30:00.000Z' },
    { id: 'point-review-busan', title: 'Saved Busan seafood route', points: 40, createdAt: '2026-05-12T11:15:00.000Z' },
  ];
}

function assertSupabaseConfigured(scope: string): void {
  if (!isSupabaseConfigured) {
    throw createBackendServiceError(scope, 'Supabase environment variables are not configured.');
  }
}

function createMockPointTransaction(params: AwardPointsParams, signedPoints: number): PointTransaction {
  return {
    id: `mock-point-${params.eventType}-${params.sourceId ?? Date.now()}`,
    user_id: params.userId,
    event_type: params.eventType,
    points: signedPoints,
    source_table: params.sourceTable ?? null,
    source_id: params.sourceId ?? null,
    idempotency_key: params.idempotencyKey ?? null,
    reason: params.reason ?? 'Mock point transaction fallback',
    metadata: sanitizeJsonRecord(params.metadata),
    created_at: new Date().toISOString(),
  };
}

function getMockPointSummary(userId: string): UserPointSummary {
  const profile = getMockUserProfile();

  return {
    user_id: userId,
    current_points: profile.totalPoints,
    total_accumulated_points: profile.totalPoints,
  };
}

function getMockPointTransactions(userId: string): PointTransaction[] {
  return getPointHistory().map((item) => ({
    id: item.id,
    user_id: userId,
    event_type: item.points >= 100 ? 'stamp_earned' : 'post_created',
    points: item.points,
    source_table: null,
    source_id: null,
    idempotency_key: null,
    reason: item.title,
    metadata: {},
    created_at: item.createdAt,
  }));
}

function getMockAntiFarmingEvents(userId: string): AntiFarmingEvent[] {
  return [
    {
      id: 'mock-anti-farming-duplicate-source',
      user_id: userId,
      event_type: 'post_created',
      source_table: 'posts',
      source_id: 'mock-duplicate-post',
      blocked_reason: 'duplicate_source_reward',
      metadata: { fallback: true },
      created_at: '2026-05-14T12:00:00.000Z',
    },
  ];
}

async function insertPointTransaction(params: AwardPointsParams, signedPoints: number): Promise<PointTransaction> {
  assertSupabaseConfigured('pointService');

  const payload: PointTransactionInsert = {
    user_id: params.userId,
    event_type: params.eventType,
    points: signedPoints,
    source_table: params.sourceTable,
    source_id: params.sourceId,
    reason: params.reason,
    idempotency_key: params.idempotencyKey,
    metadata: sanitizeJsonRecord(params.metadata),
  };

  const { data, error } = await supabase.rpc<PointTransaction>('apply_point_transaction', {
    p_user_id: payload.user_id,
    p_event_type: payload.event_type,
    p_points: payload.points,
    p_source_table: payload.source_table,
    p_source_id: payload.source_id,
    p_reason: payload.reason,
    p_idempotency_key: payload.idempotency_key ?? (payload.source_id ? `${payload.event_type}:${payload.source_table ?? 'source'}:${payload.source_id}` : undefined),
    p_metadata: payload.metadata ?? {},
  });

  if (error || !data) {
    throw createBackendServiceError('pointService.insertPointTransaction', error?.message);
  }

  return data;
}

function getTrustedAwardPoints(params: AwardPointsParams): number {
  if (params.eventType === 'admin_adjustment') {
    return Math.max(0, Math.min(params.points, 500));
  }

  return pointAwardAllowlist[params.eventType] ?? 0;
}

export async function getMyAntiFarmingEvents(userId: string): Promise<AntiFarmingEvent[]> {
  try {
    assertSupabaseConfigured('pointService.getMyAntiFarmingEvents');

    const { data, error } = await supabase.from<AntiFarmingEvent>('anti_farming_events').select('*', {
      params: {
        user_id: `eq.${userId}`,
      },
      order: 'created_at.desc',
    });

    if (error || !data) {
      throw createBackendServiceError('pointService.getMyAntiFarmingEvents', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('pointService.getMyAntiFarmingEvents', error instanceof Error ? error.message : null);
    return getMockAntiFarmingEvents(userId);
  }
}

export async function awardPoints(params: AwardPointsParams): Promise<PointTransaction> {
  const trustedPoints = getTrustedAwardPoints(params);

  if (trustedPoints <= 0) {
    logBackendFallback('pointService.awardPoints', 'Awarded points must be zero or positive.');
    return createMockPointTransaction(params, 0);
  }

  try {
    return await insertPointTransaction(params, trustedPoints);
  } catch (error) {
    logBackendFallback('pointService.awardPoints', error instanceof Error ? error.message : null);
    return createMockPointTransaction(params, trustedPoints);
  }
}

export async function deductPoints(params: DeductPointsParams): Promise<PointTransaction> {
  if (params.points < 0) {
    logBackendFallback('pointService.deductPoints', 'Deducted points input must be zero or positive.');
    return createMockPointTransaction(params, 0);
  }

  try {
    return await insertPointTransaction(params, -params.points);
  } catch (error) {
    logBackendFallback('pointService.deductPoints', error instanceof Error ? error.message : null);
    return createMockPointTransaction(params, -params.points);
  }
}

export async function getMyPointHistory(userId: string): Promise<PointTransaction[]> {
  try {
    assertSupabaseConfigured('pointService.getMyPointHistory');

    const { data, error } = await supabase.from<PointTransaction>('point_transactions').select('*', {
      params: {
        user_id: `eq.${userId}`,
      },
      order: 'created_at.desc',
    });

    if (error || !data) {
      throw createBackendServiceError('pointService.getMyPointHistory', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('pointService.getMyPointHistory', error instanceof Error ? error.message : null);
    return getMockPointTransactions(userId);
  }
}

export async function getUserPointSummary(userId: string): Promise<UserPointSummary> {
  try {
    assertSupabaseConfigured('pointService.getUserPointSummary');

    const { data, error } = await supabase.from<ProfilePointRow>('profiles').select('id,current_points,total_accumulated_points', {
      params: {
        id: `eq.${userId}`,
      },
      limit: 1,
    });

    if (error || !data?.[0]) {
      throw createBackendServiceError('pointService.getUserPointSummary', error?.message ?? 'Profile point summary not found.');
    }

    return {
      user_id: data[0].id,
      current_points: data[0].current_points,
      total_accumulated_points: data[0].total_accumulated_points,
    };
  } catch (error) {
    logBackendFallback('pointService.getUserPointSummary', error instanceof Error ? error.message : null);
    return getMockPointSummary(userId);
  }
}
