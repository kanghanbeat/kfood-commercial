import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { SeoHead } from '@/components/seo/SeoHead';
import { adminRouteEnabled } from '@/lib/env';
import { checkAccess, getCurrentUser } from '@/lib/mockAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getCurrentUser as getSupabaseCurrentUser } from '@/services/authService';

export default function AdminLayout() {
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyAdminAccess() {
      if (!adminRouteEnabled) {
        if (isMounted) {
          setHasAdminAccess(false);
          setIsCheckingAccess(false);
        }

        router.replace('/(tabs)');
        return;
      }

      if (!isSupabaseConfigured) {
        const mockUser = getCurrentUser();
        const mockHasAccess = Boolean(mockUser && checkAccess('admin'));

        if (isMounted) {
          setHasAdminAccess(mockHasAccess);
          setIsCheckingAccess(false);
        }

        if (!mockHasAccess) {
          router.replace('../admin-login');
        }

        return;
      }

      const result = await getSupabaseCurrentUser();
      const supabaseHasAccess = result.mode === 'supabase-ready' && result.data?.role === 'admin';

      if (isMounted) {
        setHasAdminAccess(supabaseHasAccess);
        setIsCheckingAccess(false);
      }

      if (!supabaseHasAccess) {
        router.replace('../admin-login');
      }
    }

    verifyAdminAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isCheckingAccess || !hasAdminAccess) {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <SeoHead
          title="Restricted operations | K-Food Travel"
          description="Restricted K-Food Travel operations area."
          path="/admin"
          noIndex
        />
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <SeoHead
        title="Restricted operations | K-Food Travel"
        description="Restricted K-Food Travel operations area."
        path="/admin"
        noIndex
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
