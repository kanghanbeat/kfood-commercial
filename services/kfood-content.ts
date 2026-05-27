export type KFoodPost = {
  id: string;
  authorName: string;
  region: string;
  dishName: string;
  note: string;
  stampCount: number;
  pointCount: number;
};

export type KFoodRecommendation = {
  id: string;
  region: string;
  title: string;
  description: string;
  tags: string[];
};

export type TravelerStat = {
  label: string;
  value: string;
};

export const travelerStats: TravelerStat[] = [
  { label: 'Stamps', value: '12' },
  { label: 'Points', value: '2,480' },
  { label: 'Rank', value: 'Seoul 8%' },
];

export const featuredPosts: KFoodPost[] = [
  {
    id: 'post-bibimbap-jeonju',
    authorName: 'Mina',
    region: 'Jeonju',
    dishName: 'Bibimbap',
    note: 'Logged a classic market bowl with fresh namul and gochujang on the side.',
    stampCount: 3,
    pointCount: 180,
  },
  {
    id: 'post-milmyeon-busan',
    authorName: 'Joon',
    region: 'Busan',
    dishName: 'Milmyeon',
    note: 'Cold noodles after a coastal walk. Good candidate for a summer route.',
    stampCount: 2,
    pointCount: 120,
  },
];

export const regionalRecommendations: KFoodRecommendation[] = [
  {
    id: 'region-seoul-street-food',
    region: 'Seoul',
    title: 'Street Food Starter Route',
    description: 'Tteokbokki, hotteok, and market snacks for first-time K-Food travelers.',
    tags: ['market', 'snacks', 'beginner'],
  },
  {
    id: 'region-jeju-seafood',
    region: 'Jeju',
    title: 'Seafood and Black Pork Trail',
    description: 'A practical food route for travelers who want regional specialties.',
    tags: ['seafood', 'pork', 'island'],
  },
  {
    id: 'region-gangneung-cafe',
    region: 'Gangneung',
    title: 'Coffee and Coastal Bites',
    description: 'Pair local cafes with seafood stops near the beach district.',
    tags: ['coffee', 'coast', 'slow travel'],
  },
];
