import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 ServiceBenefits block.
const COLUMNS_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
}
const RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

// Figma 40473:23209 wash over the benefits photo.
const BENEFITS_WASH =
  'linear-gradient(74deg, rgba(1,39,61,0.8) 0%, rgba(1,38,59,0.8) 100%)'

const TITLE_SIZE = 'text-2xl leading-8 md:text-[32px]'
const ITEM_TITLE_SIZE = 'text-xl leading-8 md:text-[28px]'
const ITEM_DESCRIPTION_SIZE = 'text-base leading-5'
const LINK_SIZE = 'text-base leading-[normal]'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Photo banner of service benefits (Figma 40473:23209): centered title, then
 * icon circles with a title, description, and an optional text link.
 */
const ServiceBenefits = ({
  title = '',
  imageUrl = '',
  imageAlt = '',
  items = [],
  showHeader = true,
  columns = '3',
  radius = 'lg',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showOverlay = true,
  overlayColor = 'secondary-2',
  showIcon = true,
  iconBg = 'primary-3',
  iconColor = 'secondary-2',
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
  if (!title && !items.length && !imageUrl) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const radiusClass = RADIUS_CLASS[radius] ?? RADIUS_CLASS.lg
  const columnsClass = COLUMNS_CLASS[columns] ?? COLUMNS_CLASS[3]

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className={cx(
          'relative isolate min-h-[280px] overflow-hidden md:min-h-[363px]',
          radiusClass,
        )}
        style={{
          backgroundColor: colorVar(overlayColor) || colorVar('secondary-2'),
          backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
        {showOverlay ? (
          <span
            aria-hidden
            className={cx('absolute inset-0', radiusClass)}
            style={{ backgroundImage: BENEFITS_WASH }}
          />
        ) : null}
        <div className="relative z-[1] flex flex-col items-center gap-10 px-6 py-12 md:gap-16 md:px-10 md:py-[54px]">
          {showHeader && title ? (
            <h2
              className={cx('m-0 text-center', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '50', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {items.length ? (
            <div className={cx('grid w-full items-center gap-10 md:gap-6', columnsClass)}>
              {items.map((item, index) => {
                const Icon = showIcon && item.icon ? resolvePhosphorIcon(item.icon) : null
                const LinkIcon =
                  showLink && showLinkIcon && item.linkIcon
                    ? resolvePhosphorIcon(item.linkIcon)
                    : null
                const showItemLink = showLink && item.linkLabel && item.href
                return (
                  <article key={item.id || index} className="flex min-w-0 flex-col items-center gap-3 text-center md:flex-row md:items-center md:gap-3.5 md:text-start">
                    {Icon ? (
                      <span
                        className="flex size-[60px] shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: colorVar(iconBg) || colorVar('primary-3') }}
                      >
                        <Icon
                          size={24}
                          weight="fill"
                          aria-hidden
                          style={{ color: colorVar(iconColor) || colorVar('secondary-2') }}
                        />
                      </span>
                    ) : null}
                    <div className="flex min-w-0 flex-col items-center gap-2.5 md:items-start">
                      {item.title ? (
                        <h3
                          className={cx('m-0', ITEM_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                          style={getTextStyleVars(textStyle, 'itemTitleColor', '50', 'semibold')}
                        >
                          <LinkedText text={item.title} {...linkProps} />
                        </h3>
                      ) : null}
                      {item.description ? (
                        <p
                          className={cx('m-0', ITEM_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                          style={getTextStyleVars(
                            textStyle,
                            'itemDescriptionColor',
                            '50',
                            'normal',
                          )}
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
                          style={getTextStyleVars(textStyle, 'buttonText', 'primary-3', 'semibold')}
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
      </div>
    </section>
  )
}

export default ServiceBenefits
