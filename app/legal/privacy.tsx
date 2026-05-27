import { LegalDocumentScreen } from '@/components/legal/LegalDocumentScreen';

export default function PrivacyPolicyScreen() {
  return (
    <LegalDocumentScreen
      eyebrow="Legal"
      title="Privacy Policy"
      sections={[
        {
          heading: 'Service overview',
          body: [
            'K-Food Travel helps users discover Korean food experiences, create food and travel posts, upload photos, receive recommendations, and participate in points, stamps, rankings, and community features.',
            'This screen is a practical release-readiness draft and should be reviewed by qualified legal counsel before public launch.',
          ],
        },
        {
          heading: 'Data we may collect',
          body: [
            'Account and profile data may include email, authentication identifiers, display name, avatar, preferences, region interests, points, stamps, badges, and ranking information.',
            'Community data may include uploaded food/travel photos, posts, comments, likes, bookmarks, reports, blocks, moderation logs, and usage or error events where applicable.',
          ],
        },
        {
          heading: 'AI, Supabase, and maps',
          body: [
            'Uploaded images or image URLs may be sent to a server-side AI analysis endpoint. AI results are for reference only and may be inaccurate.',
            'Supabase may be used for authentication, database records, storage, and role-based access. The client app must use only the Supabase anon key with Row Level Security enabled.',
            'The app may open Google Maps or a browser for external place information. At this stage, the app opens external map links and does not require direct native location permission.',
          ],
        },
        {
          heading: 'Retention, rights, and contact',
          body: [
            'Records are retained as needed to operate the service, comply with law, prevent abuse, and enforce policies. Specific retention periods should be defined as [Data Retention Period].',
            'Users may request privacy support, access, correction, or deletion by contacting [Contact Email]. Company: [Company Name]. Business registration number: [Business Registration Number].',
          ],
        },
      ]}
    />
  );
}
