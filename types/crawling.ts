export type CrawledSourceType =
  | 'regional_food'
  | 'restaurant'
  | 'travel_destination'
  | 'food_description';

export type CrawledReviewStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected';

export type LinkedEntityType =
  | 'food'
  | 'place'
  | 'region';

export type CrawledItem = {
  id: string;
  title: string;
  titleKo: string;
  titleEn: string;
  sourceType: CrawledSourceType;
  linkedEntityType: LinkedEntityType;
  region: string;
  summary: string;
  sourceName: string;
  confidenceScore: number;
  tags: string[];
  candidateSlug: string;
  status: CrawledReviewStatus;
  collectedAt: string;
  adminNote?: string;
};
