# Security Commercialization Readiness

Last reviewed: 2026-06-04

## Client Secret Boundary

- Expo client code must only read `EXPO_PUBLIC_*` values.
- `OPENAI_API_KEY` must remain in Supabase Edge Function secrets or another trusted server runtime.
- `SUPABASE_SERVICE_ROLE_KEY` must never be used by Expo Web, React Native screens, client services, or public environment variables.
- Current code path keeps OpenAI access in `supabase/functions/analyze-food-image`; the Expo app should call only a backend or Supabase Edge Function for AI analysis.

## Admin Route Assumptions

- Public navigation must not link to admin or admin login routes.
- `EXPO_PUBLIC_ADMIN_ROUTE_ENABLED=false` is the safe default for public deployments.
- `app/admin/_layout.tsx` blocks direct admin route rendering when admin routes are disabled, and checks admin role when Supabase is configured.
- `app/(admin-auth)/admin-login.tsx` must not expose demo credentials. It should show an unavailable notice unless admin routes are explicitly enabled.
- Client-side route guards are user-experience controls only. Supabase RLS and server-side role checks remain the authority for protected data.

## Supabase RLS Assumptions

The migration set includes RLS and helper policies for:

- Profiles: users can select and update their own profile; admins can manage profiles.
- Public catalog: regions, active foods, and places are publicly readable; admin manage policies exist.
- Posts: published posts are publicly readable; users can create and update their own posts; moderators/admins can moderate.
- Food image uploads: users insert/select their own uploads; reviewers can select and update review status.
- AI labels and review logs: reviewers can manage or inspect review data; users can view labels for their own uploads.
- Content reports and blocks: users can create reports and blocks; moderators/admins can review reports.
- Storage objects: authenticated users can upload, update, and delete files inside their own storage folder.

## Policies To Verify Before Production

- Apply all migrations in order on the production Supabase project and verify RLS is enabled on every public table.
- Confirm no policy allows anonymous mutation of posts, uploads, reports, profiles, rankings, or moderation data.
- Confirm role escalation is blocked in the live database, not only in client code.
- Confirm public storage is acceptable for the first launch. Prefer split buckets before production: public post images, private food analysis uploads, public avatars, private gold dataset assets.
- Add backend rate limiting for login, upload, report submission, AI analysis, and admin review actions.
- Connect report placeholders to durable `content_reports` records with reason, target type, target ID, reporter ID, status, timestamps, reviewer ID, and resolution note.
- Add moderator/admin report queue UI before accepting public UGC reports at scale.
- Verify static hosting redirects block or redirect `/admin`, `/admin-login`, `/api`, and `/debug` paths as configured in `public/_redirects`.
