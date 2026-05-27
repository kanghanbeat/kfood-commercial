export type FeedSortKey = 'latest' | 'recommended' | 'popular';

export type FoodTag =
  | 'korean_bbq'
  | 'street_food'
  | 'seafood'
  | 'dessert'
  | 'traditional'
  | 'spicy'
  | 'seasonal'
  | 'local_specialty';

export type TravelPurpose =
  | 'food_tour'
  | 'date'
  | 'family_trip'
  | 'solo_trip'
  | 'healing'
  | 'local_experience'
  | 'hidden_gem';

export interface JournalImage {
  id: string;
  uri: string;
  alt: string;
}

export interface JournalAuthor {
  id: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
}

export interface JournalScores {
  recommendation: number;
  popularity: number;
  freshness: number;
}

export interface Journal {
  id: string;
  title: string;
  content: string;
  images: JournalImage[];
  author: JournalAuthor;

  regionId: string;
  regionName: string;
  cityId?: string;
  cityName?: string;
  locationName?: string;

  foodTags: FoodTag[];
  travelPurposeTags: TravelPurpose[];

  likeCount: number;
  saveCount: number;
  commentCount: number;
  viewCount: number;

  pointReward: number;
  earnedBadgeLabel?: string;

  scores: JournalScores;

  createdAt: string;
  updatedAt?: string;
}

export interface RegionOption {
  id: string;
  name: string;
  cityName?: string;
}

export interface MockImageOption {
  id: string;
  uri: string;
  alt: string;
}
