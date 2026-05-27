import { StyleSheet, Text, View } from 'react-native';

import { FoodPreviewCard } from '@/components/explore/FoodPreviewCard';
import { theme } from '@/constants/theme';
import type { Food } from '@/types/food';

interface RegionFoodSectionProps {
  title: string;
  foods: Food[];
  onPressFood: (foodId: string) => void;
}

export function RegionFoodSection({ title, foods, onPressFood }: RegionFoodSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {foods.length > 0 ? (
        foods.map((food) => <FoodPreviewCard food={food} key={food.id} onPress={() => onPressFood(food.id)} />)
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No foods match this filter yet.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  emptyCard: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
});
