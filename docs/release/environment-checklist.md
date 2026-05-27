# Environment Variable Safety Checklist

## Public Expo Variables

These values may be present in `.env.example` because they are intended for the client bundle:

- `EXPO_PUBLIC_APP_ENV=`
- `EXPO_PUBLIC_SUPABASE_URL=`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY=`
- `EXPO_PUBLIC_GOOGLE_MAPS_BASE_URL=`
- `EXPO_PUBLIC_SITE_URL=`
- `EXPO_PUBLIC_ADMIN_ROUTE_ENABLED=`
- `EXPO_PUBLIC_USE_MOCK_AI=`

## Server-Side Only Variables

Never place these in Expo public environment variables, client code, screenshots, commits, or store review notes:

- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Production database passwords
- Private signing credentials
- CI deploy tokens such as `SENTRY_AUTH_TOKEN`

## Supabase Requirements

- The client app must use the Supabase anon key only.
- Row Level Security must be enabled and tested for user, reviewer, moderator, and admin roles.
- Service-role operations must run only from trusted backend code, Supabase Edge Functions, or protected CI/server runtime.
- Production and preview Supabase projects should be separated when possible.

## AI Analysis Boundary

- `OPENAI_API_KEY` must be configured only on the server-side analysis endpoint.
- The Expo app should call a backend or Supabase Edge Function, not OpenAI directly.
- Logs must not include raw image payloads, private URLs, API keys, or service-role credentials.

## Release Review

- Confirm `.env`, `.env.local`, and production secret files are ignored by git.
- Confirm `.env.example` contains placeholders only.
- Confirm EAS environment values are placeholders or managed through EAS secrets.
- Confirm no secret values appear in `app.json`, `eas.json`, docs, or source files.
