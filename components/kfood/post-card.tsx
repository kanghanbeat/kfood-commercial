import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { KFoodColors } from '@/constants/theme';
import type { KFoodPost } from '@/services/kfood-content';

type PostCardProps = {
  post: KFoodPost;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.avatar}>
          <ThemedText type="defaultSemiBold" style={styles.avatarText}>
            {post.authorName.slice(0, 1)}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.headerText}>
          <ThemedText type="defaultSemiBold">{post.authorName}</ThemedText>
          <ThemedText style={styles.region}>{post.region}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.body}>
        <ThemedText type="subtitle">{post.dishName}</ThemedText>
        <ThemedText style={styles.note}>{post.note}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.meta}>{post.stampCount} stamps</ThemedText>
        <ThemedText style={styles.meta}>{post.pointCount} pts</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KFoodColors.border,
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: KFoodColors.rice,
    borderWidth: 1,
    borderColor: KFoodColors.border,
  },
  avatarText: {
    color: KFoodColors.kimchi,
  },
  headerText: {
    flex: 1,
  },
  region: {
    color: KFoodColors.stone,
    fontSize: 13,
    lineHeight: 18,
  },
  body: {
    gap: 6,
  },
  note: {
    color: KFoodColors.stone,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  meta: {
    color: KFoodColors.leaf,
    fontSize: 13,
    lineHeight: 18,
  },
});
