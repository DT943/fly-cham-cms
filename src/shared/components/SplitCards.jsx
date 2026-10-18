import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 SplitCards block.
const COLUMNS_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
}

/** Image-pair cards: one column until lg so each card’s text isn’t crushed. */
const PAIR_COLUMNS_CLASS = 'grid-cols-1 lg:grid-cols-2'

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const TITLE_SIZE = 'text-2xl leading-[normal] md:text-[28px]'
const SUBTITLE_SIZE = 'text-sm leading-[normal] md:text-base'
const FEATURE_TITLE_SIZE = 'text-xl leading-[normal]'
const CARD_TITLE_SIZE = 'text-[15px] leading-[normal]'
const PAIR_TITLE_SIZE = 'text-xl leading-[normal] md:text-[22px]'
const BODY_SIZE = 'text-sm leading-[1.5]'
const COMPACT_BODY_SIZE = 'text-sm leading-[1.4]'
const LINK_SIZE = 'text-base leading-[19px]'
const CREAM = 'rgba(249,244,230,0.5)'

function LearnMore({ item, style }) {
  if (style.showLink === false || !item.cta || !item.href) return null
  const Icon = style.showLinkIcon !== false && item.icon ? resolvePhosphorIcon(item.icon) : null
  return (
    <LocalizedLink
      href={item.href}
      className={`group/lm relative inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full no-underline ${LINK_SIZE}`}
    >
      {Icon ? (
        <span
          aria-hidden
          className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width] duration-300 ease-out group-hover/lm:w-full"
          style={{ backgroundColor: colorVar(style.arrowBadgeBg || 'primary-1') }}
        />
      ) : null}
      {Icon ? (
        <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
          <Icon
            size={16}
            weight="bold"
            aria-hidden
            className="rtl:-scale-x-100"
            style={{ color: colorVar(style.arrowColor || '50') }}
          />
        </span>
      ) : null}
      <span
        className={`cms-lm-label relative z-10 transition-[color,font-weight] duration-300 ${Icon ? 'pe-3 ps-2.5' : ''} ${CMS_TEXT_HOVER_CLASS}`}
        style={getTextStyleVars(style, 'learnMoreColor', 'primary-1', 'semibold')}
      >
        {item.cta}
      </span>
    </LocalizedLink>
  )
}

/**
 * Image-left cards. `featured` is one wide card plus a two-column grid.
 * `pair` is two cream cards with no link.
 */
const SplitCards = ({
  title = '',
  subtitle = '',
  items = [],
  layout = 'featured',
  columns = '2',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showHeader = true,
  showSubtitle = true,
  cardBg = 'background',
  showLink = true,
  showLinkIcon = true,
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
  const list = Array.isArray(items) ? items : []
  if (!title && !subtitle && !list.length) return null

  const style = {
    ...textStyle,
    showLink,
    showLinkIcon,
    arrowBadgeBg,
    arrowColor,
    showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const linkProps = { links, enabled: showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic }
  const pair = layout === 'pair'
  const columnsClass = pair
    ? PAIR_COLUMNS_CLASS
    : COLUMNS_CLASS[String(columns)] || COLUMNS_CLASS[2]
  const paddingClass = SECTION_PADDING[sectionPadding] ?? ''
  const surface = pair ? CREAM : colorVar(cardBg)
  const [featured, ...rest] = pair ? [null, ...list] : list
  const gridItems = pair ? list : rest

  return (
    <section
      className={`w-full ${paddingClass}`.trim()}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col gap-6">
        {showHeader && (title || subtitle) ? (
          <div className="flex flex-col items-center gap-2 text-center">
            {title ? (
              <h2 className={`m-0 ${TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'titleColor', '700', 'semibold')}>
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showSubtitle && subtitle ? (
              <p className={`m-0 ${SUBTITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'subtitleColor', '700', 'normal')}>
                <LinkedText text={subtitle} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}

        {!pair && featured ? (
          <article className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-white md:min-h-[320px] md:flex-row" style={{ backgroundColor: surface }}>
            {featured.imageUrl ? (
              <div className="h-[220px] w-full shrink-0 md:h-auto md:w-[45%] md:max-w-[480px] md:self-stretch">
                <img src={featured.imageUrl} alt={featured.imageAlt || ''} className="size-full object-cover" />
              </div>
            ) : null}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 p-6 md:p-8">
              {featured.title ? (
                <h3 className={`m-0 break-words ${FEATURE_TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'cardTitleColor', '700', 'semibold')}>
                  <LinkedText text={featured.title} {...linkProps} />
                </h3>
              ) : null}
              {featured.description ? (
                <p className={`m-0 break-words ${BODY_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'cardDescriptionColor', '600', 'normal')}>
                  <LinkedText text={featured.description} {...linkProps} />
                </p>
              ) : null}
              <LearnMore item={featured} style={style} />
            </div>
          </article>
        ) : null}

        {gridItems.length ? (
          <div className={`grid gap-4 md:gap-6 ${columnsClass}`}>
            {gridItems.map((item, index) => (
              <article
                key={item.id || index}
                className={`flex min-w-0 flex-col overflow-hidden rounded-xl ${
                  pair
                    ? 'lg:min-h-[284px] lg:flex-row'
                    : 'md:min-h-[180px] md:flex-row'
                }`}
                style={{ backgroundColor: surface }}
              >
                {item.imageUrl ? (
                  <div
                    className={`w-full shrink-0 ${
                      pair
                        ? 'h-[200px] lg:h-auto lg:w-[42%] lg:max-w-[288px] lg:self-stretch'
                        : 'h-[180px] md:size-[180px] md:shrink-0'
                    }`}
                  >
                    <img src={item.imageUrl} alt={item.imageAlt || ''} className="size-full object-cover" />
                  </div>
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-5">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    {item.title ? (
                      <h3 className={`m-0 break-words ${pair ? PAIR_TITLE_SIZE : CARD_TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'cardTitleColor', '700', 'semibold')}>
                        <LinkedText text={item.title} {...linkProps} />
                      </h3>
                    ) : null}
                    {item.description ? (
                      <p className={`m-0 break-words ${pair ? BODY_SIZE : COMPACT_BODY_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'cardDescriptionColor', pair ? '700' : '600', 'normal')}>
                        <LinkedText text={item.description} {...linkProps} />
                      </p>
                    ) : null}
                  </div>
                  <LearnMore item={item} style={style} />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default SplitCards
