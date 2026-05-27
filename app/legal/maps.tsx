import { LegalDocumentScreen } from '@/components/legal/LegalDocumentScreen';

export default function MapsLinkNoticeScreen() {
  return (
    <LegalDocumentScreen
      eyebrow="Notice"
      title="Maps Link Notice"
      sections={[
        {
          heading: 'External service',
          body: [
            'K-Food Travel may open Google Maps or an external browser when users view a restaurant, destination, route, or place-related action.',
            'Place names, addresses, routes, opening hours, ratings, reviews, business information, and map data may come from third-party services not controlled by K-Food Travel.',
          ],
        },
        {
          heading: 'Verify before visiting',
          body: [
            'Users should verify routes, opening hours, reservation requirements, accessibility, pricing, menus, safety conditions, and business status before visiting a place.',
          ],
        },
        {
          heading: 'Accuracy and location',
          body: [
            'K-Food Travel does not guarantee the accuracy, availability, or completeness of external map data. External services may collect data according to their own terms and privacy policies.',
            'At this stage, K-Food Travel opens external map links and does not collect direct precise location data through native location permission.',
          ],
        },
      ]}
    />
  );
}
