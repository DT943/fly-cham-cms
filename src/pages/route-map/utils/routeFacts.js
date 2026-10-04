import manifest from '../../../vendor/flycham/data/flightmanifestData.json'
import { airportsByCode, legsFor } from './routeNetwork.js'

/**
 * Average flights per week to each airport, counted from the bundled manifest
 * over its full date span. Computed once at module load.
 */
const weeklyByCode = (() => {
  const rows = (manifest?.result || []).filter((r) => r.status !== 'Cancelled' && r.day)
  if (rows.length === 0) return {}

  const days = rows.map((r) => r.day).sort()
  const spanDays = (new Date(days[days.length - 1]) - new Date(days[0])) / 86_400_000 + 1
  const weeks = Math.max(1, spanDays / 7)

  const counts = {}
  rows.forEach((r) => {
    counts[r.destination] = (counts[r.destination] || 0) + 1
  })

  return Object.fromEntries(
    Object.entries(counts).map(([code, total]) => [code, Math.max(1, Math.round(total / weeks))])
  )
})()

export function weeklyFlights(code) {
  return weeklyByCode[code] || 1
}

function haversineKm(a, b) {
  const R = 6371
  const toRad = (x) => (x * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

/** Rough block time from great-circle distance: ~780 km/h cruise + 30 min on the ground. */
export function estimateDurationMinutes(a, b) {
  if (!a || !b) return null
  const minutes = (haversineKm(a, b) / 780) * 60 + 30
  return Math.max(45, Math.round(minutes / 5) * 5)
}

export function formatDuration(minutes) {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m}m`
  return m ? `${h}h ${m}m` : `${h}h`
}

/** The airport on the other end of a focus airport's first route — a stand-in origin. */
export function firstPartner(code) {
  const [leg] = legsFor(code)
  if (!leg) return null
  return airportsByCode[leg[0] === code ? leg[1] : leg[0]] || null
}
