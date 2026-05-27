import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { RankingUser } from '@/types/ranking';

type PodiumItemProps = {
  user: RankingUser;
  height: number;
  highlight?: boolean;
};

export function PodiumItem({ user, height, highlight = false }: PodiumItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>{user.avatarEmoji}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {user.displayName}
      </Text>
      <Text style={styles.points}>{user.points.toLocaleString()} pts</Text>
      <View style={[styles.block, { height }, highlight && styles.highlightBlock]}>
        <Text style={[styles.rank, highlight && styles.highlightRank]}>#{user.rank}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 92,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  avatar: {
    fontSize: 30,
  },
  name: {
    maxWidth: 96,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  points: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  block: {
    width: '100%',
    borderTopLeftRadius: theme.radius.input,
    borderTopRightRadius: theme.radius.input,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightBlock: {
    backgroundColor: theme.colors.primary,
  },
  rank: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  highlightRank: {
    color: theme.colors.accent,
  },
});
