import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 AirportServiceCards block.
const COLUMNS_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}
const CARD_GAP_CLASS = { tight: 'gap-3', default: 'gap-[14px]', loose: 'gap-6' }
const CARD_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
}
const IMAGE_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-t-lg',
  lg: 'rounded-t-xl',
  xl: 'rounded-t-2xl',
}
const IMAGE_HEIGHT_CLASS = {
  compact: 'h-[160px]',
  medium: 'h-[180px]',
  default: 'h-[200px]',
  tall: 'h-[240px]',
  xl: 'h-[180px] md:h-[332px]',
}
const HEADER_ALIGN_CLASS = {
  start: 'items-start text-start',
  center: 'items-center text-center',
}
const LINK_ALIGN_CLASS = {
  start: 'max-md:self-end md:self-start',
  end: 'self-end',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const TITLE_SIZE = 'text-2xl leading-[normal]'
const SUBTITLE_SIZE = 'text-base leading-[1.5]'
const CARD_TITLE_SIZE = 'text-xl leading-[normal]'
const CARD_DESCRIPTION_SIZE = 'text-[15px] leading-[1.5]'
const LINK_SIZE = 'text-base leading-[19px]'
const CARD_SHADOW =
  ''
const IMAGE_MOTION =
  'transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-[1.041]'

/**
 * Airport service cards (Figma 39457:12163): centered heading and a grid of
 * image-top cards, each with a title, description, and a circle-arrow link.
 * Every colour, weight, icon, and link is CMS-driven.
 */
const AirportServiceCards = ({
  title = '',
  subtitle = '',
  items = [],
  showHeader = true,
  showTitle = true,
  showSubtitle = true,
  headerAlign = 'center',
  columns = '3',
  cardGap = 'default',
  cardRadius = 'lg',
  imageHeight = 'default',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = 'background',
  showCardShadow = true,
  showLink = true,
  showLinkIcon = true,
  linkAlign = 'start',
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
  if (!items.length && !title && !subtitle) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const columnsClass = COLUMNS_CLASS[String(columns)] || COLUMNS_CLASS[3]
  const gapClass = CARD_GAP_CLASS[cardGap] || CARD_GAP_CLASS.default
  const radiusKey = cardRadius in CARD_RADIUS_CLASS ? cardRadius : 'lg'
  const imageHeightClass = IMAGE_HEIGHT_CLASS[imageHeight] || IMAGE_HEIGHT_CLASS.default
  const alignClass = HEADER_ALIGN_CLASS[headerAlign] || HEADER_ALIGN_CLASS.center
  const paddingClass = SECTION_PADDING[sectionPadding] ?? ''
  const headerVisible =
    showHeader && ((showTitle && title) || (showSubtitle && subtitle))

  return (
    <section
      className={`w-full ${paddingClass}`.trim()}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col gap-6">
        {headerVisible ? (
          <div className={`flex flex-col gap-2 ${alignClass}`}>
            {showTitle && title ? (
              <h2
                className={`m-0 ${TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showSubtitle && subtitle ? (
              <p
                className={`m-0 w-full ${SUBTITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(textStyle, 'subtitleColor', '700', 'normal')}
              >
                <LinkedText text={subtitle} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}

        {items.length ? (
          <div className={`grid items-stretch ${columnsClass} ${gapClass}`}>
            {items.map((item, index) => {
              const Icon =
                showLinkIcon && item.icon ? resolvePhosphorIcon(item.icon) : null
              const visibleLink = showLink && (item.cta || Icon)
              return (
                <article
                  key={item.id || index}
                  className={`group flex h-full min-w-0 flex-col gap-2.5 ${CARD_RADIUS_CLASS[radiusKey]} ${
                    showCardShadow ? CARD_SHADOW : ''
                  }`}
                  style={{ backgroundColor: colorVar(cardBg) }}
                >
                  {item.imageUrl ? (
                    <div
                      className={`w-full shrink-0 overflow-hidden ${imageHeightClass} ${IMAGE_RADIUS_CLASS[radiusKey]}`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt || ''}
                        className={`size-full object-cover ${IMAGE_MOTION}`}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                    <div className="flex flex-col gap-3">
                      {item.title ? (
                        <h3
                          className={`m-0 ${CARD_TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
                          style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                        >
                          <LinkedText text={item.title} {...linkProps} />
                        </h3>
                      ) : null}
                      {item.description ? (
                        <p
                          className={`m-0 ${CARD_DESCRIPTION_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
                          style={getTextStyleVars(
                            textStyle,
                            'cardDescriptionColor',
                            '700',
                            'normal',
                          )}
                        >
                          <LinkedText text={item.description} {...linkProps} />
                        </p>
                      ) : null}
                    </div>
                    {visibleLink ? (
                      <LocalizedLink
                        href={item.href || '#'}
                        className={`group/lm relative inline-flex w-fit items-center no-underline ${
                          Icon ? 'h-10 overflow-hidden rounded-full md:h-[34px]' : ''
                        } ${LINK_ALIGN_CLASS[linkAlign] || LINK_ALIGN_CLASS.start} ${LINK_SIZE}`}
                      >
                        {Icon ? (
                          <span
                            aria-hidden
                            className="absolute inset-y-0 start-0 w-10 rounded-full md:w-[34px] md:transition-[width] md:duration-300 md:ease-out md:group-hover/lm:w-full"
                            style={{ backgroundColor: colorVar(arrowBadgeBg) }}
                          />
                        ) : null}
                        {Icon ? (
                          <span className="relative z-10 flex size-10 shrink-0 items-center justify-center md:size-[34px]">
                            <Icon
                              size={16}
                              weight="bold"
                              aria-hidden
                              className="rtl:-scale-x-100"
                              style={{ color: colorVar(arrowColor) }}
                            />
                          </span>
                        ) : null}
                        {item.cta ? (
                          <span
                            className={`cms-lm-label relative z-10 pe-1 transition-[color,font-weight] duration-300 ${
                              Icon ? 'hidden md:inline md:ps-2.5' : ''
                            } ${CMS_TEXT_HOVER_CLASS}`}
                            style={getTextStyleVars(textStyle, 'learnMoreColor', 'primary-1', 'semibold')}
                          >
                            {item.cta}
                          </span>
                        ) : null}
                      </LocalizedLink>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default AirportServiceCards
