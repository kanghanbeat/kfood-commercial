import type { Json } from '@/lib/supabase';

export type PointEventType =
  | 'post_created'
  | 'food_image_uploaded'
  | 'food_image_approved'
  | 'stamp_earned'
  | 'region_progress'
  | 'badge_earned'
  | 'post_liked'
  | 'content_rejected'
  | 'admin_adjustment';

export type RankingPeriod = 'all' | 'weekly' | 'monthly';

export type PointTransaction = {
  id: string;
  user_id: string;
  event_type: PointEventType;
  points: number;
  source_table: string | null;
  source_id: string | null;
  idempotency_key: string | null;
  reason: string | null;
  metadata: Json;
  created_at: string;
};

export type AntiFarmingEvent = {
  id: string;
  user_id: string;
  event_type: PointEventType;
  source_table: string | null;
  source_id: string | null;
  blocked_reason: string;
  metadata: Json;
  created_at: string;
};

export type StampDefinition = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  action_type: string;
  category: string;
  condition_value: number;
  reward_points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserStampProgress = {
  id: string;
  user_id: string;
  stamp_id: string;
  action_type: string;
  category: string;
  current_value: number;
  condition_value: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StampProgressResult = {
  stamp_id: string;
  code: string;
  name: string;
  current_value: number;
  condition_value: number;
  is_completed: boolean;
  reward_points: number;
  awarded_points: boolean;
};

export type UserRankingStats = {
  user_id: string;
  total_points: number;
  current_points: number;
  post_count: number;
  approved_food_image_count: number;
  stamp_count: number;
  badge_count: number;
  weekly_points: number;
  monthly_points: number;
  last_rank_calculated_at: string | null;
};

export type AwardPointsParams = {
  userId: string;
  eventType: PointEventType;
  points: number;
  sourceTable?: string;
  sourceId?: string;
  reason?: string;
  idempotencyKey?: string;
  metadata?: Record<string, Json | undefined>;
};

export type DeductPointsParams = AwardPointsParams;

export type UserPointSummary = {
  user_id: string;
  current_points: number;
  total_accumulated_points: number;
};

export type RegionProgress = {
  id: string;
  user_id: string;
  region_id: string;
  completed_action_count: number;
  target_action_count: number;
  progress_percent: number;
  last_action_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Badge = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  badge_type: 'region' | 'food' | 'streak' | 'seasonal' | 'community' | 'admin';
  region_id: string | null;
  food_id: string | null;
  required_progress: number;
  reward_points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  source_table: string | null;
  source_id: string | null;
};

export type RankingSnapshot = {
  id: string;
  period: RankingPeriod;
  rank_position: number;
  user_id: string;
  points: number;
  post_count: number;
  stamp_count: number;
  badge_count: number;
  snapshot_at: string;
};

export type RecordRegionProgressParams = {
  userId: string;
  regionId: string;
  sourceTable?: string;
  sourceId?: string;
};
