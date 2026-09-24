import { useId, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

const CARD_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

const AccordionItem = ({
  item,
  showDivider,
  dividerColor,
  iconColor,
  textStyle,
  linkProps,
}) => {
  const [open, setOpen] = useState(item.defaultOpen !== false)
  const buttonId = useId()
  const panelId = useId()

  return (
    <div
      className={showDivider ? 'border-t border-solid' : ''}
      style={showDivider ? { borderColor: colorVar(dividerColor) } : undefined}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className={cx(
            'flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-0 py-5 text-start',
            typography.itemTitle,
            CMS_TEXT_HOVER_CLASS,
          )}
          style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
        >
          <span className="min-w-0">
            <LinkedText text={item.title} {...linkProps} />
          </span>
          <CaretDown
            size={18}
            weight="regular"
            className={cx('shrink-0 transition-transform duration-300', open && 'rotate-180')}
            style={{ color: colorVar(iconColor) }}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cx(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {item.body ? (
            <p
              className={cx(
                'm-0 pb-5 leading-relaxed',
                typography.itemDescription,
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(textStyle, 'bodyColor', '600', 'normal')}
            >
              <LinkedText text={item.body} {...linkProps} />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/**
 * Single white card with stacked expandable sections (title + body),
 * separated by dividers. Matches the seat-selection Terms design.
 */
const InfoAccordion = ({
  items = [],
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  cardRadius = 'sm',
  dividerColor = '200',
  iconColor = '700',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!items.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const radiusClass = CARD_RADIUS[cardRadius] || CARD_RADIUS.sm

  const card = (
    <div
      className={cx(
        'overflow-hidden px-5 shadow-[0px_2px_1px_rgba(33,37,41,0.06),0px_0px_0.5px_rgba(33,37,41,0.08)] sm:px-6',
        radiusClass,
      )}
      style={{ backgroundColor: colorVar(cardBg) }}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={item.id || index}
          item={item}
          showDivider={index > 0}
          dividerColor={dividerColor}
          iconColor={iconColor}
          textStyle={textStyle}
          linkProps={linkProps}
        />
      ))}
    </div>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )

  if (!sectionClass) return card
  return (
    <div
      className={sectionClass}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {card}
    </div>
  )
}

export default InfoAccordion
