import { ArrowRight } from '@phosphor-icons/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { typography } from '../../../../styles/typography.js'
import Container from '../../../components/Container.jsx'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import {
  HDR_GROUP,
  HDR_GROUP_COLOR,
  HDR_GROUP_TEXT,
  colorVar,
  headerHref,
  headerIcon,
  hrefMatchesHeaderPath,
  roleStyle,
} from '../headerStyle.js'

const scrollTabToStart = (nav, tab) => {
  const navRect = nav.getBoundingClientRect()
  const tabRect = tab.getBoundingClientRect()
  const styles = getComputedStyle(nav)
  const rtl = styles.direction === 'rtl'
  const paddingStart = Number.parseFloat(rtl ? styles.paddingRight : styles.paddingLeft) || 0
  const delta = rtl
    ? tabRect.right - (navRect.right - paddingStart)
    : tabRect.left - (navRect.left + paddingStart)

  nav.scrollTo({ left: nav.scrollLeft + delta, behavior: 'smooth' })
}

/** Left rail: the tabs that switch the panel content. */
const MegaMenuSidebar = ({ menuId, menuLabel, tabs, activeId, onSelect, headerStyle: hs }) => {
  const navRef = useRef(null)
  const tabRefs = useRef({})
  const placed = useRef(false)
  const [line, setLine] = useState({
    vertical: true,
    offset: 0,
    size: 0,
    animate: false,
  })

  useLayoutEffect(() => {
    placed.current = false
  }, [menuId])

  useLayoutEffect(() => {
    const nav = navRef.current
    const tab = tabRefs.current[activeId]
    if (!nav || !tab) return

    const place = () => {
      const current = tabRefs.current[activeId]
      if (!current) return
      const vertical = window.matchMedia('(min-width: 1024px)').matches
      setLine((previous) => ({
        vertical,
        offset: vertical ? current.offsetTop : current.offsetLeft,
        size: vertical ? current.offsetHeight : current.offsetWidth,
        animate: placed.current && previous.vertical === vertical,
      }))
      placed.current = true
    }

    place()
    const observer = new ResizeObserver(place)
    observer.observe(nav)

    if (nav.scrollWidth > nav.clientWidth + 1) scrollTabToStart(nav, tab)

    return () => observer.disconnect()
  }, [activeId, tabs])

  return (
    <nav
      ref={navRef}
      aria-label={menuLabel}
      className="no-scrollbar relative px-6 flex w-full shrink-0 flex-row overflow-x-auto border-b border-200 lg:w-[232px] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-e lg:py-6"
      style={{ backgroundColor: colorVar(hs.sidebarBg) }}
    >
      {tabs.map((tab) => {
        const Icon = headerIcon(tab.icon)
        const Badge = headerIcon(tab.badge)
        const isActive = tab.id === activeId
        const labelStyle = roleStyle({
          color: hs.tabColor,
          colorHover: hs.tabColorHover,
          weight: hs.tabFontWeight,
          weightHover: hs.tabFontWeightHover,
          active: isActive,
        })

        return (
          <button
            key={tab.id}
            type="button"
            ref={(node) => {
              tabRefs.current[tab.id] = node
            }}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelect(tab.id)}
            className={`${HDR_GROUP} relative flex shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap border-0 border-b-[3px] border-transparent bg-transparent ps-0 pe-6 py-4.5 text-start outline-none focus:outline-none focus-visible:outline-none lg:w-full lg:border-b-0 lg:ps-6 lg:pe-6`}
            style={{ color: labelStyle.color }}
          >
            {Icon && (
              <span
                className="relative shrink-0"
                style={{ color: colorVar(isActive ? hs.iconColorHover : hs.iconColor) }}
              >
                <Icon size={24} weight="regular" />
                {Badge && (
                  <span
                    className="absolute -bottom-1 -end-1 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: colorVar(hs.sidebarBg) }}
                  >
                    <Badge size={12} weight="fill" />
                  </span>
                )}
              </span>
            )}
            <span className={`${typography.body} ${HDR_GROUP_TEXT}`} style={labelStyle}>
              {tab.label}
            </span>
          </button>
        )
      })}
      <span
        aria-hidden
        className={`pointer-events-none absolute ${
          line.vertical ? 'start-0 hidden w-[3px] lg:block' : 'bottom-0 h-[3px] lg:hidden'
        } ${
          line.animate
            ? line.vertical
              ? 'transition-[top,height] duration-300 ease-out motion-reduce:transition-none'
              : 'transition-[left,width] duration-300 ease-out motion-reduce:transition-none'
            : ''
        }`}
        style={{
          backgroundColor: colorVar(hs.indicatorColor),
          ...(line.vertical
            ? { top: line.offset, height: line.size }
            : { left: line.offset, width: line.size }),
        }}
      />
    </nav>
  )
}

