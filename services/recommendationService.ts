import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { deleteCachedValue, getCachedValue, setCachedValue } from '@/services/cacheService';
import { createBackendServiceError, logBackendFallback, sanitizeJsonRecord } from '@/services/serviceHelpers';
import type { PostStats } from '@/types/analytics';
import type {
  MockUserPreference,
  PersonalizedFeedItem,
  RecommendationEvent,
  RecommendationSignal,
  RecommendedItem,
  RecommendationFeedbackParams,
  RecordRecommendationEventParams,
  RecommendationReason,
  RecommendationScoreBreakdown,
  ScoredRecommendation,
} from '@/types/recommendation';

type RecommendationEventInsert = {
  user_id: string;
  surface: RecommendationEvent['surface'];
  target_type: RecommendationEvent['target_type'];
  target_id: string;
  event_type: RecommendationEvent['event_type'];
  rank_position?: number;
  score_snapshot?: number;
  metadata?: RecommendationEvent['metadata'];
};

type PostFeedRow = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  region_id: string | null;
  food_id: string | null;
  created_at: string;
};

type FeedbackBucket = {
  hiddenIds: Set<string>;
  notInterestedTags: Set<string>;
  notInterestedRegions: Set<string>;
};

const recommendationCacheTtlMs = 90 * 1000;
const feedbackByUserId = new Map<string, FeedbackBucket>();

function assertSupabaseConfigured(scope: string): void {
  if (!isSupabaseConfigured) {
    throw createBackendServiceError(scope, 'Supabase environment variables are not configured.');
  }
}

function getFeedbackBucket(userId: string): FeedbackBucket {
  const existingBucket = feedbackByUserId.get(userId);

  if (existingBucket) {
    return existingBucket;
  }

  const bucket: FeedbackBucket = {
    hiddenIds: new Set<string>(),
    notInterestedTags: new Set<string>(),
    notInterestedRegions: new Set<string>(),
  };

  feedbackByUserId.set(userId, bucket);
  return bucket;
}

function toTargetType(item: RecommendedItem): 'post' | 'food' | 'region' {
  if (item.sourceType === 'food') {
    return 'food';
  }

  if (item.sourceType === 'region') {
    return 'region';
  }

  return 'post';
}

function applyFeedbackFilter(items: ScoredRecommendation[], userId: string): ScoredRecommendation[] {
  const feedback = getFeedbackBucket(userId);

  return items.filter((item) => {
    if (feedback.hiddenIds.has(item.id) || feedback.hiddenIds.has(item.sourceId)) {
      return false;
    }

    if (feedback.notInterestedRegions.has(item.regionName)) {
      return false;
    }

    return !item.foodTags.some((tag) => feedback.notInterestedTags.has(tag));
  });
}

function diversifyRecommendations(items: ScoredRecommendation[]): ScoredRecommendation[] {
  const selected: ScoredRecommendation[] = [];
  const deferred: ScoredRecommendation[] = [];
  const regionCounts = new Map<string, number>();
  const primaryTagCounts = new Map<string, number>();

  items.forEach((item) => {
    const primaryTag = item.foodTags[0] ?? 'general';
    const regionCount = regionCounts.get(item.regionName) ?? 0;
    const tagCount = primaryTagCounts.get(primaryTag) ?? 0;

    if (regionCount === 0 || tagCount === 0 || selected.length < 2) {
      selected.push({
        ...item,
        reasons: regionCount === 0 ? [...item.reasons, { type: 'diverse_region', label: 'Balances your feed' }] : item.reasons,
      });
      regionCounts.set(item.regionName, regionCount + 1);
      primaryTagCounts.set(primaryTag, tagCount + 1);
      return;
    }

    deferred.push(item);
  });

  return [...selected, ...deferred];
}

