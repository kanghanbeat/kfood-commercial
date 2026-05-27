export type FoodCategory =
  | 'street_food'
  | 'traditional_food'
  | 'dessert'
  | 'drink'
  | 'seafood'
  | 'meat'
  | 'noodle'
  | 'rice'
  | 'soup'
  | 'unknown';

export type FoodLabelRouteStatus = 'auto_approved_candidate' | 'needs_admin_review' | 'rejected_candidate';

export type FoodLabelReviewStatus = 'pending' | 'approved' | 'edited' | 'rejected';

export interface CandidateLabel {
  name: string;
  confidence: number;
}

export interface FoodLabelEditableFields {
  selectedFoodName?: string;
  selectedIngredients?: string[];
  selectedRegionName?: string;
  category?: FoodCategory;
  tags?: string[];
}

export interface FoodLabelAnalysisResult {
  id: string;
  imageId: string;

  foodNameCandidates: CandidateLabel[];
  ingredientCandidates: CandidateLabel[];
  regionCandidates: CandidateLabel[];

  selectedFoodName?: string;
  selectedIngredients?: string[];
  selectedRegionName?: string;

  category: FoodCategory;
  tags: string[];

  confidenceScore: number;
  routeStatus: FoodLabelRouteStatus;
  reviewStatus: FoodLabelReviewStatus;

  modelProvider: 'mock' | 'openai_vision_future';
  modelVersion: string;

  createdAt: string;
  updatedAt: string;
}

export type GoldDatasetStatus = 'candidate' | 'verified' | 'archived';

export interface GoldFoodDatasetItem {
  id: string;

  sourceImageId: string;
  sourceFoodLabelId: string;
  approvedByReviewerId?: string;

  foodName: string;
  normalizedFoodName: string;

  ingredients: string[];
  regionName?: string;

  category: FoodCategory;
  tags: string[];

  confidenceScore: number;
  isHumanVerified: boolean;

  linkedJournalId?: string;
  linkedPlaceId?: string;
  linkedUserId?: string;

  status: GoldDatasetStatus;

  createdAt: string;
  updatedAt: string;
}
