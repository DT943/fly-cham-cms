import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher.jsx'
import { routeAirports } from '../utils/routeNetwork.js'
import RouteMapCanvas from './RouteMapCanvas.jsx'
import RouteSearchPanel from './RouteSearchPanel.jsx'
import DestinationPanel from './DestinationPanel.jsx'
import RouteBookingDrawer from './RouteBookingDrawer.jsx'

/**
 * Full-bleed route map: pick From and To (from the fields or by clicking pins),
 * see the leg drawn, then open the booking drawer to finish the search.
 */
const RouteMapExplorer = () => {
  const { t } = useTranslation()
  const [fromCode, setFromCode] = useState(null)
  const [toCode, setToCode] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const airports = useMemo(
    () =>
      routeAirports.map((airport) => ({
        ...airport,
        city: t(`destinations.cities.${airport.cityKey}.name`),
        country: t(`destinations.countries.${airport.countryKey}`),
        airportName: t(`routeMap.airports.${airport.code}`),
      })),
    [t]
  )

  const byCode = (code) => airports.find((airport) => airport.code === code) || null
  const from = byCode(fromCode)
  const to = byCode(toCode)

  const change = (field, code) => {
    if (field === 'from') {
      setFromCode(code)
      if (code === toCode) setToCode(null)
    } else {
      setToCode(code)
      if (code === fromCode) setFromCode(null)
    }
    setDrawerOpen(false)
  }

  // Clicking a pin fills whichever end is still empty.
  const selectFromMap = (code) => {
    if (code === fromCode) return setFromCode(null)
    if (code === toCode) return setToCode(null)
    return fromCode ? change('to', code) : change('from', code)
  }

  const reset = () => {
    setFromCode(null)
    setToCode(null)
    setDrawerOpen(false)
  }

  return (
    <section className="relative w-full h-[calc(100dvh-65px)] md:h-[calc(100dvh-73px)]">
      <RouteMapCanvas
        className="absolute inset-0 h-full w-full"
        fromCode={fromCode}
        toCode={toCode}
        onSelect={selectFromMap}
        labelFor={(airport) =>
          `${t(`destinations.cities.${airport.cityKey}.name`)} (${airport.code})`
        }
      />

      {/* Transparent to pointer events so the map stays draggable underneath. */}
      <div className="pointer-events-none absolute inset-0 z-[500]">
        {/* Search + destination card, pinned to the left edge and made wider. */}
        <div className="pointer-events-auto absolute start-0 top-0 flex max-h-full w-full max-w-[440px] flex-col gap-3 p-3 md:p-4">
          <RouteSearchPanel from={from} to={to} onChange={change} onReset={reset} />

          {/* The destination card for the end you are travelling to. */}
          <div className="hidden min-h-0 flex-1 overflow-y-auto lg:block">
            <DestinationPanel from={from} to={to} onFindFlights={() => setDrawerOpen(true)} />
          </div>
        </div>

        {/* The page has no breadcrumb row, so the language toggle lives here. */}
        <div className="pointer-events-auto absolute end-0 top-0 p-3 md:p-4">
          <div className="rounded-lg bg-background/95 px-2 py-1 shadow-[0_6px_18px_rgba(1,38,59,0.16)] backdrop-blur-sm">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <RouteBookingDrawer
        open={drawerOpen}
        from={from}
        to={to}
        onClose={() => setDrawerOpen(false)}
      />
    </section>
  )
}

export default RouteMapExplorer
