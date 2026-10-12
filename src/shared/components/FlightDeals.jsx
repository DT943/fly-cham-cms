import { useMemo, useState } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import DealCard from './deals/DealCard.jsx'
import DealsCarousel from './deals/DealsCarousel.jsx'
import DealsDropdown from './deals/DealsDropdown.jsx'
import { DEAL_CARD_WIDTH, SECTION_PADDING_CLASS } from './deals/dealsStyle.js'

// Figma: title 22px (mobile) / 28px; origin 18px underlined (mobile) / 24px.
const TITLE_SIZE = 'text-[22px] leading-[normal] lg:text-[28px]'
const ORIGIN_SIZE = 'text-[18px] leading-[normal] underline lg:text-[24px] lg:no-underline'

/** "Round trip | Economy From" for one deal, from the section labels. */
const buildFareText = (deal, content) => {
  const trip = deal.tripType === 'one-way' ? content.oneWayFareLabel : content.roundTripFareLabel
  const cabin = deal.cabin === 'business' ? content.businessLabel : content.economyLabel
  const head = [trip, cabin].filter(Boolean).join(' | ')
  return [head, content.fromLabel].filter(Boolean).join(' ')
}

/**
 * CMS "flight-deals" block (Figma 40951:24297 / mobile 40954:91306): header
 * with origin city picker, Round-trip/One-way toggle, Class picker, and the
 * deal cards row. Cards are filtered by the chosen origin, trip type and class
 * (a hidden picker stops filtering by it). Mirrors cms2 FlightDealsPanel.
 */
