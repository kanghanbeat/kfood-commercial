import type { Food } from '@/types/food';
import type { Place } from '@/types/place';
import type { Region } from '@/types/region';

export const mockRegions: Region[] = [
  {
    id: 'region-seoul',
    nameKo: '서울',
    nameEn: 'Seoul',
    level: 'city',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7c8ed1fda1f9?auto=format&fit=crop&w=1200&q=80',
    description:
      'A fast-moving food capital where historic markets, street snacks, cafes, and classic Korean dishes sit close to major travel routes.',
    representativeFoodIds: ['food-tteokbokki', 'food-hotteok'],
    recommendedPlaceIds: ['place-gwangjang-market', 'place-myeongdong-street-food-alley'],
    tags: ['street food', 'markets', 'first trip'],
  },
  {
    id: 'region-busan',
    nameKo: '부산',
    nameEn: 'Busan',
    level: 'city',
    imageUrl: 'https://images.unsplash.com/photo-1593419522333-34473f3e477d?auto=format&fit=crop&w=1200&q=80',
    description:
      'A coastal city for seafood markets, warm noodle bowls, beach routes, and old-downtown snack alleys.',
    representativeFoodIds: ['food-milmyeon', 'food-gukbap'],
    recommendedPlaceIds: ['place-jagalchi-market', 'place-biff-square'],
    tags: ['seafood', 'coastal', 'local alleys'],
  },
  {
    id: 'region-jeonju',
    nameKo: '전주',
    nameEn: 'Jeonju',
    level: 'city',
    imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=80',
    description:
      'A slower heritage destination known for bibimbap, bean sprout soup, traditional streets, and market food.',
    representativeFoodIds: ['food-bibimbap', 'food-kongnamul-gukbap'],
    recommendedPlaceIds: ['place-jeonju-hanok-village', 'place-nambu-market'],
    tags: ['heritage', 'traditional', 'walkable'],
  },
];

export const mockFoods: Food[] = [
  {
    id: 'food-tteokbokki',
    nameKo: '떡볶이',
    nameEn: 'Tteokbokki',
    category: 'street',
    regionIds: ['region-seoul'],
    description: 'Chewy rice cakes in a spicy-sweet sauce, easy to find in markets and snack alleys.',
    imageUrl: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=1200&q=80',
    tags: ['spicy', 'snack', 'market'],
    recommendedPlaceIds: ['place-gwangjang-market', 'place-myeongdong-street-food-alley'],
  },
  {
    id: 'food-bibimbap',
    nameKo: '비빔밥',
    nameEn: 'Bibimbap',
    category: 'traditional',
    regionIds: ['region-jeonju'],
    description: 'A mixed rice bowl with seasoned vegetables, gochujang, and regional toppings.',
    imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1200&q=80',
    tags: ['rice', 'classic', 'balanced'],
    recommendedPlaceIds: ['place-jeonju-hanok-village', 'place-nambu-market'],
  },
  {
    id: 'food-hotteok',
    nameKo: '호떡',
    nameEn: 'Hotteok',
    category: 'dessert',
    regionIds: ['region-seoul', 'region-busan'],
    description: 'A sweet griddled pancake filled with brown sugar, seeds, and cinnamon.',
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80',
    tags: ['sweet', 'winter', 'street snack'],
    recommendedPlaceIds: ['place-myeongdong-street-food-alley', 'place-biff-square'],
  },
  {
    id: 'food-milmyeon',
    nameKo: '밀면',
    nameEn: 'Milmyeon',
    category: 'local_specialty',
    regionIds: ['region-busan'],
    description: 'Busan-style wheat noodles served cold with broth, garnish, and spicy sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=1200&q=80',
    tags: ['noodles', 'summer', 'Busan'],
    recommendedPlaceIds: ['place-biff-square'],
  },
  {
    id: 'food-gukbap',
    nameKo: '국밥',
    nameEn: 'Gukbap',
    category: 'traditional',
    regionIds: ['region-busan'],
    description: 'A comforting soup-and-rice meal often served with pork, broth, and side dishes.',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    tags: ['soup', 'local meal', 'comfort'],
    recommendedPlaceIds: ['place-jagalchi-market', 'place-biff-square'],
  },
  {
    id: 'food-kongnamul-gukbap',
    nameKo: '콩나물국밥',
    nameEn: 'Kongnamul Gukbap',
    category: 'local_specialty',
    regionIds: ['region-jeonju'],
    description: 'Jeonju bean sprout soup with rice, light broth, and clean morning flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1625938145744-e3805153992b?auto=format&fit=crop&w=1200&q=80',
    tags: ['bean sprout', 'breakfast', 'Jeonju'],
    recommendedPlaceIds: ['place-nambu-market'],
  },
];

