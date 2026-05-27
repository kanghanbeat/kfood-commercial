export type PlaceCategory =
  | 'restaurant'
  | 'cafe'
  | 'market'
  | 'tourist_spot'
  | 'museum'
  | 'landmark'
  | 'other';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  googlePlaceId?: string;
  name: string;
  category: PlaceCategory;
  regionId: string;
  relatedFoodIds: string[];
  address: string;
  location?: LatLng;
  rating?: number;
  userRatingCount?: number;
  googleMapsUrl?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  imageUrl?: string;
  tags: string[];
  recommendationTags: string[];
}
