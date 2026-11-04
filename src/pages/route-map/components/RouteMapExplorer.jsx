import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { fetchB2cFlightAvailByRoute } from '../../../vendor/flycham/lib/b2cAvailability/b2cAvailabilityApi.js'
import Container from '../../../shared/components/Container.jsx'
import { LOGO_CONTENT_INSET_CLASS } from '../../../shared/layout/logoContentInset.js'
import { routeAirports } from '../utils/routeNetwork.js'
import RouteMapCanvas from './RouteMapCanvas.jsx'
import RouteSearchPanel from './RouteSearchPanel.jsx'
import DestinationPanel from './DestinationPanel.jsx'
import RouteBookingDrawer from './RouteBookingDrawer.jsx'
import RouteMapLegend from './RouteMapLegend.jsx'
import { resetRouteSelectionAnalytics, trackRouteSelected } from '../../../shared/analytics/cmsEvents.js'

/**
 * Interactive route map: wide map stage + page-aligned overlays (search, card).
 *
 * Content alignment (title / fields / card) follows the page column.
 * Map width is independent and wider on large screens.
 */
const RouteMapExplorer = ({ planeUrl = '', cityImages = {}, cityImageAlts = {} }) => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()
  const [fromCode, setFromCode] = useState(null)
  const [toCode, setToCode] = useState(null)
  const [panelCode, setPanelCode] = useState(null)
  const [openedByMap, setOpenedByMap] = useState(false)
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
  const panelFocus = byCode(panelCode)

  const change = (field, code) => {
    findRequestRef.current += 1
    setDrawerOpen(false)
    setFindingFlights(false)

    if (field === 'from') {
      setFromCode(code)
      if (code === toCode) setToCode(null)
      if (toCode && code !== toCode) {
        setPanelCode(toCode)
        setOpenedByMap(false)
      } else {
        setPanelCode(null)
        setOpenedByMap(false)
      }
      return
    }

    setToCode(code)
    setOpenedByMap(false)
    if (code === fromCode) setFromCode(null)
    setPanelCode(code)
  }

  const selectFromMap = (code) => {
    findRequestRef.current += 1
    setDrawerOpen(false)
    setFindingFlights(false)

    if (code === fromCode) {
      setFromCode(null)
      if (panelCode === code) {
        setPanelCode(toCode)
        setOpenedByMap(Boolean(toCode))
      }
      return
    }
    if (code === toCode) {
      setToCode(null)
      if (panelCode === code) {
        setPanelCode(null)
        setOpenedByMap(false)
      }
      return
    }

    if (!fromCode) {
      setFromCode(code)
    } else {
      setToCode(code)
    }

    setPanelCode(code)
    setOpenedByMap(true)
  }

  useEffect(() => {
    if (fromCode && toCode) trackRouteSelected(fromCode, toCode)
  }, [fromCode, toCode])

  const reset = () => {
    findRequestRef.current += 1
    resetRouteSelectionAnalytics()
    setFromCode(null)
    setToCode(null)
    setPanelCode(null)
    setOpenedByMap(false)
    setDrawerOpen(false)
    setFindingFlights(false)
  }

  const clearFocus = () => {
    setPanelCode(null)
    setOpenedByMap(false)
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
      // Prefetch is best-effort; the booking drawer loads its own calendar.
    }

    if (findRequestRef.current !== requestId) return
    setFindingFlights(false)
    setDrawerOpen(true)
  }

  const destinationPanel = panelFocus ? (
    <DestinationPanel
      from={from}
      to={to}
      focus={panelFocus}
      onClear={clearFocus}
      cityImages={cityImages}
      cityImageAlts={cityImageAlts}
      layout={openedByMap ? 'stacked' : 'auto'}
    />
  ) : null

  return (
    <div className="relative w-full">
      {/*
        Page-column layer (same width/inset as title + breadcrumbs).
        Mobile: search in normal flow above the map.
        Desktop: absolute overlay over the wide map, still page-aligned.
      */}
      <Container className="relative z-[520] mb-3 md:pointer-events-none md:absolute md:inset-x-0 md:top-0 md:mb-0 md:h-full md:py-4">
        <div className={`pointer-events-auto md:max-w-[48rem] ${LOGO_CONTENT_INSET_CLASS}`}>
          <RouteSearchPanel
            from={from}
            to={to}
            onChange={change}
            onReset={reset}
            onSearch={findFlights}
            searching={findingFlights}
          />
        </div>

        {destinationPanel ? (
          <div
            className={`pointer-events-auto absolute bottom-4 hidden md:block ${LOGO_CONTENT_INSET_CLASS} ${
              openedByMap ? 'w-[min(100%,28rem)]' : 'w-[min(100%,52rem)]'
            }`}
          >
            {destinationPanel}
          </div>
        ) : null}
      </Container>

      {/* Wide map — width is independent of the page content column. */}
      <div className="relative mx-auto w-full max-w-[min(100%,90rem)] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <section className="route-map-shell relative h-[min(62dvh,36rem)] min-h-[22rem] w-full overflow-hidden rounded-2xl border border-solid border-200 bg-100 shadow-[0_12px_40px_rgba(1,38,59,0.1)] md:h-[min(72dvh,48rem)] md:min-h-[28rem] lg:h-[min(75dvh,52rem)] xl:h-[min(78dvh,56rem)]">
          <RouteMapCanvas
            className="absolute inset-0 h-full w-full"
            fromCode={fromCode}
            toCode={toCode}
            onSelect={selectFromMap}
            planeUrl={planeUrl}
            labelFor={(airport) =>
              `${t(`destinations.cities.${airport.cityKey}.name`)} (${airport.code})`
            }
          />

          <div className="pointer-events-none absolute inset-0 z-[450]">
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

      {/* Mobile card: page-aligned, sitting over the bottom of the wide map. */}
      {destinationPanel ? (
        <Container className="pointer-events-none absolute inset-x-0 bottom-3 z-[520] md:hidden">
          <div className={`pointer-events-auto ${LOGO_CONTENT_INSET_CLASS}`}>
            <DestinationPanel
              from={from}
              to={to}
              focus={panelFocus}
              onClear={clearFocus}
              cityImages={cityImages}
              cityImageAlts={cityImageAlts}
              layout="stacked"
            />
          </div>
        </Container>
      ) : null}
    </div>
  )
}

export default RouteMapExplorer
