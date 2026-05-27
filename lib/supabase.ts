import { supabaseAnonKey, supabaseUrl, validatePublicEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

type JsonPrimitive = string | number | boolean | null;
export type Json = JsonPrimitive | Json[] | { [key: string]: Json };

type RequestBody = Record<string, unknown> | Record<string, unknown>[];

type SupabaseError = {
  message: string;
  status?: number;
};

type SupabaseResponse<T> = {
  data: T | null;
  error: SupabaseError | null;
};

type SupabaseSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: SupabaseAuthUser;
};

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, Json | undefined>;
};

type SignUpInput = {
  email: string;
  password: string;
  options?: {
    data?: Record<string, Json | undefined>;
  };
};

type SignInWithPasswordInput = {
  email: string;
  password: string;
};

type SignInWithPasswordResponse = SupabaseSession & {
  user: SupabaseAuthUser;
};

type SelectOptions = {
  params?: Record<string, string>;
  order?: string;
  limit?: number;
};

type MutationOptions = {
  params?: Record<string, string>;
};

type RpcParams = Record<string, Json | undefined>;

const allowedUploadMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxUploadBytes = 8 * 1024 * 1024;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let authSession: SupabaseSession | null = null;
validatePublicEnv();

function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, supabaseUrl);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

function getAuthHeader(): string {
  return authSession?.access_token ? `Bearer ${authSession.access_token}` : `Bearer ${supabaseAnonKey}`;
}

