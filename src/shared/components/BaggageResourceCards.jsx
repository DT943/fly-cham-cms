import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 BaggageResourceCards block.
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
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
}
const IMAGE_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-t-lg',
  lg: 'rounded-t-2xl',
  xl: 'rounded-t-3xl',
}
const IMAGE_HEIGHT_CLASS = {
  compact: 'h-[150px]',
  default: 'h-[180px]',
  tall: 'h-[234px]',
  xl: 'h-[240px] md:h-[332px]',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

// Pinned px sizes from Figma 40281:46252.
const TITLE_SIZE = 'text-2xl leading-[normal] md:text-[28px]'
const DESCRIPTION_SIZE = 'text-base leading-[27px]'
const CARD_TITLE_SIZE = 'text-lg leading-[normal] md:text-xl'
const CARD_DESCRIPTION_SIZE = 'text-sm leading-[1.5]'
const BUTTON_SIZE = 'text-base leading-[normal]'
// Figma "shadow 2".
const CARD_SHADOW = ''
// Card hover motion standard (Figma prototype): 500ms soft ease-out, 1.041 zoom.
const IMAGE_MOTION =
  'transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-[1.041]'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * CMS-driven "Everything You Need for Your Baggage" (Figma 40281:46252):
 * 28px title + image-top cards, each ending in a full-width button with an
 * optional Phosphor icon. Mirrors the cms2 BaggageResourceCards block.
 */
const BaggageResourceCards = ({
  title = '',
  description = '',
  items = [],
  showHeader = true,
  showDescription = true,
  columns = '3',
  cardGap = 'default',
  cardRadius = 'lg',
  imageHeight = 'default',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = 'background',
  showCardShadow = true,
  showButton = true,
  showButtonIcon = true,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!items.length && !title && !description) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const button = getButtonStyle(textStyle, {
    bgKey: 'buttonBg',
    bgFallback: 'primary-1',
    bgHoverFallback: 'primary-800',
    textKey: 'buttonText',
    textFallback: '50',
    weightFallback: 'semibold',
  })
  const showTitle = showHeader && title
  const showCopy = showHeader && showDescription && description
  const radiusKey = cardRadius in CARD_RADIUS_CLASS ? cardRadius : 'lg'
  const imageHeightClass = IMAGE_HEIGHT_CLASS[imageHeight] ?? IMAGE_HEIGHT_CLASS.default

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex min-w-0 flex-col gap-4 md:gap-[17px]">
        {showTitle || showCopy ? (
          <div className="flex flex-col gap-3">
            {showTitle ? (
              <h2
                className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'titleColor', 'foreground', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showCopy ? (
              <p
                className={cx('m-0', DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}

        {items.length ? (
          <div
            className={cx(
              'grid min-w-0',
              COLUMNS_CLASS[columns] ?? COLUMNS_CLASS[3],
              CARD_GAP_CLASS[cardGap] ?? CARD_GAP_CLASS.default,
            )}
          >
            {items.map((item, index) => {
              const Icon =
                showButtonIcon && item.buttonIcon ? resolvePhosphorIcon(item.buttonIcon) : null
              return (
                <article
                  key={item.id ? `${item.id}-${index}` : index}
                  className={cx(
                    'group flex h-full min-w-0 flex-col gap-2.5',
                    CARD_RADIUS_CLASS[radiusKey],
                    showCardShadow && CARD_SHADOW,
                  )}
                  style={{ backgroundColor: colorVar(cardBg) }}
                >
                  {item.imageUrl ? (
                    <div
                      className={cx(
                        'w-full shrink-0 overflow-hidden',
                        imageHeightClass,
                        IMAGE_RADIUS_CLASS[radiusKey],
                      )}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt || ''}
                        loading="lazy"
                        className={cx('size-full object-cover', IMAGE_MOTION)}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="flex flex-col gap-3">
                      {item.title ? (
                        <h3
                          className={cx('m-0', CARD_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                          style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                        >
                          <LinkedText text={item.title} {...linkProps} />
                        </h3>
                      ) : null}
                      {item.description ? (
                        <p
                          className={cx('m-0', CARD_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                          style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                        >
                          <LinkedText text={item.description} {...linkProps} />
                        </p>
                      ) : null}
                    </div>
                    {showButton && item.buttonLabel ? (
                      <LocalizedLink
                        href={item.href || '#'}
                        className={cx(
                          'mt-auto flex h-[52px] w-full items-center justify-center gap-2 rounded-lg px-[35px] py-[15px] no-underline transition-colors',
                          BUTTON_SIZE,
                          button.className,
                        )}
                        style={button.style}
                      >
                        <span>{item.buttonLabel}</span>
                        {Icon ? (
                          <Icon size={16} aria-hidden className="shrink-0 rtl:-scale-x-100" />
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

export default BaggageResourceCards
