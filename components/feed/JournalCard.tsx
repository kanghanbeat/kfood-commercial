import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { PointBadge } from '@/components/feed/PointBadge';
import { TagGroup } from '@/components/feed/TagGroup';
import { foodTagLabels, travelPurposeLabels } from '@/constants/mockData';
import { theme } from '@/constants/theme';
import type { Journal } from '@/types/journal';

type JournalCardProps = {
  journal: Journal;
  onPress?: () => void;
};

export function JournalCard({ journal, onPress }: JournalCardProps) {
  const image = journal.images[0];
  const foodLabels = journal.foodTags.map((tag) => foodTagLabels[tag]);
  const purposeLabels = journal.travelPurposeTags.map((tag) => travelPurposeLabels[tag]);
  const content = (
    <>
      <View style={styles.authorRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{journal.author.displayName.slice(0, 1)}</Text>
        </View>
        <View style={styles.authorText}>
          <Text style={styles.authorName}>{journal.author.displayName}</Text>
          <Text style={styles.authorMeta}>Lv.{journal.author.level} food traveler</Text>
        </View>
        <PointBadge points={journal.pointReward} label={journal.earnedBadgeLabel} />
      </View>

      {image ? (
        <Image
          accessibilityLabel={image.alt}
          cachePolicy="memory-disk"
          contentFit="cover"
          placeholder={{ blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I' }}
          source={{ uri: image.uri }}
          style={styles.image}
          transition={160}
        />
      ) : null}

      <View style={styles.body}>
        <Text style={styles.location}>
          {journal.regionName}
          {journal.cityName ? ` · ${journal.cityName}` : ''}
          {journal.locationName ? ` · ${journal.locationName}` : ''}
        </Text>
        <Text style={styles.title}>{journal.title}</Text>
        <Text style={styles.content}>{journal.content}</Text>
      </View>

      <TagGroup labels={foodLabels} />
      <TagGroup labels={purposeLabels} tone="purpose" />

      <View style={styles.statsRow}>
        <Text style={styles.stat}>Likes {journal.likeCount}</Text>
        <Text style={styles.stat}>Saves {journal.saveCount}</Text>
        <Text style={styles.stat}>Comments {journal.commentCount}</Text>
        <Text style={styles.stat}>Views {journal.viewCount}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={`Open journal: ${journal.title}`}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}>
        <AppCard style={styles.card}>{content}</AppCard>
      </Pressable>
    );
  }

  return (
    <AppCard style={styles.card}>
      {content}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  authorText: {
    flex: 1,
    minWidth: 0,
  },
  authorName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  authorMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.border,
  },
  body: {
    gap: theme.spacing.sm,
  },
  location: {
    color: theme.colors.secondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  content: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  stat: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.9,
  },
});
