import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';
import {
  CRAWLED_REVIEW_STATUS_LABELS,
  CRAWLED_SOURCE_TYPE_LABELS,
  MOCK_CRAWLED_DATA,
} from '@/data/mockCrawledData';
import type { CrawledItem } from '@/types/crawling';

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatCollectedAt(value: string): string {
  return new Date(value).toLocaleString();
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailLine}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function SourceTypePill({ label }: { label: string }) {
  return (
    <View style={styles.sourcePill}>
      <Text style={styles.sourcePillText}>{label}</Text>
    </View>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <View style={styles.statusBadge}>
      <Text style={styles.statusBadgeText}>{label}</Text>
    </View>
  );
}

function CrawledResultCard({ item }: { item: CrawledItem }) {
  return (
    <AppCard style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <View style={styles.titleGroup}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text style={styles.localizedTitle}>{item.titleKo}</Text>
          <Text style={styles.localizedTitle}>{item.titleEn}</Text>
        </View>
        <StatusBadge label={CRAWLED_REVIEW_STATUS_LABELS[item.status]} />
      </View>

      <View style={styles.metaRow}>
        <SourceTypePill label={CRAWLED_SOURCE_TYPE_LABELS[item.sourceType]} />
        <Text style={styles.confidenceText}>Confidence {formatPercent(item.confidenceScore)}</Text>
      </View>

      <View style={styles.detailGrid}>
        <DetailLine label="Linked Entity Type" value={item.linkedEntityType} />
        <DetailLine label="Region" value={item.region} />
        <DetailLine label="Collected At" value={formatCollectedAt(item.collectedAt)} />
      </View>

      <View style={styles.tagRow}>
        {item.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.summary}>{item.summary}</Text>
    </AppCard>
  );
}

export default function AdminDataCrawlingScreen() {
  const [hasRunCrawl, setHasRunCrawl] = useState(false);
  const crawledItems = hasRunCrawl ? MOCK_CRAWLED_DATA : [];

  return (
    <ScreenContainer style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Admin Data Pipeline</Text>
        <Text style={styles.title}>Data Crawling Center</Text>
        <Text style={styles.subtitle}>
          Collect and prepare K-Food, region, and travel destination data for admin review.
        </Text>
      </View>

      <AppCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Crawling Source Types</Text>
        <View style={styles.sourceGrid}>
          {Object.values(CRAWLED_SOURCE_TYPE_LABELS).map((label) => (
            <SourceTypePill key={label} label={label} />
          ))}
        </View>
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Mock Crawling Action</Text>
        {!hasRunCrawl ? (
          <Text style={styles.helperText}>
            No crawled items loaded yet. Run a mock crawl to preview admin data collection.
          </Text>
        ) : (
          <Text style={styles.helperText}>
            Loaded {crawledItems.length} mock review candidates from the existing crawling dataset.
          </Text>
        )}
        <AppButton title="Run Mock Crawling" onPress={() => setHasRunCrawl(true)} />
      </AppCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crawled Results</Text>
        {crawledItems.length > 0 ? (
          crawledItems.map((item) => <CrawledResultCard key={item.id} item={item} />)
        ) : (
          <AppCard style={styles.emptyCard}>
            <Text style={styles.helperText}>Crawled review candidates will appear here after the mock crawl runs.</Text>
          </AppCard>
        )}
      </View>

      <AppCard style={styles.noticeCard}>
        <Text style={styles.noticeText}>
          Collected items will be sent to the admin review queue before becoming public recommendation data.
        </Text>
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    maxWidth: 900,
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
  section: {
    gap: theme.spacing.md,
  },
  sectionCard: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sourcePill: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  sourcePillText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  helperText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  emptyCard: {
    padding: theme.spacing.lg,
  },
  resultCard: {
    padding: theme.spacing.lg,
  },
  resultHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  titleGroup: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 220,
  },
  resultTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  localizedTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 18,
  },
  statusBadge: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    borderRadius: theme.radius.input,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  statusBadgeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  confidenceText: {
    color: theme.colors.success,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  detailGrid: {
    gap: theme.spacing.sm,
  },
  detailLine: {
    gap: 2,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  detailValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.input,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  tagText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  summary: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  noticeCard: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
    padding: theme.spacing.lg,
  },
  noticeText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
});
