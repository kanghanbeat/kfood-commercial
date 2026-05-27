import { LegalDocumentScreen } from '@/components/legal/LegalDocumentScreen';

export default function UgcPolicyScreen() {
  return (
    <LegalDocumentScreen
      eyebrow="Safety"
      title="UGC Policy"
      sections={[
        {
          heading: 'Allowed content',
          body: [
            'Users may share food and travel photos, personal food diaries, restaurant experiences, regional K-Food discoveries, comments, recommendations, and profile content when they have the right to share it.',
          ],
        },
        {
          heading: 'Prohibited content',
          body: [
            'Do not upload illegal content, hateful content, explicit sexual content, violent or harmful content, harassment, defamation, privacy-invading content, copyrighted content without permission, or unauthorized photos of other people.',
            'Users are responsible for ensuring uploaded photos do not violate privacy, publicity rights, copyright, trademark, restaurant rules, platform rules, or applicable law.',
          ],
        },
        {
          heading: 'Reports, blocks, and review',
          body: [
            'Users should be able to report posts, images, comments, profiles, or other content with a reason and optional details.',
            'Blocking should persist using backend records when Supabase is available. Client-side filtering can be a fallback, but it is not enough as the long-term moderation mechanism.',
            'Moderators or admins should review reports, update moderation status, record resolution notes, and take proportionate action.',
          ],
        },
        {
          heading: 'Content actions',
          body: [
            'K-Food Travel may limit visibility, hide content during review, remove content, disable interactions, or restrict accounts when content violates policy or creates legal, safety, privacy, or operational risk.',
            'Repeated or severe violations may result in warnings, temporary restrictions, suspension, or termination. Contact: [Contact Email].',
          ],
        },
      ]}
    />
  );
}
