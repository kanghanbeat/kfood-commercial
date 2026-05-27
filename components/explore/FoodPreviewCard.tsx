import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { Food } from '@/types/food';

interface FoodPreviewCardProps {
  food: Food;
  onPress?: () => void;
}

function formatCategoryLabel(category: string): string {
  return category
    .split('_')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

export function FoodPreviewCard({ food, onPress }: FoodPreviewCardProps) {
  const content = (
    <>
      {food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={styles.image} /> : null}
      <View style={styles.body}>
        <Text style={styles.category}>{formatCategoryLabel(food.category)}</Text>
        <Text style={styles.title}>{food.nameEn ?? food.nameKo}</Text>
        <Text style={styles.description}>{food.description}</Text>
        <View style={styles.tagRow}>
          {food.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    ...theme.shadow,
  },
  pressed: {
    opacity: 0.88,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: theme.colors.border,
  },
  body: {
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  category: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF4ED',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  tagText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
});