/** Promo image with a teal action bar (used by the link-style tabs). */
const MegaMenuPromo = ({ tab, onNavigate, headerStyle: hs }) => {
  if (!tab.imageUrl) return null

  return (
    <div className="hidden shrink-0 border-s border-200 ps-5 lg:block">
      <LocalizedLink
        to={headerHref(tab.ctaHref)}
        onClick={onNavigate}
        className="group relative flex w-full flex-col justify-end overflow-hidden rounded-[24px] no-underline outline-none focus:outline-none lg:w-[300px]"
      >
        <img
          src={tab.imageUrl}
          alt={tab.imageAlt}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {tab.ctaLabel ? (
          <span
            className="relative mt-40 flex items-center gap-2 px-4 py-4"
            style={{ backgroundColor: colorVar(hs.ctaBarBg) }}
          >
            <span
              className={typography.caption}
              style={roleStyle({ color: hs.ctaTextColor, weight: hs.ctaFontWeight })}
            >
              {tab.ctaLabel}
            </span>
            <ArrowRight
              size={16}
              weight="bold"
              className="rtl:-scale-x-100"
              style={{ color: colorVar(hs.ctaTextColor) }}
            />
          </span>
        ) : (
          <span className="relative mt-40 block py-4" aria-hidden />
        )}
      </LocalizedLink>
    </div>
  )
}

/** Two-column grid of icon links (Book & Manage, Travel Experience, Help). */
const MegaMenuLinks = ({ tab, onNavigate, headerStyle: hs, activePath = '' }) => {
  const descriptionStyle = roleStyle({
    color: hs.linkDescriptionColor,
    weight: hs.linkDescriptionFontWeight,
  })

  return (
    <div className="flex flex-1 flex-col gap-8 py-6 lg:flex-row lg:py-8">
      <div className="grid flex-1 grid-cols-1 content-start gap-x-6 gap-y-2 sm:grid-cols-2">
        {tab.links.map((link) => {
          const Icon = headerIcon(link.icon)
          const Badge = headerIcon(link.badge)
          const isCurrent = hrefMatchesHeaderPath(link.href, activePath)
          const iconStyle = roleStyle({
            color: hs.iconColor,
            colorHover: hs.iconColorHover,
            active: isCurrent,
          })
          const titleStyle = roleStyle({
            color: hs.linkTitleColor,
            colorHover: hs.linkTitleColorHover,
            weight: hs.linkTitleFontWeight,
            weightHover: hs.linkTitleFontWeightHover,
            active: isCurrent,
          })

          return (
            <LocalizedLink
              key={link.id}
              to={headerHref(link.href)}
              onClick={onNavigate}
              aria-current={isCurrent ? 'page' : undefined}
              className={`group ${HDR_GROUP} flex items-start gap-3 rounded-xl ps-0 pe-3 py-3 text-inherit no-underline outline-none transition-colors focus:outline-none lg:ps-3`}
            >
              {Icon && (
                <span className={`relative mt-0.5 shrink-0 ${HDR_GROUP_COLOR}`} style={iconStyle}>
                  <Icon size={24} weight="regular" />
                  {Badge && (
                    <span
                      className="absolute -bottom-1 -end-1 flex items-center justify-center rounded-full text-primary-1"
                      style={{ backgroundColor: colorVar(hs.panelBg) }}
                    >
                      <Badge size={13} weight="fill" />
                    </span>
                  )}
                </span>
              )}
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className={`${typography.body} ${HDR_GROUP_TEXT}`} style={titleStyle}>
                  {link.title}
                </span>
                {tab.withDescriptions && link.description && (
                  <span className={`${typography.caption} leading-snug`} style={descriptionStyle}>
                    {link.description}
                  </span>
                )}
              </span>
            </LocalizedLink>
          )
        })}
      </div>

      <MegaMenuPromo tab={tab} onNavigate={onNavigate} headerStyle={hs} />
    </div>
  )
}

