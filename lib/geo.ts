// Uses the free, keyless Zippopotam.us API for US zip -> city/state/lat/long
// lookups. No API key or billing account needed, which is why this is the
// default — but it's a third-party free service with no uptime guarantee.
// If it becomes unreliable at scale, swap this for Google's Address
// Validation API or the USPS Web Tools API (both need an API key/account).

export type ZipInfo = {
  city: string;
  state: string;
  stateAbbreviation: string;
  latitude: number;
  longitude: number;
};

export async function lookupZip(zip: string): Promise<ZipInfo | null> {
  if (!/^\d{5}$/.test(zip)) return null;
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return {
      city: place["place name"],
      state: place["state"],
      stateAbbreviation: place["state abbreviation"],
      latitude: parseFloat(place["latitude"]),
      longitude: parseFloat(place["longitude"]),
    };
  } catch {
    return null;
  }
}

// Great-circle distance in miles between two lat/long points.
export function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Rounds up to the nearest whole mile beyond the free radius, then applies
// the per-mile rate — adjust the rounding rule if you'd rather charge exact
// fractional miles.
export function calculateDeliveryFee(
  distanceMiles: number,
  freeRadiusMiles: number,
  perMileRate: number
): number {
  const milesOver = Math.max(0, Math.ceil(distanceMiles - freeRadiusMiles));
  return Math.round(milesOver * perMileRate * 100) / 100;
}
