import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { FeedSortTabs } from '@/components/feed/FeedSortTabs';
import { JournalCard } from '@/components/feed/JournalCard';
import { mockJournals } from '@/constants/mockData';
import {
  getDefaultRecommendations,
  getFallbackRecommendations,
  getRecommendationReason,
  getSearchResults,
  type SearchResult,
} from '@/constants/mockSearchData';
import { theme } from '@/constants/theme';
import type { FeedSortKey, Journal } from '@/types/journal';

function sortJournals(journals: Journal[], sortKey: FeedSortKey): Journal[] {
  const sortedJournals = [...journals];

  if (sortKey === 'recommended') {
    return sortedJournals.sort((a, b) => b.scores.recommendation - a.scores.recommendation);
  }

  if (sortKey === 'popular') {
    return sortedJournals.sort((a, b) => b.scores.popularity - a.scores.popularity);
  }

  return sortedJournals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function hasSearchValue(value: string): boolean {
  return value.trim().length > 0;
}

export default function HomeScreen() {
  const [activeSortKey, setActiveSortKey] = useState<FeedSortKey>('latest');
  const [hiddenJournalIds, setHiddenJournalIds] = useState<Set<string>>(() => new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasQuery = hasSearchValue(searchQuery);
  const searchResults = useMemo(() => getSearchResults(searchQuery), [searchQuery]);
  const defaultRecommendations = useMemo(() => getDefaultRecommendations(), []);
  const fallbackRecommendations = useMemo(() => getFallbackRecommendations(), []);
  const relatedRecommendations = hasQuery
    ? searchResults.length > 0
      ? searchResults
      : fallbackRecommendations
    : defaultRecommendations;
  const todayRecommendation = defaultRecommendations[0];
  const sortedJournals = useMemo(
    () => sortJournals(mockJournals, activeSortKey).filter((journal) => !hiddenJournalIds.has(journal.id)),
    [activeSortKey, hiddenJournalIds],
  );
  const featuredJournal = sortedJournals[0];

  function handleHideJournal(journalId: string) {
    setHiddenJournalIds((currentIds) => new Set([...currentIds, journalId]));
  }

  function handleRefresh() {
    setRefreshing(true);
    setErrorMessage('');
    setTimeout(() => setRefreshing(false), 250);
  }

  function handleOpenUpload() {
    router.push('/upload' as Href);
  }

  function handleOpenMapResult() {
    router.push('/explore' as Href);
  }

  function handleClearSearch() {
    setSearchQuery('');
  }

  function renderRecommendationCard(result: SearchResult, reason: string) {
    return (
      <Pressable
        accessibilityRole="button"
        key={result.place.id}
        onPress={handleOpenMapResult}
        style={({ pressed }) => [styles.recommendationCard, pressed && styles.pressed]}>
        <Text style={styles.recommendationTitle}>{result.place.name}</Text>
        <Text style={styles.recommendationMeta}>
          {result.place.foodName} · {result.destinationName} / {result.place.city}
        </Text>
        <Text style={styles.recommendationReason}>{reason}</Text>
      </Pressable>
    );
  }

  const header = (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>K-Food Travel Feed</Text>
        <Text style={styles.title}>Real routes from food travelers</Text>
        <Text style={styles.subtitle}>
          Mock SNS feed data structured for future Supabase, recommendations, rankings, and reward systems.
        </Text>
        <AppButton onPress={handleOpenUpload} title="+ Upload Post" />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchInputRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            accessibilityLabel="Search K-Food, regions, or places"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearchQuery}
            placeholder="Search K-Food, regions, or places"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.searchInput}
            value={searchQuery}
          />
          {hasQuery ? (
            <Pressable
              accessibilityRole="button"
              onPress={handleClearSearch}
              style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Related recommendations</Text>
        {hasQuery && searchResults.length === 0 ? (
          <View style={styles.emptyResultBox}>
            <Text style={styles.emptyResultTitle}>No matching K-Food routes found yet.</Text>
            <Text style={styles.emptyResultText}>Showing popular fallback routes while this data grows.</Text>
          </View>
        ) : null}
        <View style={styles.recommendationList}>
          {relatedRecommendations.map((result) =>
            renderRecommendationCard(result, getRecommendationReason(result, hasQuery && searchResults.length > 0)),
          )}
        </View>
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Recommended K-Food Today</Text>
        <View style={styles.recommendationList}>
          {todayRecommendation
            ? renderRecommendationCard(todayRecommendation, 'Related local food recommendation')
            : null}
        </View>
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Popular regional food routes</Text>
        <View style={styles.routeGrid}>
          {defaultRecommendations.map((result) => (
            <View key={`route-${result.place.id}`} style={styles.routeCard}>
              <Text style={styles.routeTitle}>{result.destinationName}</Text>
              <Text style={styles.routeMeta}>{result.place.foodName}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Recent or suggested travel posts</Text>
        <View style={styles.emptyResultBox}>
          <Text style={styles.emptyResultText}>
            Suggested posts are currently represented by the mock SNS feed below.
          </Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{mockJournals.length}</Text>
          <Text style={styles.summaryLabel}>journals</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{featuredJournal?.scores.recommendation ?? 0}</Text>
          <Text style={styles.summaryLabel}>top score</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {mockJournals.reduce((total, journal) => total + journal.pointReward, 0)}
          </Text>
          <Text style={styles.summaryLabel}>mock points</Text>
        </View>
      </View>

      <FeedSortTabs activeKey={activeSortKey} onChange={setActiveSortKey} />

      {errorMessage ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListEmptyComponent={
          <View style={[styles.content, styles.emptyState]}>
            <Text style={styles.emptyTitle}>No journals to show</Text>
            <Text style={styles.stateText}>Change the sort or refresh to restore the mock feed.</Text>
          </View>
        }
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        data={sortedJournals}
        initialNumToRender={4}
        keyExtractor={(journal) => journal.id}
        maxToRenderPerBatch={5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.content}>
            <JournalCard journal={item} />
            <Text accessibilityRole="button" onPress={() => handleHideJournal(item.id)} style={styles.hideAction}>
              Hide from feed
            </Text>
          </View>
        )}
        removeClippedSubviews
        updateCellsBatchingPeriod={50}
        windowSize={7}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    gap: theme.spacing.lg,
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
  searchSection: {
    gap: theme.spacing.sm,
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
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    minWidth: 0,
    paddingVertical: theme.spacing.xs,
  },
  clearButton: {
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  clearButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  recommendationSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  recommendationList: {
    gap: theme.spacing.sm,
  },
  recommendationCard: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  recommendationTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  recommendationMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    lineHeight: 20,
  },
  recommendationReason: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  emptyResultBox: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
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
  routeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  routeCard: {
    flexGrow: 1,
    flexBasis: 160,
    gap: theme.spacing.xs,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
  },
  routeTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  routeMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    minHeight: 76,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  summaryValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  summaryLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  hideAction: {
    alignSelf: 'flex-end',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  stateBox: {
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
  },
  stateText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.86,
  },
});
