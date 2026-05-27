# Mobile Release QA Checklist

## App Config

- App name is `K-Food Travel`.
- Slug is `k-food-travel`.
- Scheme is `kfoodtravel`.
- iOS bundle identifier is `com.kfoodtravel.app`.
- Android package is `com.kfoodtravel.app`.
- Version, iOS build number, and Android version code are set.

## EAS Profiles

- `development` uses development client and internal distribution.
- `preview` uses internal distribution, iOS real-device builds, and Android APK for testing.
- `production` uses store distribution, auto increment, iOS real-device builds, and Android app bundle.

## Permissions

- iOS camera purpose string is present.
- iOS photo library purpose string is present.
- No location permission is added while the app only opens external Google Maps links.
- Android permissions are not expanded unless a package or feature requires them.

## Assets

- App icon exists and is final artwork.
- Splash image exists and is final artwork.
- Android adaptive icon foreground, background, and monochrome assets exist.
- Store screenshots are prepared for required iOS and Android devices.

## Environment And Secrets

- `.env.example` contains placeholders only.
- Client uses Supabase anon key with RLS enabled.
- `OPENAI_API_KEY` is server-side only.
- `SUPABASE_SERVICE_ROLE_KEY` is server-side only.
- Production database passwords and signing credentials are not committed.

## Policy Documents

- Privacy policy is complete enough for store review.
- Terms of service are complete enough for store review.
- UGC policy explains allowed content, prohibited content, reporting, blocking, and moderation.
- AI analysis notice is available in app.
- Maps link notice is available in app.

## UGC And Moderation

- Report post flow works.
- Report user flow works.
- Block user flow persists through backend records.
- Admin review queue is tested.
- Report status and content status values are aligned.
- Public contact email is configured.

## Preview Builds

- iOS preview build installs on a real test device.
- Android preview APK installs on test devices.
- Login, feed, explore, upload, profile, admin-gated flows, and legal screens render without runtime errors.

## Production Builds

- iOS production build uses the production bundle identifier and store distribution.
- Android production build uses an app bundle.
- Version numbers are incremented.
- Production Supabase and backend AI endpoint configuration are verified.

## Store Review Account

- Provide reviewer login credentials.
- Seed reviewer-safe sample posts and images.
- Include notes explaining AI analysis is reference-only and maps open externally.
- Include contact email: `[Contact Email]`.

## Manual Smoke Tests

- Sign up.
- Log in.
- View feed.
- Create post.
- Upload image.
- Read AI analysis notice.
- Report post.
- Block user.
- Open every legal screen.
- Open Google Maps external link.
- Log out.

## Manual Commands

Run locally before requesting cloud builds:

```sh
npm run lint
npx expo-doctor
npx expo start --web
npx expo start
```

Cloud build commands for release operators only:

```sh
eas build --platform ios --profile preview
eas build --platform android --profile preview
eas build --platform ios --profile production
eas build --platform android --profile production
```
