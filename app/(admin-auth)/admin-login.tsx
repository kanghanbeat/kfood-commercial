import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SeoHead } from '@/components/seo/SeoHead';
import { theme } from '@/constants/theme';
import { adminRouteEnabled } from '@/lib/env';
import { mockLogin } from '@/lib/mockAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { login } from '@/services/authService';

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleAdminLogin() {
    if (!adminRouteEnabled) {
      setError('Admin route access is disabled for this environment.');
      return;
    }

    if (isSupabaseConfigured) {
      const result = await login(email, password);

      if (result.mode !== 'supabase-ready' || result.error || !result.data) {
        setError(result.error ?? 'Admin login failed.');
        return;
      }

      if (result.data.role !== 'admin') {
        setError('Admin access is required for this portal.');
        return;
      }

      setError('');
      router.replace('../admin');
      return;
    }

    const result = mockLogin(email, password);

    if (!result.success || !result.user) {
      setError(result.error ?? 'Admin login failed.');
      return;
    }

    if (result.user.role !== 'admin') {
      setError('Admin access is required for this portal.');
      return;
    }

    setError('');
    router.replace('../admin');
  }

  if (!adminRouteEnabled) {
    return (
      <ScreenContainer style={styles.container}>
        <SeoHead
          title="Operations access unavailable | K-Food Travel"
          description="K-Food Travel operations access is disabled in this environment."
          path="/admin-login"
          noIndex
        />
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Restricted</Text>
          <Text style={styles.title}>Operations access is unavailable</Text>
          <Text style={styles.subtitle}>
            The operations portal is disabled in this environment. Public K-Food Travel pages remain available.
          </Text>
        </View>

        <AppCard style={styles.card}>
          <AppButton title="Back to K-Food Travel" onPress={() => router.replace('/' as Href)} />
        </AppCard>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <SeoHead
        title="Operations sign in | K-Food Travel"
        description="Restricted K-Food Travel operations sign-in."
        path="/admin-login"
        noIndex
      />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Admin Portal</Text>
        <Text style={styles.title}>K-Food Operations</Text>
        <Text style={styles.subtitle}>Sign in with an authorized operations account.</Text>
      </View>

      <AppCard style={styles.card}>
        <AppInput
          keyboardType="email-address"
          label="Admin Email"
          onChangeText={setEmail}
          placeholder="admin@example.com"
          value={email}
        />
        <AppInput
          label="Password"
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AppButton title="Enter Admin Dashboard" onPress={handleAdminLogin} />
        <AppButton title="Back to User Login" variant="ghost" onPress={() => router.push('../login')} />
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    minHeight: '100%',
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
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  card: {
    borderColor: theme.colors.textPrimary,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
});
