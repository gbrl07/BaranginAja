/**
 * Helper utility for accurate geographical & driving distance calculation
 * using Haversine formula with urban routing curve adjustment.
 */

export function calculateDistanceKm(
  lat1?: number | null, 
  lng1?: number | null, 
  lat2?: number | null, 
  lng2?: number | null
): number {
  // If coordinates are missing, fallback to realistic average city distance in Surabaya (3.2 km)
  if (!lat1 || !lng1 || !lat2 || !lng2) {
    return 3.2;
  }

  // Same point
  if (lat1 === lat2 && lng1 === lng2) {
    return 0.5;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;

  // Apply urban road network multiplier (~1.3x for city street routing curve)
  const roadDistance = straightDistance * 1.3;

  // Return formatted to 1 decimal place, minimum 0.5 km
  const rounded = Math.max(0.5, Math.round(roadDistance * 10) / 10);
  return rounded;
}

export function calculateOngkirRupiah(jarakKm: number, beratKg: number): number {
  // Formula: Rp 2.500 per km + Rp 5.000 per kg, rounded up to nearest 500
  const raw = (jarakKm * 2500) + (beratKg * 5000);
  return Math.ceil(raw / 500) * 500;
}
