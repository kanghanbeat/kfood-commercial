export type FoodPlace = {
  id: string;
  name: string;
  foodName: string;
  region: string;
  city: string;
  description: string;
  tags: string[];
};

export type MapDestination = {
  id: string;
  name: string;
  region: string;
  representativeFood: string;
  description: string;
  markerTop: `${number}%`;
  markerLeft: `${number}%`;
  places: FoodPlace[];
};

export type SearchMatchType = 'region' | 'food' | 'place' | 'keyword';

export type SearchResult = {
  destinationId: string;
  destinationName: string;
  region: string;
  place: FoodPlace;
  matchType: SearchMatchType;
};

export const mapDestinations: MapDestination[] = [
  {
    id: 'seoul',
    name: 'Seoul',
    region: 'Capital Area',
    representativeFood: 'Gwangjang Market bindaetteok',
    description: 'Follow street-food alleys, palace neighborhoods, and night market stops in one city route.',
    markerTop: '24%',
    markerLeft: '48%',
    places: [
      {
        id: 'seoul-gwangjang-bindaetteok',
        name: 'Gwangjang Bindaetteok House',
        foodName: 'Bindaetteok',
        region: 'Capital Area',
        city: 'Seoul',
        description: 'Historic market stop for mung bean pancakes, mayak gimbap, street food, and night snacks.',
        tags: ['market', 'street food', 'night market', 'pancake', 'jongno'],
      },
      {
        id: 'seoul-bibimbap-table',
        name: 'Seoul Bibimbap Table',
        foodName: 'Bibimbap',
        region: 'Capital Area',
        city: 'Seoul',
        description: 'Central Seoul table for vegetable bibimbap, gochujang, rice bowls, and quick lunch routes.',
        tags: ['bibimbap', 'rice bowl', 'lunch', 'vegetable', 'classic'],
      },
      {
        id: 'seoul-myeongdong-kalguksu',
        name: 'Myeongdong Kalguksu Route',
        foodName: 'Kalguksu',
        region: 'Capital Area',
        city: 'Seoul',
        description: 'Walkable noodle route around Myeongdong with dumplings, broth, and shopping-area snacks.',
        tags: ['noodles', 'myeongdong', 'dumplings', 'shopping', 'comfort food'],
      },
    ],
  },
  {
    id: 'jeonju',
    name: 'Jeonju',
    region: 'Jeollabuk-do',
    representativeFood: 'Jeonju bibimbap',
    description: 'Preview a hanok village route built around bibimbap, makgeolli streets, and local side dishes.',
    markerTop: '52%',
    markerLeft: '40%',
    places: [
      {
        id: 'jeonju-bibimbap-house',
        name: 'Jeonju Bibimbap House',
        foodName: 'Jeonju bibimbap',
        region: 'Jeollabuk-do',
        city: 'Jeonju',
        description: 'Classic brass-bowl bibimbap near hanok streets with seasoned vegetables and local banchan.',
        tags: ['bibimbap', 'hanok village', 'traditional', 'local specialty', 'banchan'],
      },
      {
        id: 'jeonju-hanok-makgeolli',
        name: 'Hanok Village Makgeolli Table',
        foodName: 'Makgeolli table',
        region: 'Jeollabuk-do',
        city: 'Jeonju',
        description: 'Traditional table route for makgeolli, shared side dishes, hanok alleys, and evening snacks.',
        tags: ['makgeolli', 'hanok village', 'traditional', 'sharing table', 'evening route'],
      },
      {
        id: 'jeonju-kongnamul-gukbap',
        name: 'Jeonju Kongnamul Gukbap Spot',
        foodName: 'Kongnamul gukbap',
        region: 'Jeollabuk-do',
        city: 'Jeonju',
        description: 'Market-friendly bean sprout soup route with rice, clean broth, and local breakfast stops.',
        tags: ['market', 'gukbap', 'bean sprout', 'soup', 'breakfast'],
      },
    ],
  },
  {
    id: 'busan',
    name: 'Busan',
    region: 'Gyeongsangnam-do Coast',
    representativeFood: 'Dwaeji gukbap',
    description: 'Trace a coastal food path through markets, harbor views, milmyeon shops, and gukbap districts.',
    markerTop: '67%',
    markerLeft: '69%',
    places: [
      {
        id: 'busan-dwaeji-gukbap-street',
        name: 'Busan Dwaeji Gukbap Street',
        foodName: 'Dwaeji gukbap',
        region: 'Gyeongsangnam-do Coast',
        city: 'Busan',
        description: 'Pork soup rice district with rich broth, chives, kimchi, and quick local table service.',
        tags: ['gukbap', 'pork soup', 'local dining', 'seomyeon', 'comfort food'],
      },
      {
        id: 'busan-milmyeon-local-house',
        name: 'Milmyeon Local House',
        foodName: 'Milmyeon',
        region: 'Gyeongsangnam-do Coast',
        city: 'Busan',
        description: 'Busan wheat noodle stop with chilled broth, spicy sauce, and summer route appeal.',
        tags: ['milmyeon', 'noodles', 'cold noodles', 'summer', 'local specialty'],
      },
      {
        id: 'busan-jagalchi-seafood-route',
        name: 'Jagalchi Seafood Route',
        foodName: 'Grilled seafood',
        region: 'Gyeongsangnam-do Coast',
        city: 'Busan',
        description: 'Harbor market route for grilled fish, shellfish, spicy seafood soup, and ocean views.',
        tags: ['market', 'seafood', 'harbor', 'fish', 'coastal'],
      },
    ],
  },
  {
    id: 'jeju',
    name: 'Jeju',
    region: 'Jeju Island',
    representativeFood: 'Black pork barbecue',
    description: 'Plan an island route for black pork, seafood, citrus cafes, and scenic local markets.',
    markerTop: '83%',
    markerLeft: '32%',
    places: [
      {
        id: 'jeju-black-pork-grill',
        name: 'Jeju Black Pork Grill',
        foodName: 'Black pork barbecue',
        region: 'Jeju Island',
        city: 'Jeju City',
        description: 'Island barbecue route focused on Jeju black pork, charcoal grills, and local dipping sauces.',
        tags: ['black pork', 'barbecue', 'island food', 'grill', 'jeju specialty'],
      },
      {
        id: 'jeju-seafood-noodle-house',
        name: 'Jeju Seafood Noodle House',
        foodName: 'Seafood noodles',
        region: 'Jeju Island',
        city: 'Jeju City',
        description: 'Seafood noodle stop with shellfish broth, coastal produce, and traveler-friendly lunch routes.',
        tags: ['seafood', 'noodles', 'coastal', 'shellfish', 'island food'],
      },
      {
        id: 'jeju-citrus-cafe-food-stop',
        name: 'Citrus Cafe Food Stop',
        foodName: 'Citrus dessert',
        region: 'Jeju Island',
        city: 'Seogwipo',
        description: 'Cafe route for citrus desserts, drinks, and light snacks between scenic island stops.',
        tags: ['citrus', 'dessert', 'cafe', 'seogwipo', 'island market'],
      },
    ],
  },
];

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function fieldIncludesQuery(fields: string[], query: string): boolean {
  return fields.some((field) => normalizeSearchValue(field).includes(query));
}

