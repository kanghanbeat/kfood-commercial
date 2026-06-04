import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';

type RankingPeriod = 'weekly' | 'monthly' | 'allTime';

type RankingItem = {
  id: string;
  rank: number;
  name: string;
  points: number;
  note: string;
};

const periodOptions: { key: RankingPeriod; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'allTime', label: 'All Time' },
];

const topRankings: RankingItem[] = [
  {
    id: 'hana-foodie',
    rank: 1,
    name: 'Hana Foodie',
    points: 12400,
    note: 'Regional stamps and approved food posts',
  },
  {
    id: 'seoul-taster',
    rank: 2,
    name: 'Seoul Taster',
    points: 10950,
    note: 'Market routes and local discovery points',
  },
  {
    id: 'jeju-explorer',
    rank: 3,
    name: 'Jeju Explorer',
    points: 9820,
    note: 'Island food routes and travel journals',
  },
];

export default function RankingScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>('weekly');

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Competition</Text>
        <Text style={styles.title}>K-Food Traveler Ranking</Text>
        <Text style={styles.subtitle}>
          Compete through food travel posts, regional stamps, and local discovery points.
        </Text>
      </View>

      <View style={styles.periodRow}>
        {periodOptions.map((option) => {
          const isSelected = option.key === selectedPeriod;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={option.key}
              onPress={() => setSelectedPeriod(option.key)}
              style={({ pressed }) => [
                styles.periodChip,
                isSelected && styles.selectedPeriodChip,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.periodText, isSelected && styles.selectedPeriodText]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <AppCard style={styles.rankingCard}>
        <Text style={styles.sectionTitle}>Top 3 Travelers</Text>
        <View style={styles.rankingList}>
          {topRankings.map((item) => (
            <View key={item.id} style={styles.rankingRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>{item.rank}</Text>
              </View>
              <View style={styles.rankingBody}>
                <Text style={styles.rankingName}>{item.name}</Text>
                <Text style={styles.rankingNote}>{item.note}</Text>
              </View>
              <Text style={styles.pointsText}>{item.points.toLocaleString()} pts</Text>
            </View>
          ))}
        </View>
      </AppCard>

      <AppCard style={styles.infoCard}>
        <Text style={styles.sectionTitle}>How Ranking Works</Text>
        <Text style={styles.infoText}>
          Rankings combine approved journals, regional stamp progress, saved routes, and helpful local discovery activity.
        </Text>
      </AppCard>
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
    lineHeight: 34,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  periodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  periodChip: {
    minWidth: 96,
    alignItems: 'center',
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  selectedPeriodChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  periodText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  selectedPeriodText: {
    color: theme.colors.surface,
  },
  pressed: {
    opacity: 0.84,
  },
  rankingCard: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  rankingList: {
    gap: theme.spacing.md,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  rankBadge: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
  },
  rankBadgeText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  rankingBody: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  rankingName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  rankingNote: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    lineHeight: 18,
  },
  pointsText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    textAlign: 'right',
  },
  infoCard: {
    padding: theme.spacing.lg,
  },
  infoText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
});
