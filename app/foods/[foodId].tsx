import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { PlacePreviewCard } from '@/components/explore/PlacePreviewCard';
import { getFoodById, getPlaceById, getPlacesByFood, getRegionById } from '@/constants/mockExploreData';
import { theme } from '@/constants/theme';

function placeHref(placeId: string): Href {
  return `/place/${placeId}` as Href;
}

function regionHref(regionId: string): Href {
  return `/regions/${regionId}` as Href;
}

function formatCategoryLabel(category: string): string {
  return category
    .split('_')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function FoodDetailScreen() {
  const router = useRouter();
  const { foodId } = useLocalSearchParams<{ foodId: string }>();
  const food = foodId ? getFoodById(foodId) : undefined;

  if (!food) {
    return (
      <ScreenContainer>
        <View style={styles.fallbackCard}>
          <Text style={styles.title}>Food not found</Text>
          <Text style={styles.subtitle}>This food guide is not available in the mock discovery data.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/(tabs)/explore')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Back to Explore</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const regions = food.regionIds.flatMap((regionId) => {
    const region = getRegionById(regionId);
    return region ? [region] : [];
  });
  const placesFromFood = getPlacesByFood(food.id);
  const placesFromRecommendations = food.recommendedPlaceIds.flatMap((placeId) => {
    const place = getPlaceById(placeId);
    return place ? [place] : [];
  });
  const places = [...placesFromRecommendations, ...placesFromFood].filter(
    (place, index, allPlaces) => allPlaces.findIndex((item) => item.id === place.id) === index,
  );

  return (
    <ScreenContainer>
      <View style={styles.heroCard}>
        {food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={styles.heroImage} /> : null}
        <View style={styles.heroBody}>
          <Text style={styles.kicker}>{formatCategoryLabel(food.category)}</Text>
          <Text style={styles.title}>{food.nameEn ?? food.nameKo}</Text>
          <Text style={styles.subtitle}>{food.description}</Text>
          <View style={styles.tagRow}>
            {food.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Related Regions</Text>
        <View style={styles.regionGrid}>
          {regions.map((region) => (
            <Pressable
              accessibilityRole="button"
              key={region.id}
              onPress={() => router.push(regionHref(region.id))}
              style={({ pressed }) => [styles.regionChip, pressed && styles.pressed]}>
              <Text style={styles.regionChipText}>{region.nameEn ?? region.nameKo}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Places to Try This Food</Text>
        {places.map((place) => (
          <PlacePreviewCard
            key={place.id}
            onPress={() => router.push(placeHref(place.id))}
            place={place}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
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
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: theme.colors.border,
  },
  heroBody: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  kicker: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.title,
    fontWeight: '700',
  },
  subtitle: {
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
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  regionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  regionChipText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  fallbackCard: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadow,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  pressed: {
    opacity: 0.86,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
});
