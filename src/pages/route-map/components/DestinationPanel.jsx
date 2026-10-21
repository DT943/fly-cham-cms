import { CircleNotch, Star } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

/**
 * Compact destination card: a photo header, the city with its country and IATA
 * code, and the actions — Find Flights (primary, once both ends are chosen) and
 * View Flight Schedule (outline). `focus` is the end being travelled to
 * (falling back to the chosen origin).
 *
 * `cityImages` maps a cityKey to its photo URL (from the CMS route-map-explorer
 * block). A city without a photo renders the branded fallback header.
 */
const DestinationPanel = ({
  from,
  to,
  onFindFlights,
  findingFlights = false,
  cityImages = {},
  // cityKey → the photo's media-library alt.
  cityImageAlts = {},
}) => {
  const { t } = useTranslation()
  const focus = to || from
  if (!focus) return null

  const city = t(`destinations.cities.${focus.cityKey}.name`)
  const country = t(`destinations.countries.${focus.countryKey}`)
  const image = cityImages?.[focus.cityKey] || ''

  return (
    <article className="w-full max-w-[320px] overflow-hidden rounded-2xl bg-50">
      <div className="relative h-65">
        {image ? (
          <img loading="lazy" decoding="async" src={image} alt={cityImageAlts?.[focus.cityKey] || `${city}, ${country}`} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary-1 to-secondary-2 text-3xl font-semibold text-50">
            {focus.code}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-700">{country}</span>
            {focus.isNew && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-2">
                <Star size={12} weight="fill" className="text-secondary-900" />
                {t('routeMap.panel.new')}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="m-0 text-lg font-semibold text-secondary-2">{city}</h3>
            <span className="rounded-md bg-secondary-1 px-2 py-1 text-xs font-medium uppercase text-50">
              {focus.code}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {from && to && (
            <button
              type="button"
              onClick={onFindFlights}
              disabled={findingFlights}
              aria-busy={findingFlights}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-primary-1 px-5 py-2 text-sm font-medium text-50 transition-colors hover:bg-primary-1/90 disabled:cursor-wait disabled:opacity-90"
            >
              {findingFlights && (
                <CircleNotch size={16} className="animate-spin shrink-0" aria-hidden />
              )}
              {t('routeMap.search.findFlights')}
            </button>
          )}
          <LocalizedLink
            href="/our-destinations"
            className="w-full rounded-lg border border-solid border-primary-1 bg-transparent px-5 py-2 text-center text-sm font-medium text-primary-1 no-underline transition-colors hover:bg-primary-1 hover:text-50"
          >
            {t('routeMap.panel.links.schedule')}
          </LocalizedLink>
        </div>
      </div>
    </article>
  )
}

export default DestinationPanel
