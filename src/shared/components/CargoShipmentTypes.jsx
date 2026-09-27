import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import requestImage from '../../assets/images/cargo-service/request.jpg'
import stationsImage from '../../assets/images/cargo-service/stations.jpg'
import assistanceImage from '../../assets/images/cargo-service/assistance.png'
import heroImage from '../../assets/images/cargo-service/hero.jpg'

/** Bundled fallback images keyed by shipment id (used when the CMS image is empty). */
const IMAGE_BY_ID = {
  airFreight: requestImage,
  perishables: heroImage,
  pharma: stationsImage,
  liveAnimals: assistanceImage,
  aog: requestImage,
  sensitive: stationsImage,
  dangerous: heroImage,
  charter: requestImage,
}

/** Figma inactive-tab text — no theme token matches it exactly. */
const INACTIVE_TAB_FALLBACK_COLOR = '#6E6E6A'

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const IMAGE_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-[8px]',
  md: 'rounded-[12px]',
  lg: 'rounded-[16px]',
}

const TITLE_SIZE = 'text-xl sm:text-2xl md:text-3xl lg:text-[24px] lg:leading-[normal]'
const DESCRIPTION_SIZE =
  'text-sm leading-relaxed sm:text-base md:text-lg lg:text-[16px] lg:leading-[normal]'
const PANEL_TITLE_SIZE = 'text-base leading-snug md:text-lg lg:text-[24px] lg:leading-[normal]'
const PANEL_BODY_SIZE =
  'text-sm leading-relaxed sm:text-base md:text-lg lg:text-[16px] lg:leading-[1.5]'
const TAB_SIZE = 'text-xs sm:text-sm lg:text-[14px] lg:leading-[normal]'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const cx = (...parts) => parts.filter(Boolean).join(' ')

function inactiveTabVars(style) {
  const vars = getTextStyleVars(style, 'tabColor', '600', 'medium')
  if (!style.tabColor) vars.color = INACTIVE_TAB_FALLBACK_COLOR
  if (!style.tabColorHover && !style.tabColor) vars['--cms-hc'] = INACTIVE_TAB_FALLBACK_COLOR
  return vars
}

