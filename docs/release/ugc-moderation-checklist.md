# UGC Moderation Release Checklist

Reported content will be reviewed as soon as reasonably possible, and clearly illegal, harmful, or policy-violating content may be restricted or removed promptly.

## Review-Readiness Matrix

| Area | Current Readiness | Release Requirement |
| --- | --- | --- |
| Report post button | Needs product/UI verification | Users can report posts with a reason and optional details. |
| Report user button | Needs product/UI verification | Users can report profiles or abusive behavior. |
| Block user button | Backend table exists as `user_blocks`; UI flow needs verification | Blocking persists through backend records when Supabase is available. |
| Hide reported content option | Post status support exists; UX needs verification | Moderators can hide or restrict content during review. |
| Admin review queue | Admin/review screens exist for label review; content report queue needs verification | Moderators can view open reports, update status, and record resolution notes. |
| Public contact email | Placeholder needed | Publish `[Contact Email]` in policies and store metadata. |
| Reviewer test account | Needed | Provide App Store/Google Play credentials with reviewer-safe test content. |
| Abuse handling process | Draft policy exists | Define internal owner, escalation path, and evidence retention. |

## Moderation Status Values

Use these content lifecycle values consistently in product, backend, and support tooling:

- `published`
- `pending_review`
- `hidden_by_moderator`
- `deleted_by_user`
- `removed_for_policy_violation`

The current Supabase schema also includes earlier post values such as `draft`, `published`, `hidden`, and `deleted`. Align the database enum, app labels, and admin filters before production enforcement.

## Evidence and Logging Needs

- Store report target type, target id, reporter id, reason, details, status, reviewer id, timestamps, and resolution note.
- Keep moderation logs access-restricted to reviewer, moderator, and admin roles.
- Avoid storing unnecessary sensitive personal data in report details.
- Sanitize logs so image URLs, auth tokens, and private storage paths are not exposed.

## Supabase Table Readiness

- `reports` or current `content_reports`: required for user reports.
- `blocked_users` or current `user_blocks`: required for persistent blocking.
- `moderation_actions`: recommended for durable admin audit history.
- `post_status` or `content_status`: required to hide, remove, or restore content safely.

User blocking should be persistent using backend records when Supabase is available. Client-side filtering can be used as a fallback, but it is not sufficient as the only long-term moderation mechanism.

## Manual QA

- Report a post as a normal user.
- Report a user/profile as a normal user.
- Block and unblock a user, then restart the app and confirm persistence.
- Confirm blocked users are filtered from feeds, comments, recommendations, and profile access where applicable.
- Confirm moderators can review open reports.
- Confirm action history is visible to admins and hidden from normal users.
