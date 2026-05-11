import { ScrollView, StyleSheet } from 'react-native';

import { RecommendationCard } from '@/components/kfood/recommendation-card';
import { SectionHeading } from '@/components/kfood/section-heading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { KFoodColors } from '@/constants/theme';
import { regionalRecommendations } from '@/services/kfood-content';

export default function TabTwoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.hero}>
        <ThemedText type="title" style={styles.heroTitle}>
          Regional K-Food Routes
        </ThemedText>
        <ThemedText style={styles.heroText}>
          A lightweight discovery surface for future region-based recommendations and marketplace
          offers.
        </ThemedText>
      </ThemedView>

      <SectionHeading
        title="Recommended Regions"
        description="Mock recommendations prepared for the future recommendations service."
      />

      <ThemedView style={styles.list}>
        {regionalRecommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 64,
    gap: 20,
  },
  hero: {
    borderRadius: 8,
    backgroundColor: KFoodColors.leaf,
    padding: 20,
    gap: 10,
  },
  heroTitle: {
    color: KFoodColors.surface,
  },
  heroText: {
    color: KFoodColors.rice,
  },
  list: {
    gap: 12,
  },
});
