import { LegalDocumentScreen } from '@/components/legal/LegalDocumentScreen';

export default function AiAnalysisNoticeScreen() {
  return (
    <LegalDocumentScreen
      eyebrow="Safety"
      title="AI Analysis Notice"
      sections={[
        {
          heading: 'Reference only',
          body: [
            'K-Food Travel may offer AI-assisted food photo analysis to help identify possible foods, ingredients, categories, or review signals.',
            'AI results may be inaccurate, incomplete, outdated, or inappropriate and should be verified independently.',
          ],
        },
        {
          heading: 'Not professional advice',
          body: [
            'AI analysis does not provide medical, allergy, nutrition, legal, safety, or professional advice. Users with allergies, dietary restrictions, health conditions, or safety concerns should consult reliable sources or qualified professionals.',
          ],
        },
        {
          heading: 'Image handling',
          body: [
            'Images or image URLs may be sent to a server-side AI analysis endpoint. Users should not upload sensitive images, private documents, payment information, medical information, or photos of other people without permission.',
            'OpenAI or other AI provider API keys must remain server-side only and must not be included in Expo public environment variables or client-side source code.',
          ],
        },
        {
          heading: 'Reports and improvements',
          body: [
            'Users can report inaccurate or inappropriate AI results through [Contact Email] or available in-app reporting tools. AI analysis may be adjusted, improved, limited, or removed over time.',
          ],
        },
      ]}
    />
  );
}