async function request<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: RequestBody;
    params?: Record<string, string>;
    prefer?: string;
    useUserToken?: boolean;
  } = {},
): Promise<SupabaseResponse<T>> {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.' },
    };
  }

  try {
    const response = await fetch(buildUrl(path, options.params), {
      method: options.method ?? 'GET',
      headers: {
        apikey: supabaseAnonKey,
        authorization: options.useUserToken === false ? `Bearer ${supabaseAnonKey}` : getAuthHeader(),
        'content-type': 'application/json',
        ...(options.prefer ? { Prefer: options.prefer } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    const parsed = text ? (JSON.parse(text) as unknown) : null;

    if (!response.ok) {
      const message =
        typeof parsed === 'object' && parsed !== null && 'message' in parsed && typeof parsed.message === 'string'
          ? parsed.message
          : `Supabase request failed with status ${response.status}.`;

      return {
        data: null,
        error: {
          message,
          status: response.status,
        },
      };
    }

    return {
      data: parsed as T,
      error: null,
    };
  } catch (error) {
    logger.error('[supabase] Request failed.', error, { path });
    const message = error instanceof Error ? error.message : 'Unknown Supabase request error.';
    return {
      data: null,
      error: { message },
    };
  }
}

function mergeSelectOptions(options?: SelectOptions): Record<string, string> {
  return {
    ...(options?.params ?? {}),
    ...(options?.order ? { order: options.order } : {}),
    ...(typeof options?.limit === 'number' ? { limit: String(options.limit) } : {}),
  };
}

export const supabase = {
  auth: {
    async signUp(input: SignUpInput): Promise<SupabaseResponse<{ user: SupabaseAuthUser | null; session: SupabaseSession | null }>> {
      const response = await request<{ user: SupabaseAuthUser | null; session: SupabaseSession | null }>('/auth/v1/signup', {
        method: 'POST',
        body: {
          email: input.email,
          password: input.password,
          data: input.options?.data,
        },
        useUserToken: false,
      });

      authSession = response.data?.session ?? null;
      return response;
    },

    async signInWithPassword(
      input: SignInWithPasswordInput,
    ): Promise<SupabaseResponse<{ user: SupabaseAuthUser; session: SupabaseSession }>> {
      const response = await request<SignInWithPasswordResponse>('/auth/v1/token', {
        method: 'POST',
        params: { grant_type: 'password' },
        body: {
          email: input.email,
          password: input.password,
        },
        useUserToken: false,
      });

      const session: SupabaseSession | null = response.data
        ? {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type,
            user: response.data.user,
          }
        : null;
      authSession = session;

      return {
        data: response.data && session
          ? {
              user: response.data.user,
              session,
            }
          : null,
        error: response.error,
      };
    },

    async getUser(): Promise<SupabaseResponse<{ user: SupabaseAuthUser | null }>> {
      if (!authSession?.access_token) {
        return { data: { user: null }, error: null };
      }

      return request<{ user: SupabaseAuthUser | null }>('/auth/v1/user');
    },

    async signOut(): Promise<SupabaseResponse<{ signedOut: boolean }>> {
      const response = await request<Record<string, never>>('/auth/v1/logout', {
        method: 'POST',
      });

      authSession = null;

      return {
        data: { signedOut: !response.error },
        error: response.error,
      };
    },
  },

  from<T extends object>(table: string) {
    return {
      select(select = '*', options?: SelectOptions): Promise<SupabaseResponse<T[]>> {
        return request<T[]>(`/rest/v1/${table}`, {
          params: {
            select,
            ...mergeSelectOptions(options),
          },
        });
      },

      insert<TInsert extends object = Partial<T>>(
        payload: TInsert | TInsert[],
        options?: MutationOptions,
      ): Promise<SupabaseResponse<T[]>> {
        return request<T[]>(`/rest/v1/${table}`, {
          method: 'POST',
          body: (Array.isArray(payload) ? payload : [payload]) as RequestBody,
          params: options?.params,
          prefer: 'return=representation',
        });
      },

      update(payload: Partial<T>, options?: MutationOptions): Promise<SupabaseResponse<T[]>> {
        return request<T[]>(`/rest/v1/${table}`, {
          method: 'PATCH',
          body: payload as Record<string, Json | undefined>,
          params: options?.params,
          prefer: 'return=representation',
        });
      },

      delete(options?: MutationOptions): Promise<SupabaseResponse<T[]>> {
        return request<T[]>(`/rest/v1/${table}`, {
          method: 'DELETE',
          params: options?.params,
          prefer: 'return=representation',
        });
      },
    };
  },

  rpc<T>(functionName: string, params?: RpcParams): Promise<SupabaseResponse<T>> {
    return request<T>(`/rest/v1/rpc/${functionName}`, {
      method: 'POST',
      body: params ?? {},
    });
  },

  storage: {
    from(bucket: string) {
      return {
        async upload(path: string, file: Blob, contentType?: string): Promise<SupabaseResponse<{ path: string }>> {
          if (!isSupabaseConfigured) {
            return {
              data: null,
              error: { message: 'Supabase is not configured. Storage upload skipped.' },
            };
          }

          const resolvedContentType = contentType ?? file.type;

          if (!allowedUploadMimeTypes.has(resolvedContentType)) {
            return {
              data: null,
              error: { message: 'Only JPEG, PNG, and WebP image uploads are allowed.' },
            };
          }

          if (file.size <= 0 || file.size > maxUploadBytes) {
            return {
              data: null,
              error: { message: `Image uploads must be between 1 byte and ${maxUploadBytes} bytes.` },
            };
          }

          if (path.includes('..') || path.startsWith('/') || path.endsWith('/')) {
            return {
              data: null,
              error: { message: 'Invalid storage path.' },
            };
          }

          try {
            const response = await fetch(buildUrl(`/storage/v1/object/${bucket}/${path}`), {
              method: 'POST',
              headers: {
                apikey: supabaseAnonKey,
                authorization: getAuthHeader(),
                'content-type': resolvedContentType,
                'x-upsert': 'false',
              },
              body: file,
            });

            if (!response.ok) {
              return {
                data: null,
                error: {
                  message: `Supabase storage upload failed with status ${response.status}.`,
                  status: response.status,
                },
              };
            }

            return {
              data: { path },
              error: null,
            };
          } catch (error) {
            logger.error('[supabase] Storage upload failed.', error, { bucket, path });
            return {
              data: null,
              error: { message: error instanceof Error ? error.message : 'Unknown Supabase storage upload error.' },
            };
          }
        },

        getPublicUrl(path: string): { data: { publicUrl: string } } {
          const publicUrl = isSupabaseConfigured ? buildUrl(`/storage/v1/object/public/${bucket}/${path}`) : '';
          return { data: { publicUrl } };
        },
      };
    },
  },
};

// This browser-safe client only uses the public Supabase anon key.
// Privileged operations belong in Supabase Edge Functions or other trusted server runtimes.

export function isSupabaseEnabled(): boolean {
  return isSupabaseConfigured;
}
