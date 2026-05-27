# Monitoring Runbook

## MVP Scope

Use the lightweight `logger` utility for client-side informational, warning, and error logs. Production logging should be sparse and sanitized.

## Logger Usage Policy

- Use `logger.info` for local development diagnostics.
- Use `logger.warn` for recoverable configuration or service fallback issues.
- Use `logger.error` for failed requests, failed uploads, and unexpected runtime errors.
- Include route, feature, and safe identifiers where helpful.

## Do Not Log

- Authorization headers.
- Bearer tokens.
- Passwords.
- Access tokens or refresh tokens.
- API keys.
- Service-role keys.
- OpenAI keys.
- Full JWTs.
- Raw image payloads.

## Future Sentry Integration

- Add a client error boundary around the root app.
- Use Sentry for React Native and Expo Web once project DSN and source map upload are configured.
- Store `SENTRY_AUTH_TOKEN` only in CI or protected deployment settings.
- Upload source maps from CI, not from developer machines with personal credentials.

## Supabase Edge Function Logs

- Log request IDs, user IDs, route names, and sanitized status outcomes.
- Do not log request bodies containing images or secrets.
- Track rate-limit blocks, validation failures, model failures, and cost-control blocks.

## Production Incident Checklist

- Confirm whether the incident is client, hosting, Supabase, storage, or Edge Function related.
- Disable risky feature flags such as real AI analysis if needed.
- Review Supabase logs and hosting logs.
- Check recent deployments and migrations.
- Roll back hosting deployment if client behavior regressed.
- Pause admin workflows if moderation or role checks are affected.
- Document impact, timeline, remediation, and follow-up hardening tasks.
