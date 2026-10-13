import { useCallback, useEffect, useMemo, useState } from 'react'
import staticAirportList from '../../vendor/flycham/data/staticAirportList.json'
import { fetchB2cAllRoutes } from '../../vendor/flycham/lib/b2cAvailability/b2cAvailabilityApi.js'
import { collectDestinationIatasFromB2cRoutes } from '../../vendor/flycham/lib/b2cAvailability/collectDestinationIatasFromB2cRoutes.js'
import { buildAirportListPayload } from '../../vendor/flycham/util/airports/buildAirportListFromManifest.js'

const DESTINATION_IMAGES = {
  DAM: 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/damascus.webp',
  DXB: 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/dubai.webp',
}

const toAirport = (row) => {
  const code = String(row.iataCode || '').toUpperCase()
  const translation = row.airPortTranslations?.[0] || {}
  const name = translation.airPortName?.trim() || code
  return {
    code,
    city: translation.city || code,
    country: translation.country || '',
    name,
    airport: `${name} (${code})`,
    image: DESTINATION_IMAGES[code] || row.url || '',
  }
}

/** `{ CODE: airport }`, Damascus first, in the same order the booking box lists them. */
const buildAirportMap = (routeRows, lang) => {
  const { items } = buildAirportListPayload(routeRows, staticAirportList, lang)
  const airports = items.map(toAirport).filter((airport) => airport.code)
  const damascus = airports.find((airport) => airport.code === 'DAM')
  const ordered = damascus ? [damascus, ...airports.filter((airport) => airport !== damascus)] : airports
  return Object.fromEntries(ordered.map((airport) => [airport.code, airport]))
}

/**
 * Airports for the flight schedule search — the same served-station list as the
 * home booking box (B2C route matrix merged with `staticAirportList.json`).
 * `destinationsFor(origin)` returns the IATA codes that origin flies to.
 */
const useScheduleAirports = (lang) => {
  const [routeRows, setRouteRows] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchB2cAllRoutes(lang)
      .then((rows) => {
        if (!cancelled) setRouteRows(Array.isArray(rows) ? rows : [])
      })
      .catch((error) => {
        console.error('Failed to load flight schedule routes:', error)
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  const airports = useMemo(() => buildAirportMap(routeRows, lang), [routeRows, lang])

  const destinationsFor = useCallback(
    (origin) => {
      if (!origin) return []
      if (routeRows.length) return collectDestinationIatasFromB2cRoutes(routeRows, origin)
      return Object.keys(airports).filter((code) => code !== origin)
    },
    [routeRows, airports],
  )

  return { airports, destinationsFor }
}

export default useScheduleAirports
