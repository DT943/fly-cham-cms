import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { fetchB2cFlightAvailByRoute } from '../../../vendor/flycham/lib/b2cAvailability/b2cAvailabilityApi.js'
import { routeAirports } from '../utils/routeNetwork.js'
import RouteMapCanvas from './RouteMapCanvas.jsx'
import RouteSearchPanel from './RouteSearchPanel.jsx'
import DestinationPanel from './DestinationPanel.jsx'
import RouteBookingDrawer from './RouteBookingDrawer.jsx'
import RouteMapLegend from './RouteMapLegend.jsx'
import { resetRouteSelectionAnalytics, trackRouteSelected } from '../../../shared/analytics/cmsEvents.js'

/**
 * Interactive route map: From/To search, hover photo pins, destination detail
 * card, and booking drawer. On mobile the search bar sits above the map; from
 * md up it floats over the map. Images come from the CMS route-map-explorer
 * block (`planeUrl`, `cityImages`).
 */
const RouteMapExplorer = ({ planeUrl = '', cityImages = {}, cityImageAlts = {} }) => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()
  const [fromCode, setFromCode] = useState(null)
  const [toCode, setToCode] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [findingFlights, setFindingFlights] = useState(false)
  const findRequestRef = useRef(0)

  const airports = useMemo(
    () =>
      routeAirports.map((airport) => ({
        ...airport,
        city: t(`destinations.cities.${airport.cityKey}.name`),
        country: t(`destinations.countries.${airport.countryKey}`),
        airportName: t(`routeMap.airports.${airport.code}`),
      })),
    [t],
  )

  const byCode = (code) => airports.find((airport) => airport.code === code) || null
  const from = byCode(fromCode)
  const to = byCode(toCode)

  const change = (field, code) => {
    findRequestRef.current += 1
    if (field === 'from') {
      setFromCode(code)
      if (code === toCode) setToCode(null)
    } else {
      setToCode(code)
      if (code === fromCode) setFromCode(null)
    }
    setDrawerOpen(false)
    setFindingFlights(false)
  }

  const selectFromMap = (code) => {
    if (code === fromCode) return setFromCode(null)
    if (code === toCode) return setToCode(null)
    return fromCode ? change('to', code) : change('from', code)
  }

  useEffect(() => {
    if (fromCode && toCode) trackRouteSelected(fromCode, toCode)
  }, [fromCode, toCode])

  const reset = () => {
    findRequestRef.current += 1
    resetRouteSelectionAnalytics()
    setFromCode(null)
    setToCode(null)
    setDrawerOpen(false)
    setFindingFlights(false)
  }

  const clearFocus = () => {
    if (toCode) setToCode(null)
    else if (fromCode) setFromCode(null)
    setDrawerOpen(false)
    setFindingFlights(false)
  }

  const findFlights = async () => {
    if (!fromCode || !toCode || findingFlights) return

    const requestId = findRequestRef.current + 1
    findRequestRef.current = requestId
    setFindingFlights(true)

    try {
      await fetchB2cFlightAvailByRoute(fromCode, toCode, language)
    } catch {
      // The booking drawer loads the calendar itself if this prefetch fails.
    }

    if (findRequestRef.current !== requestId) return
    setFindingFlights(false)
    setDrawerOpen(true)
  }

  return (
    <div className="relative w-full">
      {/* Mobile: in normal flow above the map. Desktop: floats over the map. */}
      <div className="relative z-[520] mb-3 md:absolute md:inset-x-4 md:top-4 md:mb-0 lg:start-4 lg:end-auto lg:w-[min(100%,48rem)]">
        <RouteSearchPanel
          from={from}
          to={to}
          onChange={change}
          onReset={reset}
          onSearch={findFlights}
          searching={findingFlights}
        />
      </div>

      <section className="route-map-shell relative h-[min(62dvh,36rem)] min-h-[22rem] w-full overflow-hidden rounded-2xl border border-solid border-200 bg-100 shadow-[0_12px_40px_rgba(1,38,59,0.1)] md:h-[min(72dvh,48rem)] md:min-h-[28rem] lg:h-[min(75dvh,52rem)] xl:h-[min(78dvh,56rem)]">
        <RouteMapCanvas
          className="absolute inset-0 h-full w-full"
          fromCode={fromCode}
          toCode={toCode}
          onSelect={selectFromMap}
          planeUrl={planeUrl}
          cityImages={cityImages}
          cityNameFor={(airport) => t(`destinations.cities.${airport.cityKey}.name`)}
          labelFor={(airport) =>
            `${t(`destinations.cities.${airport.cityKey}.name`)} (${airport.code})`
          }
        />

        <div className="pointer-events-none absolute inset-0 z-[500]">
          {(from || to) && (
            <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-[510] md:inset-x-4 md:bottom-4 lg:end-auto lg:w-[min(100%,52rem)]">
              <DestinationPanel
                from={from}
                to={to}
                onClear={clearFocus}
                cityImages={cityImages}
                cityImageAlts={cityImageAlts}
              />
            </div>
          )}

          <RouteMapLegend />
        </div>

        <RouteBookingDrawer
          open={drawerOpen}
          from={from}
          to={to}
          onClose={() => setDrawerOpen(false)}
        />
      </section>
    </div>
  )
}

export default RouteMapExplorer
