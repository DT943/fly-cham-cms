import { AirplaneTilt, CalendarBlank, Clock, Star, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import {
  destinationImageByCity,
  estimateDurationMinutes,
  firstPartner,
  formatDuration,
  weeklyFlights,
} from '../utils/routeFacts.js'

/**
 * The destination card from the reference: a photo header, the city with its
 * country and IATA code, the key flight facts, and a single schedule link.
 * `focus` is the end being travelled to (falling back to the chosen origin).
 */
const DestinationPanel = ({ from, to, onClear }) => {
  const { t } = useTranslation()
  const focus = to || from
  if (!focus) return null

  const city = t(`destinations.cities.${focus.cityKey}.name`)
  const country = t(`destinations.countries.${focus.countryKey}`)
  const image = destinationImageByCity[focus.cityKey]

  // Duration is for the chosen leg when both ends are set, else a representative
  // flight from the airport's first route partner.
  const origin = from && to && from.code !== to.code ? from : firstPartner(focus.code)
  const duration = formatDuration(estimateDurationMinutes(focus, origin))
  const perWeek = weeklyFlights(focus.code)

  return (
    <article className="w-full max-w-80 overflow-hidden rounded-2xl bg-50 shadow-[0_12px_30px_rgba(1,38,59,0.2)]">
      <div className="relative h-44">
        {image ? (
          <img src={image} alt={`${city}, ${country}`} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary-1 to-secondary-2 text-3xl font-semibold text-50">
            {focus.code}
          </div>
        )}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label={t('routeMap.panel.clear')}
            className="absolute end-3 top-3 grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-background/85 text-secondary-2 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-600">{country}</span>
            {focus.isNew && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-2">
                <Star size={12} weight="fill" className="text-secondary-900" />
                {t('routeMap.panel.new')}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="m-0 text-xl font-semibold text-secondary-2">{city}</h3>
            <span className="rounded-md bg-100 px-2 py-0.5 text-xs font-semibold uppercase text-600">
              {focus.code}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-700">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <AirplaneTilt size={16} className="shrink-0 text-primary-1" />
              {t('routeMap.panel.nonStop')}
            </span>
            {duration && (
              <>
                <span className="h-3 w-px bg-200" aria-hidden />
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={16} className="shrink-0 text-primary-1" />
                  {t('routeMap.panel.duration', { time: duration })}
                </span>
              </>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5">
            <CalendarBlank size={16} className="shrink-0 text-primary-1" />
            {t('routeMap.panel.perWeek', { count: perWeek })}
          </span>
        </div>

        <LocalizedLink
          href="/our-destinations"
          className="text-sm font-semibold text-primary-1 no-underline hover:underline"
        >
          {t('routeMap.panel.links.schedule')}
        </LocalizedLink>
      </div>
    </article>
  )
}

export default DestinationPanel