const FlightDeals = ({ content, style = {}, lang = 'en' }) => {
  const origins = (content?.origins || []).filter((origin) => origin.id && origin.label)
  const allDeals = content?.deals || []
  const [originChoice, setOriginChoice] = useState('')
  const [tripType, setTripType] = useState('round-trip')
  const [cabin, setCabin] = useState('economy')

  const showOrigin = style.showOriginPicker !== false && origins.length > 0
  const showTrip = style.showTripToggle !== false
  const showClass = style.showClassPicker !== false
  const origin = origins.some((item) => item.id === originChoice) ? originChoice : origins[0]?.id || ''
  const originLabel = origins.find((item) => item.id === origin)?.label || ''

  const deals = useMemo(
    () =>
      allDeals.filter(
        (deal) =>
          (!showOrigin || !deal.origin || deal.origin === origin) &&
          (!showTrip || deal.tripType === tripType) &&
          (!showClass || deal.cabin === cabin),
      ),
    [allDeals, showOrigin, origin, showTrip, tripType, showClass, cabin],
  )

  if (!content?.title && !allDeals.length) return null

  const linkProps = {
    links: content.links || [],
    enabled: style.showLinks !== false,
    linkColor: style.linkColor,
    linkHoverColor: style.linkHoverColor,
    linkFontWeight: style.linkFontWeight,
    linkUnderline: style.linkUnderline,
    linkItalic: style.linkItalic,
  }
  const filterBg = colorVar(style.filterBg || 'white')
  const cabinLabel = cabin === 'business' ? content.businessLabel : content.economyLabel
  const mobileLayout = style.mobileLayout === 'stack' ? 'stack' : 'carousel'
  const tripOptions = [
    { value: 'round-trip', label: content.roundTripLabel },
    { value: 'one-way', label: content.oneWayLabel },
  ]
  const cabinOptions = [
    { value: 'economy', label: content.economyLabel },
    { value: 'business', label: content.businessLabel },
  ]

  return (
    <section
      className={SECTION_PADDING_CLASS[style.sectionPadding] || ''}
      style={style.showSectionBg ? { backgroundColor: colorVar(style.sectionBg || '100') } : undefined}
    >
      <div className="flex flex-col gap-5 lg:gap-[25px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-[25px]">
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            {content.title ? (
              <h2
                className={`m-0 ${TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(style, 'titleColor', '700', 'semibold')}
              >
                <LinkedText text={content.title} {...linkProps} />
              </h2>
            ) : null}
            {showOrigin ? (
              <DealsDropdown
                label={originLabel}
                options={origins.map((item) => ({ value: item.id, label: item.label }))}
                value={origin}
                onChange={setOriginChoice}
                menuClassName="end-0 lg:end-auto lg:start-0"
                buttonClassName="inline-flex items-center gap-1 bg-transparent p-0.5 lg:gap-4 lg:p-0"
              >
                <span
                  className={`${ORIGIN_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(style, 'originColor', 'primary-1', 'semibold')}
                >
                  {originLabel}
                </span>
                <CaretDownIcon
                  size={16}
                  aria-hidden
                  className="shrink-0"
                  style={{ color: colorVar(style.originColor || 'primary-1') }}
                />
              </DealsDropdown>
            ) : null}
          </div>

          {showTrip || showClass ? (
            <div className="flex flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:justify-end">
              {showTrip ? (
                <div
                  role="radiogroup"
                  className="flex h-14 w-full items-center gap-1 rounded-lg p-1 lg:h-[58px] lg:w-[280px] lg:shrink-0 lg:gap-0 lg:rounded-[12px] lg:px-3 lg:py-0"
                  style={{ backgroundColor: filterBg }}
                >
                  {tripOptions.map((option) => {
                    const active = option.value === tripType
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setTripType(option.value)}
                        className="flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-[6px] border-0 px-2 text-xs leading-[normal] transition-colors lg:h-[47px] lg:rounded-lg lg:text-base"
                        style={
                          active
                            ? {
                                backgroundColor: colorVar(style.toggleActiveBg || 'primary-1'),
                                color: colorVar(style.toggleActiveText || 'white'),
                                fontWeight: 600,
                              }
                            : {
                                backgroundColor: 'transparent',
                                color: colorVar(style.toggleText || 'primary-1'),
                                fontWeight: 500,
                              }
                        }
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              ) : null}
              {showClass ? (
                <DealsDropdown
                  label={content.classLabel}
                  options={cabinOptions}
                  value={cabin}
                  onChange={setCabin}
                  className="w-full lg:w-[259px] lg:shrink-0"
                  menuClassName="start-0 end-0"
                  buttonClassName="flex h-14 w-full items-center justify-between gap-3 rounded-lg p-[10px] text-start lg:h-[58px] lg:rounded-[12px] lg:px-4 lg:py-0"
                  buttonStyle={{ backgroundColor: filterBg }}
                >
                  <span className="flex flex-col gap-[3px] leading-[normal] lg:gap-[6px]">
                    <span
                      className={`text-[11px] lg:text-base ${CMS_TEXT_HOVER_CLASS}`}
                      style={getTextStyleVars(style, 'labelColor', '600', 'normal')}
                    >
                      {content.classLabel}
                    </span>
                    <span
                      className={`text-[13px] lg:text-base ${CMS_TEXT_HOVER_CLASS}`}
                      style={getTextStyleVars(style, 'valueColor', '700', 'medium')}
                    >
                      {cabinLabel}
                    </span>
                  </span>
                  <CaretDownIcon
                    size={16}
                    aria-hidden
                    className="shrink-0"
                    style={{ color: colorVar(style.caretColor || '800') }}
                  />
                </DealsDropdown>
              ) : null}
            </div>
          ) : null}
        </div>

        {deals.length ? (
          <DealsCarousel
            count={deals.length}
            mobileLayout={mobileLayout}
            showArrows={style.showArrows !== false}
            showDots={style.showDots !== false}
            arrowColor={style.arrowColor}
            dotColor={style.dotColor}
            resetKey={`${origin}|${tripType}|${cabin}`}
          >
            {deals.map((deal, index) => (
              <DealCard
                key={deal.id || index}
                variant="flight"
                deal={deal}
                fareText={buildFareText(deal, content)}
                buttonLabel={content.buttonLabel}
                lang={lang}
                textStyle={style}
                linkProps={linkProps}
                widthClass={DEAL_CARD_WIDTH[mobileLayout]}
                badgeBgFallback="secondary-100"
                badgeTextFallback="700"
              />
            ))}
          </DealsCarousel>
        ) : content.emptyLabel ? (
          <p
            className="m-0 rounded-[10px] px-6 py-10 text-center text-sm leading-[1.6]"
            style={{ backgroundColor: colorVar(style.cardBg || 'white'), color: colorVar('600') }}
          >
            {content.emptyLabel}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default FlightDeals
