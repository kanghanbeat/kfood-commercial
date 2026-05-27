# Web Deployment Checklist

## Expo Web Pre-Deployment

- Confirm `app.json` has `web.output` configured for static export.
- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npx expo export -p web`.
- Inspect the generated `dist/` output locally before publishing.
- Configure SPA rewrites on the hosting provider so deep links route to `index.html`.

Official Expo docs list `npx expo export -p web` for publishing websites and `npx expo export --platform web` for web export workflows.

## EAS Environment Strategy

Use separate EAS environments:

- `development`: local development public values.
- `preview`: staging Supabase project and preview site URL.
- `production`: production Supabase project and production site URL.

Useful commands:

```bash
eas env:create
eas env:list
eas env:pull --environment development
eas env:pull --environment preview
eas env:pull --environment production
eas env:update
```

Visibility guidance:

- Use plaintext for non-sensitive public values such as `EXPO_PUBLIC_SITE_URL`.
- Use sensitive or secret for CI/server-only values where needed.
- Any `EXPO_PUBLIC_` value is still public if bundled into Expo client code, even if stored as an EAS secret.
- Never store `OPENAI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` as `EXPO_PUBLIC_` variables.

## Supabase Production Checklist

- Use a separate production Supabase project.
- Apply migrations in order.
- Confirm RLS is enabled on all exposed tables.
- Review policies for public, authenticated, admin, reviewer, and moderator paths.
- Confirm storage bucket policies restrict writes by user path and content type.
- Configure Auth redirect URLs for local, preview, and production sites.
- Verify backup and restore process before launch.
- Confirm service-role key is used only in trusted server contexts.

## OpenAI Key Handling

- Store `OPENAI_API_KEY` only in Supabase Edge Function secrets or protected server runtime settings.
- Call OpenAI only from `supabase/functions/analyze-food-image`.
- Keep `EXPO_PUBLIC_USE_MOCK_AI=true` until production controls are complete.
- Add auth checks, rate limits, MIME validation, file size validation, abuse prevention, monitoring, and cost caps before enabling real calls.

## Admin Route Checklist

- Set `EXPO_PUBLIC_ADMIN_ROUTE_ENABLED=false` by default.
- Show admin navigation only to authorized roles when route access is enabled.
- Keep Supabase RLS and RPC checks as the final authorization boundary.
- Document every admin role assignment.

## Final Pre-Launch Checklist

- No real secrets in git.
- `.env.example` contains placeholders only.
- `npx expo export -p web` succeeds.
- Production Supabase URL and anon key point to the production project.
- Auth redirect URLs are correct.
- RLS audit queries reviewed.
- Edge Function secrets configured server-side only.
- Rollback plan documented for hosting and database migrations.

References:

- Expo web deployment: https://docs.expo.dev/deploy/web/
- Expo publishing websites: https://docs.expo.dev/guides/publishing-websites/
- EAS environment variables: https://docs.expo.dev/eas/environment-variables/
