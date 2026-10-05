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
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

function Tile({ item, style, links, showLinks }) {
  const Icon = item.icon ? resolvePhosphorIcon(item.icon) : null
  const linked = style.showLink !== false && item.cta && item.href
  const body = (
    <>
      {Icon ? (
        <span className="flex size-10 items-center justify-center md:size-[55px]" style={{ color: colorVar(style.iconColor || '700') }}>
          <Icon size={24} weight="regular" aria-hidden className="md:!size-10" />
        </span>
      ) : null}
      {item.title ? (
        <p className={cx('m-0 text-center text-sm leading-snug md:text-base md:leading-[normal]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'cardTitleColor', '700', 'semibold')}>
          <LinkedText text={item.title} links={links} enabled={showLinks} />
        </p>
      ) : null}
      {item.description ? (
        <p className={cx('m-0 text-center text-[11px] leading-snug md:text-xs md:leading-[normal]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'cardDescriptionColor', '700', 'normal')}>
          <LinkedText text={item.description} links={links} enabled={showLinks} />
        </p>
      ) : null}
    </>
  )
  const className = 'flex flex-col items-center gap-1.5 rounded-xl bg-white p-3 text-inherit no-underline  md:gap-2 md:p-6'
  if (linked) {
    return (
      <LocalizedLink href={item.href} className={className}>
        {body}
      </LocalizedLink>
    )
  }
  return <div className={className}>{body}</div>
}

/**
 * Centered heading and a row of white cards, each a Phosphor icon with a
 * short title and description. Used for the meals tasting strip.
 */
const IconTiles = ({
  title = '',
  subtitle = '',
  items = [],
  links = [],
  columns = '4',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showHeader = true,
  showSubtitle = true,
  showLinks = true,
  ...style
}) => {
  const list = items.filter((item) => item?.title || item?.description || item?.icon)
  if (!title && !subtitle && !list.length) return null
  const linkProps = { links, enabled: showLinks }

  return (
    <section
      className={cx('w-full', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col items-center gap-5 md:gap-8">
        {showHeader !== false && (title || (showSubtitle !== false && subtitle)) ? (
          <div className="flex max-w-[760px] flex-col items-center gap-2 text-center">
            {title ? (
              <h2 className={cx('m-0 text-xl leading-snug md:text-2xl md:leading-[normal] lg:text-[28px]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'titleColor', '700', 'semibold')}>
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showSubtitle !== false && subtitle ? (
              <p className={cx('m-0 text-sm leading-snug md:text-base md:leading-[normal]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'subtitleColor', '700', 'normal')}>
                <LinkedText text={subtitle} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}
        {list.length ? (
          <div className={cx('grid w-full gap-3 md:gap-4', COLUMNS_CLASS[columns] || COLUMNS_CLASS[4])}>
            {list.map((item, index) => (
              <Tile key={item.id || index} item={item} style={style} links={links} showLinks={showLinks} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default IconTiles
