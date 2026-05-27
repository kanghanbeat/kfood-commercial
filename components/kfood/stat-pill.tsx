import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { KFoodColors } from '@/constants/theme';
import type { TravelerStat } from '@/services/kfood-content';

type StatPillProps = {
  stat: TravelerStat;
};

export function StatPill({ stat }: StatPillProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.value}>
        {stat.value}
      </ThemedText>
      <ThemedText style={styles.label}>{stat.label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KFoodColors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 2,
  },
  value: {
    color: KFoodColors.kimchi,
  },
  label: {
    color: KFoodColors.stone,
    fontSize: 13,
    lineHeight: 18,
  },
});
