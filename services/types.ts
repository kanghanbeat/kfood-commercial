export type ServiceMode = 'mock' | 'supabase-ready';

export type ServiceResult<T> = {
  data: T;
  error: string | null;
  mode: ServiceMode;
};

export type AuthUser = {
  id: string;
  displayName: string;
  email: string;
  role: 'traveler' | 'seller' | 'admin';
};

export type FoodPost = {
  id: string;
  authorId: string;
  authorName: string;
  region: string;
  dishName: string;
  note: string;
  stampCount: number;
  pointCount: number;
  createdAt: string;
};

export type FoodRecommendation = {
  id: string;
  region: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
};

export type StampProgress = {
  userId: string;
  region: string;
  collectedCount: number;
  requiredCount: number;
};

export type RankingEntry = {
  rank: number;
  userId: string;
  displayName: string;
  region: string;
  pointCount: number;
};

export type MarketplaceItem = {
  id: string;
  sellerId: string;
  title: string;
  region: string;
  priceLabel: string;
  status: 'draft' | 'active' | 'sold_out';
};

export type SellerOnboardingStatus = {
  sellerId: string;
  businessName: string;
  status: 'not_started' | 'pending_review' | 'approved' | 'rejected';
  requiredSteps: string[];
};

export type AdminDashboardSummary = {
  pendingSellerCount: number;
  reportedPostCount: number;
  activeMarketplaceItemCount: number;
};

