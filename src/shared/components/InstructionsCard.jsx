import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 InstructionsCard block.
const LIST_STYLE_CLASS = {
  decimal: 'list-decimal ps-[21px]',
  disc: 'list-disc ps-[21px]',
  none: 'list-none ps-0',
}
const LIST_GAP_CLASS = { tight: 'gap-2', default: 'gap-4', loose: 'gap-6' }
const RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
}
const IMAGE_HEIGHT_CLASS = {
  compact: 'h-[200px] md:h-[240px]',
  default: 'h-[220px] md:h-[321px]',
  tall: 'h-[260px] md:h-[400px]',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

// Pinned px sizes from Figma 40347:12759.
const TITLE_SIZE = 'text-2xl leading-[normal] md:text-[28px]'
const DESCRIPTION_SIZE = 'text-base leading-[27px]'
const LIST_SIZE = 'text-sm leading-[27px]'
const BUTTON_SIZE = 'text-base leading-[normal]'
// Figma "shadow 2".
const CARD_SHADOW = ''

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * CMS-driven instructions card (Figma 40347:12759 / 40347:12760): 28px title
 * over a white card holding an ordered list beside a photo (side switchable),
 * plus an optional button. Mirrors the cms2 InstructionsCard block.
 */
const InstructionsCard = ({
  title = '',
  description = '',
  items = [],
  imageUrl = '',
  imageAlt = '',
  buttonLabel = '',
  buttonHref = '',
  buttonIcon = '',
  showHeader = true,
  showDescription = true,
  showImage = true,
  imageSide = 'right',
  imageRadius = 'md',
  imageHeight = 'default',
  listStyle = 'decimal',
  listGap = 'default',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = 'background',
  cardRadius = 'lg',
  showCardShadow = false,
  markerColor = '700',
  showButton = false,
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
  const list = items.filter((item) => item?.text)
  if (!list.length && !title && !description && !imageUrl) return null

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
  const hasButton = showButton && buttonLabel
  const ButtonIcon =
    hasButton && showButtonIcon && buttonIcon ? resolvePhosphorIcon(buttonIcon) : null
  const ListTag = listStyle === 'decimal' ? 'ol' : 'ul'

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex min-w-0 flex-col gap-4 md:gap-6">
        {showHeader && title ? (
          <h2
            className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        <div
          className={cx(
            'flex min-w-0 flex-col-reverse gap-6 p-4 md:items-start md:justify-between md:gap-[46px] md:p-6',
            imageSide === 'left' ? 'md:flex-row-reverse' : 'md:flex-row',
            RADIUS_CLASS[cardRadius] ?? RADIUS_CLASS.lg,
            showCardShadow && CARD_SHADOW,
          )}
          style={{ backgroundColor: colorVar(cardBg) }}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-4 md:max-w-[655px]">
            {showDescription && description ? (
              <p
                className={cx('m-0', DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
            {list.length ? (
              <ListTag
                className={cx(
                  'm-0 flex flex-col',
                  LIST_STYLE_CLASS[listStyle] ?? LIST_STYLE_CLASS.decimal,
                  LIST_GAP_CLASS[listGap] ?? LIST_GAP_CLASS.default,
                  LIST_SIZE,
                  CMS_TEXT_HOVER_CLASS,
                  'marker:text-[color:var(--ic-marker)]',
                )}
                style={{
                  ...getTextStyleVars(textStyle, 'listColor', '700', 'normal'),
                  '--ic-marker': colorVar(markerColor),
                }}
              >
                {list.map((item, index) => (
                  <li key={item.id ? `${item.id}-${index}` : index}>
                    <LinkedText text={item.text} {...linkProps} />
                  </li>
                ))}
              </ListTag>
            ) : null}
            {hasButton ? (
              <LocalizedLink
                href={buttonHref || '#'}
                className={cx(
                  'flex h-[52px] w-fit items-center justify-center gap-2 self-start rounded-lg px-[35px] py-[15px] no-underline transition-colors',
                  BUTTON_SIZE,
                  button.className,
                )}
                style={button.style}
              >
                <span>{buttonLabel}</span>
                {ButtonIcon ? (
                  <ButtonIcon size={16} aria-hidden className="shrink-0 rtl:-scale-x-100" />
                ) : null}
              </LocalizedLink>
            ) : null}
          </div>
          {showImage && imageUrl ? (
            <div
              className={cx(
                'w-full shrink-0 overflow-hidden md:w-[471px]',
                IMAGE_HEIGHT_CLASS[imageHeight] ?? IMAGE_HEIGHT_CLASS.default,
                RADIUS_CLASS[imageRadius] ?? RADIUS_CLASS.md,
              )}
            >
              <img
                src={imageUrl}
                alt={imageAlt || ''}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default InstructionsCard
