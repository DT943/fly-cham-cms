import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import beforeYouFlyPhoto from '../../assets/images/travel-experience/card-before-you-fly.png'
import atTheAirportPhoto from '../../assets/images/travel-experience/card-at-the-airport.png'
import onboardPhoto from '../../assets/images/travel-experience/card-onboard.png'
import afterTravelPhoto from '../../assets/images/travel-experience/card-after-travel.png'

/** Seed images keyed by card id — mirror the cms2 defaults so an un-uploaded card previews. */
const IMAGE_BY_ID = {
  beforeYouFly: beforeYouFlyPhoto,
  atTheAirport: atTheAirportPhoto,
  onboard: onboardPhoto,
  afterTravel: afterTravelPhoto,
}

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const CARD_GAP = {
  tight: 'gap-3',
  default: 'gap-4',
  loose: 'gap-6',
}

const CARD_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Travel-experience journey cards (heading + grid of full-bleed photo cards). Each
 * card has a bottom tint wash, a title, a description and an arrow link (with an
 * optional "Learn More" label). CMS-driven: colours/weights/hover, columns, gap,
 * radius and the section background are all controllable, with defaults matching
 * the source design.
 */
const TravelExperienceCards = ({
  title = '',
  subtitle = '',
  learnMore = '',
  items = [],
  showHeader = true,
  showSubtitle = true,
  columns = 4,
  cardGap = 'default',
  cardRadius = 'lg',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  cardBorderColor = '200',
  arrowBadgeBg = '100',
  arrowBadgeBgHover,
  arrowColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
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
  const headerVisible = showHeader && (title || (showSubtitle && subtitle))
  const badgeHover = arrowBadgeBgHover || arrowBadgeBg

  const inner = (
    <section className="flex flex-col gap-6 lg:gap-8">
      {headerVisible ? (
        <div className="flex flex-col gap-3">
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
              style={getTextStyleVars(textStyle, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={cx('grid', COLUMNS[colKey] || COLUMNS[4], gapClass)}>
        {items.map((item, index) => {
          const src = item.image || IMAGE_BY_ID[item.id] || IMAGE_BY_ID.beforeYouFly
          const tint = item.tint || '#01263b'
          return (
            <article
              key={item.id || index}
              className={cx(
                'relative isolate h-105 overflow-hidden border border-solid shadow-[0px_4px_6px_rgba(33,37,41,0.05)] md:h-111',
                radiusClass,
              )}
              style={{
                backgroundColor: colorVar(cardBg),
                borderColor: colorVar(cardBorderColor),
              }}
            >
              <img
                src={src}
                alt={item.imageAlt || ''}
                className="absolute inset-0 size-full object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: `linear-gradient(to bottom, transparent 40%, ${tint})` }}
              />

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 backdrop-blur-[2px]">
                <h3
                  className={cx('m-0 text-lg leading-snug', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', '50', 'semibold')}
                >
                  <LinkedText text={item.title} {...linkProps} />
                </h3>
                <p
                  className={cx('m-0 text-sm leading-normal', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '50', 'normal')}
                >
                  <LinkedText text={item.description} {...linkProps} />
                </p>
                <LocalizedLink
                  href={item.href || '#'}
                  aria-label={item.title}
                  className={cx(
                    'group/lm relative ms-auto inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full text-sm no-underline',
                    typography.button,
                  )}
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width,background-color] duration-300 ease-out group-hover/lm:w-full group-hover/lm:[background-color:var(--te-badge-h)]"
                    style={{
                      backgroundColor: colorVar(arrowBadgeBg),
                      '--te-badge-h': colorVar(badgeHover),
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
                      className={`cms-lm-label relative z-10 pe-3 ps-2.5 transition-[color,font-weight] duration-300 ${CMS_TEXT_HOVER_CLASS}`}
                      style={getTextStyleVars(textStyle, 'learnMoreColor', '50', 'semibold')}
                    >
                      {learnMore}
                    </span>
                  ) : null}
                </LocalizedLink>
              </div>
            </article>
          )
        })}
      </div>
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

export default TravelExperienceCards
