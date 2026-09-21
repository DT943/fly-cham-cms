import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from './LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import cargoCover from '../../assets/images/our-fleet/cargo.jpg'
import entertainmentCover from '../../assets/images/our-fleet/entertainment.jpg'

const COVER_BY_KEY = { cargo: cargoCover, entertainment: entertainmentCover }

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
}

const CARD_GAP = {
  tight: 'gap-3',
  default: 'gap-4',
  loose: 'gap-6',
}

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Two-up photo cards with a bottom gold scrim, title, description, and
 * "Learn more" arrow link. Callers pass copy, images, and hrefs.
 * Optional CMS style props default to the static Our Fleet look.
 */
const MediaCards = ({
  cards = [],
  learnMore = '',
  columns = '2',
  cardGap = 'default',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  overlayColor,
  arrowBadgeBg = '100',
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
  if (!cards.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const inner = (
    <section className={cx('grid', COLUMNS[columns] || COLUMNS[2], CARD_GAP[cardGap] || CARD_GAP.default)}>
      {cards.map(({ id, image, imageAlt = '', coverKey, href, title, description, cta }, index) => {
        const src = image || COVER_BY_KEY[coverKey] || COVER_BY_KEY[['cargo', 'entertainment'][index % 2]]
        const label = cta || learnMore
        return (
          <article
            key={id || title}
            className="relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-2xl p-8 md:p-10"
          >
            <img
              src={src}
              alt={imageAlt}
              className="absolute inset-0 -z-10 size-full object-cover"
            />
            <div
              className={cx(
                'absolute inset-0 -z-10',
                overlayColor ? '' : 'bg-linear-to-b from-transparent to-secondary-2',
              )}
              style={
                overlayColor
                  ? {
                      background: `linear-gradient(to bottom, transparent, ${colorVar(overlayColor)})`,
                    }
                  : undefined
              }
            />

            <div className="flex flex-col gap-3 text-50">
              {title ? (
                <h2
                  className={cx('m-0 text-2xl font-bold md:text-[28px]', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', '50', 'bold')}
                >
                  <LinkedText text={title} {...linkProps} />
                </h2>
              ) : null}
              {description ? (
                <p
                  className={cx(
                    'm-0 font-normal leading-normal',
                    typography.caption,
                    CMS_TEXT_HOVER_CLASS,
                  )}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '100', 'normal')}
                >
                  <LinkedText text={description} {...linkProps} />
                </p>
              ) : null}
              {label && href ? (
                <LocalizedLink
                  href={href}
                  className={cx(
                    'mt-1 inline-flex w-fit items-center gap-2.5 font-semibold no-underline',
                    typography.button,
                    CMS_TEXT_HOVER_CLASS,
                  )}
                  style={getTextStyleVars(textStyle, 'learnMoreColor', '50', 'semibold')}
                >
                  <span
                    className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-100"
                    style={{ backgroundColor: colorVar(arrowBadgeBg) }}
                  >
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="rtl:rotate-180"
                      style={{ color: colorVar(arrowColor) }}
                    />
                  </span>
                  {label}
                </LocalizedLink>
              ) : null}
            </div>
          </article>
        )
      })}
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

export default MediaCards
