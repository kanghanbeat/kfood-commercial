declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

type LogContext = Record<string, unknown>;

const secretKeyPattern = /(authorization|password|access[_-]?token|refresh[_-]?token|api[_-]?key|secret|service[_-]?role|jwt)/i;
const bearerPattern = /bearer\s+[a-z0-9._~+/=-]+/gi;
const skPattern = /\bsk-[a-z0-9_-]{8,}/gi;
const sbPattern = /\bsb-[a-z0-9_-]{8,}/gi;
const jwtPattern = /\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g;

function isProduction(): boolean {
  return process?.env?.EXPO_PUBLIC_APP_ENV === 'production';
}

function scrubString(value: string): string {
  return value
    .replace(bearerPattern, 'Bearer [redacted]')
    .replace(skPattern, '[redacted-openai-key]')
    .replace(sbPattern, '[redacted-supabase-key]')
    .replace(jwtPattern, '[redacted-jwt]');
}

export function sanitizeLogValue(value: unknown, seen = new WeakSet<object>()): unknown {
  if (typeof value === 'string') {
    return scrubString(value);
  }

  if (typeof value !== 'object' || value === null) {
    return value;
  }

  if (seen.has(value)) {
    return '[circular]';
  }

  seen.add(value);

  if (value instanceof Error) {
    return {
      name: value.name,
      message: scrubString(value.message),
      stack: isProduction() ? undefined : scrubString(value.stack ?? ''),
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLogValue(item, seen));
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((sanitized, [key, item]) => {
    sanitized[key] = secretKeyPattern.test(key) ? '[redacted]' : sanitizeLogValue(item, seen);
    return sanitized;
  }, {});
}

function writeLog(level: 'info' | 'warn' | 'error', message: string, errorOrContext?: unknown, context?: LogContext): void {
  if (level === 'info' && isProduction()) {
    return;
  }

  const payload = context
    ? { error: sanitizeLogValue(errorOrContext), context: sanitizeLogValue(context) }
    : sanitizeLogValue(errorOrContext);

  if (level === 'error') {
    console.error(message, payload ?? '');
    return;
  }

  if (level === 'warn') {
    console.warn(message, payload ?? '');
    return;
  }

  console.info(message, payload ?? '');
}

export const logger = {
  info(message: string, context?: LogContext): void {
    writeLog('info', message, context);
  },
  warn(message: string, context?: LogContext): void {
    writeLog('warn', message, context);
  },
  error(message: string, error?: unknown, context?: LogContext): void {
    writeLog('error', message, error, context);
  },
};