function getSearchMatchType(destination: MapDestination, place: FoodPlace, query: string): SearchMatchType | null {
  if (fieldIncludesQuery([destination.name, destination.region, place.region, place.city], query)) {
    return 'region';
  }

  if (fieldIncludesQuery([destination.representativeFood, place.foodName], query)) {
    return 'food';
  }

  if (fieldIncludesQuery([place.name], query)) {
    return 'place';
  }

  if (fieldIncludesQuery([destination.description, place.description, ...place.tags], query)) {
    return 'keyword';
  }

  return null;
}

function toSearchResult(destination: MapDestination, place: FoodPlace, matchType: SearchMatchType): SearchResult {
  return {
    destinationId: destination.id,
    destinationName: destination.name,
    region: destination.region,
    place,
    matchType,
  };
}

function getPlaceResult(placeId: string, matchType: SearchMatchType): SearchResult | undefined {
  for (const destination of mapDestinations) {
    const place = destination.places.find((item) => item.id === placeId);

    if (place) {
      return toSearchResult(destination, place, matchType);
    }
  }

  return undefined;
}

function getPlaceResults(placeIds: string[], matchType: SearchMatchType): SearchResult[] {
  return placeIds.flatMap((placeId) => {
    const result = getPlaceResult(placeId, matchType);
    return result ? [result] : [];
  });
}

export function getSearchResults(query: string): SearchResult[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return [];
  }

  const resultsByPlaceId = new Map<string, SearchResult>();

  mapDestinations.forEach((destination) => {
    destination.places.forEach((place) => {
      const matchType = getSearchMatchType(destination, place, normalizedQuery);

      if (matchType && !resultsByPlaceId.has(place.id)) {
        resultsByPlaceId.set(place.id, toSearchResult(destination, place, matchType));
      }
    });
  });

  return [...resultsByPlaceId.values()];
}

export function getDefaultRecommendations(): SearchResult[] {
  return getPlaceResults(
    ['jeonju-bibimbap-house', 'busan-dwaeji-gukbap-street', 'jeju-black-pork-grill'],
    'keyword',
  );
}

export function getFallbackRecommendations(): SearchResult[] {
  return getPlaceResults(
    ['jeonju-bibimbap-house', 'busan-milmyeon-local-house', 'jeju-black-pork-grill'],
    'keyword',
  );
}

export function getMatchLabel(matchType: SearchMatchType): string {
  if (matchType === 'region') {
    return 'Matched by region';
  }

  if (matchType === 'food') {
    return 'Matched by food';
  }

  if (matchType === 'place') {
    return 'Matched by place';
  }

  return 'Matched by keyword';
}

export function getRecommendationReason(result: SearchResult, hasQuery: boolean): string {
  return hasQuery ? getMatchLabel(result.matchType) : 'Popular K-Food route';
}
