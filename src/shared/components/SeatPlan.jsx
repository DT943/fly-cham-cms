import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const CARD_GAP = { tight: 'gap-3', default: 'gap-4', loose: 'gap-6' }

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

const HEADER_ALIGN = {
  start: 'items-start text-start',
  center: 'items-center text-center',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * "Plan for your trip" — a heading and a grid of image-top cards with a title,
 * description and a "Learn More" link with a circular arrow badge. CMS-driven:
 * colours/weights/hover, columns, gap, radius and card chrome are controllable,
 * with defaults matching the source. Only the link is an anchor, so backlinks
 * apply to the card title/description (not the label).
 */
const SeatPlan = ({
  title = '',
  description = '',
  learnMore = '',
  items = [],
  showHeader = true,
  showDescription = true,
  headerAlign = 'start',
  columns = 3,
  cardGap = 'default',
  cardRadius = 'sm',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
  learnMoreAlign = 'auto',
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
  const radiusClass = CARD_RADIUS[cardRadius] || CARD_RADIUS.sm
  const alignClass = HEADER_ALIGN[headerAlign] || HEADER_ALIGN.start
  const headerVisible = showHeader && (title || (showDescription && description))

  const inner = (
    <section className="flex flex-col gap-5">
      {headerVisible ? (
        <div className={cx('flex flex-col gap-3', alignClass)}>
          {title ? (
            <h2
              className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {showDescription && description ? (
            <p
              className={cx('m-0', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={cx('grid', COLUMNS[colKey] || COLUMNS[3], gapClass)}>
        {items.map((item, index) => {
          const src = item.image
          return (
            <article
              key={item.id || index}
              className={cx(
                'group relative cursor-pointer transition-shadow duration-300 ease-out hover:shadow-[0_6px_18px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.08)]',
                radiusClass,
              )}
              style={{ backgroundColor: colorVar(cardBg) }}
            >
              <div className={cx('relative flex h-full flex-col overflow-hidden', radiusClass)}>
              <LocalizedLink
                href={item.href || '#'}
                className="absolute inset-0 z-1"
                aria-label={item.title || learnMore || 'Learn more'}
              />
              {src ? (
                <img loading="lazy" decoding="async"
                  src={src}
                  alt={item.imageAlt || ''}
                  className="h-[196px] w-full object-cover"
                />
              ) : null}
              <div className="relative z-2 flex flex-1 flex-col gap-3 p-4 pointer-events-none">
                <h3
                  className={cx('m-0 [&_a]:pointer-events-auto', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                >
                  <LinkedText text={item.title} {...linkProps} />
                </h3>
                <p
                  className={cx(
                    'm-0 flex-1 leading-relaxed [&_a]:pointer-events-auto',
                    typography.itemDescription,
                    CMS_TEXT_HOVER_CLASS,
                  )}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                >
                  <LinkedText text={item.description} {...linkProps} />
                </p>
                <LocalizedLink
                  href={item.href || '#'}
                  className={cx(
                    'group/lm pointer-events-auto relative mt-2 inline-flex h-[34px] w-fit items-center self-end overflow-hidden rounded-full no-underline',
                    learnMoreAlign !== 'end' && 'sm:self-auto',
                    typography.button,
                  )}
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width] duration-300 ease-out sm:group-hover/lm:w-full"
                    style={{ backgroundColor: colorVar(arrowBadgeBg) }}
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
                      className={`cms-lm-label relative z-10 hidden pe-3 ps-2.5 transition-[color,font-weight] duration-300 sm:inline ${CMS_TEXT_HOVER_CLASS}`}
                      style={getTextStyleVars(textStyle, 'buttonText', 'primary-1', 'semibold')}
                    >
                      {learnMore}
                    </span>
                  ) : null}
                </LocalizedLink>
              </div>
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

export default SeatPlan
