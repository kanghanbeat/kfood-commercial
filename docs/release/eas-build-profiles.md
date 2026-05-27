# EAS Build Profiles

This project is configured for release-readiness checks only. Do not run cloud builds or submit to stores until business, legal, asset, and QA review is complete.

## Profiles

- `development`: development client enabled, internal distribution.
- `preview`: internal distribution for tester devices. iOS is configured for real devices, and Android outputs an APK for easier internal installation.
- `production`: store distribution with automatic version incrementing. Android builds an app bundle, and iOS is not simulator-only.

## Local Verification Commands

Run these before requesting cloud builds:

```sh
npm run lint
npx expo-doctor
npx expo start --web
npx expo start
```

## Cloud Build Commands

Release operators may run these manually when ready:

```sh
eas build --platform ios --profile preview
eas build --platform android --profile preview
eas build --platform ios --profile production
eas build --platform android --profile production
```

Do not run EAS Submit unless store metadata, reviewer account, privacy URLs, content moderation flows, and production backend configuration are ready.
