import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 ProhibitedItemsGrid block.
const COLUMNS_CLASS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
}
const CARD_GAP_CLASS = {
  tight: 'gap-3',
  default: 'gap-3 md:gap-[19px]',
  loose: 'gap-4 md:gap-7',
}
const CARD_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
}
const CARD_HEIGHT_CLASS = {
  auto: '',
  compact: 'min-h-[150px] md:h-[170px]',
  default: 'min-h-[170px] md:h-[217px]',
  tall: 'min-h-[200px] md:h-[260px]',
}
const ICON_BOX_CLASS = {
  auto: 'max-h-[64px] max-w-[88px]',
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-[72px]',
}
const PHOSPHOR_ICON_SIZE = { auto: 56, sm: 40, md: 56, lg: 72 }
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

// Pinned px sizes from Figma 40347:12540.
const TITLE_SIZE = 'text-2xl leading-[normal] md:text-[28px]'
const DESCRIPTION_SIZE = 'text-base leading-[27px]'
const LABEL_SIZE = 'text-sm leading-[21.7px]'
const CARD_BOX =
  'flex min-w-0 flex-col items-center justify-center gap-[17px] px-[14.5px] pb-6 pt-[29px] text-center'
// Figma "shadow 2".
const CARD_SHADOW = ''

const cx = (...parts) => parts.filter(Boolean).join(' ')

function ItemIcon({ item, iconSize, iconColor, iconWeight }) {
  const sizeKey = iconSize in ICON_BOX_CLASS ? iconSize : 'auto'

  if (item.iconSource === 'image' && item.iconUrl) {
    return (
      <img
        src={item.iconUrl}
        alt={item.iconAlt || ''}
        loading="lazy"
        className={cx(
          'block shrink-0',
          sizeKey === 'auto' ? 'h-auto w-auto' : 'object-contain',
          ICON_BOX_CLASS[sizeKey],
        )}
      />
    )
  }

  if (!item.icon) return null
  const Icon = resolvePhosphorIcon(item.icon)
  return (
    <Icon
      size={PHOSPHOR_ICON_SIZE[sizeKey]}
      weight={iconWeight || 'regular'}
      aria-hidden
      className="shrink-0"
      style={{ color: colorVar(iconColor) }}
    />
  )
}

/**
 * CMS-driven prohibited items grid (Figma 40347:12540 / 40347:12587): 28px
 * title then white cards, each an icon (uploaded SVG or Phosphor) over a
 * centered label. Mirrors the cms2 ProhibitedItemsGrid block.
 */
const ProhibitedItemsGrid = ({
  title = '',
  description = '',
  items = [],
  showHeader = true,
  showDescription = true,
  columns = '4',
  cardGap = 'default',
  cardRadius = 'md',
  cardHeight = 'default',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = 'background',
  showCardBorder = false,
  cardBorderColor = '200',
  showCardShadow = false,
  showIcon = true,
  iconSize = 'auto',
  iconColor = '600',
  iconWeight = 'regular',
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
  const showTitle = showHeader && title
  const showCopy = showHeader && showDescription && description
  const radiusKey = cardRadius in CARD_RADIUS_CLASS ? cardRadius : 'md'
  const cardClass = cx(
    CARD_BOX,
    CARD_RADIUS_CLASS[radiusKey],
    CARD_HEIGHT_CLASS[cardHeight] ?? CARD_HEIGHT_CLASS.default,
    showCardShadow && CARD_SHADOW,
    showCardBorder && 'border border-solid',
  )
  const cardStyle = {
    backgroundColor: colorVar(cardBg),
    ...(showCardBorder ? { borderColor: colorVar(cardBorderColor) } : {}),
  }
  const labelStyle = getTextStyleVars(textStyle, 'labelColor', '700', 'medium')

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex min-w-0 flex-col gap-4 md:gap-6">
        {showTitle || showCopy ? (
          <div className="flex flex-col gap-3">
            {showTitle ? (
              <h2
                className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showCopy ? (
              <p
                className={cx('m-0', DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'descriptionColor', '600', 'normal')}
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
              COLUMNS_CLASS[columns] ?? COLUMNS_CLASS[4],
              CARD_GAP_CLASS[cardGap] ?? CARD_GAP_CLASS.default,
            )}
          >
            {items.map((item, index) => {
              const key = item.id ? `${item.id}-${index}` : index
              const body = (
                <>
                  {showIcon ? (
                    <ItemIcon
                      item={item}
                      iconSize={iconSize}
                      iconColor={iconColor}
                      iconWeight={iconWeight}
                    />
                  ) : null}
                  {item.label ? (
                    <p
                      className={cx('m-0 w-full', LABEL_SIZE, CMS_TEXT_HOVER_CLASS)}
                      style={labelStyle}
                    >
                      {/* No backlinks inside a linked card (nested anchors are invalid). */}
                      {item.href ? item.label : <LinkedText text={item.label} {...linkProps} />}
                    </p>
                  ) : null}
                </>
              )
              return item.href ? (
                <LocalizedLink
                  key={key}
                  href={item.href}
                  className={cx(
                    cardClass,
                    'no-underline',
                  )}
                  style={cardStyle}
                >
                  {body}
                </LocalizedLink>
              ) : (
                <article key={key} className={cardClass} style={cardStyle}>
                  {body}
                </article>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default ProhibitedItemsGrid
