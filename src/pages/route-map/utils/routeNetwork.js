/**
 * The live network, derived from the bundled flight manifest
 * (`src/vendor/flycham/data/flightmanifestData.json`): 11 airports and the 12
 * city pairs it actually flies. Damascus and Aleppo are the two hubs.
 *
 * City and country labels reuse `destinations.cities.*` / `destinations.countries.*`;
 * only the airport name lives in `routeMap.airports.*`.
 */
export const routeAirports = [
  { code: 'DAM', cityKey: 'damascus', countryKey: 'syria', lat: 33.4114, lng: 36.5156, hub: true },
  { code: 'ALP', cityKey: 'aleppo', countryKey: 'syria', lat: 36.1806, lng: 37.2244, hub: true },
  { code: 'DXB', cityKey: 'dubai', countryKey: 'uae', lat: 25.2532, lng: 55.3657 },
  { code: 'SHJ', cityKey: 'sharjah', countryKey: 'uae', lat: 25.3286, lng: 55.5172 },
  { code: 'AUH', cityKey: 'abuDhabi', countryKey: 'uae', lat: 24.433, lng: 54.6511 },
  { code: 'KWI', cityKey: 'kuwait', countryKey: 'kuwait', lat: 29.2266, lng: 47.9689 },
  { code: 'MCT', cityKey: 'muscat', countryKey: 'oman', lat: 23.5933, lng: 58.2844 },
  { code: 'BGW', cityKey: 'baghdad', countryKey: 'iraq', lat: 33.2625, lng: 44.2346 },
  { code: 'EBL', cityKey: 'erbil', countryKey: 'iraq', lat: 36.2376, lng: 43.9632 },
  { code: 'EVN', cityKey: 'yerevan', countryKey: 'armenia', lat: 40.1473, lng: 44.3959 },
  { code: 'SAW', cityKey: 'istanbul', countryKey: 'turkey', lat: 40.8986, lng: 29.3092 },
]

/** Undirected city pairs served, ordered by how often they appear in the manifest. */
export const routeLegs = [
  ['DAM', 'KWI'],
  ['DAM', 'SHJ'],
  ['DAM', 'DXB'],
  ['ALP', 'SHJ'],
  ['DAM', 'BGW'],
  ['DAM', 'MCT'],
  ['DAM', 'AUH'],
  ['ALP', 'SAW'],
  ['ALP', 'EVN'],
  ['DAM', 'EBL'],
  ['ALP', 'DXB'],
  ['ALP', 'EBL'],
]

export const airportsByCode = Object.fromEntries(
  routeAirports.map((airport) => [airport.code, airport])
)

/** Legs touching a given airport, used to highlight a selection on the map. */
export function legsFor(code) {
  return routeLegs.filter(([from, to]) => from === code || to === code)
}

/**
 * Quadratic bezier between two airports so legs read as flight arcs rather than
 * straight chords. The control point is pushed perpendicular to the leg, so a
 * constant `bend` fans the routes out of a hub instead of overlapping them.
 */
export function arcBetween(from, to, bend = 0.16, steps = 48) {
  const dLat = to.lat - from.lat
  const dLng = to.lng - from.lng
  const controlLat = (from.lat + to.lat) / 2 + dLng * bend
  const controlLng = (from.lng + to.lng) / 2 - dLat * bend

  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps
    const inverse = 1 - t
    return [
      inverse * inverse * from.lat + 2 * inverse * t * controlLat + t * t * to.lat,
      inverse * inverse * from.lng + 2 * inverse * t * controlLng + t * t * to.lng,
    ]
  })
}
