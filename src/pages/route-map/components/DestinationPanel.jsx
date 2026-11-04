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
 * Destination card over the map.
 * - `focus` is the city the card describes (map click or To)
 * - `layout="stacked"`: image-first card used for map-pin clicks
 * - `layout="auto"`: horizontal on md+, stacked on mobile
 */
const DestinationPanel = ({
  from,
  to,
  focus: focusProp,
  onClear,
  cityImages = {},
  cityImageAlts = {},
  layout = 'auto',
}) => {
  const { t } = useTranslation()
  const focus = focusProp || to
  if (!focus) return null

  const city = t(`destinations.cities.${focus.cityKey}.name`)
  const image = cityImages?.[focus.cityKey] || ''
  const origin =
    from && from.code !== focus.code
      ? from
      : to && to.code !== focus.code
        ? to
        : firstPartner(focus.code)
  const duration = formatDuration(estimateDurationMinutes(focus, origin))
  const perWeek = weeklyFlights(focus.code)
  const originCity = origin ? t(`destinations.cities.${origin.cityKey}.name`) : ''
  const showRoute = origin && origin.code !== focus.code
  const thingsHref =
    focus.cityKey === 'damascus'
      ? '/our-destinations/things-to-do-in-damascus'
      : '/our-destinations/activities-and-attractions'

  const stacked = layout === 'stacked'
  const shellClass = stacked
    ? 'relative flex w-full flex-col overflow-hidden rounded-2xl bg-50 shadow-[0_12px_30px_rgba(1,38,59,0.18)]'
    : 'relative flex w-full flex-col overflow-hidden rounded-2xl bg-50 shadow-[0_12px_30px_rgba(1,38,59,0.18)] md:flex-row md:items-center md:gap-4 md:overflow-visible md:p-4'

  const imageClass = stacked
    ? 'relative h-44 w-full shrink-0 overflow-hidden bg-100'
    : 'relative h-40 w-full shrink-0 overflow-hidden bg-100 md:size-[5.5rem] md:rounded-xl'

  const closeClass = stacked
    ? 'absolute end-3 top-3 z-20 grid size-7 cursor-pointer place-items-center rounded-none border-0 bg-transparent p-0 text-50 drop-shadow'
    : 'absolute end-3 top-3 z-20 grid size-7 cursor-pointer place-items-center rounded-none border-0 bg-transparent p-0 text-50 drop-shadow md:end-2.5 md:top-2.5 md:text-secondary-2 md:drop-shadow-none'

  const facts = (
    <div
      className={`flex flex-wrap items-center gap-y-1.5 text-xs text-700 sm:text-sm ${
        stacked ? 'gap-x-0' : 'gap-x-3'
      }`}
    >
      <span className="inline-flex items-center gap-1.5 pe-2.5">
        <AirplaneTilt size={16} className="shrink-0 text-700" aria-hidden />
        {t('routeMap.panel.nonStop')}
      </span>
      {duration ? (
        <>
          {stacked ? <span className="px-1.5 text-400" aria-hidden>|</span> : null}
          <span className="inline-flex items-center gap-1.5 pe-2.5">
            <Clock size={16} className="shrink-0 text-700" aria-hidden />
            {t('routeMap.panel.duration', { time: duration })}
          </span>
        </>
      ) : null}
      {stacked ? <span className="px-1.5 text-400" aria-hidden>|</span> : null}
      <span className="inline-flex items-center gap-1.5">
        <CalendarBlank size={16} className="shrink-0 text-700" aria-hidden />
        {t('routeMap.panel.perWeek', { count: perWeek })}
      </span>
    </div>
  )

  return (
    <article className={shellClass}>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={t('routeMap.panel.clear')}
          className={closeClass}
        >
          <X size={stacked ? 18 : 16} weight="regular" />
        </button>
      ) : null}

      <div className={imageClass}>
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

      <div
        className={
          stacked
            ? 'flex min-w-0 flex-1 flex-col gap-3 p-4'
            : 'flex min-w-0 flex-1 flex-col gap-3 p-4 md:gap-2 md:p-0 md:pe-2'
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1 text-start">
            <h3 className="m-0 text-base font-bold leading-tight text-secondary-2 sm:text-lg">
              {city} <span className="font-semibold text-600">({focus.code})</span>
            </h3>
            {showRoute ? (
              <p className="m-0 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm leading-snug text-700">
                <span>{originCity}</span>
                <ArrowRight
                  size={14}
                  className="shrink-0 text-primary-1 rtl:rotate-180"
                  aria-hidden
                />
                <span>{city}</span>
              </p>
            ) : null}
          </div>

          {stacked && origin ? (
            <div className="shrink-0 self-start text-end leading-snug">
              <p className="m-0 text-sm font-semibold text-primary-1">
                {t('routeMap.panel.departingFrom', { code: origin.code })}
              </p>
            </div>
          ) : null}
        </div>

        {facts}

        <div className={`flex gap-2 ${stacked ? '' : 'md:hidden'}`}>
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

      {!stacked ? (
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
      ) : null}
    </article>
  )
}

export default DestinationPanel
