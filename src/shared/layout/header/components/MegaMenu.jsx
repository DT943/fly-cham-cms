import { ArrowRight } from '@phosphor-icons/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import Container from '../../../components/Container.jsx'
import LocalizedLink from '../../../components/LocalizedLink.jsx'

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
const MegaMenuSidebar = ({ menuId, tabs, activeId, onSelect }) => {
  const { t } = useTranslation()
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
      aria-label={t(`layout.header.nav.${menuId}`)}
      className="no-scrollbar relative px-6 flex w-full shrink-0 flex-row overflow-x-auto border-b border-200 bg-100 lg:w-[232px] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-e lg:py-6"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const Badge = tab.badge
        const isActive = tab.id === activeId

        return (
          <button
            key={tab.id}
            type="button"
            ref={(node) => {
              tabRefs.current[tab.id] = node
            }}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelect(tab.id)}
            className={`relative flex shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap border-0 border-b-[3px] border-transparent bg-transparent ps-0 pe-6 py-4.5 text-start outline-none focus:outline-none focus-visible:outline-none lg:w-full lg:border-b-0 lg:ps-6 lg:pe-6 ${
              isActive ? 'text-primary-1' : 'text-700 hover:text-primary-1'
            }`}
          >
            <span className={`relative shrink-0 ${isActive ? 'text-primary-1' : 'text-700'}`}>
              <Icon size={24} weight="regular" />
              {Badge && (
                <span className="absolute -bottom-1 -end-1 flex items-center justify-center rounded-full bg-100">
                  <Badge size={12} weight="fill" />
                </span>
              )}
            </span>
            <span className={`${typography.body} font-medium`}>
              {t(`layout.header.tabs.${tab.id}`)}
            </span>
          </button>
        )
      })}
      <span
        aria-hidden
        className={`pointer-events-none absolute bg-primary-2 ${
          line.vertical ? 'start-0 hidden w-[3px] lg:block' : 'bottom-0 h-[3px] lg:hidden'
        } ${
          line.animate
            ? line.vertical
              ? 'transition-[top,height] duration-300 ease-out motion-reduce:transition-none'
              : 'transition-[left,width] duration-300 ease-out motion-reduce:transition-none'
            : ''
        }`}
        style={
          line.vertical
            ? { top: line.offset, height: line.size }
            : { left: line.offset, width: line.size }
        }
      />
    </nav>
  )
}

/** Promo image with a teal action bar (used by the link-style tabs). */
const MegaMenuPromo = ({ image, ctaHref, ctaLabel, onNavigate }) => (
  <div className="hidden shrink-0 border-s border-200 ps-5 lg:block">
    <LocalizedLink
      to={ctaHref}
      onClick={onNavigate}
      className="group relative flex w-full flex-col justify-end overflow-hidden rounded-[24px] no-underline outline-none focus:outline-none lg:w-[300px]"
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="relative mt-40 flex items-center gap-2 bg-primary-1 px-4 py-4">
        <span className={`${typography.caption} font-semibold text-50`}>{ctaLabel}</span>
        <ArrowRight size={16} weight="bold" className="text-50 rtl:-scale-x-100" />
      </span>
    </LocalizedLink>
  </div>
)

/** Two-column grid of icon links (Book & Manage, Travel Experience, Help). */
const MegaMenuLinks = ({ tab, onNavigate }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col gap-8 py-6 lg:flex-row lg:py-8">
      <div className="grid flex-1 grid-cols-1 content-start gap-x-6 gap-y-2 sm:grid-cols-2">
        {tab.links.map((link) => {
          const Icon = link.icon
          const Badge = link.badge

          return (
            <LocalizedLink
              key={link.id}
              to={link.href}
              onClick={onNavigate}
              className="group flex items-start gap-3 rounded-xl ps-0 pe-3 py-3 text-inherit no-underline outline-none transition-colors focus:outline-none lg:ps-3"
            >
              <span className="relative mt-0.5 shrink-0 text-700 group-hover:text-primary-1">
                <Icon size={24} weight="regular" />
                {Badge && (
                  <span className="absolute -bottom-1 -end-1 flex items-center justify-center rounded-full bg-50 text-primary-1">
                    <Badge size={13} weight="fill" />
                  </span>
                )}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className={`${typography.body} font-semibold text-700 group-hover:text-primary-1`}>
                  {t(`layout.header.items.${link.id}.title`)}
                </span>
                {tab.withDescriptions && (
                  <span className={`${typography.caption} leading-snug text-500`}>
                    {t(`layout.header.items.${link.id}.description`)}
                  </span>
                )}
              </span>
            </LocalizedLink>
          )
        })}
      </div>

      <MegaMenuPromo
        image={tab.image}
        ctaHref={tab.cta}
        ctaLabel={t(`layout.header.cta.${tab.id}`)}
        onNavigate={onNavigate}
      />
    </div>
  )
}

