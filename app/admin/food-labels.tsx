import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';
import { mockFoodLabels } from '@/data/mockFoodLabels';
import { approveFoodLabel, editFoodLabel, rejectFoodLabel } from '@/services/foodReviewService';
import { createGoldDatasetCandidate } from '@/services/goldDatasetService';
import type {
  CandidateLabel,
  FoodLabelAnalysisResult,
  FoodLabelReviewStatus,
  FoodLabelRouteStatus,
  GoldFoodDatasetItem,
} from '@/types/foodLabel';

type LabelFilter = 'all' | 'pending' | 'auto_candidate' | 'needs_review' | 'high_risk' | 'rejected';

const reviewerId = 'admin-demo-reviewer';

const filterOptions: { key: LabelFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'auto_candidate', label: 'Auto Candidate' },
  { key: 'needs_review', label: 'Needs Review' },
  { key: 'high_risk', label: 'High Risk' },
  { key: 'rejected', label: 'Rejected' },
];

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatProgressWidth(value: number): `${number}%` {
  return `${Math.round(value * 100)}%`;
}

function formatLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

function getTopCandidate(candidates: CandidateLabel[]): CandidateLabel | undefined {
  return [...candidates].sort((a, b) => b.confidence - a.confidence)[0];
}

function getReviewPriorityScore(label: FoodLabelAnalysisResult): number {
  const routePenalty = label.routeStatus === 'needs_admin_review' ? 40 : 0;
  const rejectedPenalty = label.routeStatus === 'rejected_candidate' ? 60 : 0;
  const lowConfidencePenalty = Math.round((1 - label.confidenceScore) * 50);
  const pendingPenalty = label.reviewStatus === 'pending' ? 20 : 0;

  return routePenalty + rejectedPenalty + lowConfidencePenalty + pendingPenalty;
}

function isHighRiskLabel(label: FoodLabelAnalysisResult): boolean {
  return label.confidenceScore < 0.7 || label.routeStatus === 'rejected_candidate';
}

function getRouteStatusLabel(status: FoodLabelRouteStatus): string {
  if (status === 'auto_approved_candidate') {
    return 'Auto Candidate';
  }

  if (status === 'needs_admin_review') {
    return 'Needs Review';
  }

  return 'Rejected Candidate';
}

function getReviewStatusLabel(status: FoodLabelReviewStatus): string {
  return formatLabel(status);
}

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: formatProgressWidth(value) }]} />
    </View>
  );
}