function nextIndexForKey(event, index, count) {
  const rtl =
    typeof window !== 'undefined' &&
    window.getComputedStyle(event.currentTarget).direction === 'rtl'
  switch (event.key) {
    case 'ArrowRight':
      return rtl ? (index - 1 + count) % count : (index + 1) % count
    case 'ArrowLeft':
      return rtl ? (index + 1) % count : (index - 1 + count) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}

/**
 * CMS-driven "A Wide Range of Shipment Types" block (cargo-shipment-types).
 * Header + one card with an underline tab bar (animated indicator) and a
 * text/image panel at lg+; scrollable pill tabs above a stacked card below lg.
 * Mirrors flychamadmin cms2 CargoShipmentTypesPanel; defaults = Figma tokens.
 * Not full-bleed: PageBlocks wraps it in the page Container.
 */
const CargoShipmentTypes = ({
  title = '',
  description = '',
  tabsLabel = '',
  items = [],
  showHeader = true,
  showDescription = true,
  sectionPadding = 'default',
  imageRadius = 'md',
  cardBg = '50',
  indicatorColor = 'primary-1',
  dividerColor = '200',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const { t } = useTranslation()
  const baseId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const current = Math.min(activeIndex, Math.max(items.length - 1, 0))
  const active = items[current]

  const desktopTabs = useRef([])
  const mobileTabs = useRef([])
  const tablistRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false })

  const measure = useCallback(() => {
    const el = desktopTabs.current[current]
    if (!el) return
    setIndicator((prev) => ({
      left: el.offsetLeft,
      width: el.offsetWidth,
      ready: prev.ready || el.offsetWidth > 0,
    }))
  }, [current])

  useIsoLayoutEffect(() => {
    measure()
  }, [measure, items.length, active?.label])

  useEffect(() => {
    const node = tablistRef.current
    if (!node || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => measure())
    observer.observe(node)
    return () => observer.disconnect()
  }, [measure])

  if (!items.length || !active) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const ariaLabel = tabsLabel || t('cargoService.shipments.tabsLabel')
  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS.md
  const cardBgCss = colorVar(cardBg || '50')
  const dividerCss = colorVar(dividerColor || '200')
  const indicatorCss = colorVar(indicatorColor || 'primary-1')
  const activeVars = getTextStyleVars(textStyle, 'currentColor', 'primary-1', 'semibold')
  const inactiveVars = inactiveTabVars(textStyle)
  const pillActiveText = colorVar('50')

  const panelId = `${baseId}-panel`
  const tabId = (index, variant) => `${baseId}-${variant}-tab-${index}`

  const handleKeyDown = (event, index, refs) => {
    const next = nextIndexForKey(event, index, items.length)
    if (next === null) return
    event.preventDefault()
    setActiveIndex(next)
    refs.current[next]?.focus()
    refs.current[next]?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }

  const src = active.image || IMAGE_BY_ID[active.id] || IMAGE_BY_ID.airFreight
  const headerVisible = showHeader && (title || (showDescription && description))

  return (
    <section className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? SECTION_PADDING.default)}>
      <div className="flex min-w-0 flex-col gap-5 md:gap-6 lg:gap-[29px]">
        {headerVisible ? (
          <div className="flex max-w-3xl flex-col gap-2 md:gap-3 lg:max-w-none lg:gap-[13px]">
            {title ? (
              <h2
                className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showDescription && description ? (
              <p
                className={cx('m-0', DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}

        <div
          className="flex min-w-0 flex-col gap-4 lg:h-[374px] lg:gap-0 lg:overflow-hidden lg:rounded-[16px] lg:bg-[color:var(--cst-card)]"
          style={{ '--cst-card': cardBgCss, '--cst-divider': dividerCss }}
        >
          {/* < lg: scrollable pill tabs */}
          <div
            role="tablist"
            aria-label={ariaLabel}
            className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] sm:mx-0 sm:w-full sm:px-0 lg:hidden"
          >
            {items.map((item, index) => {
              const isActive = index === current
              return (
                <button
                  key={`m-${item.id || index}`}
                  ref={(el) => {
                    mobileTabs.current[index] = el
                  }}
                  type="button"
                  role="tab"
                  id={tabId(index, 'm')}
                  aria-selected={isActive}
                  aria-controls={panelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => handleKeyDown(e, index, mobileTabs)}
                  className={cx(
                    'm-0 shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 transition-colors duration-200',
                    TAB_SIZE,
                    CMS_TEXT_HOVER_CLASS,
                    isActive ? 'border-0' : 'border border-solid',
                  )}
                  style={
                    isActive
                      ? {
                          ...activeVars,
                          color: pillActiveText,
                          '--cms-hc': pillActiveText,
                          backgroundColor: indicatorCss,
                        }
                      : {
                          ...inactiveVars,
                          backgroundColor: colorVar('100'),
                          borderColor: dividerCss,
                        }
                  }
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* lg+: underline tab bar with animated indicator */}
          <div className="no-scrollbar hidden overflow-x-auto [scrollbar-width:none] lg:block">
            <div
              ref={tablistRef}
              role="tablist"
              aria-label={ariaLabel}
              className="relative flex h-[50px] w-max min-w-full"
            >
              {items.map((item, index) => {
                const isActive = index === current
                return (
                  <button
                    key={`d-${item.id || index}`}
                    ref={(el) => {
                      desktopTabs.current[index] = el
                    }}
                    type="button"
                    role="tab"
                    id={tabId(index, 'd')}
                    aria-selected={isActive}
                    aria-controls={panelId}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(e) => handleKeyDown(e, index, desktopTabs)}
                    className={cx(
                      'm-0 flex h-[49px] flex-auto cursor-pointer items-center justify-center whitespace-nowrap border-0 bg-transparent px-4 transition-colors duration-200',
                      TAB_SIZE,
                      CMS_TEXT_HOVER_CLASS,
                    )}
                    style={isActive ? activeVars : inactiveVars}
                  >
                    {item.label}
                  </button>
                )
              })}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                style={{ backgroundColor: dividerCss }}
              />
              <span
                aria-hidden
                className={cx(
                  'pointer-events-none absolute bottom-0 h-[2px] rounded-full',
                  indicator.ready &&
                    'transition-[left,width] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]',
                )}
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  backgroundColor: indicatorCss,
                  opacity: indicator.ready ? 1 : 0,
                }}
              />
            </div>
          </div>

          <div
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId(current, 'd')}
            className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-solid border-[color:var(--cst-divider)] bg-[color:var(--cst-card)] p-4 sm:p-5 lg:h-[324px] lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-[46px] lg:py-6"
          >
            <div className="order-2 flex min-w-0 flex-col gap-2 lg:order-1 lg:w-[433px] lg:max-w-[45%] lg:gap-4">
              {active.title ? (
                <h3
                  className={cx('m-0', PANEL_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'itemTitleColor', '700', 'semibold')}
                >
                  <LinkedText text={active.title} {...linkProps} />
                </h3>
              ) : null}
              {active.description ? (
                <p
                  className={cx('m-0', PANEL_BODY_SIZE, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'itemBodyColor', '700', 'normal')}
                >
                  <LinkedText text={active.description} {...linkProps} />
                </p>
              ) : null}
            </div>

            <div
              className={cx(
                'order-1 shrink-0 overflow-hidden lg:order-2 lg:h-[276px] lg:w-[473px] lg:max-w-[48%]',
                radiusClass,
              )}
            >
              <img
                key={src}
                src={src}
                alt={active.imageAlt || ''}
                className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CargoShipmentTypes
