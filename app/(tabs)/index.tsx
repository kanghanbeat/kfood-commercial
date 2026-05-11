import { ScrollView, StyleSheet } from 'react-native';

import { PostCard } from '@/components/kfood/post-card';
import { SectionHeading } from '@/components/kfood/section-heading';
import { StatPill } from '@/components/kfood/stat-pill';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { KFoodColors } from '@/constants/theme';
import { featuredPosts, travelerStats } from '@/services/kfood-content';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.hero}>
        <ThemedText type="title" style={styles.heroTitle}>
          K-Food Travel Feed
        </ThemedText>
        <ThemedText style={styles.heroText}>
          Share food-centered travel logs, collect regional stamps, and discover routes from other
          travelers.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.statsRow}>
        {travelerStats.map((stat) => (
          <StatPill key={stat.label} stat={stat} />
        ))}
      </ThemedView>

      <SectionHeading
        title="Recent Travel Logs"
        description="Mock feed data prepared for the future posts service."
      />

      <ThemedView style={styles.list}>
        {featuredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
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
    backgroundColor: KFoodColors.rice,
    borderWidth: 1,
    borderColor: KFoodColors.border,
    padding: 20,
    gap: 10,
  },
  heroTitle: {
    color: KFoodColors.kimchi,
  },
  heroText: {
    color: KFoodColors.charcoal,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  list: {
    gap: 12,
  },
});
