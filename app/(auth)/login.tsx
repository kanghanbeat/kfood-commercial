import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';
import { mockLogin } from '@/lib/mockAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('user@kfood.test');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleLogin() {
    const result = mockLogin(email, password);

    if (!result.success || !result.user) {
      setMessage(result.error ?? 'Login failed.');
      return;
    }

    if (result.user.role === 'admin') {
      setMessage('Please use the Admin Portal.');
      return;
    }

    setMessage('');
    router.replace('/(tabs)');
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>K-Food Travel SNS</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your food-centered travel journey.</Text>
      </View>

      <AppCard>
        <AppInput
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="user@kfood.test"
          value={email}
        />
        <AppInput
          label="Password"
          onChangeText={setPassword}
          placeholder="Enter any non-empty password"
          secureTextEntry
          value={password}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <AppButton title="Log In" onPress={handleLogin} />
        <AppButton title="Create Mock Account" variant="outline" onPress={() => router.push('./signup')} />
        <AppButton title="Admin Portal" variant="ghost" onPress={() => router.push('../admin-login')} />
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
  message: {
    color: theme.colors.error,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
});
