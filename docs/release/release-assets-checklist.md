# Release Assets Checklist

This checklist tracks the non-code image assets that must be verified before App Store and Google Play submission. Do not treat placeholder or starter Expo artwork as final commercial assets.

## App Icon

- Required purpose: primary store and device launcher icon.
- Current path: `assets/images/icon.png`.
- Recommended source size: 1024 x 1024 PNG, no transparency for iOS.
- Must be readable at small sizes and must not include screenshots, pricing, badges, or platform logos.
- Replace any Expo starter artwork with the final K-Food Travel brand icon before submission.

## Splash Image

- Required purpose: native launch screen.
- Current path: `assets/images/splash-icon.png`.
- Current config: `expo-splash-screen` plugin with `resizeMode: contain`, width `200`, light background `#ffffff`, dark background `#000000`.
- Verify the splash mark has enough contrast in both light and dark launch backgrounds.
- Avoid text-heavy splash images because localization and scaling can become unreliable.

## Android Adaptive Icon

- Foreground image: `assets/images/android-icon-foreground.png`.
- Background image: `assets/images/android-icon-background.png`.
- Monochrome image: `assets/images/android-icon-monochrome.png`.
- Background color: `#E6F4FE`.
- Verify the foreground artwork remains inside the Android adaptive icon safe zone.
- Confirm the monochrome icon works for themed icons on supported Android launchers.

## Store Listing Images

- Prepare iPhone screenshots for all required App Store device sizes.
- Prepare iPad screenshots if tablet support remains enabled.
- Prepare Android phone screenshots for Google Play.
- Include screens for feed, K-Food exploration, post creation/upload, profile, and legal/safety access.
- Do not include personal data, real user private content, or unlicensed restaurant imagery.

## Manual Replacement Checklist

- Confirm every image path in `app.json` exists.
- Replace starter Expo/react images before final submission if they are still present.
- Confirm icon, splash, and adaptive icons render correctly in preview builds.
- Confirm screenshots match the production app name: K-Food Travel.
- Keep original editable design files in a separate design source folder outside the runtime bundle if needed.

Missing or placeholder image assets must be replaced before final store submission.
