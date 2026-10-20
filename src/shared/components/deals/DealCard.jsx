import { Fragment } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../../styles/cmsStyle.js'
import LocalizedLink from '../LocalizedLink.jsx'
import { trackDealSelected } from '../../analytics/cmsEvents.js'
import LinkedText from '../backlinks/LinkedText.jsx'
import DealBadge from './DealBadge.jsx'
import {
  DEAL_BODY_CLASS,
  DEAL_BUTTON,
  DEAL_BUTTON_HEIGHT,
  DEAL_DATES_CLASS,
  DEAL_FARE_CLASS,
  DEAL_PRICE_CLASS,
  DEAL_ROUTES_CLASS,
  DEAL_TITLE_CLASS,
} from './dealsStyle.js'

/** "DAM → DXB / DAM → SHJ" — each pair stays left-to-right (IATA codes). */
const DealRoutes = ({ routes, textStyle }) => {
  const rows = routes.filter((route) => route?.from || route?.to)
  if (!rows.length) return null
  return (
    <div
      className={`flex flex-wrap items-center gap-x-[10px] gap-y-1 ${DEAL_ROUTES_CLASS} ${CMS_TEXT_HOVER_CLASS}`}
      style={getTextStyleVars(textStyle, 'routeColor', '700', 'medium')}
    >
      {rows.map((route, index) => (
        <Fragment key={index}>
          {index > 0 ? <span aria-hidden>/</span> : null}
          <span dir="ltr" className="inline-flex items-center gap-0.5">
            <span>{route.from}</span>
            <ArrowRightIcon aria-hidden className="size-3 shrink-0 lg:size-4" />
            <span>{route.to}</span>
          </span>
        </Fragment>
      ))}
    </div>
  )
}

/**
 * One Offers & Deals card: photo (+ tag), title, optional routes, fare line
 * with price, optional dates, and the "Book now" button. Mirrors cms2
 * shared/deals/DealCard. `variant` "flight" | "service".
 */
const DealCard = ({
  variant = 'flight',
  deal,
  fareText = '',
  buttonLabel = '',
  endsInLabel = '',
  lang = 'en',
  textStyle,
  linkProps,
  widthClass = '',
  badgeBgFallback,
  badgeTextFallback,
}) => {
  const btn = getButtonStyle(textStyle, DEAL_BUTTON)
  const showButton = textStyle.showButton !== false && Boolean(buttonLabel)

  return (
    <article
      data-deal-card
      className={`flex shrink-0 snap-start flex-col overflow-hidden rounded-[10px] lg:rounded-[9.335px] ${widthClass}`}
      style={{ backgroundColor: colorVar(textStyle.cardBg || 'white') }}
    >
      <div className="relative h-[260px] w-full shrink-0 overflow-hidden lg:h-[340px]">
        {deal.imageUrl ? (
          <img
            src={deal.imageUrl}
            alt={deal.imageAlt || ''}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <span aria-hidden className="absolute inset-0" style={{ backgroundColor: colorVar('200') }} />
        )}
        {textStyle.showBadge !== false ? (
          <DealBadge
            variant={variant}
            badge={deal.badge}
            endsAt={deal.endsAt}
            endsInLabel={endsInLabel}
            lang={lang}
            textStyle={textStyle}
            bgFallback={badgeBgFallback}
            textFallback={badgeTextFallback}
          />
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col gap-3 lg:gap-6 ${DEAL_BODY_CLASS[variant] || DEAL_BODY_CLASS.flight}`}>
        <div className="flex flex-col gap-3">
          {deal.title ? (
            <h3
              className={`m-0 ${DEAL_TITLE_CLASS[variant] || DEAL_TITLE_CLASS.flight} ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
            >
              <LinkedText text={deal.title} {...linkProps} />
            </h3>
          ) : null}
          {variant === 'service' && Array.isArray(deal.routes) ? (
            <DealRoutes routes={deal.routes} textStyle={textStyle} />
          ) : null}
          {fareText || deal.price ? (
            <p
              className={`m-0 ${DEAL_FARE_CLASS} ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(textStyle, 'fareColor', '700', 'medium')}
            >
              {fareText ? <LinkedText text={fareText} {...linkProps} /> : null}
              {fareText && deal.price ? ' ' : null}
              {deal.price ? (
                <span
                  dir="auto"
                  className={`${DEAL_PRICE_CLASS} ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(textStyle, 'priceColor', '700', 'medium')}
                >
                  {deal.price}
                </span>
              ) : null}
            </p>
          ) : null}
          {variant === 'flight' && deal.dates && textStyle.showDates !== false ? (
            <p
              className={`m-0 ${DEAL_DATES_CLASS} ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(textStyle, 'datesColor', '700', 'normal')}
            >
              {deal.dates}
            </p>
          ) : null}
        </div>
        {showButton ? (
          <LocalizedLink
            href={deal.href || '#'}
            onClick={() => trackDealSelected(deal, fareText)}
            className={`mt-auto inline-flex w-full items-center justify-center rounded-lg px-[26px] py-3 text-base leading-[normal] no-underline transition-colors ${DEAL_BUTTON_HEIGHT[variant] || DEAL_BUTTON_HEIGHT.flight} ${btn.className}`}
            style={btn.style}
          >
            {buttonLabel}
          </LocalizedLink>
        ) : null}
      </div>
    </article>
  )
}

export default DealCard
