import type { Json } from '@/lib/supabase';

export type RecommendationSourceType = 'journal' | 'place' | 'food' | 'region';

export type RecommendationReasonType =
  | 'preferred_region'
  | 'preferred_tag'
  | 'popular'
  | 'recent'
  | 'uncollected_stamp'
  | 'seasonal'
  | 'not_repeated'
  | 'diverse_region';

export interface RecommendationReason {
  type: RecommendationReasonType;
  label: string;
}

export interface MockUserPreference {
  preferredRegions: string[];
  preferredTags: string[];
  collectedStampIds: string[];
  recentlySeenItemIds: string[];
  recentlySeenRegionNames: string[];
}

export interface RecommendedItem {
  id: string;
  sourceType: RecommendationSourceType;
  sourceId: string;
  title: string;
  description: string;
  regionName: string;
  foodTags: string[];
  imageEmoji: string;
  popularity: number;
  createdAt: string;
  relatedStampId?: string;
  isSeasonal: boolean;
}

export interface RecommendationScoreBreakdown {
  baseScore: number;
  personalRegionBonus: number;
  personalTagBonus: number;
  growthBonus: number;
  seasonalBonus: number;
  repetitionPenalty: number;
  totalScore: number;
}

export interface ScoredRecommendation extends RecommendedItem {
  score: RecommendationScoreBreakdown;
  reasons: RecommendationReason[];
}

export type RecommendationSurface =
  | 'home_feed'
  | 'best_posts'
  | 'food_detail'
  | 'region_detail'
  | 'discovery_hub';

export type RecommendationTargetType = 'post' | 'food' | 'region';

export type RecommendationEventType = 'shown' | 'clicked' | 'dismissed' | 'saved';
export type RecommendationFeedbackAction = 'hide' | 'not_interested';

export type RecommendationEvent = {
  id: string;
  user_id: string | null;
  surface: RecommendationSurface;
  target_type: RecommendationTargetType;
  target_id: string;
  event_type: RecommendationEventType;
  rank_position: number | null;
  score_snapshot: number | null;
  metadata: Json;
  created_at: string;
};

export type RecommendationSignalType =
  | 'view'
  | 'like'
  | 'save'
  | 'search'
  | 'stamp'
  | 'region_progress'
  | 'badge'
  | 'manual'
  | 'shown'
  | 'clicked'
  | 'dismissed'
  | 'saved';

export type RecommendationSignal = {
  id: string;
  user_id: string | null;
  target_type: RecommendationTargetType;
  target_id: string;
  signal_type: RecommendationSignalType;
  weight: number;
  metadata: Json;
  created_at: string;
};

export type UserInterest = {
  id: string;
  user_id: string;
  preferred_food_categories: string[];
  preferred_regions: string[];
  interest_weights: Record<string, number>;
  created_at: string;
  updated_at: string;
};

export type PersonalizedFeedItem = {
  post_id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  category: string;
  region_id: string | null;
  food_id: string | null;
  like_count: number;
  view_count: number;
  score: number;
  created_at: string;
};

export type RecordRecommendationEventParams = {
  userId: string;
  surface: RecommendationSurface;
  targetType: RecommendationTargetType;
  targetId: string;
  eventType: RecommendationEventType;
  rankPosition?: number;
  scoreSnapshot?: number;
  metadata?: Record<string, Json | undefined>;
};

export type RecommendationFeedbackParams = {
  userId: string;
  item: ScoredRecommendation;
  action: RecommendationFeedbackAction;
  rankPosition?: number;
};
