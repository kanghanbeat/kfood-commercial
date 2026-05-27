import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { RegionBadge } from '@/types/stamp';

type BadgeGridProps = {
  badges: RegionBadge[];
  onBadgePress?: (badge: RegionBadge) => void;
};

export function BadgeGrid({ badges, onBadgePress }: BadgeGridProps) {
  return (
    <View style={styles.grid}>
      {badges.map((badge) => (
        <Pressable
          accessibilityRole="button"
          key={badge.id}
          onPress={() => onBadgePress?.(badge)}
          style={({ pressed }) => [
            styles.badgeCard,
            !badge.isUnlocked && styles.lockedBadge,
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.icon, !badge.isUnlocked && styles.lockedText]}>{badge.icon}</Text>
          <Text style={[styles.badgeName, !badge.isUnlocked && styles.lockedText]}>{badge.badgeName}</Text>
          <Text style={[styles.regionName, !badge.isUnlocked && styles.lockedText]}>{badge.regionName}</Text>
          <Text style={[styles.progress, !badge.isUnlocked && styles.lockedText]}>
            {badge.progressCurrent}/{badge.progressTarget}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  badgeCard: {
    flexGrow: 1,
    flexBasis: 128,
    minHeight: 144,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF4ED',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  lockedBadge: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    opacity: 0.62,
  },
  pressed: {
    opacity: 0.82,
  },
  icon: {
    fontSize: 30,
  },
  badgeName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  regionName: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  progress: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  lockedText: {
    color: theme.colors.textSecondary,
  },
});
