export type RegionLevel = 'province' | 'city' | 'district';

export interface Region {
  id: string;
  nameKo: string;
  nameEn?: string;
  level: RegionLevel;
  parentRegionId?: string;
  imageUrl?: string;
  description: string;
  representativeFoodIds: string[];
  recommendedPlaceIds: string[];
  tags: string[];
}
