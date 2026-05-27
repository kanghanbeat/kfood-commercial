import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { FeedSortKey } from '@/types/journal';

type SortOption = {
  key: FeedSortKey;
  label: string;
};

type FeedSortTabsProps = {
  activeKey: FeedSortKey;
  onChange: (key: FeedSortKey) => void;
};

const sortOptions: SortOption[] = [
  { key: 'latest', label: 'Latest' },
  { key: 'recommended', label: 'Recommended' },
  { key: 'popular', label: 'Popular' },
];

export function FeedSortTabs({ activeKey, onChange }: FeedSortTabsProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {sortOptions.map((option) => {
        const isActive = option.key === activeKey;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            key={option.key}
            onPress={() => onChange(option.key)}
            style={({ pressed }) => [styles.tab, isActive && styles.activeTab, pressed && styles.pressed]}>
            <Text style={[styles.tabText, isActive && styles.activeText]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.86,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  activeText: {
    color: theme.colors.surface,
  },
});
