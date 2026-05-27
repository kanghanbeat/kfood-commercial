import { Stack } from 'expo-router';

import { theme } from '@/constants/theme';

export default function LegalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="terms" options={{ title: 'Terms of Service' }} />
      <Stack.Screen name="ugc" options={{ title: 'UGC Policy' }} />
      <Stack.Screen name="ai" options={{ title: 'AI Analysis Notice' }} />
      <Stack.Screen name="maps" options={{ title: 'Maps Link Notice' }} />
    </Stack>
  );
}
