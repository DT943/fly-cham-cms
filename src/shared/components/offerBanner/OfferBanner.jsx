import { resolvePhosphorIcon } from '../../../cms/adapters/phosphorIcons.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getButtonStyle, getTextStyleVars } from '../../../styles/cmsStyle.js'
import LinkedText from '../backlinks/LinkedText.jsx'
import { getOfferVariant, resolveOfferStyle } from './offerBannerStyle.js'

/**
 * CMS offer banner (destination, one-way, round-trip, multi-city, baggage, seat, payment
 * option). Public mirror of flychamadmin cms2 OfferBannerPanel/OfferBannerVisual —
 * class names and sizes are kept byte-identical so both apps look the same.
 */

const cx = (...parts) => parts.filter(Boolean).join(' ')

// Keep byte-identical with cms2 OfferBanner/utils/style.js.
const HEIGHT_CLASS = {
  compact: 'md:min-h-[300px]',
  default: 'md:min-h-[380px]',
  tall: 'md:min-h-[460px]',
}
const RADIUS_CLASS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-[24px]',
}
const SECTION_PADDING_CLASS = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const TITLE_SIZE = 'text-[26px] leading-[1.15] md:text-[34px]'
const BODY_SIZE = 'text-sm leading-relaxed md:text-base'
const CODE_SIZE = 'text-[28px] leading-none md:text-[36px]'
const BUTTON_CLASS =
  'inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 px-6 text-base whitespace-nowrap transition-colors sm:w-auto'

const BUTTON_OPTS = {
  bgKey: 'buttonBg',
  bgFallback: 'secondary',
  textKey: 'buttonText',
  textFallback: 'secondary-2',
  weightFallback: 'semibold',
}

const mix = (token, amount) => `color-mix(in srgb, ${colorVar(token || 'secondary')} ${amount}%, transparent)`

const tone = (style, key, fallback, weight) => ({
  className: CMS_TEXT_HOVER_CLASS,
  style: getTextStyleVars(style, key, fallback, weight),
})

const getTones = (style) => ({
  code: tone(style, 'routeColor', '50', 'bold'),
  label: tone(style, 'labelColor', '300', 'medium'),
  value: tone(style, 'valueColor', '50', 'bold'),
})

function Endpoint({ code, city, tones, end = false }) {
  if (!code && !city) return null
  return (
    <div className={cx('flex shrink-0 flex-col gap-1', end && 'items-end text-end')}>
      {code ? <span className={cx(CODE_SIZE, tones.code.className)} style={tones.code.style}>{code}</span> : null}
      {city ? <span className={cx('text-sm', tones.label.className)} style={tones.label.style}>{city}</span> : null}
    </div>
  )
}

function RouteVisual({ content, style, roundTrip }) {
  const tones = getTones(style)
  const Icon = resolvePhosphorIcon(roundTrip ? 'ArrowsLeftRight' : 'AirplaneTilt')
  const line = (
    <span
      aria-hidden
      className="h-0 flex-1 border-0 border-t-2 border-dashed"
      style={{ borderColor: mix(style.accentColor, 60) }}
    />
  )
  return (
    <div className="flex w-full max-w-[520px] items-center gap-3 md:gap-5">
      <Endpoint code={content.originCode} city={content.originCity} tones={tones} />
      <div className="flex min-w-[72px] flex-1 flex-col items-center gap-2">
        {content.tripLabel ? (
          <span className={cx('text-[11px] uppercase tracking-[0.08em]', tones.label.className)} style={tones.label.style}>
            {content.tripLabel}
          </span>
        ) : null}
        <div className="flex w-full items-center gap-2">
          {line}
          <span
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: colorVar(style.accentColor), color: colorVar(style.cardBg) }}
          >
            <Icon size={20} weight="fill" aria-hidden className="rtl:-scale-x-100" />
          </span>
          {line}
        </div>
      </div>
      <Endpoint code={content.destinationCode} city={content.destinationCity} tones={tones} end />
    </div>
  )
}

