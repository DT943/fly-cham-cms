import { useEffect, useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import {
  colorVar,
  colorMix,
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
} from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'
import { DEFAULT_FORM_ICON } from '../utils/formsDirectoryIcons.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

// Local token → class maps that match flychamadmin cms2's FormsDirectory style
// tokens exactly, so the public render mirrors the editor preview.
const SECTION_PADDING_CLASS = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const CARD_GAP_CLASS = {
  tight: 'gap-3 md:gap-4',
  default: 'gap-4 md:gap-5',
  loose: 'gap-5 md:gap-8',
}

const CARD_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const COLUMNS_CLASS = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
}

const FormCard = ({ card, style, links, showLinks }) => {
  const Icon = card.icon || DEFAULT_FORM_ICON
  const radiusClass = CARD_RADIUS_CLASS[style.cardRadius] ?? CARD_RADIUS_CLASS.lg
  // The whole card is an <a> when card.href is set, so never nest LinkedText's
  // own <a> inside it — fall back to plain text for anchor-wrapped cards.
  const isAnchorWrapped = Boolean(card.href)

  const className = cx(
    'flex h-full w-full flex-col gap-4 p-5 md:p-6 text-start no-underline text-inherit',
    'shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)]',
    radiusClass,
  )
  const cardStyle = {
    backgroundColor: style.showCardBg ? colorVar(style.cardBg || 'background') : 'transparent',
  }

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        {style.showIcon && (
          <span
            className="flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: colorVar(style.iconBg || '100') }}
          >
            <Icon size={26} weight="regular" aria-hidden style={{ color: colorVar(style.iconColor || '700') }} />
          </span>
        )}
        {style.showCategory && card.category && (
          <span
            className={cx(typography.caption, 'whitespace-nowrap rounded-full px-3.5 py-1 font-medium', CMS_TEXT_HOVER_CLASS)}
            style={{
              ...getTextStyleVars(style, 'categoryColor', 'primary-1'),
              backgroundColor: colorMix('secondary-1', 20),
            }}
          >
            {isAnchorWrapped ? (
              card.category
            ) : (
              <LinkedText text={card.category} links={links} enabled={showLinks} {...linkStyle(style)} />
            )}
          </span>
        )}
      </div>

      <h3
        className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
        style={getTextStyleVars(style, 'cardTitleColor', '700')}
      >
        {isAnchorWrapped ? (
          card.title
        ) : (
          <LinkedText text={card.title} links={links} enabled={showLinks} {...linkStyle(style)} />
        )}
      </h3>

      <div className="mt-auto flex items-end justify-between gap-3">
        {style.showDescription && card.description ? (
          <p
            className={cx(typography.caption, 'm-0 flex-1 leading-snug', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(style, 'descriptionColor', '600')}
          >
            {isAnchorWrapped ? (
              card.description
            ) : (
              <LinkedText text={card.description} links={links} enabled={showLinks} {...linkStyle(style)} />
            )}
          </p>
        ) : (
          <span className="flex-1" />
        )}
        {style.showArrow && (
          <div
            className="flex h-9 w-9 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: colorVar(style.arrowBg || 'primary-1') }}
          >
            <ArrowRight
              size={20}
              weight="bold"
              aria-hidden
              className="rtl:-scale-x-100"
              style={{ color: colorVar(style.arrowColor || '50') }}
            />
          </div>
        )}
      </div>
    </>
  )

  if (card.href) {
    return (
      <LocalizedLink href={card.href} className={className} style={cardStyle}>
        {body}
      </LocalizedLink>
    )
  }
  return (
    <div className={className} style={cardStyle}>
      {body}
    </div>
  )
}

/** Pull the backlink style keys out of the flat style object for LinkedText. */
const linkStyle = (style) => ({
  linkColor: style.linkColor,
  linkHoverColor: style.linkHoverColor,
  linkFontWeight: style.linkFontWeight,
  linkUnderline: style.linkUnderline,
  linkItalic: style.linkItalic,
})

/**
 * CMS-driven forms directory — a tabbed grid of request-form cards grouped by
 * travel stage. Fully dynamic: content (tabs + cards) and every style key come
 * from the CMS block, each key falling through to the original look when unset.
 * Mirrors flychamadmin cms2's FormsDirectory renderer.
 */
const FormsDirectory = ({
  tabs = [],
  links = [],
  showLinks = true,
  showTitle = true,
  showIcon = true,
  showCategory = true,
  showDescription = true,
  showArrow = true,
  showCardBg = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  columns = '3',
  cardGap = 'default',
  cardRadius = 'lg',
  ...rest
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= tabs.length) setActiveIndex(0)
  }, [tabs.length, activeIndex])

  if (!tabs.length) return null

  const style = {
    showTitle,
    showIcon,
    showCategory,
    showDescription,
    showArrow,
    showCardBg,
    sectionBg,
    sectionPadding,
    columns,
    cardGap,
    cardRadius,
    showLinks,
    ...rest,
  }

  const paddingClass = SECTION_PADDING_CLASS[sectionPadding] ?? SECTION_PADDING_CLASS.default
  const gapClass = CARD_GAP_CLASS[cardGap] ?? CARD_GAP_CLASS.default
  const columnsClass = COLUMNS_CLASS[String(columns)] ?? COLUMNS_CLASS[3]
  const activeTab = tabs[activeIndex] || tabs[0]
  const showTabs = tabs.length > 1

  return (
    <section
      className={cx(
        'flex flex-col gap-4 md:gap-6',
        paddingClass,
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {showTabs && (
        <div role="tablist" className="flex w-full gap-2 md:gap-3">
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={`${tab.label}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(index)}
                className={cx(
                  typography.caption,
                  'm-0 box-border shrink grow basis-0 cursor-pointer whitespace-normal rounded-lg border-none px-2 py-2.5 text-center font-medium sm:px-3 sm:py-3 md:px-4',
                )}
                style={{
                  backgroundColor: isActive
                    ? colorVar(style.tabActiveBg || 'primary-1')
                    : colorVar(style.tabInactiveBg || '200'),
                  color: isActive
                    ? colorVar(style.tabActiveText || '50')
                    : colorVar(style.tabInactiveText || '700'),
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      {showTitle && activeTab?.label && (
        <h2
          className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(style, 'titleColor', 'primary-1', 'semibold')}
        >
          <LinkedText text={activeTab.label} links={links} enabled={showLinks} {...linkStyle(style)} />
        </h2>
      )}

      {activeTab && (
        <div className={cx('grid grid-cols-1', columnsClass, gapClass)}>
          {(activeTab.cards || []).map((card, index) => (
            <FormCard
              key={`${card.title}-${index}`}
              card={card}
              style={style}
              links={links}
              showLinks={showLinks}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FormsDirectory
