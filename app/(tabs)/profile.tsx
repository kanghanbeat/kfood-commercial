import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { BadgeGrid } from '@/components/gamification/BadgeGrid';
import { LevelProgressBar } from '@/components/gamification/LevelProgressBar';
import { PointPopup } from '@/components/gamification/PointPopup';
import { theme } from '@/constants/theme';
import { getCurrentUser, mockLogout } from '@/lib/mockAuth';
import {
  calculateUserLevel,
  getMyPointHistory,
  getMockUserProfile,
  getPointHistory,
  getUserPointSummary,
} from '@/services/pointService';
import { getMockRegionBadges, getStampSummary } from '@/services/stampService';
import { getMyRegionProgress } from '@/services/gamificationService';
import type { RegionBadge } from '@/types/stamp';

const legalLinks = [
  { title: 'Privacy Policy', route: '../legal/privacy' },
  { title: 'Terms of Service', route: '../legal/terms' },
  { title: 'UGC Policy', route: '../legal/ugc' },
  { title: 'AI Analysis Notice', route: '../legal/ai' },
  { title: 'Maps Link Notice', route: '../legal/maps' },
] as const;

export default function ProfileScreen() {
  const authUser = getCurrentUser();
  const mockProfile = useMemo(() => getMockUserProfile(), []);
  const [profile, setProfile] = useState(mockProfile);
  const stampSummary = useMemo(() => getStampSummary(), []);
  const [badges, setBadges] = useState<RegionBadge[]>(() => getMockRegionBadges());
  const [pointHistory, setPointHistory] = useState(() => getPointHistory());
  const [selectedBadge, setSelectedBadge] = useState<RegionBadge | null>(null);
  const userId = authUser?.id ?? mockProfile.id;

  useEffect(() => {
    let isMounted = true;

    async function loadReadOnlyProfileData() {
      const [pointSummary, transactions, regionProgress] = await Promise.all([
        getUserPointSummary(userId),
        getMyPointHistory(userId),
        getMyRegionProgress(userId),
      ]);

      if (!isMounted) {
        return;
      }

      setProfile((currentProfile) => ({
        ...currentProfile,
        totalPoints: pointSummary.total_accumulated_points,
        level: calculateUserLevel(pointSummary.total_accumulated_points),
      }));

      setPointHistory(
        transactions.slice(0, 5).map((transaction) => ({
          id: transaction.id,
          title: transaction.reason ?? transaction.event_type.replaceAll('_', ' '),
          points: transaction.points,
          createdAt: transaction.created_at,
        })),
      );

      setBadges((currentBadges) =>
        currentBadges.map((badge) => {
          const progress = regionProgress.find((item) => badge.id.endsWith(item.region_id.replace('region-', '')));

          if (!progress) {
            return badge;
          }

          return {
            ...badge,
            isUnlocked: progress.progress_percent >= 100,
            progressCurrent: progress.completed_action_count,
            progressTarget: progress.target_action_count,
            progressPercent: progress.progress_percent,
          };
        }),
      );
    }

    loadReadOnlyProfileData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  function handleLogout() {
    mockLogout();
    router.replace('../login');
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Gamification Center</Text>
        <Text style={styles.title}>My K-Food Journey</Text>
        <Text style={styles.subtitle}>Track rewards, stamps, and the next discovery loop.</Text>
      </View>

      <AppCard style={styles.profileCard}>
        <View style={styles.profileRow}>
          <Text style={styles.avatar}>{profile.avatarEmoji}</Text>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{authUser?.name ?? profile.displayName}</Text>
            <Text style={styles.profileEmail}>{authUser?.email ?? profile.email}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Lv.{profile.level.level}</Text>
            <Text style={styles.statLabel}>{profile.level.label}</Text>
          </View>
        </View>

        <LevelProgressBar
          currentPoints={profile.level.currentPoints}
          levelLabel={profile.level.label}
          nextLevelPoints={profile.level.nextLevelPoints}
          progressPercent={profile.level.progressPercent}
        />
      </AppCard>

      <AppCard style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Stamp Summary</Text>
        <Text style={styles.stampText}>
          Stamps Collected: {stampSummary.collected}/{stampSummary.total}
        </Text>
        <View style={styles.summaryTrack}>
          <View style={[styles.summaryFill, { width: `${stampSummary.completionPercent}%` }]} />
        </View>
        <Text style={styles.profileEmail}>{stampSummary.completionPercent}% complete across mock missions</Text>
      </AppCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Region Badges</Text>
        <BadgeGrid badges={badges} onBadgePress={setSelectedBadge} />
      </View>

      <PointPopup
        description={selectedBadge?.earnHint ?? 'Tap a badge to see how to unlock it.'}
        points={selectedBadge?.isUnlocked ? 120 : undefined}
        title={selectedBadge ? selectedBadge.badgeName : 'Badge Hint'}
        visible
      />

      <AppCard style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Recent Point Activity</Text>
        {pointHistory.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <Text style={styles.historyTitle}>{item.title}</Text>
            <Text style={styles.historyPoints}>{item.points > 0 ? '+' : ''}{item.points}</Text>
          </View>
        ))}
      </AppCard>

      <AppCard style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Legal & Safety</Text>
        <Text style={styles.profileEmail}>Release policy drafts and safety notices for store review.</Text>
        <View style={styles.legalButtonGroup}>
          {legalLinks.map((item) => (
            <AppButton
              key={item.title}
              title={item.title}
              variant="outline"
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
      </AppCard>

      <AppCard style={styles.profileCard}>
        <AppButton title="Log Out" variant="outline" onPress={handleLogout} />
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
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  profileCard: {
    padding: theme.spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    fontSize: 44,
  },
  profileText: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  profileEmail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  section: {
    gap: theme.spacing.md,
  },
  legalButtonGroup: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  stampText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  summaryTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  summaryFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.secondary,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  historyTitle: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  historyPoints: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
});
