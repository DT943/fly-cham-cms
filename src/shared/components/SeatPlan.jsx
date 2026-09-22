import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import plan1 from '../../assets/images/seat-selection/plan-1.jpg'
import plan2 from '../../assets/images/seat-selection/plan-2.jpg'
import plan3 from '../../assets/images/seat-selection/plan-3.jpg'

/** Seed images keyed by card id — mirror the cms2 defaults so an un-uploaded card previews. */
const IMAGE_BY_ID = {
  baggage: plan1,
  prohibited: plan2,
  minor: plan3,
}

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
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
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
  columns = 3,
  cardGap = 'default',
  cardRadius = 'sm',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
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
  const headerVisible = showHeader && (title || (showDescription && description))

  const inner = (
    <section className="flex flex-col gap-5">
      {headerVisible ? (
        <div className="flex flex-col gap-3">
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
          const src = item.image || IMAGE_BY_ID[item.id] || IMAGE_BY_ID.baggage
          const labelVars = getTextStyleVars(textStyle, 'buttonText', 'primary-1', 'semibold')
          return (
            <article
              key={item.id || index}
              className={cx('flex flex-col overflow-hidden shadow-[0px_2px_1px_rgba(33,37,41,0.06),0px_0px_0.5px_rgba(33,37,41,0.08)]', radiusClass)}
              style={{ backgroundColor: colorVar(cardBg) }}
            >
              <img
                src={src}
                alt={item.imageAlt || ''}
                className="h-49 w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3
                  className={cx('m-0', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                >
                  <LinkedText text={item.title} {...linkProps} />
                </h3>
                <p
                  className={cx('m-0 flex-1 leading-relaxed', typography.itemDescription, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                >
                  <LinkedText text={item.description} {...linkProps} />
                </p>
                <LocalizedLink
                  href={item.href || '#'}
                  className={cx('mt-2 inline-flex items-center gap-2 no-underline', typography.button, CMS_TEXT_HOVER_CLASS)}
                  style={labelVars}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: colorVar(arrowBadgeBg), color: colorVar(arrowColor) }}
                  >
                    <ArrowRight size={18} weight="bold" className="rtl:rotate-180" />
                  </span>
                  {learnMore}
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

export default SeatPlan
