export function getGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
}

export function getGoogleMapsUrl(name: string, address?: string, placeId?: string): string {
  const safeName = name.trim();
  const safeAddress = address?.trim();
  const query = safeAddress ? `${safeName} ${safeAddress}` : safeName;

  if (placeId?.trim()) {
    return `${getGoogleMapsSearchUrl(safeName)}&query_place_id=${encodeURIComponent(placeId.trim())}`;
  }

  return getGoogleMapsSearchUrl(query);
}
