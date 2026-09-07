import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher.jsx'
import { routeAirports } from '../utils/routeNetwork.js'
import RouteMapCanvas from './RouteMapCanvas.jsx'
import DestinationPanel from './DestinationPanel.jsx'

/**
 * Full-bleed map: the canvas fills the viewport below the sticky header (65px
 * mobile / 73px desktop) and spans edge to edge. Destinations are picked from
 * the pins themselves; the only things floating over the map are the language
 * toggle and the selected destination's card.
 */
const RouteMapExplorer = () => {
  const { t } = useTranslation()
  const [selectedCode, setSelectedCode] = useState(null)

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

  const selected = airports.find((airport) => airport.code === selectedCode) || null

  return (
    <section className="relative w-full h-[calc(100dvh-65px)] md:h-[calc(100dvh-73px)]">
      <RouteMapCanvas
        className="absolute inset-0 h-full w-full"
        airports={airports}
        selectedCode={selectedCode}
        onSelect={setSelectedCode}
        labelFor={(airport) =>
          `${t(`destinations.cities.${airport.cityKey}.name`)} (${airport.code})`
        }
      />

      {/* Transparent to pointer events so the map stays draggable underneath. */}
      <div className="pointer-events-none absolute inset-0 z-[500]">
        <Container className="flex h-full flex-col gap-3 py-4 md:py-6 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          {/* The page has no breadcrumb row, so the language toggle lives here. */}
          <div className="pointer-events-auto flex justify-end lg:order-2">
            <div className="rounded-lg bg-background/95 px-2 py-1 shadow-[0_6px_18px_rgba(1,38,59,0.16)] backdrop-blur-sm">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Below lg the card is pinned to the bottom so the map stays the hero. */}
          <div className="pointer-events-auto mt-auto w-full lg:order-1 lg:mt-0 lg:w-80 xl:w-88">
            <DestinationPanel airport={selected} onClear={() => setSelectedCode(null)} />
          </div>
        </Container>
      </div>
    </section>
  )
}

export default RouteMapExplorer
