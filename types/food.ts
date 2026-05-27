export type FoodCategory =
  | 'traditional'
  | 'street'
  | 'seafood'
  | 'dessert'
  | 'cafe'
  | 'local_specialty'
  | 'seasonal';

export interface Food {
  id: string;
  nameKo: string;
  nameEn?: string;
  category: FoodCategory;
  regionIds: string[];
  description: string;
  imageUrl?: string;
  tags: string[];
  recommendedPlaceIds: string[];
}
