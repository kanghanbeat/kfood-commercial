import type { ServiceMode, ServiceResult } from '@/services/types';
import type { Json } from '@/lib/supabase';

export function createServiceResult<T>(
  data: T,
  error: string | null = null,
  mode: ServiceMode = 'mock',
): ServiceResult<T> {
  return {
    data,
    error,
    mode,
  };
}

export function createBackendServiceError(scope: string, message?: string | null): Error {
  return new Error(`${scope}: ${message ?? 'Backend request failed.'}`);
}

export function logBackendFallback(scope: string, message?: string | null): void {
  console.warn(`[${scope}] Using mock fallback. ${message ?? 'Backend request failed.'}`);
}

export function sanitizeJsonRecord(metadata?: Record<string, Json | undefined>): Record<string, Json> {
  return Object.entries(metadata ?? {}).reduce<Record<string, Json>>((sanitized, [key, value]) => {
    if (value !== undefined) {
      sanitized[key] = value;
    }

    return sanitized;
  }, {});
}
