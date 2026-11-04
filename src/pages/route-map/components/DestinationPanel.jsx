import {
  AirplaneTilt,
  ArrowRight,
  CalendarBlank,
  Clock,
  X,
} from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import {
  estimateDurationMinutes,
  firstPartner,
  formatDuration,
  weeklyFlights,
} from '../utils/routeFacts.js'

/**
 * Selected-destination card over the map: thumbnail, city/code, route line,
 * flight facts, and schedule / things-to-do actions. `focus` is the end being
 * travelled to (falling back to the chosen origin).
 */
const DestinationPanel = ({
  from,
  to,
  onClear,
  cityImages = {},
  cityImageAlts = {},
}) => {
  const { t } = useTranslation()
  const focus = to || from
  if (!focus) return null

  const city = t(`destinations.cities.${focus.cityKey}.name`)
  const image = cityImages?.[focus.cityKey] || ''
  const origin = from && to && from.code !== to.code ? from : firstPartner(focus.code)
  const duration = formatDuration(estimateDurationMinutes(focus, origin))
  const perWeek = weeklyFlights(focus.code)
  const fromCity = from ? t(`destinations.cities.${from.cityKey}.name`) : ''
  const toCity = to ? t(`destinations.cities.${to.cityKey}.name`) : city
  const thingsHref =
    focus.cityKey === 'damascus'
      ? '/our-destinations/things-to-do-in-damascus'
      : '/our-destinations/activities-and-attractions'

  return (
    <article className="relative flex w-full max-w-[min(100%,52rem)] flex-col gap-3 rounded-2xl border border-solid border-200 bg-50 p-3 shadow-[0_12px_30px_rgba(1,38,59,0.16)] sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={t('routeMap.panel.clear')}
          className="absolute end-2 top-2 grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-600 transition-colors hover:bg-100 hover:text-secondary-2"
        >
          <X size={16} weight="bold" />
        </button>
      )}

      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-100 sm:size-24">
        {image ? (
          <img
            loading="lazy"
            decoding="async"
            src={image}
            alt={cityImageAlts?.[focus.cityKey] || city}
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-primary-1 to-secondary-2 text-lg font-semibold text-50">
            {focus.code}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pe-8 sm:pe-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="m-0 text-base font-semibold text-secondary-2 sm:text-lg">
            {city} ({focus.code})
          </h3>
          {from && to ? (
            <p className="m-0 flex items-center gap-1.5 text-sm text-700">
              <span>{fromCity}</span>
              <ArrowRight size={14} className="shrink-0 text-primary-1 rtl:rotate-180" aria-hidden />
              <span>{toCity}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-700 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <AirplaneTilt size={16} className="shrink-0 text-primary-1" aria-hidden />
            {t('routeMap.panel.nonStop')}
          </span>
          {duration ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={16} className="shrink-0 text-primary-1" aria-hidden />
              {t('routeMap.panel.duration', { time: duration })}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <CalendarBlank size={16} className="shrink-0 text-primary-1" aria-hidden />
            {t('routeMap.panel.perWeek', { count: perWeek })}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:min-w-44">
        <LocalizedLink
          href="/flight-schedule"
          className="inline-flex w-full items-center justify-center rounded-lg border-0 bg-primary-1 px-4 py-2.5 text-center text-sm font-medium text-50 no-underline transition-colors hover:bg-primary-1/90"
        >
          {t('routeMap.panel.links.schedule')}
        </LocalizedLink>
        <LocalizedLink
          href={thingsHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-solid border-primary-1 bg-transparent px-4 py-2.5 text-center text-sm font-medium text-primary-1 no-underline transition-colors hover:bg-primary-1 hover:text-50"
        >
          {t('routeMap.panel.links.thingsToDo')}
        </LocalizedLink>
      </div>
    </article>
  )
}

export default DestinationPanel
