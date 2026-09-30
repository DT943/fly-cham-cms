import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const COLUMNS_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
}
const RADIUS_CLASS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const TITLE_SIZE = 'text-2xl leading-[1.5] md:text-[28px]'
const BODY_SIZE = 'text-sm leading-[1.5]'
const FEATURE_TITLE_SIZE = 'text-base leading-[normal]'
const FEATURE_DESCRIPTION_SIZE = 'text-xs leading-4'
const LINK_SIZE = 'text-sm leading-[normal]'
const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Text and icon features beside a photo (Figma 40442:11961).
 */
const FeatureHighlight = ({
  title = '',
  description = '',
  imageUrl = '',
  imageAlt = '',
  items = [],
  imageSide = 'right',
  featureColumns = '2',
  imageRadius = 'xl',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showIcon = true,
  iconBg = 'primary-1',
  iconColor = '50',
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
  if (!title && !description && !items.length && !imageUrl) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const imageFirst = imageSide === 'left'
  const radiusClass = RADIUS_CLASS[imageRadius] ?? RADIUS_CLASS.xl
  const columnsClass = COLUMNS_CLASS[featureColumns] ?? COLUMNS_CLASS[2]

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className={cx('flex flex-col items-start gap-8 lg:justify-between', imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row')}>
        <div className="flex w-full max-w-[555px] flex-col gap-[22px]">
          {title || description ? (
            <div className="flex flex-col gap-4">
              {title ? (
                <h2 className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}>
                  <LinkedText text={title} {...linkProps} />
                </h2>
              ) : null}
              {description ? (
                <p className={cx('m-0', BODY_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}>
                  <LinkedText text={description} {...linkProps} />
                </p>
              ) : null}
            </div>
          ) : null}
          {items.length ? (
            <div className={cx('grid gap-4', columnsClass)}>
              {items.map((item, index) => {
                const Icon = showIcon && item.icon ? resolvePhosphorIcon(item.icon) : null
                const LinkIcon = showLink && showLinkIcon && item.linkIcon ? resolvePhosphorIcon(item.linkIcon) : null
                const showItemLink = showLink && item.linkLabel && item.href
                return (
                  <article key={item.id || index} className="flex min-w-0 items-start gap-4">
                    {Icon ? (
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: colorVar(iconBg) || colorVar('primary-1') }}>
                        <Icon size={20} aria-hidden style={{ color: colorVar(iconColor) || colorVar('50') }} />
                      </span>
                    ) : null}
                    <div className="flex min-w-0 flex-col gap-0.5">
                      {item.title ? (
                        <h3 className={cx('m-0', FEATURE_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'featureTitleColor', 'primary-1', 'medium')}>
                          <LinkedText text={item.title} {...linkProps} />
                        </h3>
                      ) : null}
                      {item.description ? (
                        <p className={cx('m-0', FEATURE_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'featureDescriptionColor', '600', 'normal')}>
                          <LinkedText text={item.description} {...linkProps} />
                        </p>
                      ) : null}
                      {showItemLink ? (
                        <LocalizedLink href={item.href} className={cx('mt-1 inline-flex w-fit items-center gap-2 no-underline', LINK_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'buttonText', 'primary-1', 'semibold')}>
                          <span>{item.linkLabel}</span>
                          {LinkIcon ? <LinkIcon size={16} aria-hidden className="shrink-0 rtl:-scale-x-100" /> : null}
                        </LocalizedLink>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          ) : null}
        </div>
        {imageUrl ? (
          <div className={cx('h-[240px] w-full overflow-hidden lg:h-[375px] lg:w-[621px] lg:shrink-0', radiusClass)}>
            <img src={imageUrl} alt={imageAlt || ''} className={cx('size-full object-cover', radiusClass)} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default FeatureHighlight
