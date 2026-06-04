import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleSignup() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage('Please complete all fields to create your traveler profile.');
      return;
    }

    setMessage('Profile details saved. Continue to login when you are ready.');
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Traveler Account</Text>
        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>Set up your traveler profile for journals, saved places, rankings, and route notes.</Text>
      </View>

      <AppCard>
        <AppInput label="Name" onChangeText={setName} placeholder="Your name" value={name} />
        <AppInput
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
        />
        <AppInput
          label="Password"
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
          value={password}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <AppButton title="Create Account" onPress={handleSignup} />
        <AppButton title="Back to Login" variant="ghost" onPress={() => router.push('./login')} />
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
    color: theme.colors.secondary,
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
    color: theme.colors.success,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
  },
});
