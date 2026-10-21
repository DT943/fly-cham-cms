import { useEffect, useRef, useState } from 'react'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons'
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  ShoppingCart,
  PersonSimpleWalk,
  Binoculars,
  Buildings,
  GlobeHemisphereWest,
  MapPin,
  Camera,
  ForkKnife,
  Mountains,
  Storefront,
} from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getButtonStyle, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import useDestinationCategories from '../../cms/useDestinationCategories.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const ICON_BY_NAME = {
  shoppingCart: ShoppingCart,
  walk: PersonSimpleWalk,
  binoculars: Binoculars,
  buildings: Buildings,
  globe: GlobeHemisphereWest,
  mapPin: MapPin,
  camera: Camera,
  food: ForkKnife,
  mountains: Mountains,
  storefront: Storefront,
}

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const CARD_GAP = {
  tight: 'gap-4 lg:gap-6',
  default: 'gap-6 lg:gap-9',
  loose: 'gap-8 lg:gap-12',
}

// Widths that keep 1 / 2 / 3 cards in view, matching CARD_GAP at each breakpoint.
const CAROUSEL_BASIS = {
  tight: 'w-full sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/3)]',
  default: 'w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/3)]',
  loose: 'w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-6rem)/3)]',
}

const CARD_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

const CAROUSEL_ARROW =
  'absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-solid shadow-[0_2px_10px_rgba(33,37,41,0.12)] transition-colors [color:var(--ttd-arrow)] hover:[color:var(--ttd-arrow-h)] disabled:pointer-events-none disabled:opacity-40 md:grid'

/**
 * Things-to-do image cards for a destination (heading + grid + CTA). Every card
 * is a full-bleed photo with a bottom wash, a badge pill (label + icon), a title
 * and an optional description. CMS-driven: colours/weights/hover, columns, gap,
 * radius and the wash are all controllable, with defaults matching the source.
 */
