import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { FoodPreviewCard } from '@/components/explore/FoodPreviewCard';
import { PlacePreviewCard } from '@/components/explore/PlacePreviewCard';
import { getFoodById, getPlaceById, getRegionById } from '@/constants/mockExploreData';
import { theme } from '@/constants/theme';

function foodHref(foodId: string): Href {
  return `/foods/${foodId}` as Href;
}

function placeHref(placeId: string): Href {
  return `/place/${placeId}` as Href;
}

export default function RegionDetailScreen() {
  const router = useRouter();
  const { regionId } = useLocalSearchParams<{ regionId: string }>();
  const region = regionId ? getRegionById(regionId) : undefined;

  if (!region) {
    return (
      <ScreenContainer>
        <View style={styles.fallbackCard}>
          <Text style={styles.title}>Region not found</Text>
          <Text style={styles.subtitle}>This region guide is not available in the mock discovery data.</Text>
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

  const foods = region.representativeFoodIds.flatMap((foodId) => {
    const food = getFoodById(foodId);
    return food ? [food] : [];
  });
  const places = region.recommendedPlaceIds.flatMap((placeId) => {
    const place = getPlaceById(placeId);
    return place ? [place] : [];
  });

  return (
    <ScreenContainer>
      <View style={styles.heroCard}>
        {region.imageUrl ? <Image source={{ uri: region.imageUrl }} style={styles.heroImage} /> : null}
        <View style={styles.heroBody}>
          <Text style={styles.kicker}>Region Guide</Text>
          <Text style={styles.title}>{region.nameEn ?? region.nameKo}</Text>
          <Text style={styles.subtitle}>{region.description}</Text>
          <View style={styles.tagRow}>
            {region.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Representative Foods</Text>
        {foods.map((food) => (
          <FoodPreviewCard
            food={food}
            key={food.id}
            onPress={() => router.push(foodHref(food.id))}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Places</Text>
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
