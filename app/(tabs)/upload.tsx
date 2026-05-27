import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';
import { analyzeFoodImageMock } from '@/services/foodVisionService';
import type { FoodImage, FoodImageUploadStatus } from '@/types/foodImage';
import type { CandidateLabel, FoodLabelAnalysisResult, FoodLabelRouteStatus } from '@/types/foodLabel';

const mockFoodImage: FoodImage = {
  id: 'mock-upload-image-001',
  localUri: 'mock-local-food-image-001',
  fileName: 'mock-kfood-photo.jpg',
  uploadedByUserId: 'user-demo-traveler',
  uploadedAt: '2026-05-14T09:00:00.000Z',
  uploadStatus: 'uploaded',
};

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

function getRouteStatusLabel(status: FoodLabelRouteStatus): string {
  if (status === 'auto_approved_candidate') {
    return 'Auto Approved Candidate';
  }

  if (status === 'needs_admin_review') {
    return 'Needs Admin Review';
  }

  return 'Rejected Candidate';
}

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: formatProgressWidth(value) }]} />
    </View>
  );
}

function CandidateRows({ title, candidates }: { title: string; candidates: CandidateLabel[] }) {
  return (
    <View style={styles.candidateGroup}>
      <Text style={styles.sectionTitle}>{title}</Text>
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

export default function UploadScreen() {
  const [status, setStatus] = useState<FoodImageUploadStatus>('idle');
  const [result, setResult] = useState<FoodLabelAnalysisResult | null>(null);

  async function handleAnalyze() {
    setStatus('analyzing');
    try {
      const analysisResult = await analyzeFoodImageMock(mockFoodImage.localUri);
      setResult(analysisResult);
      setStatus('analyzed');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Mock Vision Workflow</Text>
        <Text style={styles.title}>Upload K-Food Photo</Text>
        <Text style={styles.subtitle}>
          Preview how mock AI labeling will work before real Vision API integration.
        </Text>
      </View>

      <AppCard style={styles.previewCard}>
        <View style={styles.mockImage}>
          <Text style={styles.mockImageText}>K-Food Photo Preview</Text>
          <Text style={styles.mockImageMeta}>{mockFoodImage.fileName}</Text>
        </View>
        <Text style={styles.helperText}>This is mock AI analysis only. No external API is called in Phase 4.</Text>
        <AppButton
          disabled={status === 'analyzing'}
          onPress={handleAnalyze}
          title={status === 'analyzing' ? 'Analyzing...' : 'Analyze Mock Food Image'}
        />
      </AppCard>

      {status === 'failed' ? (
        <AppCard>
          <Text style={styles.errorText}>Mock analysis failed. Try again.</Text>
        </AppCard>
      ) : null}

      {result ? (
        <AppCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.sectionTitle}>Analysis Result</Text>
            <View
              style={[
                styles.statusBadge,
                result.routeStatus === 'auto_approved_candidate' && styles.autoBadge,
                result.routeStatus === 'needs_admin_review' && styles.reviewBadge,
                result.routeStatus === 'rejected_candidate' && styles.rejectedBadge,
              ]}>
              <Text style={styles.statusBadgeText}>{getRouteStatusLabel(result.routeStatus)}</Text>
            </View>
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{formatLabel(result.category)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Overall Confidence</Text>
              <Text style={styles.metaValue}>{formatPercent(result.confidenceScore)}</Text>
            </View>
          </View>

          <View style={styles.candidateGroup}>
            <Text style={styles.sectionTitle}>Overall Confidence</Text>
            <ProgressBar value={result.confidenceScore} />
          </View>

          <CandidateRows candidates={result.foodNameCandidates} title="Food name candidates" />
          <CandidateRows candidates={result.ingredientCandidates} title="Ingredient candidates" />
          <CandidateRows candidates={result.regionCandidates} title="Region candidates" />

          <View style={styles.tagRow}>
            {result.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </AppCard>
      ) : null}
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
  previewCard: {
    padding: theme.spacing.lg,
  },
  mockImage: {
    minHeight: 180,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF4ED',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  mockImageText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
    textAlign: 'center',
  },
  mockImageMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  helperText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 18,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  resultCard: {
    padding: theme.spacing.lg,
  },
  resultHeader: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  statusBadge: {
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
  statusBadgeText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metaItem: {
    flexGrow: 1,
    minWidth: 140,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  metaLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  metaValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  candidateGroup: {
    gap: theme.spacing.sm,
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  tagText: {
    color: theme.colors.success,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
});
