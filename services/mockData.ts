import type {
  AdminDashboardSummary,
  AuthUser,
  FoodPost,
  FoodRecommendation,
  MarketplaceItem,
  RankingEntry,
  SellerOnboardingStatus,
  StampProgress,
} from '@/services/types';

export const mockCurrentUser: AuthUser = {
  id: 'user-demo-traveler',
  displayName: 'Demo Traveler',
  email: 'traveler@example.com',
  role: 'traveler',
};

export const mockPosts: FoodPost[] = [
  {
    id: 'post-bibimbap-jeonju',
    authorId: 'user-mina',
    authorName: 'Mina',
    region: 'Jeonju',
    dishName: 'Bibimbap',
    note: 'Logged a classic market bowl with fresh namul and gochujang on the side.',
    stampCount: 3,
    pointCount: 180,
    createdAt: '2026-05-01T09:00:00.000Z',
  },
  {
    id: 'post-milmyeon-busan',
    authorId: 'user-joon',
    authorName: 'Joon',
    region: 'Busan',
    dishName: 'Milmyeon',
    note: 'Cold noodles after a coastal walk. Good candidate for a summer route.',
    stampCount: 2,
    pointCount: 120,
    createdAt: '2026-05-02T11:30:00.000Z',
  },
];

export const mockFoods: FoodRecommendation[] = [
  {
    id: 'food-seoul-tteokbokki',
    region: 'Seoul',
    name: 'Tteokbokki',
    category: 'Street food',
    description: 'Spicy rice cakes for a first market route.',
    tags: ['market', 'snacks', 'beginner'],
  },
  {
    id: 'food-jeonju-bibimbap',
    region: 'Jeonju',
    name: 'Bibimbap',
    category: 'Local classic',
    description: 'Rice bowl with seasonal vegetables and gochujang.',
    tags: ['classic', 'rice', 'regional'],
  },
];

export const mockStampProgress: StampProgress[] = [
  {
    userId: 'user-demo-traveler',
    region: 'Seoul',
    collectedCount: 4,
    requiredCount: 8,
  },
  {
    userId: 'user-demo-traveler',
    region: 'Jeonju',
    collectedCount: 3,
    requiredCount: 6,
  },
];

export const mockRankings: RankingEntry[] = [
  {
    rank: 1,
    userId: 'user-mina',
    displayName: 'Mina',
    region: 'Jeonju',
    pointCount: 4280,
  },
  {
    rank: 2,
    userId: 'user-demo-traveler',
    displayName: 'Demo Traveler',
    region: 'Seoul',
    pointCount: 2480,
  },
];

export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'market-seoul-snack-pass',
    sellerId: 'seller-market-01',
    title: 'Seoul Market Snack Pass',
    region: 'Seoul',
    priceLabel: 'KRW 18,000',
    status: 'active',
  },
  {
    id: 'market-jeju-seafood-tour',
    sellerId: 'seller-jeju-01',
    title: 'Jeju Seafood Tasting Tour',
    region: 'Jeju',
    priceLabel: 'KRW 65,000',
    status: 'draft',
  },
];

export const mockSellerOnboardingStatus: SellerOnboardingStatus = {
  sellerId: 'seller-demo',
  businessName: 'Demo K-Food Partner',
  status: 'pending_review',
  requiredSteps: ['business_profile', 'contact_verification', 'menu_or_product_review'],
};

export const mockAdminDashboardSummary: AdminDashboardSummary = {
  pendingSellerCount: 1,
  reportedPostCount: 0,
  activeMarketplaceItemCount: 1,
};