function getMockPersonalizedFeedItems(limit: number, offset: number): PersonalizedFeedItem[] {
  return getScoredRecommendations().slice(offset, offset + limit).map((item) => ({
    post_id: item.sourceId,
    title: item.title,
    content: item.description,
    image_url: null,
    category: item.foodTags[0] ?? '',
    region_id: item.sourceType === 'region' ? item.sourceId : null,
    food_id: item.sourceType === 'food' ? item.sourceId : null,
    like_count: Math.round(item.popularity / 4),
    view_count: item.popularity,
    score: item.score.totalScore,
    created_at: item.createdAt,
  }));
}

function createMockRecommendationEvent(params: RecordRecommendationEventParams): RecommendationEvent {
  return {
    id: `mock-recommendation-event-${params.targetType}-${params.targetId}-${Date.now()}`,
    user_id: params.userId,
    surface: params.surface,
    target_type: params.targetType,
    target_id: params.targetId,
    event_type: params.eventType,
    rank_position: params.rankPosition ?? null,
    score_snapshot: params.scoreSnapshot ?? null,
    metadata: sanitizeJsonRecord(params.metadata),
    created_at: new Date().toISOString(),
  };
}

function getMockRecommendationSignals(userId: string, limit: number): RecommendationSignal[] {
  return getScoredRecommendations().slice(0, limit).map((item, index) => ({
    id: `mock-recommendation-signal-${item.id}`,
    user_id: userId,
    target_type: item.sourceType === 'journal' || item.sourceType === 'place' ? 'post' : item.sourceType,
    target_id: item.sourceId,
    signal_type: index % 2 === 0 ? 'clicked' : 'shown',
    weight: index % 2 === 0 ? 3 : 1,
    metadata: {
      fallback: true,
      surface: 'discovery_hub',
      score: item.score.totalScore,
    },
    created_at: item.createdAt,
  }));
}

export function getMockUserPreference(): MockUserPreference {
  return {
    preferredRegions: ['Seoul', 'Jeonju'],
    preferredTags: ['street_food', 'traditional', 'spicy', 'bibimbap'],
    collectedStampIds: ['stamp-seoul-market', 'stamp-jeonju-classic'],
    recentlySeenItemIds: ['rec-busan-gukbap'],
    recentlySeenRegionNames: ['Busan'],
  };
}

export function getMockRecommendedItems(): RecommendedItem[] {
  return [
    {
      id: 'rec-seoul-market-tteokbokki',
      sourceType: 'place',
      sourceId: 'place-gwangjang-market',
      title: 'Gwangjang Market Tteokbokki Route',
      description: 'A snack-focused route that can earn another Seoul market action.',
      regionName: 'Seoul',
      foodTags: ['street_food', 'spicy', 'tteokbokki'],
      imageEmoji: '🌶️',
      popularity: 92,
      createdAt: '2026-05-14T10:00:00.000Z',
      relatedStampId: 'stamp-seoul-market',
      isSeasonal: false,
    },
    {
      id: 'rec-jeonju-bibimbap-walk',
      sourceType: 'journal',
      sourceId: 'journal-jeonju-bibimbap-walk',
      title: 'Jeonju Bibimbap Heritage Walk',
      description: 'Traditional rice bowl route with strong match to your Jeonju interests.',
      regionName: 'Jeonju',
      foodTags: ['traditional', 'bibimbap', 'rice'],
      imageEmoji: '🍚',
      popularity: 84,
      createdAt: '2026-05-13T09:00:00.000Z',
      relatedStampId: 'stamp-jeonju-classic',
      isSeasonal: false,
    },
    {
      id: 'rec-jeju-seasonal-citrus',
      sourceType: 'region',
      sourceId: 'region-jeju',
      title: 'Jeju Seasonal Dessert Discovery',
      description: 'A seasonal island pick that opens a new stamp opportunity.',
      regionName: 'Jeju',
      foodTags: ['dessert', 'seasonal', 'cafe'],
      imageEmoji: '🍊',
      popularity: 76,
      createdAt: '2026-05-15T08:00:00.000Z',
      relatedStampId: 'stamp-jeju-seasonal',
      isSeasonal: true,
    },
    {
      id: 'rec-busan-gukbap',
      sourceType: 'food',
      sourceId: 'food-gukbap',
      title: 'Busan Gukbap Comfort Route',
      description: 'Popular soup route, but recently viewed Busan items reduce its priority.',
      regionName: 'Busan',
      foodTags: ['traditional', 'soup', 'local_specialty'],
      imageEmoji: '🍲',
      popularity: 88,
      createdAt: '2026-05-11T08:00:00.000Z',
      relatedStampId: 'stamp-busan-seafood',
      isSeasonal: false,
    },
    {
      id: 'rec-gangwon-potato-noodles',
      sourceType: 'food',
      sourceId: 'food-gangwon-noodles',
      title: 'Gangwon Potato Noodle Mission',
      description: 'A new-region recommendation for users who need more region badge progress.',
      regionName: 'Gangwon',
      foodTags: ['noodle', 'local_specialty', 'seasonal'],
      imageEmoji: '🥔',
      popularity: 64,
      createdAt: '2026-05-12T08:00:00.000Z',
      relatedStampId: 'stamp-gangwon-mountain',
      isSeasonal: true,
    },
  ];
}

