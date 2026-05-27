import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { FeedSortTabs } from '@/components/feed/FeedSortTabs';
import { JournalCard } from '@/components/feed/JournalCard';
import { mockJournals } from '@/constants/mockData';
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

export default function HomeScreen() {
  const [activeSortKey, setActiveSortKey] = useState<FeedSortKey>('latest');
  const [hiddenJournalIds, setHiddenJournalIds] = useState<Set<string>>(() => new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const header = (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>K-Food Travel Feed</Text>
        <Text style={styles.title}>Real routes from food travelers</Text>
        <Text style={styles.subtitle}>
          Mock SNS feed data structured for future Supabase, recommendations, rankings, and reward systems.
        </Text>
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
});