/** Bottom-right "View all …" link shared by the card and map tabs. */
const MegaMenuInlineCta = ({ tab, onNavigate, headerStyle: hs }) => {
  if (!tab.ctaLabel) return null
  const color = colorVar(hs.inlineCtaColor)

  return (
    <div className="flex justify-end pb-2">
      <LocalizedLink
        to={headerHref(tab.ctaHref)}
        onClick={onNavigate}
        className="flex items-center gap-3 text-inherit no-underline outline-none focus:outline-none"
      >
        <span className={`${typography.caption} font-semibold`} style={{ color }}>
          {tab.ctaLabel}
        </span>
        <span
          className="flex size-7 items-center justify-center rounded-full border"
          style={{ color, borderColor: color }}
        >
          <ArrowRight size={14} weight="bold" className="rtl:-scale-x-100" />
        </span>
      </LocalizedLink>
    </div>
  )
}

const cardTitleStyle = (hs) => roleStyle({ color: hs.cardTitleColor, weight: hs.cardTitleFontWeight })

/** Where We Fly → Our Destinations (three image cards). */
const MegaMenuDestinations = ({ tab, onNavigate, headerStyle: hs }) => (
  <div className="flex flex-1 flex-col gap-4 py-6 lg:py-8">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tab.cards.map((card) => (
        <LocalizedLink
          key={card.id}
          to={headerHref(card.href)}
          onClick={onNavigate}
          className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-[24px] no-underline outline-none focus:outline-none"
        >
          {card.imageUrl && (
            <img
              src={card.imageUrl}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          )}
          {card.tag && (
            <span
              className={`${typography.caption} absolute start-0 top-5 px-2.5 py-1 font-semibold`}
              style={{ backgroundColor: colorVar(hs.tagBg), color: colorVar(hs.tagTextColor) }}
            >
              {card.tag}
            </span>
          )}
          <span
            className="relative flex items-center justify-between gap-3 px-4 py-3.5"
            style={{ backgroundColor: colorVar(hs.cardBarBg) }}
          >
            <span className={`${typography.itemTitle} truncate`} style={cardTitleStyle(hs)}>
              {card.name}
            </span>
            <span
              className={`${typography.caption} shrink-0 font-medium`}
              style={{ color: colorVar(hs.cardMetaColor) }}
            >
              {card.code}
            </span>
          </span>
        </LocalizedLink>
      ))}
    </div>

    <MegaMenuInlineCta tab={tab} onNavigate={onNavigate} headerStyle={hs} />
  </div>
)

