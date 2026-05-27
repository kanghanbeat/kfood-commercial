import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type PointBadgeProps = {
  points: number;
  label?: string;
};

export function PointBadge({ points, label }: PointBadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.points}>+{points}P</Text>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#FFF7D6',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: 2,
  },
  points: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  label: {
    color: theme.colors.warning,
    fontSize: 11,
    fontWeight: '600',
  },
});
