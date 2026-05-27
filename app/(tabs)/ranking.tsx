import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { PodiumItem } from '@/components/gamification/PodiumItem';
import { theme } from '@/constants/theme';
import { getRankings, getTopRankings } from '@/services/rankingService';
import type { UserRankingStats } from '@/types/gamification';
import type { RankingPeriod, RankingUser } from '@/types/ranking';

const periodOptions: { key: RankingPeriod; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'allTime', label: 'All-time' },
];

function toBackendPeriod(period: RankingPeriod): 'weekly' | 'monthly' | 'all' {
  return period === 'allTime' ? 'all' : period;
}

function toRankingUsers(rows: UserRankingStats[], period: RankingPeriod): RankingUser[] {
  return rows
    .map((row) => {
      const points = period === 'weekly'
        ? row.weekly_points
        : period === 'monthly'
          ? row.monthly_points
          : row.total_points;

      return {
        id: row.user_id,
        rank: 0,
        displayName: row.user_id.startsWith('rank-user-') ? row.user_id.replace('rank-user-', '') : 'K-Food Traveler',
        avatarEmoji: '🍚',
        points,
        stampCount: row.stamp_count,
        badgeCount: row.badge_count,
        regionTitle: `${row.post_count} posts · ${row.approved_food_image_count} approved images`,
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
}

export default function RankingScreen() {
  const [period, setPeriod] = useState<RankingPeriod>('weekly');
  const [rankingUsers, setRankingUsers] = useState<RankingUser[]>(() => getRankings('weekly'));
  const topThree = useMemo(() => rankingUsers.slice(0, 3), [rankingUsers]);
  const rest = useMemo(() => rankingUsers.slice(3), [rankingUsers]);
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  useEffect(() => {
    let isMounted = true;

    async function loadReadOnlyRankings() {
      const rows = await getTopRankings(toBackendPeriod(period), 20);

      if (isMounted) {
        setRankingUsers(toRankingUsers(rows, period));
      }
    }

    loadReadOnlyRankings();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SNS Ranking</Text>
        <Text style={styles.title}>K-Food Traveler League</Text>
        <Text style={styles.subtitle}>Points, stamps, and badges create the discovery loop.</Text>
      </View>

      <View style={styles.periodRow}>
        {periodOptions.map((option) => {
          const isSelected = option.key === period;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={option.key}
              onPress={() => setPeriod(option.key)}
              style={({ pressed }) => [styles.periodChip, isSelected && styles.selectedPeriodChip, pressed && styles.pressed]}>
              <Text style={[styles.periodText, isSelected && styles.selectedPeriodText]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <AppCard style={styles.podiumCard}>
        <View style={styles.podiumRow}>
          {podiumOrder.map((user) => (
            <PodiumItem
              height={user.rank === 1 ? 128 : user.rank === 2 ? 96 : 76}
              highlight={user.rank === 1}
              key={user.id}
              user={user}
            />
          ))}
        </View>
      </AppCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rank 4 and below</Text>
        {rest.map((user) => (
          <AppCard key={user.id} style={styles.rankCard}>
            <Text style={styles.rankNumber}>#{user.rank}</Text>
            <Text style={styles.avatar}>{user.avatarEmoji}</Text>
            <View style={styles.rankBody}>
              <Text style={styles.rankName}>{user.displayName}</Text>
              <Text style={styles.rankMeta}>{user.regionTitle}</Text>
            </View>
            <View style={styles.rankStats}>
              <Text style={styles.rankPoints}>{user.points.toLocaleString()}</Text>
              <Text style={styles.rankMeta}>{user.stampCount} stamps · {user.badgeCount} badges</Text>
            </View>
          </AppCard>
        ))}
      </View>
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
  periodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  periodChip: {
    borderRadius: 999,
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
  podiumCard: {
    padding: theme.spacing.lg,
  },
  podiumRow: {
    minHeight: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  rankNumber: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
    width: 36,
  },
  avatar: {
    fontSize: 28,
  },
  rankBody: {
    flex: 1,
    minWidth: 0,
  },
  rankName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  rankMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  rankStats: {
    alignItems: 'flex-end',
    maxWidth: 132,
  },
  rankPoints: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
});