/** Where We Fly → Activities to Do (image cards with location + tag chip). */
const MegaMenuActivities = ({ tab, onNavigate, headerStyle: hs }) => (
  <div className="flex flex-1 flex-col gap-4 py-6 lg:py-8">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tab.cards.map((card) => (
        <LocalizedLink
          key={card.id}
          to={headerHref(card.href)}
          onClick={onNavigate}
          className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-[24px] no-underline outline-none focus:outline-none"
        >
          {card.imageUrl && (
            <img
              src={card.imageUrl}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          )}
          <span
            className="relative flex items-center justify-between gap-3 px-4 py-3.5"
            style={{ backgroundColor: colorVar(hs.cardBarBg) }}
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className={`${typography.itemTitle} truncate`} style={cardTitleStyle(hs)}>
                {card.name}
              </span>
              {card.location && (
                <span className={`${typography.caption} truncate text-200`}>{card.location}</span>
              )}
            </span>
            {card.tag && (
              <span
                className={`${typography.caption} shrink-0 rounded-lg bg-white/20 px-2.5 py-1 font-medium text-50`}
              >
                {card.tag}
              </span>
            )}
          </span>
        </LocalizedLink>
      ))}
    </div>

    <MegaMenuInlineCta tab={tab} onNavigate={onNavigate} headerStyle={hs} />
  </div>
)

/** Where We Fly → Flight Schedules (route map). */
const MegaMenuMap = ({ tab, onNavigate, headerStyle: hs }) => (
  <div className="flex flex-1 flex-col gap-4 py-6 lg:py-8">
    <LocalizedLink
      to={headerHref(tab.ctaHref)}
      onClick={onNavigate}
      className="block h-64 overflow-hidden rounded-[24px] no-underline outline-none focus:outline-none lg:h-80"
    >
      <img src={tab.imageUrl} alt={tab.imageAlt} className="size-full object-cover" />
    </LocalizedLink>
    <MegaMenuInlineCta tab={tab} onNavigate={onNavigate} headerStyle={hs} />
  </div>
)

const contentByType = {
  links: MegaMenuLinks,
  destinations: MegaMenuDestinations,
  activities: MegaMenuActivities,
  map: MegaMenuMap,
}

/**
 * One header dropdown, rendered from a (normalised) header document menu —
 * see useSiteHeader. `headerStyle` is the document's `style` (theme tokens).
 */
const MegaMenu = ({ menu, headerStyle, onNavigate, embedded = false, currentLocation = null }) => {
  const ownsPage = currentLocation?.menuId === menu.id
  const currentTabId = ownsPage ? currentLocation.tabId : null
  const activePath = ownsPage ? currentLocation.path : ''
  const [activeId, setActiveId] = useState(currentTabId || menu.tabs[0]?.id)

  useEffect(() => {
    setActiveId(currentTabId || menu.tabs[0]?.id)
  }, [menu.id, currentTabId])

  const activeTab = menu.tabs.find((tab) => tab.id === activeId) || menu.tabs[0]
  if (!activeTab) return null
  const Content = contentByType[activeTab.type] || MegaMenuLinks

  const body = (
    <>
      <MegaMenuSidebar
        menuId={menu.id}
        menuLabel={menu.label}
        tabs={menu.tabs}
        activeId={activeTab.id}
        onSelect={setActiveId}
        headerStyle={headerStyle}
      />
      <div
        className={`flex min-w-0 flex-1 flex-col ${
          embedded ? 'px-6' : 'lg:ps-10 lg:pe-0'
        }`}
      >
        <Content
          tab={activeTab}
          onNavigate={onNavigate}
          headerStyle={headerStyle}
          activePath={activeTab.id === currentTabId ? activePath : ''}
        />
      </div>
    </>
  )

  return (
    <div
      className={`w-full border-b-2 border-200 ${
        embedded ? '' : 'shadow-[0_4px_16px_rgba(33,37,41,0.08)]'
      }`}
      style={{ backgroundColor: colorVar(headerStyle.panelBg) }}
    >
      {embedded ? (
        <div className="flex flex-col">{body}</div>
      ) : (
        <Container className="flex flex-col lg:flex-row lg:items-stretch">{body}</Container>
      )}
    </div>
  )
}

export default MegaMenu
