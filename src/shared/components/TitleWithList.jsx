import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 TitleWithList block.
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}
const ITEM_GAP_CLASS = {
  tight: 'gap-2 md:gap-3',
  default: 'gap-4 md:gap-[19px]',
  loose: 'gap-6 md:gap-8',
}

// Pinned px sizes from Figma 40814:21989 (desktop) / 40814:22209 (mobile).
const TITLE_SIZE = 'text-lg leading-[27px]'
const ITEM_SIZE = 'text-sm leading-6 md:text-base'

const cx = (...parts) => parts.filter(Boolean).join(' ')

function Bullet({ item, index, bulletStyle, bulletColor }) {
  const color = colorVar(bulletColor)
  if (bulletStyle === 'icon') {
    const Icon = resolvePhosphorIcon(item.icon || 'CheckCircle')
    return <Icon size={18} aria-hidden className="mt-[3px] shrink-0" style={{ color }} />
  }
  if (bulletStyle === 'number') {
    return (
      <span className={cx('shrink-0 font-semibold', ITEM_SIZE)} style={{ color }}>
        {index + 1}.
      </span>
    )
  }
  return (
    <span aria-hidden className={cx('shrink-0', ITEM_SIZE)} style={{ color }}>
      •
    </span>
  )
}

/**
 * CMS-driven "Important Information" block (Figma 40814:21989): icon + title,
 * then a bulleted list. Mirrors the cms2 TitleWithList block.
 */
const TitleWithList = ({
  icon = '',
  title = '',
  items = [],
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showCardBg = false,
  cardBg = 'background',
  itemGap = 'default',
  showIcon = true,
  iconColor = 'primary-1',
  bulletStyle = 'dot',
  bulletColor = 'secondary',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const rows = items.filter((item) => item?.text)
  if (!title && !rows.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const TitleIcon = showIcon !== false ? resolvePhosphorIcon(icon || 'Info') : null

  const inner = (
    <div
      className="flex flex-col gap-[15px] rounded-xl px-[17px] py-3 md:px-[27px]"
      style={showCardBg ? { backgroundColor: colorVar(cardBg) } : undefined}
    >
      {title ? (
        <div className="flex items-start gap-3">
          {TitleIcon ? (
            <TitleIcon size={24} aria-hidden className="mt-0.5 shrink-0" style={{ color: colorVar(iconColor) }} />
          ) : null}
          <h2
            className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'medium')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        </div>
      ) : null}
      {rows.length ? (
        <ul className={cx('m-0 flex list-none flex-col p-0', ITEM_GAP_CLASS[itemGap] || ITEM_GAP_CLASS.default)}>
          {rows.map((item, index) => (
            <li key={item.id ? `${item.id}-${index}` : index} className="flex items-start gap-2">
              <Bullet item={item} index={index} bulletStyle={bulletStyle} bulletColor={bulletColor} />
              <span
                className={cx('min-w-0 flex-1', ITEM_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'itemColor', '800', 'normal')}
              >
                <LinkedText text={item.text} {...linkProps} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )

  const sectionClass = SECTION_PADDING[sectionPadding] || ''
  if (!sectionClass && !showSectionBg) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default TitleWithList
