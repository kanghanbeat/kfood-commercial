import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { KFoodColors } from '@/constants/theme';
import type { KFoodRecommendation } from '@/services/kfood-content';

type RecommendationCardProps = {
  recommendation: KFoodRecommendation;
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText type="defaultSemiBold" style={styles.region}>
        {recommendation.region}
      </ThemedText>
      <ThemedText type="subtitle">{recommendation.title}</ThemedText>
      <ThemedText style={styles.description}>{recommendation.description}</ThemedText>
      <ThemedView style={styles.tags}>
        {recommendation.tags.map((tag) => (
          <ThemedView key={tag} style={styles.tag}>
            <ThemedText style={styles.tagText}>{tag}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KFoodColors.border,
    padding: 16,
    gap: 8,
  },
  region: {
    color: KFoodColors.kimchi,
  },
  description: {
    color: KFoodColors.stone,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    borderRadius: 8,
    backgroundColor: KFoodColors.rice,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: KFoodColors.leaf,
    fontSize: 13,
    lineHeight: 18,
  },
});
