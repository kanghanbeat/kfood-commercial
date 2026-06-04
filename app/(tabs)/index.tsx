import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/common/AppButton";
import { FeedSortTabs } from "@/components/feed/FeedSortTabs";
import { JournalCard } from "@/components/feed/JournalCard";
import { SeoHead } from "@/components/seo/SeoHead";
import { mockJournals } from "@/constants/mockData";
import {
  getDefaultRecommendations,
  getFallbackRecommendations,
  getRecommendationReason,
  getSearchResults,
  type SearchResult,
} from "@/constants/mockSearchData";
import { theme } from "@/constants/theme";
import type { FeedSortKey, Journal } from "@/types/journal";

function sortJournals(journals: Journal[], sortKey: FeedSortKey): Journal[] {
  const sortedJournals = [...journals];

  if (sortKey === "recommended") {
    return sortedJournals.sort(
      (a, b) => b.scores.recommendation - a.scores.recommendation,
    );
  }

  if (sortKey === "popular") {
    return sortedJournals.sort(
      (a, b) => b.scores.popularity - a.scores.popularity,
    );
  }

  return sortedJournals.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function hasSearchValue(value: string): boolean {
  return value.trim().length > 0;
}

function normalizeRouteId(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function getRegionRouteId(destinationId: string | null | undefined): string {
  const normalizedId = normalizeRouteId(destinationId);
  return normalizedId.startsWith("region-")
    ? normalizedId
    : `region-${normalizedId}`;
}

function getDisplayText(value: string | null | undefined, fallback: string) {
  const normalizedValue = normalizeRouteId(value);
  return normalizedValue || fallback;
}

export default function HomeScreen() {
  const [activeSortKey, setActiveSortKey] = useState<FeedSortKey>("latest");
  const [hiddenJournalIds, setHiddenJournalIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [lastHiddenJournalId, setLastHiddenJournalId] = useState<string | null>(
    null,
  );

  const hasQuery = hasSearchValue(searchQuery);
  const searchResults = useMemo(
    () => getSearchResults(searchQuery),
    [searchQuery],
  );
  const defaultRecommendations = useMemo(() => getDefaultRecommendations(), []);
  const fallbackRecommendations = useMemo(
    () => getFallbackRecommendations(),
    [],
  );
  const relatedRecommendations = hasQuery
    ? searchResults.length > 0
      ? searchResults
      : fallbackRecommendations
    : defaultRecommendations;
  const todayRecommendation = defaultRecommendations[0];
  const sortedJournals = useMemo(
    () =>
      sortJournals(mockJournals, activeSortKey).filter(
        (journal) => !hiddenJournalIds.has(journal.id),
      ),
    [activeSortKey, hiddenJournalIds],
  );
  const featuredJournal = sortedJournals[0];
  const totalRewardPoints = useMemo(
    () =>
      mockJournals.reduce(
        (total, journal) => total + journal.pointReward,
        0,
      ),
    [],
  );

  const handleHideJournal = useCallback((journalId: string) => {
    const normalizedJournalId = normalizeRouteId(journalId);

    if (!normalizedJournalId) {
      setStatusMessage("This guide cannot be hidden because its ID is missing.");
      return;
    }

    setHiddenJournalIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(normalizedJournalId);
      return nextIds;
    });
    setLastHiddenJournalId(normalizedJournalId);
    setStatusMessage("Guide hidden from this session. You can restore it below.");
  }, []);

  const handleUndoHideJournal = useCallback(() => {
    if (!lastHiddenJournalId) {
      return;
    }

    setHiddenJournalIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(lastHiddenJournalId);
      return nextIds;
    });
    setLastHiddenJournalId(null);
    setStatusMessage("Guide restored to the curated feed.");
  }, [lastHiddenJournalId]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setStatusMessage(
      "Curated K-Food Guide content is current for this guide catalog.",
    );
    setRefreshing(false);
  }, []);

  const handleOpenUpload = useCallback(() => {
    router.push("/upload");
  }, []);

  const handleOpenMapResult = useCallback((result: SearchResult) => {
    const destinationId = normalizeRouteId(result.destinationId);

    if (!destinationId) {
      setStatusMessage(
        "This K-Food Guide is missing a region link, so it cannot be opened yet.",
      );
      return;
    }

    router.push({
      pathname: "/regions/[regionId]",
      params: { regionId: getRegionRouteId(destinationId) },
    });
  }, []);

  const handleOpenSearchPage = useCallback(() => {
    const normalizedQuery = searchQuery.trim();

    router.push(
      normalizedQuery
        ? {
            pathname: "/search",
            params: { query: normalizedQuery },
          }
        : "/search",
    );
  }, [searchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setStatusMessage("");
  }, []);

  const handleOpenJournal = useCallback((journalId: string) => {
    const normalizedJournalId = normalizeRouteId(journalId);

    if (!normalizedJournalId) {
      setStatusMessage(
        "This guide is missing a journal link, so it cannot be opened yet.",
      );
      return;
    }

    router.push({
      pathname: "/journals/[journalId]",
      params: { journalId: normalizedJournalId },
    });
  }, []);

  const renderRecommendationCard = useCallback(
    (result: SearchResult, reason: string, keyFallback: string) => {
      const place = result.place;
      const placeId = getDisplayText(
        place?.id,
        getDisplayText(result.destinationId, keyFallback),
      );
      const placeName = getDisplayText(place?.name, "K-Food Guide");
      const foodName = getDisplayText(place?.foodName, "Featured dish");
      const destinationName = getDisplayText(result.destinationName, "Korea");
      const cityName = getDisplayText(place?.city, "Regional guide");

      return (
        <Pressable
          accessibilityLabel={`${placeName}, ${foodName}, ${destinationName}. Open regional K-Food Guide.`}
          accessibilityRole="button"
          key={placeId}
          onPress={() => handleOpenMapResult(result)}
          style={({ pressed }) => [
            styles.recommendationCard,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.recommendationTitle}>{placeName}</Text>
          <Text style={styles.recommendationMeta}>
            {foodName} · {destinationName} / {cityName}
          </Text>
          <Text style={styles.recommendationReason}>{reason}</Text>
        </Pressable>
      );
    },
    [handleOpenMapResult],
  );

  const renderJournalItem = useCallback(
    ({ item }: { item: Journal }) => {
      const journalId = normalizeRouteId(item.id);
      const hideLabel = journalId
        ? `Hide ${item.title} from this session`
        : "Hide this guide from this session";

      return (
        <View style={styles.content}>
          <JournalCard journal={item} onPress={() => handleOpenJournal(item.id)} />
          <Pressable
            accessibilityLabel={hideLabel}
            accessibilityRole="button"
            onPress={() => handleHideJournal(item.id)}
            style={({ pressed }) => [
              styles.hideActionButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.hideAction}>Hide this guide</Text>
          </Pressable>
        </View>
      );
    },
    [handleHideJournal, handleOpenJournal],
  );

  const header = (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>K-Food Travel Guide</Text>
        <Text style={styles.title}>Featured Korean food routes</Text>
        <Text style={styles.subtitle}>
          Curated food routes, editor picks, and regional guides for planning
          memorable Korean food trips.
        </Text>
        <AppButton onPress={handleOpenUpload} title="+ Create Journal" />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchInputRow}>
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={styles.searchIcon}
          >
            Search
          </Text>
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
              accessibilityLabel="Clear K-Food Guide search"
              accessibilityRole="button"
              onPress={handleClearSearch}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
        {hasQuery ? (
          <Pressable
            accessibilityLabel={`Open full K-Food Guide search results for ${searchQuery.trim()}`}
            accessibilityRole="button"
            onPress={handleOpenSearchPage}
            style={({ pressed }) => [
              styles.searchPageButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.searchPageButtonText}>
              Open full search results
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Recommended K-Food Guides</Text>
        {hasQuery && searchResults.length === 0 ? (
          <View style={styles.emptyResultBox}>
            <Text style={styles.emptyResultTitle}>
              No matching K-Food routes found yet.
            </Text>
            <Text style={styles.emptyResultText}>
              Showing Editor Pick guides with similar food and travel themes.
            </Text>
          </View>
        ) : null}
        <View style={styles.recommendationList}>
          {relatedRecommendations.map((result, index) =>
            renderRecommendationCard(
              result,
              getRecommendationReason(
                result,
                hasQuery && searchResults.length > 0,
              ),
              `recommended-guide-${index}`,
            ),
          )}
        </View>
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Editor Pick Today</Text>
        <View style={styles.recommendationList}>
          {todayRecommendation
            ? renderRecommendationCard(
                todayRecommendation,
                "Curated local food recommendation",
                "editor-pick-today",
              )
            : null}
        </View>
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Featured regional food routes</Text>
        <View style={styles.routeGrid}>
          {defaultRecommendations.map((result, index) => (
            <Pressable
              accessibilityLabel={`Open ${getDisplayText(
                result.destinationName,
                "regional",
              )} K-Food Guide for ${getDisplayText(
                result.place?.foodName,
                "featured dishes",
              )}`}
              accessibilityRole="button"
              key={`route-${getDisplayText(
                result.place?.id,
                getDisplayText(result.destinationId, `featured-route-${index}`),
              )}`}
              onPress={() => handleOpenMapResult(result)}
              style={({ pressed }) => [
                styles.routeCard,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.routeTitle}>
                {getDisplayText(result.destinationName, "Regional K-Food Guide")}
              </Text>
              <Text style={styles.routeMeta}>
                {getDisplayText(result.place?.foodName, "Featured dish")}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.sectionTitle}>Featured guide journals</Text>
        <View style={styles.emptyResultBox}>
          <Text style={styles.emptyResultText}>
            Browse curated route notes, then continue into region, food, and
            place guides.
          </Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{mockJournals.length}</Text>
          <Text style={styles.summaryLabel}>guides</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {featuredJournal?.scores.recommendation ?? 0}
          </Text>
          <Text style={styles.summaryLabel}>top guide score</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalRewardPoints}</Text>
          <Text style={styles.summaryLabel}>reward points</Text>
        </View>
      </View>

      {Platform.OS === "web" ? (
        <Pressable
          accessibilityLabel="Refresh curated K-Food Guide content"
          accessibilityRole="button"
          onPress={handleRefresh}
          style={({ pressed }) => [
            styles.searchPageButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.searchPageButtonText}>Refresh guide content</Text>
        </Pressable>
      ) : null}

      <FeedSortTabs activeKey={activeSortKey} onChange={setActiveSortKey} />

      {statusMessage ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>{statusMessage}</Text>
          {lastHiddenJournalId ? (
            <Pressable
              accessibilityLabel="Restore the hidden guide to the feed"
              accessibilityRole="button"
              onPress={handleUndoHideJournal}
              style={({ pressed }) => [
                styles.undoButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.undoButtonText}>Undo hide</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <SeoHead
        title="K-Food Travel | Korean food routes, maps, and guide journals"
        description="Discover Korean food travel routes by region, dish, place, and curated guide journal with K-Food guides and map-based planning."
        path="/"
      />
      <FlatList
        ListEmptyComponent={
          <View style={[styles.content, styles.emptyState]}>
            <Text style={styles.emptyTitle}>No guides to show</Text>
            <Text style={styles.stateText}>
              Refresh guide content or undo hidden guides to restore the curated
              feed.
            </Text>
          </View>
        }
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        data={sortedJournals}
        initialNumToRender={4}
        keyExtractor={(journal) => journal.id}
        maxToRenderPerBatch={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={renderJournalItem}
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
    width: "100%",
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: "center",
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.title,
    fontWeight: "700",
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
    alignItems: "center",
    flexDirection: "row",
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
    fontWeight: "700",
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
    fontWeight: "700",
  },
  searchPageButton: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchPageButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: "700",
  },
  recommendationSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: "700",
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
    fontWeight: "700",
    lineHeight: 22,
  },
  recommendationMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: "600",
    lineHeight: 20,
  },
  recommendationReason: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: "700",
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
    fontWeight: "700",
  },
  emptyResultText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  routeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    fontWeight: "700",
  },
  routeMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    minHeight: 76,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  summaryValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: "700",
  },
  summaryLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: "600",
  },
  hideActionButton: {
    alignSelf: "flex-end",
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  hideAction: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: "700",
  },
  stateBox: {
    gap: theme.spacing.sm,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
  },
  undoButton: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  undoButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: "700",
  },
  stateText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.86,
  },
});