function getRecencyScore(createdAt: string): number {
  const createdTime = new Date(createdAt).getTime();
  const currentTime = new Date('2026-05-15T00:00:00.000Z').getTime();
  const daysOld = Math.max(0, (currentTime - createdTime) / (1000 * 60 * 60 * 24));

  return Math.max(0, 10 - Math.round(daysOld * 2));
}

export function calculateRecommendationScore(
  item: RecommendedItem,
  preference: MockUserPreference,
): RecommendationScoreBreakdown {
  const popularityScore = Math.round((Math.min(100, item.popularity) / 100) * 30);
  const baseScore = popularityScore + getRecencyScore(item.createdAt);
  const personalRegionBonus = preference.preferredRegions.includes(item.regionName) ? 30 : 0;
  const matchingTags = item.foodTags.filter((tag) => preference.preferredTags.includes(tag));
  const personalTagBonus = Math.min(30, matchingTags.length * 15);
  const growthBonus =
    item.relatedStampId && !preference.collectedStampIds.includes(item.relatedStampId) ? 20 : 0;
  const seasonalBonus = item.isSeasonal ? 10 : 0;
  const repetitionPenalty =
    preference.recentlySeenItemIds.includes(item.id) || preference.recentlySeenRegionNames.includes(item.regionName)
      ? 50
      : 0;
  const totalScore = baseScore + personalRegionBonus + personalTagBonus + growthBonus + seasonalBonus - repetitionPenalty;

  return {
    baseScore,
    personalRegionBonus,
    personalTagBonus,
    growthBonus,
    seasonalBonus,
    repetitionPenalty,
    totalScore,
  };
}

export function getRecommendationReasons(
  item: RecommendedItem,
  preference: MockUserPreference,
  score: RecommendationScoreBreakdown,
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];

  if (score.personalRegionBonus > 0) {
    reasons.push({ type: 'preferred_region', label: 'Matches your favorite region' });
  }

  if (score.personalTagBonus > 0) {
    reasons.push({ type: 'preferred_tag', label: 'Based on your favorite food tags' });
  }

  if (item.popularity >= 80) {
    reasons.push({ type: 'popular', label: 'Popular with K-Food travelers' });
  }

  if (score.growthBonus > 0) {
    reasons.push({ type: 'uncollected_stamp', label: 'New stamp opportunity' });
  }

  if (score.seasonalBonus > 0) {
    reasons.push({ type: 'seasonal', label: 'Seasonal food pick' });
  }

  if (score.repetitionPenalty === 0) {
    reasons.push({ type: 'not_repeated', label: 'Fresh recommendation' });
  }

  return reasons;
}

