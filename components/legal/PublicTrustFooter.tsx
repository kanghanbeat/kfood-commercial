import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { trustPageLinks } from '@/components/legal/trustPageData';

export function PublicTrustFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.title}>K-Food Travel</Text>
      <View style={styles.linkRow}>
        {trustPageLinks.map((link) => (
          <Pressable
            accessibilityRole="link"
            key={link.href}
            onPress={() => router.push(link.href as Href)}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
            <Text style={styles.linkText}>{link.title}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.notice}>정책 문서는 서비스 운영 기준을 설명하며, 개별 사안은 적용 법령과 실제 상황에 따라 처리됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  link: {
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  notice: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.86,
  },
});
