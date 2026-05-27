import { logger } from '@/lib/logger';

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

export type AppEnv = 'development' | 'preview' | 'production';

type PublicEnvValidation = {
  isValid: boolean;
  warnings: string[];
};

const allowedAppEnvs = new Set<AppEnv>(['development', 'preview', 'production']);
const rawEnv = typeof process !== 'undefined' ? process?.env : undefined;
const rawAppEnv = readPublicEnv('EXPO_PUBLIC_APP_ENV');

function readPublicEnv(name: string): string {
  return rawEnv?.[name]?.trim() ?? '';
}

function parseAppEnv(value: string): AppEnv {
  return allowedAppEnvs.has(value as AppEnv) ? (value as AppEnv) : 'development';
}

function parsePublicBoolean(value: string, fallback: boolean): boolean {
  if (value.toLowerCase() === 'true') {
    return true;
  }

  if (value.toLowerCase() === 'false') {
    return false;
  }

  return fallback;
}

export const appEnv = parseAppEnv(rawAppEnv);
export const supabaseUrl = readPublicEnv('EXPO_PUBLIC_SUPABASE_URL');
export const supabaseAnonKey = readPublicEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
export const siteUrl = readPublicEnv('EXPO_PUBLIC_SITE_URL') || 'http://localhost:8081';
export const adminRouteEnabled = parsePublicBoolean(readPublicEnv('EXPO_PUBLIC_ADMIN_ROUTE_ENABLED'), false);
export const useMockAI = parsePublicBoolean(readPublicEnv('EXPO_PUBLIC_USE_MOCK_AI'), true);

export function validatePublicEnv(): PublicEnvValidation {
  const warnings: string[] = [];

  if (rawAppEnv && !allowedAppEnvs.has(rawAppEnv as AppEnv)) {
    warnings.push('EXPO_PUBLIC_APP_ENV must be development, preview, or production.');
  }

  if (!supabaseUrl) {
    warnings.push('EXPO_PUBLIC_SUPABASE_URL is missing. Supabase-backed services will use mock fallbacks.');
  }

  if (!supabaseAnonKey) {
    warnings.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing. Supabase-backed services will use mock fallbacks.');
  }

  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    warnings.push('EXPO_PUBLIC_SUPABASE_URL should use HTTPS for preview and production.');
  }

  if (appEnv === 'production' && siteUrl.includes('localhost')) {
    warnings.push('EXPO_PUBLIC_SITE_URL should not point to localhost in production.');
  }

  if (warnings.length > 0) {
    const context = { appEnv, warningCount: warnings.length, warnings };

    if (appEnv === 'production') {
      logger.warn('[env] Public environment validation warning.', context);
    } else {
      logger.warn('[env] Public environment validation warning.', context);
    }
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
