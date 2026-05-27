import { isSupabaseConfigured, supabase, type SupabaseAuthUser } from '@/lib/supabase';
import { mockCurrentUser } from '@/services/mockData';
import { createServiceResult } from '@/services/serviceHelpers';
import type { AuthUser, ServiceResult } from '@/services/types';

type SupabaseProfileRow = {
  id: string;
  display_name: string | null;
  role: 'user' | 'reviewer' | 'moderator' | 'admin';
};

function warnAndFallback(message: string, error?: string | null): void {
  console.warn(`[Supabase Auth] ${message}${error ? ` ${error}` : ''}`);
}

function mapRole(role?: SupabaseProfileRow['role']): AuthUser['role'] {
  return role === 'admin' ? 'admin' : 'traveler';
}

function mapAuthUser(user: SupabaseAuthUser, profile?: SupabaseProfileRow): AuthUser {
  const metadataDisplayName = user.user_metadata?.display_name;
  const displayName =
    profile?.display_name ??
    (typeof metadataDisplayName === 'string' ? metadataDisplayName : undefined) ??
    user.email?.split('@')[0] ??
    'K-Food Traveler';

  return {
    id: user.id,
    displayName,
    email: user.email ?? '',
    role: mapRole(profile?.role),
  };
}

async function fetchProfile(userId: string): Promise<SupabaseProfileRow | null> {
  const { data, error } = await supabase.from<SupabaseProfileRow>('profiles').select('id,display_name,role', {
    params: {
      id: `eq.${userId}`,
    },
    limit: 1,
  });

  if (error) {
    warnAndFallback('Profile lookup failed.', error.message);
    return null;
  }

  return data?.[0] ?? null;
}

export async function getCurrentUser(): Promise<ServiceResult<AuthUser | null>> {
  if (!isSupabaseConfigured) {
    warnAndFallback('Missing environment variables. Returning mock current user.');
    return createServiceResult(mockCurrentUser);
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    warnAndFallback('Current user request failed. Returning mock current user.', error.message);
    return createServiceResult(mockCurrentUser, error.message);
  }

  if (!data?.user) {
    return createServiceResult(null, null, 'supabase-ready');
  }

  const profile = await fetchProfile(data.user.id);
  return createServiceResult(mapAuthUser(data.user, profile ?? undefined), null, 'supabase-ready');
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string,
): Promise<ServiceResult<AuthUser | null>> {
  if (!isSupabaseConfigured) {
    warnAndFallback('Missing environment variables. Returning mock signup user.');
    return createServiceResult({
      ...mockCurrentUser,
      email,
      displayName: displayName ?? mockCurrentUser.displayName,
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error || !data?.user) {
    warnAndFallback('Signup failed. Returning mock-compatible user.', error?.message);
    return createServiceResult({
      ...mockCurrentUser,
      email,
      displayName: displayName ?? mockCurrentUser.displayName,
    }, error?.message ?? 'Signup did not return a user.');
  }

  const profile = await fetchProfile(data.user.id);
  return createServiceResult(mapAuthUser(data.user, profile ?? undefined), null, 'supabase-ready');
}

export async function signIn(
  email: string,
  password: string,
): Promise<ServiceResult<AuthUser | null>> {
  if (!isSupabaseConfigured) {
    warnAndFallback('Missing environment variables. Returning mock login user.');
    return createServiceResult({
      ...mockCurrentUser,
      email,
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    warnAndFallback('Login failed. Returning mock-compatible user.', error?.message);
    return createServiceResult({
      ...mockCurrentUser,
      email,
    }, error?.message ?? 'Login did not return a user.');
  }

  const profile = await fetchProfile(data.user.id);
  return createServiceResult(mapAuthUser(data.user, profile ?? undefined), null, 'supabase-ready');
}

export async function login(
  email: string,
  password: string,
): Promise<ServiceResult<AuthUser | null>> {
  return signIn(email, password);
}

export async function signOut(): Promise<ServiceResult<{ signedOut: boolean }>> {
  if (!isSupabaseConfigured) {
    warnAndFallback('Missing environment variables. Returning mock signout result.');
    return createServiceResult({ signedOut: true });
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    warnAndFallback('Signout failed. Returning safe signout result.', error.message);
    return createServiceResult({ signedOut: true }, error.message);
  }

  return createServiceResult({ signedOut: true }, null, 'supabase-ready');
}