const DestinationThingsToDo = ({
  title = '',
  subtitle = '',
  cta = '',
  ctaHref = '',
  learnMore = '',
  items = [],
  showHeader = true,
  showSubtitle = true,
  showCta = true,
  hideCardDescription = true,
  showCardButton = true,
  arrowBadgeBg = '50',
  arrowBadgeBgHover,
  arrowColor = 'primary-1',
  carouselArrowBg = '50',
  carouselArrowColor = '600',
  carouselArrowBorder = '200',
  carouselArrowHover = 'primary-1',
  columns = 3,
  cardGap = 'default',
  cardRadius = 'lg',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  overlayColor = 'secondary-2',
  badgeBorderColor = '50',
  buttonBg = 'secondary',
  buttonHoverBg,
  buttonText = 'btn',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const language = useCurrentLanguage()
  const shared = useDestinationCategories(language)
  const badgeLabel = (item) => {
    if (shared.status !== 'ready') return item.badge
    const match = shared.categories.find((category) => category.id && category.id === item.badgeId)
    return match?.label || item.badge
  }
  const scrollerRef = useRef(null)
  const isCarousel = items.length > 3
  const [canScroll, setCanScroll] = useState({ prev: false, next: isCarousel })

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      const left = Math.abs(el.scrollLeft)
      setCanScroll({ prev: left > 2, next: max - left > 2 })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [items.length, isCarousel])

  if (!items.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const colKey = String(columns)
  const gapClass = CARD_GAP[cardGap] || CARD_GAP.default
  const radiusClass = CARD_RADIUS[cardRadius] || CARD_RADIUS.lg
  const overlay = colorVar(overlayColor)
  const headerVisible = showHeader && (title || (showSubtitle && subtitle))
  const ctaVisible = showCta && Boolean(cta)
  const btn = getButtonStyle(
    { buttonBg, buttonHoverBg, buttonText, buttonTextFontWeight, buttonTextHover, buttonTextFontWeightHover },
    {
      bgKey: 'buttonBg',
      bgHoverKey: 'buttonHoverBg',
      bgFallback: 'secondary',
      textKey: 'buttonText',
      textFallback: 'btn',
      weightFallback: 'semibold',
    },
  )

  const scrollByCard = (direction) => {
    const el = scrollerRef.current
    const card = el?.querySelector('[data-ttd-card]')
    if (!el || !card) return
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0
    const amount = card.getBoundingClientRect().width + gap
    const rtl = el.closest('[dir]')?.getAttribute('dir') === 'rtl'
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * amount, behavior: 'smooth' })
  }

  const carouselArrowStyle = {
    backgroundColor: colorVar(carouselArrowBg),
    borderColor: colorVar(carouselArrowBorder),
    '--ttd-arrow': colorVar(carouselArrowColor),
    '--ttd-arrow-h': colorVar(carouselArrowHover),
  }

  const inner = (
    <section className="flex flex-col gap-6 lg:gap-8">
      {headerVisible ? (
        <div className="flex flex-col gap-2">
          {title ? (
            <h2
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {showSubtitle && subtitle ? (
            <p
              className={cx(typography.sectionDescription, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'subtitleColor', '800', 'normal')}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="relative min-w-0">
        <div
          ref={isCarousel ? scrollerRef : undefined}
          className={cx(
            isCarousel
              ? 'flex flex-nowrap snap-x snap-mandatory overflow-x-auto scroll-smooth motion-reduce:scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : 'grid',
            isCarousel ? '' : COLUMNS[colKey] || COLUMNS[3],
            gapClass,
          )}
        >
        {items.map((item, index) => {
          const src = item.image
          const BadgeIcon = ICON_BY_NAME[item.icon] || resolvePhosphorIcon(item.icon)
          return (
            <article
              key={item.id || index}
              data-ttd-card
              className={cx(
                'group/card relative h-[400px] overflow-hidden',
                radiusClass,
                isCarousel && 'shrink-0 snap-start',
                isCarousel && (CAROUSEL_BASIS[cardGap] || CAROUSEL_BASIS.default),
              )}
            >
              {src ? (
                <img loading="lazy" decoding="async"
                  src={src}
                  alt={item.imageAlt || ''}
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
                />
              ) : null}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${overlay} 0%, color-mix(in srgb, ${overlay} 80%, transparent) 30%, transparent 55%)`,
                }}
              />

              <span
                className="absolute start-4 top-5 inline-flex items-center gap-2 rounded-full border border-solid px-2.5 py-1 backdrop-blur-sm"
                style={{
                  borderColor: colorVar(badgeBorderColor),
                  backgroundColor: `color-mix(in srgb, ${overlay} 10%, transparent)`,
                }}
              >
                <span
                  className={cx(typography.caption, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'badgeText', '50', 'semibold')}
                >
                  <LinkedText text={badgeLabel(item)} {...linkProps} />
                </span>
                <BadgeIcon
                  size={18}
                  className="shrink-0"
                  style={{ color: getTextStyleVars(textStyle, 'badgeText', '50', 'semibold').color }}
                />
              </span>

              <div className="absolute inset-x-4 bottom-5 flex flex-col gap-1">
                <h3
                  className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', 'secondary', 'semibold')}
                >
                  <LinkedText text={item.title} {...linkProps} />
                </h3>
                {item.description && !hideCardDescription ? (
                  <p
                    className={cx(typography.itemDescription, 'm-0 leading-relaxed', CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardDescriptionColor', '50', 'normal')}
                  >
                    <LinkedText text={item.description} {...linkProps} />
                  </p>
                ) : null}
                {showCardButton ? (
                  <LocalizedLink
                    href={item.href || '#'}
                    aria-label={learnMore || item.title}
                    className={cx(
                      typography.button,
                      'group/lm relative mt-2 inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full no-underline',
                    )}
                  >
                    {/* Arrow badge that fills out to a full pill on hover. */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width,background-color] duration-300 ease-out group-hover/lm:w-full group-hover/lm:[background-color:var(--ttd-badge-h)] motion-reduce:transition-none"
                      style={{
                        backgroundColor: colorVar(arrowBadgeBg),
                        '--ttd-badge-h': colorVar(arrowBadgeBgHover || arrowBadgeBg),
                      }}
                    />
                    <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
                      <ArrowRight
                        size={16}
                        weight="bold"
                        className="rtl:-scale-x-100"
                        style={{ color: colorVar(arrowColor) }}
                      />
                    </span>
                    {learnMore ? (
                      <span
                        className={`cms-lm-label relative z-10 whitespace-nowrap pe-3 ps-2.5 transition-[color,font-weight] duration-300 ${CMS_TEXT_HOVER_CLASS}`}
                        style={getTextStyleVars(
                          { learnMoreColorHover: 'primary-1', ...textStyle },
                          'learnMoreColor',
                          '50',
                          'semibold',
                        )}
                      >
                        {learnMore}
                      </span>
                    ) : null}
                  </LocalizedLink>
                ) : null}
              </div>
            </article>
          )
        })}
        </div>
        {isCarousel ? (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByCard(-1)}
              disabled={!canScroll.prev}
              className={cx(CAROUSEL_ARROW, 'start-0 -translate-x-1/2 rtl:translate-x-1/2')}
              style={carouselArrowStyle}
            >
              <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByCard(1)}
              disabled={!canScroll.next}
              className={cx(CAROUSEL_ARROW, 'end-0 translate-x-1/2 rtl:-translate-x-1/2')}
              style={carouselArrowStyle}
            >
              <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {ctaVisible ? (
        <div className="flex justify-center">
          <LocalizedLink
            href={ctaHref || '#'}
            className={cx(
              typography.button,
              btn.className,
              // Built-in hover is a 90% fade; dropped once a hover background is chosen.
              !buttonHoverBg && 'hover:opacity-90',
              'inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border-none px-6 py-3 no-underline transition duration-200 ease-out motion-reduce:transition-none md:px-8 md:py-4',
            )}
            style={btn.style}
          >
            {cta}
            <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
          </LocalizedLink>
        </div>
      ) : null}
    </section>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )

  if (!sectionClass) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default DestinationThingsToDo
