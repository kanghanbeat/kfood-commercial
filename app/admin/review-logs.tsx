import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';
import { getReviewLogs } from '@/services/foodReviewService';
import type { FoodLabelEditableFields } from '@/types/foodLabel';
import type { FoodLabelReviewLog } from '@/types/review';

const staticMockLogs: FoodLabelReviewLog[] = [
  {
    id: 'static-log-approved-kimchi',
    foodLabelId: 'label-kimchi-jjigae-high',
    reviewerId: 'admin-seed-reviewer',
    action: 'approved',
    updatedData: {
      selectedFoodName: 'Kimchi Jjigae',
      selectedIngredients: ['kimchi', 'tofu', 'pork'],
      selectedRegionName: 'Seoul',
      category: 'soup',
      tags: ['spicy', 'stew', 'comfort food'],
    },
    createdAt: '2026-05-12T14:00:00.000Z',
  },
  {
    id: 'static-log-edited-bibimbap',
    foodLabelId: 'label-jeonju-bibimbap-regional',
    reviewerId: 'admin-seed-reviewer',
    action: 'edited',
    previousData: {
      selectedFoodName: 'Bibimbap',
      selectedIngredients: ['rice', 'vegetables'],
      selectedRegionName: 'Jeollabuk-do',
      category: 'rice',
      tags: ['traditional'],
    },
    updatedData: {
      selectedFoodName: 'Jeonju Bibimbap',
      selectedIngredients: ['rice', 'namul', 'gochujang'],
      selectedRegionName: 'Jeonju',
      category: 'rice',
      tags: ['traditional', 'regional', 'verified'],
    },
    createdAt: '2026-05-12T15:00:00.000Z',
  },
];

function formatLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

function summarizeData(data?: FoodLabelEditableFields): string {
  if (!data) {
    return 'No field snapshot.';
  }

  const parts = [
    data.selectedFoodName ? `food: ${data.selectedFoodName}` : undefined,
    data.selectedIngredients ? `ingredients: ${data.selectedIngredients.join(', ')}` : undefined,
    data.selectedRegionName ? `region: ${data.selectedRegionName}` : undefined,
    data.category ? `category: ${formatLabel(data.category)}` : undefined,
    data.tags ? `tags: ${data.tags.join(', ')}` : undefined,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(' | ') : 'No edited fields.';
}

export default function ReviewLogsScreen() {
  const memoryLogs = getReviewLogs();
  const logs = memoryLogs.length > 0 ? memoryLogs : staticMockLogs;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Admin Audit</Text>
        <Text style={styles.title}>Review Logs</Text>
        <Text style={styles.subtitle}>Audit trail for admin label actions.</Text>
      </View>

      <AppCard style={styles.helperCard}>
        <Text style={styles.helperText}>
          Logs are stored in memory only for Phase 4 and will be replaced with persistent audit logs later.
        </Text>
      </AppCard>

      {logs.length > 0 ? (
        logs.map((log) => (
          <AppCard key={log.id} style={styles.logCard}>
            <View style={styles.logHeader}>
              <Text style={styles.logTitle}>{formatLabel(log.action)}</Text>
              <Text style={styles.logDate}>{new Date(log.createdAt).toLocaleString()}</Text>
            </View>

            <View style={styles.detailGroup}>
              <Text style={styles.detailLabel}>Food Label ID</Text>
              <Text style={styles.detailValue}>{log.foodLabelId}</Text>
            </View>

            <View style={styles.detailGroup}>
              <Text style={styles.detailLabel}>Reviewer ID</Text>
              <Text style={styles.detailValue}>{log.reviewerId}</Text>
            </View>

            {log.reason ? (
              <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Reason</Text>
                <Text style={styles.detailValue}>{log.reason}</Text>
              </View>
            ) : null}

            <View style={styles.snapshotPanel}>
              <Text style={styles.snapshotTitle}>Previous Data</Text>
              <Text style={styles.snapshotText}>{summarizeData(log.previousData)}</Text>
            </View>

            <View style={styles.snapshotPanel}>
              <Text style={styles.snapshotTitle}>Updated Data</Text>
              <Text style={styles.snapshotText}>{summarizeData(log.updatedData)}</Text>
            </View>
          </AppCard>
        ))
      ) : (
        <AppCard>
          <Text style={styles.helperText}>No review logs yet. Logs will appear after admin actions.</Text>
        </AppCard>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  helperCard: {
    padding: theme.spacing.lg,
  },
  helperText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  logCard: {
    padding: theme.spacing.lg,
  },
  logHeader: {
    gap: theme.spacing.xs,
  },
  logTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  logDate: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  detailGroup: {
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
  },
  snapshotPanel: {
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  snapshotTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  snapshotText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 18,
  },
});
