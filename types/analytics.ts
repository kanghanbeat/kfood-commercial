import type { Json } from '@/lib/supabase';

export type BehaviorEventType =
  | 'post_view'
  | 'post_like'
  | 'post_save'
  | 'post_create'
  | 'food_image_upload'
  | 'food_image_approved'
  | 'stamp_earned'
  | 'region_view'
  | 'food_view'
  | 'search';

export type BehaviorTargetType = 'post' | 'food' | 'region' | 'stamp' | 'search';

export type UserBehaviorLog = {
  id: string;
  user_id: string | null;
  event_type: BehaviorEventType;
  target_type: BehaviorTargetType | null;
  target_id: string | null;
  metadata: Json;
  created_at: string;
};

export type PostStats = {
  post_id: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  save_count: number;
  share_count: number;
  report_count: number;
  recommendation_score: number;
  popularity_score: number;
  updated_at: string;
};

export type FoodPopularityScore = {
  food_id: string;
  view_count: number;
  post_count: number;
  approved_image_count: number;
  stamp_earned_count: number;
  search_count: number;
  popularity_score: number;
  updated_at: string;
};

export type RegionPopularityScore = {
  region_id: string;
  view_count: number;
  post_count: number;
  stamp_earned_count: number;
  search_count: number;
  popularity_score: number;
  updated_at: string;
};

export type LogUserBehaviorParams = {
  userId: string;
  eventType: BehaviorEventType;
  targetType: BehaviorTargetType;
  targetId?: string;
  metadata?: Record<string, Json | undefined>;
};

export type BehaviorLogResult = {
  behaviorLog: UserBehaviorLog;
  statsUpdated: boolean;
};
