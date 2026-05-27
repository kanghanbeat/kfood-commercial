import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

// This file is named `explore.tsx` for current Expo Router compatibility, but the user-facing tab is "Map".
// This screen should behave as a map-based destination discovery screen, not as a general Explore list.
type MapDestination = {
  id: string;
  name: string;
  region: string;
  representativeFood: string;
  description: string;
  markerTop: `${number}%`;
  markerLeft: `${number}%`;
};

const mapDestinations: MapDestination[] = [
  {
    id: 'seoul',
    name: 'Seoul',
    region: 'Capital Area',
    representativeFood: 'Gwangjang Market bindaetteok',
    description: 'Follow street-food alleys, palace neighborhoods, and night market stops in one city route.',
    markerTop: '24%',
    markerLeft: '48%',
  },
  {
    id: 'jeonju',
    name: 'Jeonju',
    region: 'Jeollabuk-do',
    representativeFood: 'Jeonju bibimbap',
    description: 'Preview a hanok village route built around bibimbap, makgeolli streets, and local side dishes.',
    markerTop: '52%',
    markerLeft: '40%',
  },
  {
    id: 'busan',
    name: 'Busan',
    region: 'Gyeongsangnam-do Coast',
    representativeFood: 'Dwaeji gukbap',
    description: 'Trace a coastal food path through markets, harbor views, milmyeon shops, and gukbap districts.',
    markerTop: '67%',
    markerLeft: '69%',
  },
  {
    id: 'jeju',
    name: 'Jeju',
    region: 'Jeju Island',
    representativeFood: 'Black pork barbecue',
    description: 'Plan an island route for black pork, seafood, citrus cafes, and scenic local markets.',
    markerTop: '83%',
    markerLeft: '32%',
  },
];

export default function ExploreScreen() {
  const [selectedDestinationId, setSelectedDestinationId] = useState('jeonju');
  const [actionMessage, setActionMessage] = useState('');

  const selectedDestination =
    mapDestinations.find((destination) => destination.id === selectedDestinationId) ?? mapDestinations[1];

  function handleRoutePreview() {
    setActionMessage(`Route preview for ${selectedDestination.name} is prepared for a future detail page.`);
  }

  function handleGoogleMapsPlaceholder() {
    setActionMessage('External Google Maps linking will be connected in a later phase.');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>K-Food Travel Map</Text>
          <Text style={styles.subtitle}>Tap a destination marker to preview local food routes.</Text>
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.mapRegionNorth} />
          <View style={styles.mapRegionSouth} />
          <View style={styles.routeLineOne} />
          <View style={styles.routeLineTwo} />

          {mapDestinations.map((destination) => {
            const isActive = destination.id === selectedDestination.id;

            return (
              <Pressable
                accessibilityLabel={`Select ${destination.name}`}
                accessibilityRole="button"
                key={destination.id}
                onPress={() => {
                  setSelectedDestinationId(destination.id);
                  setActionMessage('');
                }}
                style={({ pressed }) => [
                  styles.marker,
                  {
                    top: destination.markerTop,
                    left: destination.markerLeft,
                  },
                  isActive && styles.markerActive,
                  pressed && styles.markerPressed,
                ]}>
                <View style={[styles.markerDot, isActive && styles.markerDotActive]} />
                <Text style={[styles.markerLabel, isActive && styles.markerLabelActive]}>{destination.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewEyebrow}>{selectedDestination.region}</Text>
          <Text style={styles.previewTitle}>{selectedDestination.name}</Text>
          <Text style={styles.foodText}>{selectedDestination.representativeFood}</Text>
          <Text style={styles.description}>{selectedDestination.description}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={handleRoutePreview}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>View Destination Routes</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleGoogleMapsPlaceholder}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Open Google Maps later</Text>
          </Pressable>

          {actionMessage ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{actionMessage}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    alignItems: 'center',
    gap: theme.spacing.lg,
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    gap: theme.spacing.sm,
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
  mapContainer: {
    width: '100%',
    maxWidth: 600,
    height: 380,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#DDEFE8',
  },
  mapRegionNorth: {
    position: 'absolute',
    top: 28,
    left: 80,
    width: 260,
    height: 220,
    borderRadius: 120,
    backgroundColor: '#C4E1D5',
    transform: [{ rotate: '-14deg' }],
  },
  mapRegionSouth: {
    position: 'absolute',
    right: 54,
    bottom: 38,
    width: 250,
    height: 180,
    borderRadius: 100,
    backgroundColor: '#B7D7C8',
    transform: [{ rotate: '18deg' }],
  },
  routeLineOne: {
    position: 'absolute',
    top: '31%',
    left: '32%',
    width: '34%',
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.surface,
    opacity: 0.7,
    transform: [{ rotate: '28deg' }],
  },
  routeLineTwo: {
    position: 'absolute',
    top: '61%',
    left: '36%',
    width: '36%',
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.surface,
    opacity: 0.7,
    transform: [{ rotate: '-18deg' }],
  },
  marker: {
    position: 'absolute',
    minWidth: 76,
    alignItems: 'center',
    gap: theme.spacing.xs,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  markerActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF3ED',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.25,
    elevation: 4,
  },
  markerPressed: {
    opacity: 0.86,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.secondary,
  },
  markerDotActive: {
    backgroundColor: theme.colors.primary,
  },
  markerLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  markerLabelActive: {
    color: theme.colors.primary,
  },
  previewCard: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    gap: theme.spacing.md,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    ...theme.shadow,
  },
  previewEyebrow: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  previewTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  foodText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    fontWeight: '600',
  },
  messageBox: {
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  messageText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.86,
  },
});
