import type { FoodTag, Journal, MockImageOption, RegionOption, TravelPurpose } from '@/types/journal';

export const foodTagLabels: Record<FoodTag, string> = {
  korean_bbq: 'K-BBQ',
  street_food: 'Street food',
  seafood: 'Seafood',
  dessert: 'Dessert',
  traditional: 'Traditional',
  spicy: 'Spicy',
  seasonal: 'Seasonal',
  local_specialty: 'Local specialty',
};

export const travelPurposeLabels: Record<TravelPurpose, string> = {
  food_tour: 'Food tour',
  date: 'Date',
  family_trip: 'Family trip',
  solo_trip: 'Solo trip',
  healing: 'Healing',
  local_experience: 'Local experience',
  hidden_gem: 'Hidden gem',
};

export const regionOptions: RegionOption[] = [
  { id: 'seoul', name: 'Seoul', cityName: 'Jongno-gu' },
  { id: 'busan', name: 'Busan', cityName: 'Haeundae-gu' },
  { id: 'jeonju', name: 'Jeonju', cityName: 'Wansan-gu' },
  { id: 'jeju', name: 'Jeju', cityName: 'Jeju-si' },
];

export const mockImageOptions: MockImageOption[] = [
  {
    id: 'image-market-tteokbokki',
    uri: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=1200&q=80',
    alt: 'Street market plate of spicy rice cakes',
  },
  {
    id: 'image-bibimbap',
    uri: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Colorful bibimbap bowl with vegetables',
  },
  {
    id: 'image-seafood',
    uri: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=80',
    alt: 'Seafood meal on a local table',
  },
];

export const mockJournals: Journal[] = [
  {
    id: 'journal-seoul-market-night',
    title: 'Gwangjang Market night snack route',
    content:
      'Started with hot tteokbokki, then shared mung bean pancakes near the main alley. The route works well for first-time visitors because every stop is close and easy to compare.',
    images: [mockImageOptions[0]],
    author: {
      id: 'user-mina',
      displayName: 'Mina',
      level: 7,
    },
    regionId: 'seoul',
    regionName: 'Seoul',
    cityId: 'jongno',
    cityName: 'Jongno-gu',
    locationName: 'Gwangjang Market',
    foodTags: ['street_food', 'spicy', 'local_specialty'],
    travelPurposeTags: ['food_tour', 'local_experience'],
    likeCount: 128,
    saveCount: 42,
    commentCount: 16,
    viewCount: 1680,
    pointReward: 80,
    earnedBadgeLabel: 'Market Scout',
    scores: {
      recommendation: 94,
      popularity: 88,
      freshness: 91,
    },
    createdAt: '2026-05-12T18:30:00.000Z',
  },
  {
    id: 'journal-jeonju-bibimbap-walk',
    title: 'Jeonju bibimbap and hanok village walk',
    content:
      'A calm lunch route with a classic bibimbap bowl, seasonal namul, and tea afterward. Good for families because the walking path stays flat and has plenty of rest stops.',
    images: [mockImageOptions[1]],
    author: {
      id: 'user-joon',
      displayName: 'Joon',
      level: 5,
    },
    regionId: 'jeonju',
    regionName: 'Jeonju',
    cityId: 'wansan',
    cityName: 'Wansan-gu',
    locationName: 'Jeonju Hanok Village',
    foodTags: ['traditional', 'seasonal', 'local_specialty'],
    travelPurposeTags: ['family_trip', 'healing'],
    likeCount: 96,
    saveCount: 58,
    commentCount: 11,
    viewCount: 1120,
    pointReward: 70,
    earnedBadgeLabel: 'Regional Classic',
    scores: {
      recommendation: 90,
      popularity: 76,
      freshness: 84,
    },
    createdAt: '2026-05-10T04:20:00.000Z',
  },
  {
    id: 'journal-jeju-seafood-hidden',
    title: 'Jeju seafood table near the harbor',
    content:
      'Found a small seafood restaurant after the coastal trail. The grilled fish set is simple, fresh, and better for slow travel than a packed landmark schedule.',
    images: [mockImageOptions[2]],
    author: {
      id: 'user-sora',
      displayName: 'Sora',
      level: 9,
    },
    regionId: 'jeju',
    regionName: 'Jeju',
    cityId: 'jeju-si',
    cityName: 'Jeju-si',
    locationName: 'Dongmun area',
    foodTags: ['seafood', 'seasonal', 'local_specialty'],
    travelPurposeTags: ['solo_trip', 'hidden_gem'],
    likeCount: 211,
    saveCount: 84,
    commentCount: 28,
    viewCount: 2460,
    pointReward: 95,
    scores: {
      recommendation: 87,
      popularity: 96,
      freshness: 79,
    },
    createdAt: '2026-05-08T10:45:00.000Z',
  },
];
