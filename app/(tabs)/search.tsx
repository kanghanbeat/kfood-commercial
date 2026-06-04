import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { mockJournals } from '@/constants/mockData';
import { mockFoods, mockPlaces, mockRegions } from '@/constants/mockExploreData';
import { theme } from '@/constants/theme';

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  label: string;
  href: Href;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function includesQuery(fields: string[], query: string): boolean {
  return fields.some((field) => normalize(field).includes(query));
}

export default function SearchScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query ?? '');
  const normalizedQuery = normalize(query);

  const results = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) {
      return [
        ...mockRegions.slice(0, 3).map((region) => ({
          id: `region-${region.id}`,
          title: region.nameEn ?? region.nameKo,
          subtitle: region.tags.join(' · '),
          description: region.description,
          label: 'Region',
          href: `/regions/${region.id}` as Href,
        })),
        ...mockFoods.slice(0, 3).map((food) => ({
          id: `food-${food.id}`,
          title: food.nameEn ?? food.nameKo,
          subtitle: food.tags.join(' · '),
          description: food.description,
          label: 'Food',
          href: `/foods/${food.id}` as Href,
        })),
        ...mockPlaces.slice(0, 3).map((place) => ({
          id: `place-${place.id}`,
          title: place.name,
          subtitle: place.address,
          description: place.tags.join(' · '),
          label: 'Place',
          href: `/place/${place.id}` as Href,
        })),
      ];
    }

    const regionResults = mockRegions
      .filter((region) =>
        includesQuery([region.nameKo, region.nameEn ?? '', region.description, ...region.tags], normalizedQuery),
      )
      .map((region) => ({
        id: `region-${region.id}`,
        title: region.nameEn ?? region.nameKo,
        subtitle: region.tags.join(' · '),
        description: region.description,
        label: 'Region',
        href: `/regions/${region.id}` as Href,
      }));

    const foodResults = mockFoods
      .filter((food) =>
        includesQuery([food.nameKo, food.nameEn ?? '', food.description, ...food.tags], normalizedQuery),
      )
      .map((food) => ({
        id: `food-${food.id}`,
        title: food.nameEn ?? food.nameKo,
        subtitle: food.tags.join(' · '),
        description: food.description,
        label: 'Food',
        href: `/foods/${food.id}` as Href,
      }));

    const placeResults = mockPlaces
      .filter((place) =>
        includesQuery([place.name, place.address, ...place.tags, ...place.recommendationTags], normalizedQuery),
      )
      .map((place) => ({
        id: `place-${place.id}`,
        title: place.name,
        subtitle: place.address,
        description: place.tags.join(' · '),
        label: 'Place',
        href: `/place/${place.id}` as Href,
      }));

    const journalResults = mockJournals
      .filter((journal) =>
        includesQuery(
          [
            journal.title,
            journal.content,
            journal.regionName,
            journal.cityName ?? '',
            journal.locationName ?? '',
          ],
          normalizedQuery,
        ),
      )
      .map((journal) => ({
        id: `journal-${journal.id}`,
        title: journal.title,
        subtitle: `${journal.regionName}${journal.locationName ? ` · ${journal.locationName}` : ''}`,
        description: journal.content,
        label: 'Journal',
        href: `/journals/${journal.id}` as Href,
      }));

    return [...regionResults, ...foodResults, ...placeResults, ...journalResults];
  }, [normalizedQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Search</Text>
          <Text style={styles.title}>Find K-Food routes</Text>
          <Text style={styles.subtitle}>Search by region, dish, place, market, route note, or travel style.</Text>
        </View>

        <View style={styles.searchInputRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            accessibilityLabel="Search K-Food routes"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setQuery}
            placeholder="Try Jeonju, black pork, market, or bibimbap"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.searchInput}
            value={query}
          />
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>{normalizedQuery ? 'Matching routes' : 'Editor picks'}</Text>
          <Text style={styles.resultCount}>{results.length} result{results.length === 1 ? '' : 's'}</Text>
        </View>

        <View style={styles.resultsList}>
          {results.length > 0 ? (
            results.map((result) => (
              <Pressable
                accessibilityRole="button"
                key={result.id}
                onPress={() => router.push(result.href)}
                style={({ pressed }) => [styles.resultCard, pressed && styles.pressed]}>
                <View style={styles.resultTopRow}>
                  <Text style={styles.resultTitle}>{result.title}</Text>
                  <Text style={styles.resultLabel}>{result.label}</Text>
                </View>
                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                <Text style={styles.resultDescription} numberOfLines={3}>{result.description}</Text>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No matching routes yet</Text>
              <Text style={styles.emptyText}>Try a city, dish, market, or travel theme such as seafood or heritage.</Text>
            </View>
          )}
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
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.sm,
  },
  eyebrow: {
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
  searchInputRow: {
    minHeight: 52,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    borderRadius: theme.radius.input,
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
    minWidth: 0,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    paddingVertical: theme.spacing.xs,
  },
  resultsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  resultCount: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  resultsList: {
    gap: theme.spacing.md,
  },
  resultCard: {
    gap: theme.spacing.sm,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    ...theme.shadow,
  },
  resultTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  resultTitle: {
    flex: 1,
    minWidth: 180,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  resultLabel: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#FFF4ED',
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  resultSubtitle: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    lineHeight: 20,
  },
  resultDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  emptyBox: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.86,
  },
});
