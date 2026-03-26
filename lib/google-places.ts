const PLACES_API = 'https://places.googleapis.com/v1/places:searchText';

export interface PlaceInfo {
  phone: string | null;
  phoneInternational: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  googleMapsUrl: string | null;
  placeName: string | null;
}

export async function lookupPhone(companyName: string, city?: string): Promise<PlaceInfo | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  const query = city ? `${companyName} ${city}` : companyName;

  try {
    const response = await fetch(PLACES_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri',
      },
      body: JSON.stringify({ textQuery: query }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const place = data.places?.[0];
    if (!place) return null;

    return {
      phone: place.nationalPhoneNumber || null,
      phoneInternational: place.internationalPhoneNumber || null,
      website: place.websiteUri || null,
      rating: place.rating || null,
      reviewCount: place.userRatingCount || null,
      googleMapsUrl: place.googleMapsUri || null,
      placeName: place.displayName?.text || null,
    };
  } catch {
    return null;
  }
}
