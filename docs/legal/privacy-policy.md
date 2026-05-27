# Privacy Policy

Effective date: [Effective Date]

This Privacy Policy explains how [Company Name] operates K-Food Travel and handles personal information for the K-Food travel diary, recommendation, community, gamification, marketplace, and admin features.

This document is a release-readiness draft and should be reviewed by qualified legal counsel before public launch.

## Service Overview

K-Food Travel helps users discover Korean food experiences, create food and travel posts, upload photos, receive food-related recommendations, and participate in points, stamps, rankings, and community features.

## Data We May Collect

- Account data: email address, authentication identifiers, login status, and account role.
- Profile data: display name, avatar/profile image, preferences, region interests, points, stamps, badges, and ranking information.
- Uploaded content: food and travel photos, post text, selected regions, food labels, restaurant/place references, and related metadata.
- Community interactions: posts, comments, likes, bookmarks, saves, shares, reports, blocks, and moderation outcomes.
- Reports and moderation logs: report reasons, report details, target content identifiers, reviewer actions, resolution notes, and audit timestamps.
- Device and app usage data where applicable: app environment, feature usage, error logs, performance events, and abuse-prevention signals.

## AI Photo Analysis

K-Food Travel may provide AI-assisted food photo analysis. Uploaded images or image URLs may be sent to a server-side AI analysis endpoint for food labeling, ingredient hints, or quality review. AI analysis is for reference only and may be inaccurate.

The Expo client must not call AI providers directly with private API keys. AI provider credentials, including `OPENAI_API_KEY`, must be stored only in protected server-side environments such as Supabase Edge Function secrets or other trusted backend systems.

## Supabase Usage

K-Food Travel uses Supabase for authentication, database records, storage, role-based access, and security policies. The client app should use only the Supabase anon key with Row Level Security enabled. Supabase service-role keys must never be shipped in the client app.

## Google Maps And External Links

The app may open Google Maps or a browser for place lookup, routes, opening hours, and related business information. External map data is controlled by third-party services and may be inaccurate or change without notice.

At the current release-readiness stage, the app opens external Google Maps links and does not require direct location permission. If future versions collect precise location, this policy and native permission notices must be updated before release.

## Data Retention And Deletion

We retain account, profile, post, photo, report, moderation, and usage records for as long as needed to operate the service, comply with law, resolve disputes, prevent abuse, and enforce policies. Specific retention periods should be defined as [Data Retention Period].

Users may request account deletion, content deletion, or privacy support by contacting [Contact Email]. Some records may be retained where required for legal, security, fraud-prevention, or moderation reasons.

## User Rights

Depending on the user's location, users may have rights to access, correct, delete, restrict, or object to certain processing of their personal information. Users may contact [Contact Email] to exercise available rights.

## Security

We use access controls, Supabase Row Level Security, protected server-side secrets, and operational safeguards to reduce unauthorized access. No system can be guaranteed completely secure.

## Children

K-Food Travel is not intended for children where parental consent is legally required. If we learn that a child has provided personal information without required consent, we will take appropriate action.

## Contact

Privacy contact: [Contact Email]

Company: [Company Name]  
Business registration number: [Business Registration Number]
