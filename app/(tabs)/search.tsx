import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppButton } from '@/components/common/AppButton';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { InterestTag } from '@/components/recommendation/InterestTag';
import { RecommendedCard } from '@/components/recommendation/RecommendedCard';
import { theme } from '@/constants/theme';
import { getCurrentUser } from '@/lib/mockAuth';
import {
  clearRecommendationFeedback,
  getMockUserPreference,
  getPersonalizedFeed,
  getVisibleScoredRecommendations,
  recordRecommendationFeedback,
} from '@/services/recommendationService';
import type { PersonalizedFeedItem, ScoredRecommendation } from '@/types/recommendation';

function formatTag(tag: string): string {
  return tag
    .split('_')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

function toRecommendationCardItem(item: PersonalizedFeedItem): ScoredRecommendation {
  const foodTags = item.category ? [item.category] : ['recommended'];

  return {
    id: `feed-${item.post_id}`,
    sourceType: item.food_id ? 'food' : item.region_id ? 'region' : 'journal',
    sourceId: item.food_id ?? item.region_id ?? item.post_id,
    title: item.title,
    description: item.content ?? 'Recommended from your K-Food activity signals.',
    regionName: item.region_id ? 'Recommended Region' : 'K-Food Feed',
    foodTags,
    imageEmoji: item.food_id ? '🍜' : item.region_id ? '📍' : '🥢',
    popularity: item.view_count,
    createdAt: item.created_at,
    isSeasonal: false,
    score: {
      baseScore: Math.round(item.score),
      personalRegionBonus: 0,
      personalTagBonus: 0,
      growthBonus: 0,
      seasonalBonus: 0,
      repetitionPenalty: 0,
      totalScore: Math.round(item.score),
    },
    reasons: [
      { type: 'popular', label: `${item.like_count} likes · ${item.view_count} views` },
      { type: 'not_repeated', label: 'Read-only service result' },
    ],
  };
}

export default function SearchScreen() {
  const authUser = getCurrentUser();
  const preference = useMemo(() => getMockUserPreference(), []);
  const [recommendations, setRecommendations] = useState<ScoredRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const userId = authUser?.id ?? 'user-demo-traveler';

  useEffect(() => {
    let isMounted = true;

    async function loadReadOnlyRecommendations() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const feedItems = await getPersonalizedFeed(userId, 8);
        const nextRecommendations =
          feedItems.length > 0 ? feedItems.map(toRecommendationCardItem) : getVisibleScoredRecommendations(userId);

        if (isMounted) {
          setRecommendations(nextRecommendations);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Recommendations failed to load.');
          setRecommendations(getVisibleScoredRecommendations(userId));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReadOnlyRecommendations();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  async function handleFeedback(item: ScoredRecommendation, action: 'hide' | 'not_interested') {
    await recordRecommendationFeedback({
      userId,
      item,
      action,
      rankPosition: recommendations.findIndex((recommendation) => recommendation.id === item.id) + 1,
    });

    setRecommendations((currentRecommendations) =>
      currentRecommendations.filter((recommendation) => {
        if (recommendation.id === item.id || recommendation.sourceId === item.sourceId) {
          return false;
        }

        if (action === 'not_interested') {
          return recommendation.regionName !== item.regionName && !recommendation.foodTags.some((tag) => item.foodTags.includes(tag));
        }

        return true;
      }),
    );
    setFeedbackMessage(action === 'hide' ? 'Recommendation hidden.' : 'Similar recommendations will be reduced.');
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Smart Discovery</Text>
        <Text style={styles.title}>Search & Recommendations</Text>
        <Text style={styles.subtitle}>
          Personalized picks are scored from your regions, tags, stamp gaps, freshness, and recent views.
        </Text>
      </View>

      <AppCard style={styles.searchCard}>
        <Text style={styles.mockInput}>Search foods, regions, stamps, or routes</Text>
      </AppCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Feed</Text>
        {feedbackMessage ? <Text style={styles.feedbackText}>{feedbackMessage}</Text> : null}
        <View style={styles.interestGroup}>
          {preference.preferredRegions.map((region) => (
            <InterestTag key={region} label={region} selected />
          ))}
          {preference.preferredTags.map((tag) => (
            <InterestTag key={tag} label={formatTag(tag)} selected />
          ))}
        </View>
      </View>

      {isLoading ? (
        <AppCard>
          <Text style={styles.stateTitle}>Loading recommendations</Text>
          <Text style={styles.stateText}>Preparing a diverse mock-first feed from cached service data.</Text>
        </AppCard>
      ) : null}

      {errorMessage ? (
        <AppCard>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Text style={styles.stateText}>Showing safe mock recommendations instead.</Text>
        </AppCard>
      ) : null}

      {!isLoading && recommendations.length === 0 ? (
        <AppCard>
          <Text style={styles.stateTitle}>No recommendations left</Text>
          <Text style={styles.stateText}>Your feedback removed the current set. Reset the view to see mock recommendations again.</Text>
          <AppButton
            onPress={() => {
              setRecommendations(clearRecommendationFeedback(userId));
              setFeedbackMessage('');
            }}
            title="Reset View"
            variant="outline"
          />
        </AppCard>
      ) : (
        <View style={styles.cardGrid}>
          {recommendations.map((item) => (
            <RecommendedCard
              item={item}
              key={item.id}
              onHide={(recommendation) => handleFeedback(recommendation, 'hide')}
              onNotInterested={(recommendation) => handleFeedback(recommendation, 'not_interested')}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.sm,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.title,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  searchCard: {
    padding: theme.spacing.lg,
  },
  mockInput: {
    minHeight: 48,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.size.body,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  interestGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  feedbackText: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  stateTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  stateText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 22,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
});
