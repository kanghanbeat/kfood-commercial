import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { getGoogleMapsUrl } from '@/lib/googlePlaces';
import type { Place } from '@/types/place';

interface PlaceLinkCardProps {
  place: Place;
}

function formatCategoryLabel(category: string): string {
  return category
    .split('_')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

export function PlaceLinkCard({ place }: PlaceLinkCardProps) {
  const mapsUrl = place.googleMapsUrl ?? getGoogleMapsUrl(place.name, place.address, place.googlePlaceId);

  async function handleOpenMaps() {
    try {
      await Linking.openURL(mapsUrl);
    } catch (error) {
      console.warn('Failed to open Google Maps URL.', error);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <Text style={styles.category}>{formatCategoryLabel(place.category)}</Text>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.address}>{place.address}</Text>
        {place.rating ? (
          <Text style={styles.rating}>
            ★ {place.rating.toFixed(1)}
            {place.userRatingCount ? ` · ${place.userRatingCount.toLocaleString()} reviews` : ''}
          </Text>
        ) : null}
      </View>
      <Pressable accessibilityRole="button" onPress={handleOpenMaps} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.buttonText}>Open in Google Maps</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    ...theme.shadow,
  },
  body: {
    gap: theme.spacing.sm,
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
  address: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 22,
  },
  rating: {
    color: theme.colors.warning,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  button: {
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
  buttonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
});
