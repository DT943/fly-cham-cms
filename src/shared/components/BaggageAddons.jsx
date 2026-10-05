import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import useBaggageQuery from '../hooks/useBaggageQuery.js'

// Keep byte-identical with the cms2 BaggageAddons block.
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}
const COLUMNS_CLASS = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
}
// Pinned px sizes from Figma 40814:24329.
const TITLE_SIZE = 'text-lg leading-[normal] md:text-2xl'
const LABEL_SIZE = 'text-[22px] leading-[normal]'
const PRICE_SIZE = 'text-base leading-[normal]'
const CARD_CLASS =
  'flex h-[172px] w-[160px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-xl px-[11px] py-1.5 text-center no-underline md:w-auto'
const CARD_SHADOW = 'shadow-[0px_2px_1px_rgba(33,37,41,0.06),0px_0px_0.5px_rgba(33,37,41,0.08)]'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * CMS-driven "Additional baggage" cards (Figma 40814:24329). Hidden until
 * Calculate unless `onlyAfterCalculate` is off; scrolls sideways on mobile.
 */
const BaggageAddons = ({
  title = '',
  items = [],
  links = [],
  onlyAfterCalculate = true,
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  columns = '4',
  cardBg = 'background',
  showCardShadow = false,
  iconColor = 'primary-1',
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const query = useBaggageQuery()
  if (onlyAfterCalculate && !query.calculated) return null
  const rows = items.filter((item) => item.label || item.price)
  if (!title && !rows.length) return null

  const linkProps = { links, enabled: showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic }
  const cardClass = cx(CARD_CLASS, showCardShadow ? CARD_SHADOW : '')
  const cardStyle = { backgroundColor: colorVar(cardBg) }

  const inner = (
    <div className="flex flex-col gap-4">
      {title ? (
        <h2
          className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
        >
          <LinkedText text={title} {...linkProps} />
        </h2>
      ) : null}
      {rows.length ? (
        <div
          className={cx(
            '-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0',
            COLUMNS_CLASS[columns] || COLUMNS_CLASS[4],
          )}
        >
          {rows.map((item, index) => {
            const Icon = resolvePhosphorIcon(item.icon || 'SuitcaseRolling')
            const content = (
              <>
                <Icon size={60} weight="fill" aria-hidden style={{ color: colorVar(iconColor) }} />
                {item.label ? (
                  <span className={cx(LABEL_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'labelColor', '800', 'semibold')}>
                    {item.label}
                  </span>
                ) : null}
                {item.price ? (
                  <span className={cx(PRICE_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'valueColor', '700', 'medium')}>
                    {item.price}
                  </span>
                ) : null}
              </>
            )
            const key = item.id ? `${item.id}-${index}` : index
            return item.href ? (
              <LocalizedLink key={key} href={item.href} className={cardClass} style={cardStyle}>
                {content}
              </LocalizedLink>
            ) : (
              <div key={key} className={cardClass} style={cardStyle}>
                {content}
              </div>
            )
          })}
        </div>
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

export default BaggageAddons
