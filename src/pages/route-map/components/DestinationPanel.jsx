import { AirplaneTilt, ArrowRight, CalendarBlank, Clock, X } from '@phosphor-icons/react'
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
 * schedule / things-to-do actions, and a close control.
 * Mobile uses a stacked image-first layout; md+ keeps the horizontal card.
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
  const fromCity = from ? t(`destinations.cities.${from.cityKey}.name`) : ''
  const toCity = to ? t(`destinations.cities.${to.cityKey}.name`) : city
  const thingsHref =
    focus.cityKey === 'damascus'
      ? '/our-destinations/things-to-do-in-damascus'
      : '/our-destinations/activities-and-attractions'

  return (
    <article className="relative flex w-full max-w-[min(100%,52rem)] flex-col overflow-hidden rounded-2xl bg-50 shadow-[0_12px_30px_rgba(1,38,59,0.18)] md:flex-row md:items-center md:gap-4 md:overflow-visible md:p-4">
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={t('routeMap.panel.clear')}
          className="absolute end-3 top-3 z-20 grid size-7 cursor-pointer place-items-center rounded-none border-0 bg-transparent p-0 text-50 drop-shadow md:end-2.5 md:top-2.5 md:text-secondary-2 md:drop-shadow-none"
        >
          <X size={18} weight="regular" className="md:hidden" />
          <X size={16} weight="regular" className="hidden md:block" />
        </button>
      ) : null}

      <div className="relative h-40 w-full shrink-0 overflow-hidden bg-100 md:size-[5.5rem] md:rounded-xl">
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

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 md:gap-2 md:p-0 md:pe-2">
        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-base font-bold text-secondary-2 sm:text-lg">
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

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-secondary-2 sm:text-sm">
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

        <div className="flex gap-2 md:hidden">
          <LocalizedLink
            href="/flight-schedule"
            className="inline-flex min-w-0 flex-1 items-center justify-center rounded-lg border-0 bg-primary-1 px-3 py-2.5 text-center text-sm font-medium text-50 no-underline transition-colors hover:bg-primary-1/90"
          >
            {t('routeMap.panel.links.scheduleShort')}
          </LocalizedLink>
          <LocalizedLink
            href={thingsHref}
            className="inline-flex min-w-0 flex-1 items-center justify-center rounded-lg border border-solid border-primary-1 bg-transparent px-3 py-2.5 text-center text-sm font-medium text-primary-1 no-underline transition-colors hover:bg-primary-1 hover:text-50"
          >
            {t('routeMap.panel.links.thingsToDo')}
          </LocalizedLink>
        </div>
      </div>

      <div className="hidden shrink-0 flex-col gap-2 pe-6 md:flex md:min-w-44 md:pt-1">
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
