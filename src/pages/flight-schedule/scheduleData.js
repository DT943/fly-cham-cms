/**
 * Placeholder flight schedule until the real schedule API is wired in.
 *
 * Flights are generated per route from a seed, so every route the booking box
 * serves has data and a route always shows the same flights. Block times come
 * from the great-circle distance between airports and arrival times are shown
 * in the destination's local time.
 */

/** Latitude, longitude and UTC offset (hours) per served airport. */
const AIRPORT_GEO = {
  DAM: { lat: 33.411, lon: 36.516, utc: 3 },
  ALP: { lat: 36.18, lon: 37.224, utc: 3 },
  DXB: { lat: 25.253, lon: 55.364, utc: 4 },
  DWC: { lat: 24.896, lon: 55.161, utc: 4 },
  SHJ: { lat: 25.329, lon: 55.517, utc: 4 },
  AUH: { lat: 24.433, lon: 54.651, utc: 4 },
  MCT: { lat: 23.593, lon: 58.284, utc: 4 },
  KWI: { lat: 29.24, lon: 47.969, utc: 3 },
  DMM: { lat: 26.471, lon: 49.798, utc: 3 },
  BGW: { lat: 33.262, lon: 44.235, utc: 3 },
  BSR: { lat: 30.549, lon: 47.662, utc: 3 },
  EBL: { lat: 36.238, lon: 43.963, utc: 3 },
  SAW: { lat: 40.898, lon: 29.309, utc: 3 },
  COV: { lat: 36.899, lon: 35.065, utc: 3 },
  EVN: { lat: 40.147, lon: 44.396, utc: 4 },
  MJI: { lat: 32.894, lon: 13.276, utc: 2 },
}

const CRUISE_KM_PER_MIN = 12.5
const TAXI_MINUTES = 30
const FALLBACK_BLOCK_MINUTES = 150
const DEPARTURE_HOURS = [6, 7, 8, 10, 12, 13, 15, 17, 19, 20, 22]
const MINUTES_PER_DAY = 24 * 60

export const hashString = (value) => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** Deterministic 0–1 generator (mulberry32). */
export const seededRandom = (seed) => {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pickDistinct = (list, count, random) => {
  const pool = [...list]
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[pool[index], pool[swap]] = [pool[swap], pool[index]]
  }
  return pool.slice(0, count)
}

const distanceKm = (a, b) => {
  const rad = (deg) => (deg * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

/** Gate-to-gate minutes for `from → to`. */
export const blockMinutes = (from, to) => {
  const a = AIRPORT_GEO[from]
  const b = AIRPORT_GEO[to]
  if (!a || !b) return FALLBACK_BLOCK_MINUTES
  const minutes = distanceKm(a, b) / CRUISE_KM_PER_MIN + TAXI_MINUTES
  return Math.max(45, Math.round(minutes / 5) * 5)
}

const utcDifferenceMinutes = (from, to) =>
  ((AIRPORT_GEO[to]?.utc ?? 0) - (AIRPORT_GEO[from]?.utc ?? 0)) * 60

const formatClock = (minutes) => {
  const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  const hours = String(Math.floor(wrapped / 60)).padStart(2, '0')
  return `${hours}:${String(wrapped % 60).padStart(2, '0')}`
}

const formatDuration = (minutes) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`

const generateRouteFlights = (from, to) => {
  const [first, second] = [from, to].sort()
  const outbound = from === first
  // Seeded by the airport pair, so both directions share frequency and numbering.
  const pairRandom = seededRandom(hashString(`${first}-${second}`))
  const routeRandom = seededRandom(hashString(`${from}-${to}`))

  const flightCount = 1 + Math.floor(pairRandom() * 3)
  const baseNumber = 100 + Math.floor(pairRandom() * 400) * 2
  const weekdaysPerFlight = Array.from({ length: flightCount }, () =>
    pickDistinct([0, 1, 2, 3, 4, 5, 6], 3 + Math.floor(pairRandom() * 5), pairRandom).sort((a, b) => a - b),
  )
  const departHours = pickDistinct(DEPARTURE_HOURS, flightCount, routeRandom).sort((a, b) => a - b)

  const block = blockMinutes(from, to)
  const zoneShift = utcDifferenceMinutes(from, to)

  return departHours.map((hour, index) => {
    const departMinutes = hour * 60 + Math.floor(routeRandom() * 6) * 10
    const arriveMinutes = departMinutes + block + zoneShift
    const number = `XH${baseNumber + index * 10 + (outbound ? 0 : 1)}`
    return {
      id: `${from}-${to}-${formatClock(departMinutes)}`.toLowerCase(),
      depart: formatClock(departMinutes),
      arrive: formatClock(arriveMinutes),
      nextDay: arriveMinutes >= MINUTES_PER_DAY,
      duration: formatDuration(block),
      number,
      days: weekdaysPerFlight[index],
    }
  })
}

const routeCache = new Map()

/**
 * Flights for `from → to`. `days` are operating weekdays (0 Sunday … 6 Saturday);
 * `arrive` is local time at the destination, `nextDay` when it lands after midnight.
 */
export const getRouteFlights = (from, to) => {
  if (!from || !to || from === to) return []
  const key = `${from}-${to}`
  if (!routeCache.has(key)) routeCache.set(key, generateRouteFlights(from, to))
  return routeCache.get(key)
}

/** Weekdays (0–6) on which at least one flight operates `from → to`. */
export const getRouteOperatingDays = (from, to) => [
  ...new Set(getRouteFlights(from, to).flatMap((flight) => flight.days)),
]
