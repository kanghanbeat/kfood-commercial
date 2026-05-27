import { isSupabaseConfigured, supabase, type Json } from '@/lib/supabase';
import { createBackendServiceError, logBackendFallback } from '@/services/serviceHelpers';
import { incrementFoodView, incrementPostView, incrementRegionView } from '@/services/statService';
import type {
  BehaviorLogResult,
  BehaviorTargetType,
  LogUserBehaviorParams,
  UserBehaviorLog,
} from '@/types/analytics';

const blockedMetadataKeys = new Set([
  'ip',
  'ip_address',
  'device_id',
  'device_fingerprint',
  'fingerprint',
  'latitude',
  'longitude',
  'lat',
  'lng',
  'gps',
  'exact_location',
]);

type UserBehaviorLogInsert = {
  user_id: string;
  event_type: UserBehaviorLog['event_type'];
  target_type: BehaviorTargetType;
  target_id?: string;
  metadata: Record<string, Json>;
};

function assertSupabaseConfigured(scope: string): void {
  if (!isSupabaseConfigured) {
    throw createBackendServiceError(scope, 'Supabase environment variables are not configured.');
  }
}

function sanitizeMetadata(metadata?: Record<string, Json | undefined>): Record<string, Json> {
  return Object.entries(metadata ?? {}).reduce<Record<string, Json>>((sanitized, [key, value]) => {
    if (value !== undefined && !blockedMetadataKeys.has(key.toLowerCase())) {
      sanitized[key] = value;
    }

    return sanitized;
  }, {});
}

function createMockBehaviorLog(params: LogUserBehaviorParams): UserBehaviorLog {
  return {
    id: `mock-behavior-${params.eventType}-${params.targetId ?? Date.now()}`,
    user_id: params.userId,
    event_type: params.eventType,
    target_type: params.targetType,
    target_id: params.targetId ?? null,
    metadata: sanitizeMetadata(params.metadata),
    created_at: new Date().toISOString(),
  };
}

export async function logUserBehavior(params: LogUserBehaviorParams): Promise<UserBehaviorLog> {
  try {
    assertSupabaseConfigured('behaviorLogService.logUserBehavior');

    const payload: UserBehaviorLogInsert = {
      user_id: params.userId,
      event_type: params.eventType,
      target_type: params.targetType,
      target_id: params.targetId,
      metadata: sanitizeMetadata(params.metadata),
    };

    const { data, error } = await supabase.from<UserBehaviorLog>('user_behavior_logs').insert(payload);

    if (error || !data?.[0]) {
      throw createBackendServiceError('behaviorLogService.logUserBehavior', error?.message);
    }

    return data[0];
  } catch (error) {
    logBackendFallback('behaviorLogService.logUserBehavior', error instanceof Error ? error.message : null);
    return createMockBehaviorLog(params);
  }
}

export async function logPostView(
  userId: string,
  postId: string,
  metadata?: Record<string, Json | undefined>,
): Promise<BehaviorLogResult> {
  const behaviorLog = await logUserBehavior({
    userId,
    eventType: 'post_view',
    targetType: 'post',
    targetId: postId,
    metadata,
  });

  const stats = await incrementPostView(postId);
  return { behaviorLog, statsUpdated: Boolean(stats) };
}

export async function logFoodView(
  userId: string,
  foodId: string,
  metadata?: Record<string, Json | undefined>,
): Promise<BehaviorLogResult> {
  const behaviorLog = await logUserBehavior({
    userId,
    eventType: 'food_view',
    targetType: 'food',
    targetId: foodId,
    metadata,
  });

  const stats = await incrementFoodView(foodId);
  return { behaviorLog, statsUpdated: Boolean(stats) };
}

export async function logRegionView(
  userId: string,
  regionId: string,
  metadata?: Record<string, Json | undefined>,
): Promise<BehaviorLogResult> {
  const behaviorLog = await logUserBehavior({
    userId,
    eventType: 'region_view',
    targetType: 'region',
    targetId: regionId,
    metadata,
  });

  const stats = await incrementRegionView(regionId);
  return { behaviorLog, statsUpdated: Boolean(stats) };
}

export async function logPostLike(
  userId: string,
  postId: string,
  metadata?: Record<string, Json | undefined>,
): Promise<UserBehaviorLog> {
  return logUserBehavior({
    userId,
    eventType: 'post_like',
    targetType: 'post',
    targetId: postId,
    metadata,
  });
}

export async function logPostSave(
  userId: string,
  postId: string,
  metadata?: Record<string, Json | undefined>,
): Promise<UserBehaviorLog> {
  return logUserBehavior({
    userId,
    eventType: 'post_save',
    targetType: 'post',
    targetId: postId,
    metadata,
  });
}
