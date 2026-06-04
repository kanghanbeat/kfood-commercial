import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { FoodPreviewCard } from '@/components/explore/FoodPreviewCard';
import { PlaceLinkCard } from '@/components/map/PlaceLinkCard';
import { SeoHead } from '@/components/seo/SeoHead';
import { getFoodById, getPlaceById, getRegionById } from '@/constants/mockExploreData';
import { theme } from '@/constants/theme';

function foodHref(foodId: string): Href {
  return `/foods/${foodId}` as Href;
}

function regionHref(regionId: string): Href {
  return `/regions/${regionId}` as Href;
}

function searchHref(query: string): Href {
  return `/search?query=${encodeURIComponent(query)}` as Href;
}

function formatCategoryLabel(category: string): string {
  return category
    .split('_')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function PlaceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = id ? getPlaceById(id) : undefined;

  if (!place) {
    return (
      <ScreenContainer>
        <SeoHead
          title="Place not found | K-Food Travel"
          description="This K-Food Travel place guide is not available. Continue exploring curated Korean food routes."
          path={`/place/${id ?? ''}`}
          noIndex
        />
        <View style={styles.fallbackCard}>
          <Text style={styles.title}>Place not found</Text>
          <Text style={styles.subtitle}>This place is not available in the curated catalog.</Text>
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

  const region = getRegionById(place.regionId);
  const foods = place.relatedFoodIds.flatMap((foodId) => {
    const food = getFoodById(foodId);
    return food ? [food] : [];
  });

  return (
    <ScreenContainer>
      <SeoHead
        title={`${place.name} food travel stop | K-Food Travel`}
        description={`${place.address}. Explore related foods, region guides, traveler journals, and Google Maps planning for this K-Food stop.`}
        path={`/place/${place.id}`}
        imageUrl={place.imageUrl}
      />
      <View style={styles.heroCard}>
        {place.imageUrl ? (
          <Image
            accessibilityLabel={`${place.name} food travel stop`}
            source={{ uri: place.imageUrl }}
            style={styles.heroImage}
          />
        ) : null}
        <View style={styles.heroBody}>
          <Text style={styles.kicker}>{formatCategoryLabel(place.category)}</Text>
          <Text style={styles.title}>{place.name}</Text>
          <Text style={styles.subtitle}>{place.address}</Text>
          {place.rating ? (
            <Text style={styles.rating}>
              ★ {place.rating.toFixed(1)}
              {place.userRatingCount ? ` · ${place.userRatingCount.toLocaleString()} reviews` : ''}
            </Text>
          ) : null}
          <View style={styles.tagRow}>
            {place.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <PlaceLinkCard place={place} />

      {region ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Region</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(regionHref(region.id))}
            style={({ pressed }) => [styles.regionCard, pressed && styles.pressed]}>
            <Text style={styles.regionName}>{region.nameEn ?? region.nameKo}</Text>
            <Text style={styles.regionText}>{region.description}</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Related Foods</Text>
        {foods.map((food) => (
          <FoodPreviewCard
            food={food}
            key={food.id}
            onPress={() => router.push(foodHref(food.id))}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Traveler Journals</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(searchHref(place.name))}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <Text style={styles.secondaryButtonText}>Find journals near this stop</Text>
        </Pressable>
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
  rating: {
    color: theme.colors.warning,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  tagText: {
    color: theme.colors.success,
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
  regionCard: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    ...theme.shadow,
  },
  regionName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  regionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
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
  secondaryButton: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    minHeight: 52,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
});
