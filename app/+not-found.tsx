import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SeoHead } from '@/components/seo/SeoHead';
import { theme } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <SeoHead
        title="Page not found | K-Food Travel"
        description="The K-Food Travel page you requested could not be found. Return home or search curated Korean food routes."
        path="/404"
        noIndex
      />
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>404</Text>
          <Text style={styles.title}>페이지를 찾을 수 없습니다</Text>
          <Text style={styles.subtitle}>
            요청한 주소가 변경되었거나 삭제되었을 수 있습니다. 홈으로 돌아가거나 K-Food 여행 경로를 다시 검색해 주세요.
          </Text>
        </View>
        <AppButton title="홈으로 이동" onPress={() => router.replace('/' as Href)} />
        <AppButton title="검색 열기" variant="outline" onPress={() => router.push('/search' as Href)} />
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    padding: theme.spacing.lg,
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
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
});
