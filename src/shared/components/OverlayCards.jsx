import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const COLUMNS_CLASS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
}
const RADIUS_CLASS = {
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}
const WASH = 'linear-gradient(to bottom, rgba(1,38,59,0) 40%, rgba(1,38,59,0.6) 100%)'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const linkStyle = (style) => ({
  linkColor: style.linkColor,
  linkHoverColor: style.linkHoverColor,
  linkFontWeight: style.linkFontWeight,
  linkUnderline: style.linkUnderline,
  linkItalic: style.linkItalic,
})

function CardFace({ item, style, links, showLinks }) {
  const Icon = item.icon ? resolvePhosphorIcon(item.icon) : null
  return (
    <>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.imageAlt || ''} className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-200" />
      )}
      <div className="pointer-events-none absolute inset-0" style={{ background: WASH }} />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 md:gap-2 md:p-6">
        {Icon ? (
          <span className="flex justify-end" style={{ color: colorVar(style.iconColor || '50') }}>
            <Icon size={24} weight="regular" aria-hidden className="md:!size-11" />
          </span>
        ) : null}
        {item.title ? (
          <p className={cx('m-0 line-clamp-2 text-sm leading-tight md:text-lg md:leading-[1.3]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'cardTitleColor', '50', 'semibold')}>
            <LinkedText text={item.title} links={links} enabled={showLinks} {...linkStyle(style)} />
          </p>
        ) : null}
        {item.description ? (
          <p className={cx('m-0 line-clamp-2 text-xs leading-snug md:text-sm md:leading-[1.5]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'cardDescriptionColor', '50', 'normal')}>
            <LinkedText text={item.description} links={links} enabled={showLinks} {...linkStyle(style)} />
          </p>
        ) : null}
      </div>
    </>
  )
}

/**
 * Static grid of overlay photo cards (Figma 40529:12570). A card becomes a link
 * only when that card has an href.
 */
const OverlayCards = ({
  title = '',
  subtitle = '',
  items = [],
  links = [],
  showLinks = true,
  showHeader = true,
  showSubtitle = true,
  columns = '4',
  headerAlign = 'start',
  cardRadius = 'xl',
  sectionPadding = 'none',
  iconColor = '50',
  ...textStyle
}) => {
  if (!title && !subtitle && !items.length) return null
  const style = { showLinks, iconColor, ...textStyle }
  const alignStart = headerAlign !== 'center'
  const radius = RADIUS_CLASS[cardRadius] ?? RADIUS_CLASS.xl
  const padding = SECTION_PADDING[sectionPadding] ?? ''

  return (
    <section className={cx('flex flex-col gap-4 md:gap-6', padding)}>
      {showHeader && (title || (showSubtitle && subtitle)) ? (
        <div className={cx('flex max-w-[760px] flex-col gap-2', alignStart ? 'items-start text-start' : 'mx-auto items-center text-center')}>
          {title ? (
            <h2 className={cx('m-0 text-2xl leading-tight md:text-[32px] md:leading-[1.1]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'titleColor', '800', 'semibold')}>
              <LinkedText text={title} links={links} enabled={showLinks} {...linkStyle(style)} />
            </h2>
          ) : null}
          {showSubtitle && subtitle ? (
            <p className={cx('m-0 text-sm leading-normal md:text-lg', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'subtitleColor', '700', 'normal')}>
              <LinkedText text={subtitle} links={links} enabled={showLinks} {...linkStyle(style)} />
            </p>
          ) : null}
        </div>
      ) : null}
      {items.length ? (
        <div className={cx('grid gap-3 md:gap-4', COLUMNS_CLASS[columns] ?? COLUMNS_CLASS[4])}>
          {items.map((item, index) => {
            const className = cx('relative block h-[168px] overflow-hidden text-inherit no-underline md:h-[240px] lg:h-[300px]', radius)
            const face = <CardFace item={item} style={style} links={links} showLinks={showLinks} />
            if (!item.href) {
              return <article key={item.id || index} className={className}>{face}</article>
            }
            if (/^https?:/i.test(item.href)) {
              return <a key={item.id || index} href={item.href} className={className}>{face}</a>
            }
            return <LocalizedLink key={item.id || index} to={item.href} className={className}>{face}</LocalizedLink>
          })}
        </div>
      ) : null}
    </section>
  )
}

export default OverlayCards
