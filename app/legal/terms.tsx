import { LegalDocumentScreen } from '@/components/legal/LegalDocumentScreen';

export default function TermsScreen() {
  return (
    <LegalDocumentScreen
      eyebrow="Legal"
      title="Terms of Service"
      sections={[
        {
          heading: 'Service purpose and accounts',
          body: [
            'K-Food Travel provides food-centered travel diary, recommendation, community, gamification, marketplace foundation, and admin review features.',
            'Users are responsible for account security, accurate information, lawful use, and not impersonating others.',
          ],
        },
        {
          heading: 'Uploaded content rights',
          body: [
            'Users keep ownership of uploaded photos, posts, comments, and profile content.',
            'By uploading content, users grant K-Food Travel a non-exclusive, worldwide, royalty-free license to host, store, reproduce, display, format, and distribute that content for operating, improving, promoting, and securing the service.',
          ],
        },
        {
          heading: 'Prohibited activity and moderation',
          body: [
            'Users must not upload illegal, hateful, explicit sexual, violent, harassing, defamatory, privacy-invading, fraudulent, spam, malware, or copyright-infringing content.',
            'Reported content will be reviewed as soon as reasonably possible, and clearly illegal, harmful, or policy-violating content may be restricted or removed promptly.',
          ],
        },
        {
          heading: 'Limitations',
          body: [
            'AI analysis is for reference only and does not provide medical, allergy, nutrition, legal, travel safety, or professional advice.',
            'External maps and links are controlled by third parties. The service may change or become unavailable. These terms are governed by [Governing Law]. Contact: [Contact Email].',
          ],
        },
      ]}
    />
  );
}
