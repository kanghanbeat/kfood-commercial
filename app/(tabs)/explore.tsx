import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  getDefaultRecommendations,
  getFallbackRecommendations,
  getMatchLabel,
  getRecommendationReason,
  getSearchResults,
  mapDestinations,
  type SearchResult,
} from '@/constants/mockSearchData';
import { theme } from '@/constants/theme';

// This file is named `explore.tsx` for current Expo Router compatibility, but the user-facing tab is "Map".
// This screen should behave as a map-based destination discovery screen, not as a general Explore list.
function hasSearchValue(value: string): boolean {
  return value.trim().length > 0;
}

const placeRouteIds: Record<string, string> = {
  'seoul-gwangjang-bindaetteok': 'place-gwangjang-market',
  'seoul-bibimbap-table': 'place-gwangjang-market',
  'seoul-myeongdong-kalguksu': 'place-myeongdong-street-food-alley',
  'jeonju-bibimbap-house': 'place-jeonju-hanok-village',
  'jeonju-hanok-makgeolli': 'place-jeonju-hanok-village',
  'jeonju-kongnamul-gukbap': 'place-nambu-market',
  'busan-dwaeji-gukbap-street': 'place-biff-square',
  'busan-milmyeon-local-house': 'place-biff-square',
  'busan-jagalchi-seafood-route': 'place-jagalchi-market',
  'jeju-black-pork-grill': 'place-jeju-black-pork-street',
  'jeju-seafood-noodle-house': 'place-jeju-dongmun-market',
  'jeju-citrus-cafe-food-stop': 'place-jeju-dongmun-market',
};

function regionHref(destinationId: string): Href {
  return `/regions/region-${destinationId}` as Href;
}

function placeHref(placeId: string): Href {
  return `/place/${placeId}` as Href;
}

function searchHref(query: string): Href {
  const normalizedQuery = query.trim();
  return normalizedQuery
    ? (`/search?query=${encodeURIComponent(normalizedQuery)}` as Href)
    : ('/search' as Href);
}

