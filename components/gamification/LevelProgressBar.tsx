import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type LevelProgressBarProps = {
  levelLabel: string;
  currentPoints: number;
  nextLevelPoints: number;
  progressPercent: number;
};

function progressWidth(progressPercent: number): `${number}%` {
  return `${Math.max(0, Math.min(100, Math.round(progressPercent)))}%`;
}

export function LevelProgressBar({
  levelLabel,
  currentPoints,
  nextLevelPoints,
  progressPercent,
}: LevelProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{levelLabel}</Text>
        <Text style={styles.points}>
          {currentPoints.toLocaleString()} / {nextLevelPoints.toLocaleString()} pts
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: progressWidth(progressPercent) }]} />
      </View>
      <Text style={styles.caption}>{Math.round(progressPercent)}% to next level</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  label: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  points: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  caption: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
});
