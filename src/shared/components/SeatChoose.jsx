import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
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

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * "How do you choose your seat?" — a heading and a grid of photo cards, each a
 * link with a title, description and an arrow CTA. CMS-driven: colours/weights/
 * hover, columns, gap, radius and the wash are controllable, with defaults
 * matching the source. Cards are anchor-wrapped, so backlinks apply to the
 * header text only (nested anchors are invalid).
 */
const SeatChoose = ({
  title = '',
  description = '',
  items = [],
  showHeader = true,
  showDescription = true,
  columns = 4,
  cardGap = 'default',
  cardRadius = 'lg',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  overlayColor = 'secondary-2',
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
  const overlay = colorVar(overlayColor)
  const headerVisible = showHeader && (title || (showDescription && description))

  const inner = (
    <section className="flex flex-col gap-6">
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

      <div className={cx('grid', COLUMNS[colKey] || COLUMNS[4], gapClass)}>
        {items.map((item, index) => {
          const src = item.image || ''
          const ctaVars = getTextStyleVars(textStyle, 'buttonText', 'primary-3', 'semibold')
          return (
            <LocalizedLink
              key={item.id || index}
              href={item.href || '#'}
              className={cx(
                'group relative flex h-96 flex-col justify-end overflow-hidden no-underline',
                radiusClass,
              )}
            >
              {src ? (
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              ) : null}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: `linear-gradient(to bottom, transparent 25%, ${overlay})` }}
              />
              <div className="relative flex flex-col gap-3 p-5">
                <h3
                  className={cx('m-0', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', '50', 'semibold')}
                >
                  {item.title}
                </h3>
                <p
                  className={cx('m-0', typography.itemDescription, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '50', 'normal')}
                >
                  {item.description}
                </p>
                <span
                  className={cx('mt-1 inline-flex items-center gap-2', typography.button, CMS_TEXT_HOVER_CLASS)}
                  style={ctaVars}
                >
                  {item.cta}
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="rtl:-scale-x-100"
                    style={{ color: ctaVars.color }}
                  />
                </span>
              </div>
            </LocalizedLink>
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

export default SeatChoose
