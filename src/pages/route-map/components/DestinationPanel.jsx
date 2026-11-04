import { AirplaneTilt, CalendarBlank, Clock, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import {
  estimateDurationMinutes,
  firstPartner,
  formatDuration,
  weeklyFlights,
} from '../utils/routeFacts.js'

/**
 * Selected-destination card over the map: thumbnail, city/code, flight facts,
 * schedule / things-to-do actions, and a corner close control.
 */
const DestinationPanel = ({ from, to, onClear, cityImages = {}, cityImageAlts = {} }) => {
  const { t } = useTranslation()
  const focus = to || from
  if (!focus) return null

  const city = t(`destinations.cities.${focus.cityKey}.name`)
  const image = cityImages?.[focus.cityKey] || ''
  const origin = from && to && from.code !== to.code ? from : firstPartner(focus.code)
  const duration = formatDuration(estimateDurationMinutes(focus, origin))
  const perWeek = weeklyFlights(focus.code)
  const thingsHref =
    focus.cityKey === 'damascus'
      ? '/our-destinations/things-to-do-in-damascus'
      : '/our-destinations/activities-and-attractions'

  return (
    <article className="relative flex w-full max-w-[min(100%,52rem)] flex-col gap-3 rounded-2xl bg-50 p-3 shadow-[0_12px_30px_rgba(1,38,59,0.18)] sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={t('routeMap.panel.clear')}
          className="absolute end-2.5 top-2.5 z-20 grid size-6 cursor-pointer place-items-center rounded-none border-0 bg-transparent p-0 text-secondary-2 transition-opacity hover:opacity-70"
        >
          <X size={16} weight="regular" />
        </button>
      ) : null}

      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-100 sm:size-[5.5rem]">
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

      <div className="flex min-w-0 flex-1 flex-col gap-2 pe-2">
        <h3 className="m-0 text-base font-bold text-secondary-2 sm:text-lg">
          {city} ({focus.code})
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-secondary-2 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <AirplaneTilt size={16} className="shrink-0 text-secondary-2" aria-hidden />
            {t('routeMap.panel.nonStop')}
          </span>
          {duration ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={16} className="shrink-0 text-secondary-2" aria-hidden />
              {t('routeMap.panel.duration', { time: duration })}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <CalendarBlank size={16} className="shrink-0 text-secondary-2" aria-hidden />
            {t('routeMap.panel.perWeek', { count: perWeek })}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 pe-6 sm:min-w-44 sm:pt-1">
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