export const mockPlaces: Place[] = [
  {
    id: 'place-gwangjang-market',
    googlePlaceId: 'ChIJq6qq6pOifDURTfAPJZsKUGU',
    name: 'Gwangjang Market',
    category: 'market',
    regionId: 'region-seoul',
    relatedFoodIds: ['food-tteokbokki'],
    address: '88 Changgyeonggung-ro, Jongno-gu, Seoul',
    location: { latitude: 37.5701, longitude: 126.9996 },
    rating: 4.2,
    userRatingCount: 61200,
    imageUrl: 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=1200&q=80',
    tags: ['market', 'snacks', 'busy'],
    recommendationTags: ['first-time travelers', 'street food route'],
  },
  {
    id: 'place-myeongdong-street-food-alley',
    name: 'Myeongdong Street Food Alley',
    category: 'tourist_spot',
    regionId: 'region-seoul',
    relatedFoodIds: ['food-tteokbokki', 'food-hotteok'],
    address: 'Myeongdong-gil, Jung-gu, Seoul',
    location: { latitude: 37.5637, longitude: 126.9853 },
    rating: 4.1,
    userRatingCount: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80',
    tags: ['street snacks', 'shopping', 'night walk'],
    recommendationTags: ['short stay', 'dessert snacks'],
  },
  {
    id: 'place-jagalchi-market',
    googlePlaceId: 'ChIJRX3M4keVaDURQ1pH5n4Wn5Q',
    name: 'Jagalchi Market',
    category: 'market',
    regionId: 'region-busan',
    relatedFoodIds: ['food-gukbap'],
    address: '52 Jagalchihaean-ro, Jung-gu, Busan',
    location: { latitude: 35.0968, longitude: 129.0305 },
    rating: 4.0,
    userRatingCount: 39500,
    imageUrl: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=80',
    tags: ['seafood', 'harbor', 'market'],
    recommendationTags: ['seafood lovers', 'coastal route'],
  },
  {
    id: 'place-biff-square',
    name: 'BIFF Square',
    category: 'tourist_spot',
    regionId: 'region-busan',
    relatedFoodIds: ['food-hotteok', 'food-milmyeon', 'food-gukbap'],
    address: 'BIFF gwangjang-ro, Jung-gu, Busan',
    location: { latitude: 35.0983, longitude: 129.0286 },
    rating: 4.1,
    userRatingCount: 18800,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['street food', 'cinema street', 'dessert'],
    recommendationTags: ['evening route', 'snack crawl'],
  },
  {
    id: 'place-jeonju-hanok-village',
    googlePlaceId: 'ChIJq0cFeRZLezURl04w6la6hDQ',
    name: 'Jeonju Hanok Village',
    category: 'landmark',
    regionId: 'region-jeonju',
    relatedFoodIds: ['food-bibimbap'],
    address: '99 Girin-daero, Wansan-gu, Jeonju-si, Jeollabuk-do',
    location: { latitude: 35.8151, longitude: 127.1534 },
    rating: 4.1,
    userRatingCount: 25100,
    imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=80',
    tags: ['hanok', 'walkable', 'traditional'],
    recommendationTags: ['families', 'heritage route'],
  },
  {
    id: 'place-nambu-market',
    name: 'Nambu Market',
    category: 'market',
    regionId: 'region-jeonju',
    relatedFoodIds: ['food-bibimbap', 'food-kongnamul-gukbap'],
    address: '19-3 Pungnammun 1-gil, Wansan-gu, Jeonju-si, Jeollabuk-do',
    location: { latitude: 35.8124, longitude: 127.1474 },
    rating: 4.0,
    userRatingCount: 9400,
    imageUrl: 'https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?auto=format&fit=crop&w=1200&q=80',
    tags: ['market', 'breakfast', 'local'],
    recommendationTags: ['morning food', 'local specialty'],
  },
];

export function getRegionById(regionId: string): Region | undefined {
  return mockRegions.find((region) => region.id === regionId);
}

export function getFoodById(foodId: string): Food | undefined {
  return mockFoods.find((food) => food.id === foodId);
}

export function getPlaceById(placeId: string): Place | undefined {
  return mockPlaces.find((place) => place.id === placeId);
}

export function getFoodsByRegion(regionId: string): Food[] {
  return mockFoods.filter((food) => food.regionIds.includes(regionId));
}

export function getPlacesByRegion(regionId: string): Place[] {
  return mockPlaces.filter((place) => place.regionId === regionId);
}

export function getPlacesByFood(foodId: string): Place[] {
  return mockPlaces.filter((place) => place.relatedFoodIds.includes(foodId));
}
