import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';

const dashboardStats = [
  { label: 'Total Users', value: '1,248' },
  { label: 'Total Posts', value: '3,702' },
  { label: 'Pending AI Verification Count', value: '18' },
  { label: 'Food Regions', value: '42' },
];

export default function AdminDashboardScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Admin</Text>
        <Text style={styles.title}>K-Food Admin Dashboard</Text>
        <Text style={styles.subtitle}>This is a Phase 1 mock admin dashboard. Real data and Supabase role checks will be added later.</Text>
      </View>

      <View style={styles.grid}>
        {dashboardStats.map((stat) => (
          <AppCard key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </AppCard>
        ))}
      </View>

      <AppCard style={styles.navigationCard}>
        <Text style={styles.cardTitle}>AI Label Operations</Text>
        <Text style={styles.cardText}>Review mock AI food labels and inspect the in-memory review audit trail.</Text>
        <AppButton
          onPress={() => router.push('/admin/food-labels' as Href)}
          title="Open Food Label Review"
        />
        <AppButton
          onPress={() => router.push('/admin/review-logs' as Href)}
          title="Open Review Logs"
          variant="outline"
        />
      </AppCard>

      <AppCard style={styles.navigationCard}>
        <Text style={styles.cardTitle}>Data Pipeline</Text>
        <Text style={styles.cardText}>Preview mock crawled K-Food, region, and travel destination candidates for admin review.</Text>
        <AppButton
          onPress={() => router.push('/admin/data-crawling' as Href)}
          title="Data Crawling"
          variant="secondary"
        />
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
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  grid: {
    gap: theme.spacing.md,
  },
  statCard: {
    gap: theme.spacing.xs,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.title,
    fontWeight: '700',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
  },
  navigationCard: {
    gap: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
  },
  cardText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
});
