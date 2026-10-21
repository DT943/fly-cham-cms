import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 OfferCards block.
const COLUMNS_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}
const CARD_GAP_CLASS = { tight: 'gap-4', default: 'gap-8', loose: 'gap-10' }
const IMAGE_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

// Pinned px sizes from Figma 40375:19252.
const TITLE_SIZE = 'text-2xl leading-[normal] md:text-[28px]'
const CARD_TITLE_SIZE = 'text-xl leading-[normal]'
const CARD_DESCRIPTION_SIZE = 'text-sm leading-[1.5]'
const LINK_SIZE = 'text-base leading-[normal]'
const IMAGE_MOTION =
  'transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-[1.041]'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Square photo cards (Figma 40375:19252): 28px title, then a grid of photos
 * with a title, description, and optional Phosphor icon and text link.
 */
const OfferCards = ({
  title = '',
  items = [],
  showHeader = true,
  columns = '3',
  cardGap = 'default',
  imageRadius = 'lg',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showImageOverlay = true,
  showIcon = true,
  iconColor = 'primary-1',
  showLink = true,
  showLinkIcon = true,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!items.length && !title) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const columnsClass = COLUMNS_CLASS[columns] ?? COLUMNS_CLASS[3]
  const gapClass = CARD_GAP_CLASS[cardGap] ?? CARD_GAP_CLASS.default
  const radiusKey = imageRadius in IMAGE_RADIUS_CLASS ? imageRadius : 'lg'
  const radiusClass = IMAGE_RADIUS_CLASS[radiusKey]

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col gap-6">
        {showHeader && title ? (
          <h2
            className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {items.length ? (
          <div className={cx('grid items-start', columnsClass, gapClass)}>
            {items.map((item, index) => {
              const showWash = showImageOverlay && item.showOverlay !== false
              const Icon = showIcon && item.icon ? resolvePhosphorIcon(item.icon) : null
              const LinkIcon =
                showLink && showLinkIcon && item.linkIcon
                  ? resolvePhosphorIcon(item.linkIcon)
                  : null
              const showItemLink = showLink && item.linkLabel && item.href
              return (
                <article key={item.id || index} className="group flex min-w-0 flex-col gap-5">
                  {item.imageUrl ? (
                    <div className={cx('relative aspect-square w-full overflow-hidden', radiusClass)}>
                      <img loading="lazy" decoding="async"
                        src={item.imageUrl}
                        alt={item.imageAlt || ''}
                        className={cx('size-full object-cover', radiusClass, IMAGE_MOTION)}
                      />
                      {showWash ? (
                        <span
                          aria-hidden
                          className={cx('pointer-events-none absolute inset-0 bg-black/20', radiusClass)}
                        />
                      ) : null}
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-3">
                    {Icon ? (
                      <Icon
                        size={40}
                        aria-hidden
                        className="shrink-0"
                        style={{ color: colorVar(iconColor) || colorVar('primary-1') }}
                      />
                    ) : null}
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
                        style={getTextStyleVars(textStyle, 'cardDescriptionColor', '800', 'normal')}
                      >
                        <LinkedText text={item.description} {...linkProps} />
                      </p>
                    ) : null}
                    {showItemLink ? (
                      <LocalizedLink
                        href={item.href}
                        className={cx(
                          'inline-flex w-fit items-center gap-2 no-underline',
                          LINK_SIZE,
                          CMS_TEXT_HOVER_CLASS,
                        )}
                        style={getTextStyleVars(textStyle, 'buttonText', 'primary-1', 'semibold')}
                      >
                        <span>{item.linkLabel}</span>
                        {LinkIcon ? (
                          <LinkIcon size={16} aria-hidden className="shrink-0 rtl:-scale-x-100" />
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

export default OfferCards
