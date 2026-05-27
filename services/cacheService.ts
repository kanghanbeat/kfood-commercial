type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

export function getCachedValue<T>(key: string): T | null {
  const entry = memoryCache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setCachedValue<T>(key: string, value: T, ttlMs: number): T {
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });

  return value;
}

export function deleteCachedValue(keyPrefix: string): void {
  [...memoryCache.keys()].forEach((key) => {
    if (key.startsWith(keyPrefix)) {
      memoryCache.delete(key);
    }
  });
}
