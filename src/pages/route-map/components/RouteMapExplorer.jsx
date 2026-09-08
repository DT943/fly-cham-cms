import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
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
        <Container className="flex h-full flex-col gap-3 py-4 md:py-6 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="pointer-events-auto flex min-h-0 w-full flex-col gap-3 lg:order-1 lg:h-full lg:w-80 xl:w-88">
            <RouteSearchPanel
              from={from}
              to={to}
              onChange={change}
              onReset={reset}
              onFindFlights={() => setDrawerOpen(true)}
            />

            {/* Guides for the end you are travelling to, per the content brief. */}
            <div className="hidden min-h-0 overflow-y-auto lg:block">
              <DestinationPanel airport={to || from} />
            </div>
          </div>

          {/* The page has no breadcrumb row, so the language toggle lives here. */}
          <div className="pointer-events-auto flex justify-end lg:order-2">
            <div className="rounded-lg bg-background/95 px-2 py-1 shadow-[0_6px_18px_rgba(1,38,59,0.16)] backdrop-blur-sm">
              <LanguageSwitcher />
            </div>
          </div>
        </Container>
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