function CandidateList({ title, candidates }: { title: string; candidates: CandidateLabel[] }) {
  return (
    <View style={styles.candidateGroup}>
      <Text style={styles.smallTitle}>{title}</Text>
      {candidates.map((candidate) => (
        <View key={candidate.name} style={styles.candidateRow}>
          <View style={styles.candidateHeader}>
            <Text style={styles.candidateName}>{candidate.name}</Text>
            <Text style={styles.candidateScore}>{formatPercent(candidate.confidence)}</Text>
          </View>
          <ProgressBar value={candidate.confidence} />
        </View>
      ))}
    </View>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function RouteStatusBadge({ status }: { status: FoodLabelRouteStatus }) {
  return (
    <View
      style={[
        styles.badge,
        status === 'auto_approved_candidate' && styles.autoBadge,
        status === 'needs_admin_review' && styles.reviewBadge,
        status === 'rejected_candidate' && styles.rejectedBadge,
      ]}>
      <Text style={styles.badgeText}>{getRouteStatusLabel(status)}</Text>
    </View>
  );
}

function ReviewStatusBadge({ status }: { status: FoodLabelReviewStatus }) {
  return (
    <View
      style={[
        styles.badge,
        status === 'approved' && styles.autoBadge,
        status === 'edited' && styles.editedBadge,
        status === 'rejected' && styles.rejectedBadge,
        status === 'pending' && styles.pendingBadge,
      ]}>
      <Text style={styles.badgeText}>{getReviewStatusLabel(status)}</Text>
    </View>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailLine}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function matchesFilter(label: FoodLabelAnalysisResult, filter: LabelFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'pending') {
    return label.reviewStatus === 'pending';
  }

  if (filter === 'auto_candidate') {
    return label.routeStatus === 'auto_approved_candidate';
  }

  if (filter === 'needs_review') {
    return label.routeStatus === 'needs_admin_review';
  }

  if (filter === 'high_risk') {
    return isHighRiskLabel(label);
  }

  return label.routeStatus === 'rejected_candidate' || label.reviewStatus === 'rejected';
}

export default function FoodLabelsAdminScreen() {
  const [labels, setLabels] = useState<FoodLabelAnalysisResult[]>(mockFoodLabels);
  const [activeFilter, setActiveFilter] = useState<LabelFilter>('all');
  const [goldCandidates, setGoldCandidates] = useState<GoldFoodDatasetItem[]>([]);

  const visibleLabels = useMemo(
    () =>
      labels
        .filter((label) => matchesFilter(label, activeFilter))
        .sort((a, b) => getReviewPriorityScore(b) - getReviewPriorityScore(a)),
    [activeFilter, labels],
  );

  const pendingCount = labels.filter((label) => label.reviewStatus === 'pending').length;
  const autoCount = labels.filter((label) => label.routeStatus === 'auto_approved_candidate').length;
  const highRiskCount = labels.filter(isHighRiskLabel).length;
  const rejectedCount = labels.filter(
    (label) => label.routeStatus === 'rejected_candidate' || label.reviewStatus === 'rejected',
  ).length;
  const autoApprovalQueue = labels.filter(
    (label) => label.reviewStatus === 'pending' && label.routeStatus === 'auto_approved_candidate' && label.confidenceScore >= 0.9,
  );

  function updateLabel(updatedLabel: FoodLabelAnalysisResult) {
    setLabels((currentLabels) =>
      currentLabels.map((label) => (label.id === updatedLabel.id ? updatedLabel : label)),
    );
  }

  function handleApprove(label: FoodLabelAnalysisResult) {
    const approvedLabel = approveFoodLabel(label, reviewerId);
    const candidate = createGoldDatasetCandidate(approvedLabel, reviewerId);
    updateLabel(approvedLabel);
    setGoldCandidates((currentCandidates) => {
      const existingCandidate = currentCandidates.find((item) => item.sourceFoodLabelId === approvedLabel.id);
      return existingCandidate ? currentCandidates : [candidate, ...currentCandidates];
    });
  }

  function handleApproveAutoQueue() {
    autoApprovalQueue.forEach(handleApprove);
  }

  function handleEdit(label: FoodLabelAnalysisResult) {
    const topFoodName = getTopCandidate(label.foodNameCandidates)?.name;
    const topRegion = getTopCandidate(label.regionCandidates)?.name;
    const nextTags = label.tags.includes('verified') ? label.tags : [...label.tags, 'verified'];
    const nextIngredients =
      label.selectedIngredients && label.selectedIngredients.length > 0
        ? label.selectedIngredients
        : label.ingredientCandidates.map((candidate) => candidate.name);

    updateLabel(
      editFoodLabel(
        label,
        {
          selectedFoodName: label.selectedFoodName ?? topFoodName,
          selectedIngredients: nextIngredients,
          selectedRegionName: label.selectedRegionName ?? topRegion,
          category: label.category,
          tags: nextTags,
        },
        reviewerId,
      ),
    );
  }

  function handleReject(label: FoodLabelAnalysisResult) {
    updateLabel(rejectFoodLabel(label, reviewerId, 'Image is unclear or food cannot be verified.'));
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Admin Verification</Text>
        <Text style={styles.title}>Food Label Review</Text>
        <Text style={styles.subtitle}>Review AI-generated labels before they become Gold Dataset candidates.</Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard label="Total Labels" value={labels.length} />
        <SummaryCard label="Pending Review" value={pendingCount} />
        <SummaryCard label="Auto Approved Candidates" value={autoCount} />
        <SummaryCard label="High Risk Queue" value={highRiskCount} />
        <SummaryCard label="Rejected Candidates" value={rejectedCount} />
        <SummaryCard label="Gold Dataset Candidates" value={goldCandidates.length} />
      </View>

      <AppCard style={styles.workflowCard}>
        <View style={styles.workflowHeader}>
          <View style={styles.workflowText}>
            <Text style={styles.cardTitle}>Review Workload</Text>
            <Text style={styles.helperText}>
              Queue is sorted by risk so low-confidence and rejected candidates stay at the top.
            </Text>
          </View>
          <AppButton
            disabled={autoApprovalQueue.length === 0}
            onPress={handleApproveAutoQueue}
            title={`Approve ${autoApprovalQueue.length} Auto`}
            variant="outline"
          />
        </View>
      </AppCard>

      <View style={styles.filterRow}>
        {filterOptions.map((option) => {
          const isSelected = option.key === activeFilter;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={option.key}
              onPress={() => setActiveFilter(option.key)}
              style={({ pressed }) => [styles.filterChip, isSelected && styles.selectedFilterChip, pressed && styles.pressed]}>
              <Text style={[styles.filterText, isSelected && styles.selectedFilterText]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {visibleLabels.length === 0 ? (
        <AppCard>
          <Text style={styles.cardTitle}>No labels in this queue</Text>
          <Text style={styles.helperText}>Change filters or load more mock labels when backend pagination is connected.</Text>
        </AppCard>
      ) : null}

      {visibleLabels.map((label) => {
        const topFood = getTopCandidate(label.foodNameCandidates)?.name ?? 'Unknown';
        const topRegion = getTopCandidate(label.regionCandidates)?.name ?? 'Unknown';
        const originalIngredients = label.ingredientCandidates.map((candidate) => candidate.name).join(', ');

        return (
          <AppCard key={label.id} style={styles.labelCard}>
            <View style={styles.mockImage}>
              <Text style={styles.mockImageText}>Mock Food Image</Text>
              <Text style={styles.mockImageMeta}>{label.imageId}</Text>
            </View>

            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{label.selectedFoodName ?? topFood}</Text>
                <Text style={styles.priorityText}>Priority {getReviewPriorityScore(label)}</Text>
              </View>
              <View style={styles.badgeRow}>
                <RouteStatusBadge status={label.routeStatus} />
                <ReviewStatusBadge status={label.reviewStatus} />
              </View>
            </View>

            <CandidateList candidates={label.foodNameCandidates} title="Food name candidates" />
            <CandidateList candidates={label.ingredientCandidates} title="Ingredient candidates" />
            <CandidateList candidates={label.regionCandidates} title="Region candidates" />

            <View style={styles.candidateGroup}>
              <View style={styles.candidateHeader}>
                <Text style={styles.smallTitle}>Overall confidence</Text>
                <Text style={styles.candidateScore}>{formatPercent(label.confidenceScore)}</Text>
              </View>
              <ProgressBar value={label.confidenceScore} />
            </View>

            <View style={styles.metaGrid}>
              <DetailLine label="Category" value={formatLabel(label.category)} />
              <DetailLine label="Tags" value={label.tags.join(', ')} />
            </View>

            <View style={styles.comparisonGrid}>
              <View style={styles.comparisonPanel}>
                <Text style={styles.smallTitle}>Original AI Result</Text>
                <DetailLine label="Food" value={topFood} />
                <DetailLine label="Ingredients" value={originalIngredients} />
                <DetailLine label="Region" value={topRegion} />
                <DetailLine label="Category" value={formatLabel(label.category)} />
                <DetailLine label="Tags" value={label.tags.join(', ')} />
              </View>

              <View style={styles.comparisonPanel}>
                <Text style={styles.smallTitle}>Admin Edited Result</Text>
                <DetailLine label="Food" value={label.selectedFoodName ?? 'Not selected'} />
                <DetailLine label="Ingredients" value={label.selectedIngredients?.join(', ') ?? 'Not selected'} />
                <DetailLine label="Region" value={label.selectedRegionName ?? 'Not selected'} />
                <DetailLine label="Category" value={formatLabel(label.category)} />
                <DetailLine label="Tags" value={label.tags.join(', ')} />
              </View>
            </View>

            <View style={styles.actionRow}>
              <AppButton onPress={() => handleApprove(label)} title="Approve" />
              <AppButton onPress={() => handleEdit(label)} title="Edit Mock" variant="secondary" />
              <AppButton onPress={() => handleReject(label)} title="Reject" variant="danger" />
            </View>
          </AppCard>
        );
      })}
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  summaryCard: {
    flexGrow: 1,
    minWidth: 150,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    ...theme.shadow,
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  selectedFilterChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  selectedFilterText: {
    color: theme.colors.surface,
  },
  pressed: {
    opacity: 0.86,
  },
  labelCard: {
    padding: theme.spacing.lg,
  },
  workflowCard: {
    padding: theme.spacing.lg,
  },
  workflowHeader: {
    gap: theme.spacing.md,
  },
  workflowText: {
    gap: theme.spacing.xs,
  },
  helperText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 22,
  },
  mockImage: {
    minHeight: 132,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF4ED',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  mockImageText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  mockImageMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardHeader: {
    gap: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  priorityText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  autoBadge: {
    backgroundColor: theme.colors.success,
  },
  reviewBadge: {
    backgroundColor: theme.colors.warning,
  },
  rejectedBadge: {
    backgroundColor: theme.colors.error,
  },
  pendingBadge: {
    backgroundColor: theme.colors.textSecondary,
  },
  editedBadge: {
    backgroundColor: theme.colors.secondary,
  },
  badgeText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  candidateGroup: {
    gap: theme.spacing.sm,
  },
  smallTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  candidateRow: {
    gap: theme.spacing.xs,
  },
  candidateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  candidateName: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  candidateScore: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.secondary,
  },
  metaGrid: {
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
  },
  comparisonGrid: {
    gap: theme.spacing.md,
  },
  comparisonPanel: {
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionRow: {
    gap: theme.spacing.sm,
  },
});
