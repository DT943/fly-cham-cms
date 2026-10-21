import { ArrowRight, Clock } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
  colorVar,
  getButtonStyle,
} from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const COLUMNS = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

const CARD_GAP = {
  tight: 'gap-3',
  default: 'gap-4 md:gap-5',
  loose: 'gap-6 md:gap-8',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')
/** Category pill fill when the CMS `chipBg` token is empty (Primary 1 at 10%). */
const DEFAULT_CHIP_BG = 'rgba(0,96,128,0.1)'

/**
 * News card grid with a View All CTA. Defaults match Media Center News Grid.
 * Card image and title are links, so backlinks apply to the section title,
 * description, and excerpt only.
 */
const NewsGrid = ({
  title = '',
  description = '',
  learnMore = '',
  viewAll = '',
  viewAllHref = '/media-center/recent-news',
  items = [],
  columns = '3',
  cardGap = 'default',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  cardBorderColor = '200',
  chipBg = '',
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
  viewAllBg = 'background',
  viewAllBorder = 'primary-1',
  viewAllHoverBg,
  iconColor = '600',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!title && !items.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  // viewAllText* (+ Hover twins) arrive via ...textStyle. Blocks saved before
  // "View all" got its own label keys fall back to the "Learn more" style.
  const viewAllBtn = getButtonStyle(
    {
      ...textStyle,
      viewAllBg,
      viewAllHoverBg,
      viewAllText: textStyle.viewAllText ?? textStyle.learnMoreColor,
      viewAllTextHover: textStyle.viewAllTextHover ?? textStyle.learnMoreColorHover,
      viewAllTextFontWeight:
        textStyle.viewAllTextFontWeight ?? textStyle.learnMoreFontWeight,
      viewAllTextFontWeightHover:
        textStyle.viewAllTextFontWeightHover ?? textStyle.learnMoreFontWeightHover,
    },
    {
      bgKey: 'viewAllBg',
      bgHoverKey: 'viewAllHoverBg',
      bgFallback: 'background',
      bgHoverFallback: '100',
      textKey: 'viewAllText',
      textFallback: 'primary-1',
      weightFallback: 'semibold',
    },
  )

  const inner = (
    <section className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-2 md:gap-3">
        {title ? (
          <h2
            className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {description ? (
          <p
            className={cx('m-0 leading-relaxed', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}
      </div>

      <div className={cx('grid', COLUMNS[String(columns)] || COLUMNS[3], CARD_GAP[cardGap] || CARD_GAP.default)}>
        {items.map((item, index) => {
          const href = item.href || '#'
          const cta = item.cta || learnMore
          const cover = item.image
          return (
            <article
              key={item.id || index}
              className="flex h-full flex-col overflow-hidden rounded-2xl border"
              style={{
                backgroundColor: colorVar(cardBg),
                borderColor: colorVar(cardBorderColor),
              }}
            >
              {cover ? (
                <LocalizedLink href={href} className="block no-underline">
                  <img loading="lazy" decoding="async" src={cover} alt={item.imageAlt || ''} className="aspect-[4/3] w-full object-cover" />
                </LocalizedLink>
              ) : null}

              <div className="flex flex-1 flex-col gap-3 p-5 md:gap-4 md:p-6">
                <div
                  className={cx('flex flex-wrap items-center gap-x-2 gap-y-1', typography.caption, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'metaColor', '600', 'normal')}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={16} weight="regular" className="shrink-0" style={{ color: colorVar(iconColor) }} aria-hidden />
                    <time dateTime={item.dateTime}>{item.date}</time>
                  </span>
                  <span aria-hidden className="text-500">·</span>
                  <span
                    className={cx('rounded-full px-3 py-1', typography.caption, CMS_TEXT_HOVER_CLASS)}
                    style={{
                      ...getTextStyleVars(textStyle, 'chipText', 'primary-1', 'medium'),
                      backgroundColor: colorVar(chipBg) || DEFAULT_CHIP_BG,
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <h3 className={cx('m-0', typography.itemTitle)}>
                  <LocalizedLink
                    href={href}
                    className={cx('no-underline hover:underline', CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardTitleColor', 'primary-1', 'semibold')}
                  >
                    {item.title}
                  </LocalizedLink>
                </h3>
                <p
                  className={cx('m-0 flex-1 leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                >
                  <LinkedText text={item.excerpt} {...linkProps} />
                </p>

                <div className="flex justify-end pt-1">
                  <LocalizedLink
                    href={href}
                    className={cx(
                      'group/lm relative inline-flex h-[34px] items-center overflow-hidden rounded-full no-underline',
                      typography.button,
                    )}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width] duration-300 ease-out group-hover/lm:w-full"
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
                    <span
                      className={`cms-lm-label relative z-10 pe-3 ps-2.5 transition-[color,font-weight] duration-300 ${CMS_TEXT_HOVER_CLASS}`}
                      style={getTextStyleVars(
                        textStyle,
                        'learnMoreColor',
                        'primary-1',
                        'semibold',
                      )}
                    >
                      {cta}
                    </span>
                  </LocalizedLink>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {viewAll ? (
        <div className="flex justify-center">
          <LocalizedLink
            href={viewAllHref || '/media-center/recent-news'}
            className={cx('rounded-lg border px-10 py-3 no-underline', typography.button, viewAllBtn.className)}
            style={{
              ...viewAllBtn.style,
              borderColor: colorVar(viewAllBorder),
            }}
          >
            {viewAll}
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

export default NewsGrid