function StopsVisual({ content, style }) {
  const tones = getTones(style)
  const stops = (content.stops || []).filter((stop) => stop?.code || stop?.city)
  if (!stops.length) return null
  const Plane = resolvePhosphorIcon('AirplaneTilt')
  return (
    <ol className="m-0 flex list-none flex-wrap items-center gap-x-3 gap-y-4 p-0">
      {stops.map((stop, index) => (
        <li key={stop.id || index} className="flex items-center gap-3">
          {index > 0 ? (
            <span className="flex items-center gap-1" aria-hidden>
              <span
                className="h-0 w-6 border-0 border-t-2 border-dashed md:w-10"
                style={{ borderColor: mix(style.accentColor, 60) }}
              />
              <Plane size={18} weight="fill" className="rtl:-scale-x-100" style={{ color: colorVar(style.accentColor) }} />
            </span>
          ) : null}
          <span className="flex flex-col gap-1 rounded-xl px-3 py-2" style={{ backgroundColor: mix(style.accentColor, 10) }}>
            {stop.code ? (
              <span className={cx('text-[22px] leading-none md:text-[26px]', tones.code.className)} style={tones.code.style}>
                {stop.code}
              </span>
            ) : null}
            {stop.city ? (
              <span className={cx('text-xs', tones.label.className)} style={tones.label.style}>{stop.city}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  )
}

function StatVisual({ content, style }) {
  const tones = getTones(style)
  const features = (content.features || []).filter((item) => item?.label)
  const accent = colorVar(style.accentColor)
  if (!content.statValue && !features.length) return null
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      {content.statValue ? (
        <div
          className="flex shrink-0 flex-col items-start justify-center gap-1 self-start rounded-2xl px-5 py-3"
          style={{ backgroundColor: accent }}
        >
          <span className={cx(CODE_SIZE, tones.value.className)} style={tones.value.style}>{content.statValue}</span>
          {content.statLabel ? (
            <span className={cx('text-xs opacity-80', tones.value.className)} style={{ ...tones.value.style, fontWeight: 500 }}>
              {content.statLabel}
            </span>
          ) : null}
        </div>
      ) : null}
      {features.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {features.map((item, index) => {
            const Icon = resolvePhosphorIcon(item.icon || 'Check')
            return (
              <li
                key={item.id || index}
                className="inline-flex items-center gap-2 rounded-full border border-solid px-3 py-1.5"
                style={{ borderColor: mix(style.accentColor, 45) }}
              >
                <Icon size={18} aria-hidden style={{ color: accent }} className="shrink-0" />
                <span className={cx('text-sm', tones.label.className)} style={tones.label.style}>{item.label}</span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

function OfferVisual({ visual, content, style }) {
  if (visual === 'route-oneway' || visual === 'route-return') {
    if (!content.originCode && !content.destinationCode) return null
    return <RouteVisual content={content} style={style} roundTrip={visual === 'route-return'} />
  }
  if (visual === 'stops') return <StopsVisual content={content} style={style} />
  return <StatVisual content={content} style={style} />
}

function OfferCopy({ variant, content, style }) {
  const linkProps = {
    links: content.links || [],
    enabled: style.showLinks !== false,
    linkColor: style.linkColor,
    linkHoverColor: style.linkHoverColor,
    linkFontWeight: style.linkFontWeight,
    linkUnderline: style.linkUnderline,
    linkItalic: style.linkItalic,
  }
  const title = tone(style, 'titleColor', '50', 'bold')
  const body = tone(style, 'descriptionColor', '200', 'normal')
  const badge = tone(style, 'badgeText', 'secondary-2', 'semibold')
  const label = tone(style, 'labelColor', '300', 'medium')
  const price = tone(style, 'priceColor', 'secondary', 'bold')
  const terms = tone(style, 'termsColor', '400', 'normal')
  const showPrice = style.showPrice !== false && Boolean(content.price)
  const showButton = style.showButton !== false && Boolean(content.ctaLabel)
  const btn = showButton ? getButtonStyle(style, BUTTON_OPTS) : null
  const CtaIcon = resolvePhosphorIcon(content.ctaIcon || 'ArrowRight')

  return (
    <div className="flex w-full flex-col gap-5">
      {style.showBadge !== false && content.badge ? (
        <span
          className={cx('inline-flex self-start rounded-full px-3 py-1 text-xs uppercase tracking-[0.08em]', badge.className)}
          style={{ ...badge.style, backgroundColor: colorVar(style.badgeBg) }}
        >
          {content.badge}
        </span>
      ) : null}

      <div className="flex flex-col gap-3">
        {content.title ? (
          <h2 className={cx('m-0', TITLE_SIZE, title.className)} style={title.style}>
            <LinkedText text={content.title} {...linkProps} />
          </h2>
        ) : null}
        {style.showDescription !== false && content.description ? (
          <p className={cx('m-0', BODY_SIZE, body.className)} style={body.style}>
            <LinkedText text={content.description} {...linkProps} />
          </p>
        ) : null}
      </div>

      {style.showVisual !== false ? (
        <OfferVisual visual={getOfferVariant(variant).visual} content={content} style={style} />
      ) : null}

      {showPrice || showButton ? (
        <div
          className="flex flex-col gap-4 border-0 border-t border-solid pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8"
          style={{ borderColor: mix(style.accentColor, 30) }}
        >
          {showPrice ? (
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 sm:flex-1">
              {content.pricePrefix ? (
                <span className={cx('text-sm', label.className)} style={label.style}>{content.pricePrefix}</span>
              ) : null}
              <span className={cx('text-[28px] leading-none md:text-[32px]', price.className)} style={price.style}>
                {content.price}
              </span>
              {content.priceNote ? (
                <span className={cx('w-full text-xs', label.className)} style={label.style}>{content.priceNote}</span>
              ) : null}
            </div>
          ) : null}
          {showButton ? (
            // Intentionally inert for now (no link / handler).
            <button
              type="button"
              className={cx(BUTTON_CLASS, btn.className)}
              // getButtonStyle doesn't set the Normal vars that .cms-text-hover paints.
              style={{ ...btn.style, '--cms-c': btn.style.color, '--cms-w': btn.style.fontWeight }}
            >
              <span>{content.ctaLabel}</span>
              {style.showButtonIcon !== false ? (
                <CtaIcon size={20} aria-hidden="true" className="shrink-0 rtl:-scale-x-100" />
              ) : null}
            </button>
          ) : null}
        </div>
      ) : null}

      {style.showTerms !== false && content.terms ? (
        <p className={cx('m-0 text-xs', terms.className)} style={terms.style}>{content.terms}</p>
      ) : null}
    </div>
  )
}

const OfferBanner = ({ variant = 'offer-one-way', content = {}, style: rawStyle = {} }) => {
  if (!content.title && !content.description && !content.imageUrl) return null

  const style = resolveOfferStyle(variant, rawStyle)
  const radiusClass = RADIUS_CLASS[style.cardRadius] || RADIUS_CLASS['3xl']
  const heightClass = HEIGHT_CLASS[style.height] || HEIGHT_CLASS.default
  const imageStart = style.imageSide === 'left'
  const src = content.imageUrl || ''
  const cardBg = colorVar(style.cardBg)
  const cardStyle = {
    backgroundColor: cardBg,
    ...(style.showCardBorder ? { border: `1px solid ${colorVar('200')}` } : {}),
  }
  const copy = <OfferCopy variant={variant} content={content} style={style} />

  const card =
    style.layout === 'overlay' ? (
      <article className={cx('relative isolate flex w-full overflow-hidden', radiusClass, heightClass)} style={cardStyle}>
        {src ? (
          <img src={src} alt={content.imageAlt || ''} className="absolute inset-0 -z-[1] h-full w-full object-cover" />
        ) : null}
        <div aria-hidden className="absolute inset-0 -z-[1] md:hidden" style={{ backgroundColor: mix(style.cardBg, 82) }} />
        <div
          aria-hidden
          className="absolute inset-0 -z-[1] hidden md:block rtl:scale-x-[-1]"
          style={{
            backgroundImage: `linear-gradient(${imageStart ? 'to left' : 'to right'}, ${cardBg} 0%, ${mix(style.cardBg, 88)} 38%, ${mix(style.cardBg, 35)} 68%, transparent 92%)`,
          }}
        />
        <div className={cx('flex w-full max-w-[600px] flex-col justify-center px-6 py-8 md:px-12 md:py-12', imageStart && 'ms-auto')}>
          {copy}
        </div>
      </article>
    ) : (
      <article
        className={cx(
          'relative isolate flex w-full flex-col overflow-hidden lg:flex-row',
          imageStart && 'lg:flex-row-reverse',
          radiusClass,
          heightClass,
        )}
        style={cardStyle}
      >
        <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-12 md:py-12">{copy}</div>
        {src ? (
          <div className="relative order-first h-[220px] w-full shrink-0 sm:h-[280px] lg:order-none lg:h-auto lg:w-[46%]">
            <img src={src} alt={content.imageAlt || ''} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        ) : null}
      </article>
    )

  const sectionClass = SECTION_PADDING_CLASS[style.sectionPadding] ?? SECTION_PADDING_CLASS.default
  if (!sectionClass && !style.showSectionBg) return card
  return (
    <div
      className={cx(sectionClass, style.showSectionBg && 'rounded-2xl px-4 md:px-6')}
      style={style.showSectionBg ? { backgroundColor: colorVar(style.sectionBg) } : undefined}
    >
      {card}
    </div>
  )
}

export default OfferBanner