/** Bottom-right "View all …" link shared by the card and map tabs. */
const MegaMenuInlineCta = ({ tabId, href, onNavigate }) => {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end pb-2">
      <LocalizedLink
        to={href}
        onClick={onNavigate}
        className="flex items-center gap-3 text-inherit no-underline outline-none focus:outline-none"
      >
        <span className={`${typography.caption} font-semibold text-primary-1`}>
          {t(`layout.header.cta.${tabId}`)}
        </span>
        <span className="flex size-7 items-center justify-center rounded-full border border-primary-1 text-primary-1">
          <ArrowRight size={14} weight="bold" className="rtl:-scale-x-100" />
        </span>
      </LocalizedLink>
    </div>
  )
}

/** Where We Fly → Our Destinations (three image cards). */
const MegaMenuDestinations = ({ tab, onNavigate }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col gap-4 py-6 lg:py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tab.cards.map((card) => (
          <LocalizedLink
            key={card.id}
            to={card.href}
            onClick={onNavigate}
            className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-[24px] no-underline outline-none focus:outline-none"
          >
            <img
              src={card.image}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            {card.tag && (
              <span
                className={`${typography.caption} absolute start-0 top-5 bg-primary-3 px-2.5 py-1 font-semibold text-700`}
              >
                {t(`layout.header.tags.${card.tag}`)}
              </span>
            )}
            <span className="relative flex items-center justify-between gap-3 bg-primary-1 px-4 py-3.5">
              <span className={`${typography.itemTitle} truncate font-semibold text-50`}>
                {t(`layout.header.cards.${card.id}.name`)}
              </span>
              <span className={`${typography.caption} shrink-0 font-medium text-primary-3`}>{card.code}</span>
            </span>
          </LocalizedLink>
        ))}
      </div>

      <MegaMenuInlineCta tabId={tab.id} href={tab.cta} onNavigate={onNavigate} />
    </div>
  )
}

/** Where We Fly → Activities to Do (image cards with location + tag chip). */
const MegaMenuActivities = ({ tab, onNavigate }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col gap-4 py-6 lg:py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tab.cards.map((card) => (
          <LocalizedLink
            key={card.id}
            to={card.href}
            onClick={onNavigate}
            className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-[24px] no-underline outline-none focus:outline-none"
          >
            <img
              src={card.image}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <span className="relative flex items-center justify-between gap-3 bg-primary-1 px-4 py-3.5">
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className={`${typography.itemTitle} truncate font-semibold text-50`}>
                  {t(`layout.header.cards.${card.id}.name`)}
                </span>
                <span className={`${typography.caption} truncate text-200`}>
                  {t(`layout.header.cards.${card.id}.location`)}
                </span>
              </span>
              {card.tag && (
                <span
                  className={`${typography.caption} shrink-0 rounded-lg bg-white/20 px-2.5 py-1 font-medium text-50`}
                >
                  {t(`layout.header.tags.${card.tag}`)}
                </span>
              )}
            </span>
          </LocalizedLink>
        ))}
      </div>

      <MegaMenuInlineCta tabId={tab.id} href={tab.cta} onNavigate={onNavigate} />
    </div>
  )
}

/** Where We Fly → Flight Schedules (route map). */
const MegaMenuMap = ({ tab, onNavigate }) => (
  <div className="flex flex-1 flex-col gap-4 py-6 lg:py-8">
    <LocalizedLink
      to={tab.cta}
      onClick={onNavigate}
      className="block h-64 overflow-hidden rounded-[24px] no-underline outline-none focus:outline-none lg:h-80"
    >
      <img src={tab.image} alt="" className="size-full object-cover" />
    </LocalizedLink>
    <MegaMenuInlineCta tabId={tab.id} href={tab.cta} onNavigate={onNavigate} />
  </div>
)

const contentByType = {
  links: MegaMenuLinks,
  destinations: MegaMenuDestinations,
  activities: MegaMenuActivities,
  map: MegaMenuMap,
}

const MegaMenu = ({ menu, onNavigate, embedded = false }) => {
  const [activeId, setActiveId] = useState(menu.tabs[0].id)

  useEffect(() => {
    setActiveId(menu.tabs[0].id)
  }, [menu.id, menu.tabs])

  const activeTab = menu.tabs.find((tab) => tab.id === activeId) || menu.tabs[0]
  const Content = contentByType[activeTab.type]

  const body = (
    <>
      <MegaMenuSidebar
        menuId={menu.id}
        tabs={menu.tabs}
        activeId={activeTab.id}
        onSelect={setActiveId}
      />
      <div
        className={`flex min-w-0 flex-1 flex-col ${
          embedded ? 'px-6' : 'lg:ps-10 lg:pe-0'
        }`}
      >
        <Content tab={activeTab} onNavigate={onNavigate} />
      </div>
    </>
  )

  return (
    <div
      className={`w-full border-b-2 border-200 bg-50 ${
        embedded ? '' : 'shadow-[0_4px_16px_rgba(33,37,41,0.08)]'
      }`}
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
