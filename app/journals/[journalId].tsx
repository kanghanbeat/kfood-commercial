import { Image } from 'expo-image';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SeoHead } from '@/components/seo/SeoHead';
import { foodTagLabels, mockJournals, travelPurposeLabels } from '@/constants/mockData';
import { theme } from '@/constants/theme';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function regionHref(regionId: string): Href {
  return `/regions/region-${regionId}` as Href;
}

function searchHref(query: string): Href {
  return `/search?query=${encodeURIComponent(query)}` as Href;
}

export default function JournalDetailScreen() {
  const { journalId } = useLocalSearchParams<{ journalId: string }>();
  const [reportNotice, setReportNotice] = useState('');
  const journal = mockJournals.find((item) => item.id === journalId);

  if (!journal) {
    return (
      <ScreenContainer>
        <SeoHead
          title="Journal not found | K-Food Travel"
          description="This K-Food Travel journal is not available. Continue exploring Korean food routes and traveler notes."
          path={`/journals/${journalId ?? ''}`}
          noIndex
        />
        <AppCard style={styles.card}>
          <Text style={styles.title}>Journal not found</Text>
          <Text style={styles.subtitle}>This travel note is not available in the curated journal collection.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/' as Href)}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </Pressable>
        </AppCard>
      </ScreenContainer>
    );
  }

  const image = journal.images[0];
  const foodLabels = journal.foodTags.map((tag) => foodTagLabels[tag]);
  const purposeLabels = journal.travelPurposeTags.map((tag) => travelPurposeLabels[tag]);

  return (
    <ScreenContainer>
      <SeoHead
        title={`${journal.title} | K-Food Travel Journal`}
        description={journal.content}
        path={`/journals/${journal.id}`}
        imageUrl={image?.uri}
        type="article"
      />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Traveler Journal</Text>
        <Text style={styles.title}>{journal.title}</Text>
        <Text style={styles.subtitle}>
          {journal.regionName}
          {journal.locationName ? ` · ${journal.locationName}` : ''} · {formatDate(journal.createdAt)}
        </Text>
      </View>

      {image ? (
        <Image
          accessibilityLabel={image.alt}
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{ uri: image.uri }}
          style={styles.heroImage}
          transition={160}
        />
      ) : null}

      <AppCard style={styles.card}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{journal.author.displayName.slice(0, 1)}</Text>
          </View>
          <View style={styles.authorText}>
            <Text style={styles.authorName}>{journal.author.displayName}</Text>
            <Text style={styles.authorMeta}>Lv.{journal.author.level} food traveler</Text>
          </View>
        </View>

        <Text style={styles.body}>{journal.content}</Text>

        <View style={styles.tagRow}>
          {[...foodLabels, ...purposeLabels].map((label) => (
            <Text key={label} style={styles.tag}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.stat}>Likes {journal.likeCount}</Text>
          <Text style={styles.stat}>Saves {journal.saveCount}</Text>
          <Text style={styles.stat}>Comments {journal.commentCount}</Text>
          <Text style={styles.stat}>Views {journal.viewCount}</Text>
        </View>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Continue planning</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(regionHref(journal.regionId))}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>Open {journal.regionName} guide</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(searchHref(journal.regionName))}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <Text style={styles.secondaryButtonText}>Find similar journals</Text>
        </Pressable>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Safety</Text>
        <Text style={styles.helperText}>
          Report this journal if it appears to include copyright-infringing images, private information, spam, hate,
          violence, adult content, or unsafe claims.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            setReportNotice('Report request prepared. A reason form and review queue will be connected before public submissions are accepted.')
          }
          style={({ pressed }) => [styles.reportButton, pressed && styles.pressed]}>
          <Text style={styles.reportButtonText}>Report this journal</Text>
        </Pressable>
        {reportNotice ? (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{reportNotice}</Text>
          </View>
        ) : null}
      </AppCard>
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
    lineHeight: 34,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    aspectRatio: 16 / 10,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.border,
  },
  card: {
    padding: theme.spacing.lg,
  },
  authorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF4ED',
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
  body: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    lineHeight: 25,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#FFF4ED',
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
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
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  helperText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  reportButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  reportButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  noticeBox: {
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  noticeText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.86,
  },
});
