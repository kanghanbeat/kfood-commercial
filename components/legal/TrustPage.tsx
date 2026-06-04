import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PublicTrustFooter } from '@/components/legal/PublicTrustFooter';
import { theme } from '@/constants/theme';

export type TrustSection = {
  heading: string;
  body: string[];
};

type TrustPageProps = {
  eyebrow: string;
  title: string;
  updatedAt?: string;
  sections: TrustSection[];
};

export function TrustPage({ eyebrow, title, updatedAt = '2026.06.04', sections }: TrustPageProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.meta}>최종 업데이트: {updatedAt}</Text>
          </View>

          {sections.map((section) => (
            <View key={section.heading} style={styles.section}>
              <Text style={styles.heading}>{section.heading}</Text>
              {section.body.map((paragraph) => (
                <Text key={paragraph} style={styles.body}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}

          <PublicTrustFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
    gap: theme.spacing.xl,
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
    lineHeight: 34,
  },
  meta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
  section: {
    gap: theme.spacing.sm,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    ...theme.shadow,
  },
  heading: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  body: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 25,
  },
});
