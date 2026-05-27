import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type PointPopupProps = {
  title: string;
  points?: number;
  description: string;
  visible?: boolean;
};

export function PointPopup({ title, points, description, visible = true }: PointPopupProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {points ? <Text style={styles.points}>+{points} pts</Text> : null}
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FFF7D6',
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  points: {
    color: theme.colors.warning,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
});
