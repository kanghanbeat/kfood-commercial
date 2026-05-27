import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ReasonBadge } from '@/components/recommendation/ReasonBadge';
import { theme } from '@/constants/theme';
import type { ScoredRecommendation } from '@/types/recommendation';

type RecommendedCardProps = {
  item: ScoredRecommendation;
  onHide?: (item: ScoredRecommendation) => void;
  onNotInterested?: (item: ScoredRecommendation) => void;
};

function formatTag(tag: string): string {
  return tag
    .split('_')
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

export function RecommendedCard({ item, onHide, onNotInterested }: RecommendedCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{item.imageEmoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.region}>{item.regionName}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.tagRow}>
        {item.foodTags.map((tag) => (
          <View key={tag} style={styles.foodTag}>
            <Text style={styles.foodTagText}>{formatTag(tag)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.reasonRow}>
        {item.reasons.map((reason) => (
          <ReasonBadge key={`${item.id}-${reason.type}`} reason={reason} />
        ))}
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.scoreText}>Rule score {item.score.totalScore}</Text>
        <View style={styles.actionRow}>
          {onHide ? (
            <Pressable accessibilityRole="button" onPress={() => onHide(item)} style={styles.actionButton}>
              <Text style={styles.actionText}>Hide</Text>
            </Pressable>
          ) : null}
          {onNotInterested ? (
            <Pressable accessibilityRole="button" onPress={() => onNotInterested(item)} style={styles.actionButton}>
              <Text style={styles.actionText}>Not Interested</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 260,
    maxWidth: theme.layout.maxContentWidth,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadow,
  },
  header: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 36,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  region: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  foodTag: {
    borderRadius: 999,
    backgroundColor: '#FFF4ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  foodTagText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  reasonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  scoreText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  footerRow: {
    gap: theme.spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  actionButton: {
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
});
