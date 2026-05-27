import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type TagGroupProps = {
  labels: string[];
  tone?: 'food' | 'purpose';
};

export function TagGroup({ labels, tone = 'food' }: TagGroupProps) {
  return (
    <View style={styles.container}>
      {labels.map((label) => (
        <View key={label} style={[styles.tag, tone === 'purpose' ? styles.purposeTag : styles.foodTag]}>
          <Text style={[styles.tagText, tone === 'purpose' ? styles.purposeText : styles.foodText]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  foodTag: {
    backgroundColor: '#FFF4ED',
    borderColor: '#FED7AA',
  },
  purposeTag: {
    backgroundColor: '#ECFDF5',
    borderColor: '#BBF7D0',
  },
  tagText: {
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  foodText: {
    color: theme.colors.primary,
  },
  purposeText: {
    color: theme.colors.success,
  },
});
