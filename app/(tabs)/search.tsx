import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Search is now available from Home and Map.</Text>
        <Text style={styles.subtitle}>
          Use the search bars at the top of those screens to find K-Food routes, regions, places, and recommendations.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.md,
    padding: theme.layout.screenPadding,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.subtitle,
    fontWeight: '700',
    lineHeight: 28,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
});
