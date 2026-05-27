import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { RecommendationReason } from '@/types/recommendation';

type ReasonBadgeProps = {
  reason: RecommendationReason;
};

export function ReasonBadge({ reason }: ReasonBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{reason.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  text: {
    color: theme.colors.success,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
});
