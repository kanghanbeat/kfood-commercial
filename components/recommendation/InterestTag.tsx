import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type InterestTagProps = {
  label: string;
  selected?: boolean;
};

export function InterestTag({ label, selected = false }: InterestTagProps) {
  return (
    <View style={[styles.tag, selected && styles.selectedTag]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  selectedTag: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF4ED',
  },
  text: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  selectedText: {
    color: theme.colors.primary,
  },
});
