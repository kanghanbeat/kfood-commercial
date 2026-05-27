import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { theme } from '@/constants/theme';
import type { Region } from '@/types/region';

interface RegionSelectorProps {
  regions: Region[];
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export function RegionSelector({ regions, selectedRegionId, onSelectRegion }: RegionSelectorProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {regions.map((region) => {
        const isSelected = region.id === selectedRegionId;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={region.id}
            onPress={() => onSelectRegion(region.id)}
            style={({ pressed }) => [styles.card, isSelected && styles.selectedCard, pressed && styles.pressed]}>
            <Text style={[styles.name, isSelected && styles.selectedText]}>{region.nameEn ?? region.nameKo}</Text>
            <Text style={[styles.meta, isSelected && styles.selectedText]}>{region.tags.slice(0, 2).join(' · ')}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.xs,
  },
  card: {
    minWidth: 148,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  selectedCard: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.84,
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  meta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  selectedText: {
    color: theme.colors.surface,
  },
});