export function getScoredRecommendations(): ScoredRecommendation[] {
  const preference = getMockUserPreference();

  return diversifyRecommendations(getMockRecommendedItems()
    .map((item) => {
      const score = calculateRecommendationScore(item, preference);

      return {
        ...item,
        foodTags: [...item.foodTags],
        score,
        reasons: getRecommendationReasons(item, preference, score),
      };
    })
    .sort((a, b) => b.score.totalScore - a.score.totalScore));
}

export function getVisibleScoredRecommendations(userId: string): ScoredRecommendation[] {
  return diversifyRecommendations(applyFeedbackFilter(getScoredRecommendations(), userId));
}

export function clearRecommendationFeedback(userId: string): ScoredRecommendation[] {
  feedbackByUserId.delete(userId);
  deleteCachedValue(`personalized-feed:${userId}:`);
  return getVisibleScoredRecommendations(userId);
}

export async function getPersonalizedFeed(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<PersonalizedFeedItem[]> {
  const cacheKey = `personalized-feed:${userId}:${limit}:${offset}`;
  const cachedFeed = getCachedValue<PersonalizedFeedItem[]>(cacheKey);

  if (cachedFeed) {
    return cachedFeed;
  }

  try {
    assertSupabaseConfigured('recommendationService.getPersonalizedFeed');

    const { data, error } = await supabase.rpc<PersonalizedFeedItem[]>('get_personalized_feed', {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset,
    });

    if (error || !data) {
      throw createBackendServiceError('recommendationService.getPersonalizedFeed', error?.message);
    }

    return setCachedValue(cacheKey, data, recommendationCacheTtlMs);
  } catch (error) {
    logBackendFallback('recommendationService.getPersonalizedFeed', error instanceof Error ? error.message : null);
    return setCachedValue(cacheKey, getMockPersonalizedFeedItems(limit, offset), recommendationCacheTtlMs);
  }
}

export async function getBestPosts(limit = 20, offset = 0): Promise<PersonalizedFeedItem[]> {
  const cacheKey = `best-posts:${limit}:${offset}`;
  const cachedFeed = getCachedValue<PersonalizedFeedItem[]>(cacheKey);

  if (cachedFeed) {
    return cachedFeed;
  }

  try {
    assertSupabaseConfigured('recommendationService.getBestPosts');

    const { data: statsRows, error: statsError } = await supabase.from<PostStats>('post_stats').select('*', {
      order: 'popularity_score.desc',
      limit,
      params: {
        offset: String(Math.max(0, offset)),
      },
    });

    if (statsError || !statsRows) {
      throw createBackendServiceError('recommendationService.getBestPosts', statsError?.message);
    }

    if (statsRows.length === 0) {
      return setCachedValue(cacheKey, getMockPersonalizedFeedItems(limit, offset), recommendationCacheTtlMs);
    }

    const postIds = statsRows.map((row) => row.post_id);
    const { data: posts, error: postsError } = await supabase.from<PostFeedRow>('posts').select(
      'id,title,content,image_url,region_id,food_id,created_at',
      {
        params: {
          id: `in.(${postIds.join(',')})`,
        },
      },
    );

    if (postsError || !posts) {
      throw createBackendServiceError('recommendationService.getBestPosts', postsError?.message);
    }

    const postsById = Object.fromEntries(posts.map((post) => [post.id, post]));

    return setCachedValue(cacheKey, statsRows
      .map((stats) => {
        const post = postsById[stats.post_id];

        if (!post) {
          return null;
        }

        return {
          post_id: stats.post_id,
          title: post.title,
          content: post.content,
          image_url: post.image_url,
          category: '',
          region_id: post.region_id,
          food_id: post.food_id,
          like_count: stats.like_count,
          view_count: stats.view_count,
          score: stats.popularity_score,
          created_at: post.created_at,
        };
      })
      .filter((item): item is PersonalizedFeedItem => Boolean(item)), recommendationCacheTtlMs);
  } catch (error) {
    logBackendFallback('recommendationService.getBestPosts', error instanceof Error ? error.message : null);
    return setCachedValue(cacheKey, getMockPersonalizedFeedItems(limit, offset), recommendationCacheTtlMs);
  }
}

export async function recordRecommendationEvent(
  params: RecordRecommendationEventParams,
): Promise<RecommendationEvent> {
  try {
    assertSupabaseConfigured('recommendationService.recordRecommendationEvent');

    const payload: RecommendationEventInsert = {
      user_id: params.userId,
      surface: params.surface,
      target_type: params.targetType,
      target_id: params.targetId,
      event_type: params.eventType,
      rank_position: params.rankPosition,
      score_snapshot: params.scoreSnapshot,
      metadata: sanitizeJsonRecord(params.metadata),
    };

    const { data, error } = await supabase.rpc<RecommendationEvent>('record_recommendation_event', {
      p_user_id: payload.user_id,
      p_surface: payload.surface,
      p_target_type: payload.target_type,
      p_target_id: payload.target_id,
      p_event_type: payload.event_type,
      p_rank_position: payload.rank_position,
      p_score_snapshot: payload.score_snapshot,
      p_metadata: payload.metadata ?? {},
    });

    if (error || !data) {
      throw createBackendServiceError('recommendationService.recordRecommendationEvent', error?.message);
    }

    return data;
  } catch (error) {
    logBackendFallback('recommendationService.recordRecommendationEvent', error instanceof Error ? error.message : null);
    return createMockRecommendationEvent(params);
  }
}

export async function recordRecommendationFeedback(
  params: RecommendationFeedbackParams,
): Promise<RecommendationEvent> {
  const feedback = getFeedbackBucket(params.userId);

  if (params.action === 'hide') {
    feedback.hiddenIds.add(params.item.id);
    feedback.hiddenIds.add(params.item.sourceId);
  } else {
    feedback.notInterestedRegions.add(params.item.regionName);
    params.item.foodTags.forEach((tag) => feedback.notInterestedTags.add(tag));
  }

  deleteCachedValue(`personalized-feed:${params.userId}:`);

  return recordRecommendationEvent({
    userId: params.userId,
    surface: 'discovery_hub',
    targetType: toTargetType(params.item),
    targetId: params.item.sourceId,
    eventType: 'dismissed',
    rankPosition: params.rankPosition,
    scoreSnapshot: params.item.score.totalScore,
    metadata: {
      feedback_action: params.action,
      recommendation_id: params.item.id,
      region_name: params.item.regionName,
      food_tags: params.item.foodTags,
    },
  });
}

export async function getMyRecommendationSignals(userId: string, limit = 30): Promise<RecommendationSignal[]> {
  const cacheKey = `recommendation-signals:${userId}:${limit}`;
  const cachedSignals = getCachedValue<RecommendationSignal[]>(cacheKey);

  if (cachedSignals) {
    return cachedSignals;
  }

  try {
    assertSupabaseConfigured('recommendationService.getMyRecommendationSignals');

    const { data, error } = await supabase.from<RecommendationSignal>('recommendation_signals').select('*', {
      params: {
        user_id: `eq.${userId}`,
      },
      order: 'created_at.desc',
      limit,
    });

    if (error || !data) {
      throw createBackendServiceError('recommendationService.getMyRecommendationSignals', error?.message);
    }

    return setCachedValue(cacheKey, data, recommendationCacheTtlMs);
  } catch (error) {
    logBackendFallback('recommendationService.getMyRecommendationSignals', error instanceof Error ? error.message : null);
    return setCachedValue(cacheKey, getMockRecommendationSignals(userId, limit), recommendationCacheTtlMs);
  }
}