export default function ExploreScreen() {
  const [selectedDestinationId, setSelectedDestinationId] = useState('jeonju');
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => getSearchResults(searchQuery), [searchQuery]);
  const defaultRecommendations = useMemo(() => getDefaultRecommendations(), []);
  const fallbackRecommendations = useMemo(() => getFallbackRecommendations(), []);
  const hasSearchQuery = hasSearchValue(searchQuery);
  const relatedRecommendations = hasSearchQuery
    ? searchResults.length > 0
      ? searchResults.slice(0, 4)
      : fallbackRecommendations
    : defaultRecommendations;
  const matchedDestinationIds = useMemo(
    () => new Set(searchResults.map((result) => result.destinationId)),
    [searchResults],
  );
  const selectedDestination =
    mapDestinations.find((destination) => destination.id === selectedDestinationId) ?? mapDestinations[1];

  function handleRoutePreview() {
    router.push(regionHref(selectedDestination.id));
  }

  function handleOpenSearch() {
    router.push(searchHref(selectedDestination.name));
  }

  function handleSelectSearchResult(result: SearchResult) {
    const routePlaceId = placeRouteIds[result.place.id];

    if (routePlaceId) {
      router.push(placeHref(routePlaceId));
      return;
    }

    router.push(regionHref(result.destinationId));
  }

  function handleClearSearch() {
    setSearchQuery('');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>K-Food Travel Map</Text>
          <Text style={styles.subtitle}>Tap a destination marker to preview local food routes.</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchInputRow}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              accessibilityLabel="Search regions, foods, places, and keywords"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setSearchQuery}
              placeholder="Search Jeonju, bibimbap, black pork, market..."
              placeholderTextColor={theme.colors.textSecondary}
              style={styles.searchInput}
              value={searchQuery}
            />
            {hasSearchQuery ? (
              <Pressable
                accessibilityRole="button"
                onPress={handleClearSearch}
                style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.resultSummary}>
            {hasSearchQuery
              ? `${searchResults.length} K-Food route${searchResults.length === 1 ? '' : 's'} found`
              : 'Search by region, city, food, restaurant, tag, or description.'}
          </Text>
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.mapRegionNorth} />
          <View style={styles.mapRegionSouth} />
          <View style={styles.routeLineOne} />
          <View style={styles.routeLineTwo} />

          {mapDestinations.map((destination) => {
            const isActive = destination.id === selectedDestination.id;
            const isSearchMatch = hasSearchQuery && matchedDestinationIds.has(destination.id);

            return (
              <Pressable
                accessibilityLabel={`Select ${destination.name}`}
                accessibilityRole="button"
                key={destination.id}
                  onPress={() => {
                    setSelectedDestinationId(destination.id);
                  }}
                style={({ pressed }) => [
                  styles.marker,
                  {
                    top: destination.markerTop,
                    left: destination.markerLeft,
                  },
                  isSearchMatch && styles.markerSearchMatch,
                  isActive && styles.markerActive,
                  pressed && styles.markerPressed,
                ]}>
                <View style={[styles.markerDot, isActive && styles.markerDotActive]} />
                <Text style={[styles.markerLabel, isActive && styles.markerLabelActive]}>{destination.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {hasSearchQuery ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <Pressable
                  accessibilityRole="button"
                  key={result.place.id}
                  onPress={() => handleSelectSearchResult(result)}
                  style={({ pressed }) => [styles.resultCard, pressed && styles.pressed]}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>{result.place.name}</Text>
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchBadgeText}>{getMatchLabel(result.matchType)}</Text>
                    </View>
                  </View>
                  <Text style={styles.resultFood}>{result.place.foodName}</Text>
                  <Text style={styles.resultMeta}>
                    {result.destinationName} · {result.place.city} · {result.region}
                  </Text>
                  <Text style={styles.resultDescription}>{result.place.description}</Text>
                  <View style={styles.tagRow}>
                    {result.place.tags.slice(0, 4).map((tag) => (
                      <Text key={`${result.place.id}-${tag}`} style={styles.tagChip}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyResultBox}>
                <Text style={styles.emptyResultTitle}>No matching K-Food routes found yet.</Text>
                <Text style={styles.emptyResultText}>Try Busan, milmyeon, Jeju, black pork, or market.</Text>
              </View>
            )}
          </View>
        ) : null}

        <View style={styles.recommendationSection}>
          <Text style={styles.resultsTitle}>Related Recommendations</Text>
          <View style={styles.resultsContainer}>
            {relatedRecommendations.map((result) => (
              <Pressable
                accessibilityRole="button"
                key={`recommendation-${result.place.id}`}
                onPress={() => handleSelectSearchResult(result)}
                style={({ pressed }) => [styles.resultCard, pressed && styles.pressed]}>
                <Text style={styles.resultTitle}>{result.place.name}</Text>
                <Text style={styles.resultMeta}>
                  {result.place.foodName} · {result.destinationName} / {result.place.city}
                </Text>
                <Text style={styles.recommendationReason}>
                  {getRecommendationReason(result, hasSearchQuery && searchResults.length > 0)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewEyebrow}>{selectedDestination.region}</Text>
          <Text style={styles.previewTitle}>{selectedDestination.name}</Text>
          <Text style={styles.foodText}>{selectedDestination.representativeFood}</Text>
          <Text style={styles.description}>{selectedDestination.description}</Text>
          <Text style={styles.placeSummary}>{selectedDestination.places.length} curated K-Food stops ready for route planning</Text>

          <Pressable
            accessibilityRole="button"
            onPress={handleRoutePreview}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>View Destination Routes</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleOpenSearch}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Search journals for {selectedDestination.name}</Text>
          </Pressable>
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
  searchSection: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    gap: theme.spacing.sm,
  },
  searchInputRow: {
    minHeight: 52,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadow,
  },
  searchIcon: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    minWidth: 0,
    paddingVertical: theme.spacing.xs,
  },
  resultSummary: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    lineHeight: 20,
  },
  clearButton: {
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  clearButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
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
  markerSearchMatch: {
    borderColor: theme.colors.secondary,
    backgroundColor: '#ECFEFF',
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
  resultsContainer: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    gap: theme.spacing.md,
  },
  resultsTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  resultCard: {
    gap: theme.spacing.sm,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  resultHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  resultTitle: {
    flex: 1,
    minWidth: 180,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  matchBadge: {
    borderRadius: 999,
    backgroundColor: '#FFF7ED',
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  matchBadgeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  resultFood: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  resultMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    lineHeight: 20,
  },
  resultDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  tagChip: {
    borderRadius: 999,
    backgroundColor: theme.colors.background,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  recommendationSection: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    gap: theme.spacing.md,
  },
  recommendationReason: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  emptyResultBox: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  emptyResultTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  emptyResultText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
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
  placeSummary: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
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
