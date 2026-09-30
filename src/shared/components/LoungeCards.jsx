import { useRef, useState } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const RADIUS_CLASS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
}
const CARD_BASIS = {
  1: 'w-full',
  2: 'w-full md:w-[calc(50%-8px)]',
  3: 'w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]',
  4: 'w-[85%] md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}
const TITLE_SIZE = 'text-2xl leading-[normal] md:text-[28px]'
const CARD_TITLE_SIZE = 'text-base leading-[normal]'
const CARD_DESCRIPTION_SIZE = 'text-xs leading-[normal]'
const WASH = 'linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(1,38,59,0.8) 100%)'
const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Overlay lounge cards in a scrolling row (Figma 40442:12318).
 */
const LoungeCards = ({
  title = '',
  items = [],
  showHeader = true,
  columns = '4',
  radius = 'xl',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showOverlay = true,
  showArrows = true,
  showDots = true,
  showLink = true,
  showLinkIcon = true,
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  dir = 'ltr',
  ...textStyle
}) => {
  const scrollerRef = useRef(null)
  const [active, setActive] = useState(0)
  if (!title && !items.length) return null

  const linkProps = { links, enabled: showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic }
  const radiusClass = RADIUS_CLASS[radius] ?? RADIUS_CLASS.xl
  const basisClass = CARD_BASIS[columns] ?? CARD_BASIS[4]
  const rtl = dir === 'rtl'

  const scrollByCard = (direction) => {
    const el = scrollerRef.current
    const card = el?.querySelector('[data-lounge-card]')
    if (!el || !card) return
    const amount = card.getBoundingClientRect().width + 16
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * amount, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = scrollerRef.current
    const card = el?.querySelector('[data-lounge-card]')
    if (!el || !card) return
    const width = card.getBoundingClientRect().width + 16
    if (!width) return
    setActive(Math.min(items.length - 1, Math.round(Math.abs(el.scrollLeft) / width)))
  }

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
      dir={dir}
    >
      <div className="flex flex-col items-center gap-8">
        {showHeader && title ? (
          <h2 className={cx('m-0 w-full', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}>
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {items.length ? (
          <div className="relative w-full">
            <div
              ref={scrollerRef}
              onScroll={onScroll}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {items.map((item, index) => {
                const Icon = showLink && showLinkIcon && item.icon ? resolvePhosphorIcon(item.icon) : null
                const showItemLink = showLink && item.href && Icon
                return (
                  <article key={item.id || index} data-lounge-card className={cx('relative h-[320px] shrink-0 snap-start overflow-hidden', basisClass, radiusClass)}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.imageAlt || ''} className="absolute inset-0 size-full object-cover" />
                    ) : (
                      <span className="absolute inset-0 bg-secondary-2" />
                    )}
                    {showOverlay ? <span aria-hidden className="absolute inset-0" style={{ backgroundImage: WASH }} /> : null}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-5 pb-5">
                      {item.title ? (
                        <h3 className={cx('m-0', CARD_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'cardTitleColor', '50', 'semibold')}>
                          <LinkedText text={item.title} {...linkProps} />
                        </h3>
                      ) : null}
                      {item.description ? (
                        <p className={cx('m-0', CARD_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)} style={{ ...getTextStyleVars(textStyle, 'cardDescriptionColor', '50', 'normal'), opacity: 0.8 }}>
                          <LinkedText text={item.description} {...linkProps} />
                        </p>
                      ) : null}
                      {showItemLink ? (
                        <LocalizedLink href={item.href} aria-label={item.title || 'Open'} className="mt-1 flex size-[34px] items-center justify-center rounded-full no-underline" style={{ backgroundColor: colorVar(arrowBadgeBg) || colorVar('primary-1') }}>
                          <Icon size={16} weight="bold" aria-hidden className="rtl:-scale-x-100" style={{ color: colorVar(arrowColor) || colorVar('50') }} />
                        </LocalizedLink>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
            {showArrows && items.length > 1 ? (
              <>
                <button type="button" aria-label="Previous" onClick={() => scrollByCard(-1)} className="absolute start-[-20px] top-1/2 z-[1] flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e5e0] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.06)]">
                  <CaretLeftIcon size={18} className="rtl:rotate-180" aria-hidden />
                </button>
                <button type="button" aria-label="Next" onClick={() => scrollByCard(1)} className="absolute end-[-20px] top-1/2 z-[1] flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e5e0] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.06)]">
                  <CaretRightIcon size={18} className="rtl:rotate-180" aria-hidden />
                </button>
              </>
            ) : null}
          </div>
        ) : null}
        {showDots && items.length > 1 ? (
          <div className="flex items-center gap-1.5" aria-hidden>
            {items.map((item, index) => (
              <span key={item.id || index} className={cx('size-2 rounded-full', index === active ? 'bg-primary-1' : 'bg-300')} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default LoungeCards
