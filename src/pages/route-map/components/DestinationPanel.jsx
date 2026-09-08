import { ArrowRight, CalendarBlank, Compass, MapPin, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { legsFor } from '../utils/routeNetwork.js'

const links = [
  { id: 'guide', icon: Compass, href: '/our-destinations' },
  { id: 'activities', icon: MapPin, href: '/our-destinations/city-sights' },
  { id: 'schedule', icon: CalendarBlank, href: '/our-destinations' },
]

/** The "destination card" from the content doc: city, airport, then three routes onward. */
const DestinationPanel = ({ airport, onClear }) => {
  const { t } = useTranslation()

  if (!airport) return null

  const city = t(`destinations.cities.${airport.cityKey}.name`)
  const country = t(`destinations.countries.${airport.countryKey}`)

  return (
    <article className="flex flex-col gap-5 rounded-2xl bg-50 p-5 shadow-[0_8px_24px_rgba(1,38,59,0.14)] md:p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {airport.hub && (
            <span className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-secondary-900">
              {t('routeMap.panel.hub')}
            </span>
          )}
          <span className="text-xs font-medium uppercase text-600">
            {t('routeMap.panel.connections', { count: legsFor(airport.code).length })}
          </span>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label={t('routeMap.panel.clear')}
              className="ms-auto flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-100 text-600 transition-colors hover:bg-200"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>
        <h3 className="m-0 text-2xl font-semibold text-secondary-2">
          {city}, {country}
        </h3>
        <p className="m-0 text-sm text-600">
          {t('routeMap.panel.airport', { code: airport.code })}
        </p>
        <p className="m-0 text-sm font-medium text-700">
          {t(`routeMap.airports.${airport.code}`)}
        </p>
      </div>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {links.map(({ id, icon: Icon, href }) => (
          <li key={id}>
            <LocalizedLink
              href={href}
              className="group flex items-center gap-3 rounded-lg border border-solid border-200 bg-background px-3 py-2.5 no-underline transition-colors hover:border-primary-1 hover:bg-100"
            >
              <Icon size={18} className="shrink-0 text-primary-1" />
              <span className="flex-1 text-sm font-semibold text-secondary-2">
                {t(`routeMap.panel.links.${id}`)}
              </span>
              <ArrowRight
                size={14}
                weight="bold"
                className="shrink-0 text-600 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default DestinationPanel
