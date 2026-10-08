import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { GlobeHemisphereWest, UserCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../components/Container.jsx'
import LocalizedLink from '../components/LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import { HDR_SELF_HOVER, colorVar, findHeaderLocation, headerHref, roleStyle } from './header/headerStyle.js'
import useSiteHeader from './header/useSiteHeader.js'
import MegaMenu from './header/components/MegaMenu.jsx'
import RegionMenu from './header/components/RegionMenu.jsx'
import HeaderMobileMenu, { HeaderMenuButton } from './header/components/HeaderMobileMenu.jsx'
import TravelUpdatesNotice from './header/TravelUpdatesNotice.jsx'
import useHideOnScroll from './hooks/useHideOnScroll.js'
import useCurrentPos from '../hooks/useCurrentPos.js'

const REGION_MENU = 'region'
const LOGIN_ITEM = 'login'
/** How far the page must scroll down before an open menu closes. */
const SCROLL_CLOSE_PX = 8

const Header = ({ dark = false, hideOnScroll = true, showTravelNotice = false }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const header = useSiteHeader()
  // The country (POS) in the URL, shown on the region button (e.g. "AE").
  const currentPos = useCurrentPos()
  const { menus, style: hs } = header
  const headerRef = useRef(null)
  const [openMenu, setOpenMenu] = useState(null)
  // A clicked menu stays open after the pointer leaves the header; it closes on
  // a click outside, Escape, scrolling down, navigation or a second click.
  const [pinned, setPinned] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const hidden = useHideOnScroll({
    enabled: hideOnScroll && !openMenu && !mobileOpen,
    resetKey: location.pathname,
  })

  useEffect(() => {
    setOpenMenu(null)
    setPinned(false)
    setMobileOpen(false)
  }, [location.pathname])

  // Browser tab icon. The bundled mark matches the admin tab; a custom header
  // favicon still replaces it, except the old default webp.
  const faviconUrl = header.logo?.faviconUrl
  useEffect(() => {
    const href =
      faviconUrl && !faviconUrl.includes('tab-icon.webp') ? faviconUrl : '/favicon.png'
    const type = href.endsWith('.webp')
      ? 'image/webp'
      : href.endsWith('.svg')
        ? 'image/svg+xml'
        : 'image/png'
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((link) => {
      if (link.getAttribute('href') !== href) link.setAttribute('href', href)
      link.setAttribute('type', type)
    })
  }, [faviconUrl])

  useEffect(() => {
    if (!openMenu) return undefined

    const close = () => {
      setOpenMenu(null)
      setPinned(false)
    }

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) close()
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    // Scrolling the page down (not the panel itself) closes the menu, measured
    // from the highest point since it opened (scrolling up keeps it open).
    let topY = window.scrollY
    const handleScroll = () => {
      const y = window.scrollY
      if (y < topY) topY = y
      else if (y - topY > SCROLL_CLOSE_PX) close()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [openMenu])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const closeMobile = () => {
      if (media.matches) setMobileOpen(false)
    }

    media.addEventListener('change', closeMobile)
    return () => media.removeEventListener('change', closeMobile)
  }, [])

  const closeMenu = () => {
    setOpenMenu(null)
    setPinned(false)
  }
  // Hover only previews a menu; it closes when the pointer leaves unless pinned.
  const handleHeaderLeave = () => {
    if (!pinned) closeMenu()
  }
  // Click pins the menu open; clicking the pinned item again closes it.
  const toggleMenu = (id) => {
    if (openMenu === id && pinned) {
      closeMenu()
      return
    }
    setOpenMenu(id)
    setPinned(true)
  }
  const closeMobile = () => setMobileOpen(false)
  const navRef = useRef(null)
  const itemRefs = useRef({})
  const linePlaced = useRef(false)
  const [navLine, setNavLine] = useState(null)
  const currentLocation = findHeaderLocation(menus, location.pathname)
  const indicatorId =
    openMenu &&
    (openMenu === REGION_MENU || openMenu === LOGIN_ITEM || menus.some((menu) => menu.id === openMenu))
      ? openMenu
      : currentLocation?.menuId || null

  useLayoutEffect(() => {
    const nav = navRef.current
    const item = itemRefs.current[indicatorId]

    if (!nav || !item) {
      linePlaced.current = false
      setNavLine(null)
      return undefined
    }

    const place = () => {
      const current = itemRefs.current[indicatorId]
      if (!current) return
      const inset = 8
      const left = current.offsetLeft + inset
      const width = Math.max(0, current.offsetWidth - inset * 2)
      const animate = linePlaced.current
      setNavLine((prev) => {
        if (prev && prev.left === left && prev.width === width && prev.animate === animate) return prev
        return { left, width, animate }
      })
      linePlaced.current = true
    }

    place()
    const observer = new ResizeObserver(place)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [indicatorId, menus])

  const activeMenu = menus.find((menu) => menu.id === openMenu)
  const barBg = dark ? undefined : { backgroundColor: colorVar(hs.barBg) }
  // Top-bar text role (nav buttons, region, login); the dark variant keeps its light text.
  const navStyle = (active = false) =>
    roleStyle({
      color: dark ? '50' : hs.navColor,
      colorHover: hs.navColorHover,
      weight: hs.navFontWeight,
      weightHover: hs.navFontWeightHover,
      active,
    })

  return (
    <header
      ref={headerRef}
      onMouseLeave={handleHeaderLeave}
      className={`sticky top-0 z-[1000] shrink-0 ${dark ? 'bg-secondary-2' : ''}`}
      style={barBg}
    >
      {showTravelNotice && <TravelUpdatesNotice />}

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          hidden ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-b-2 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
              dark ? 'border-white/10 bg-secondary-2' : 'border-200'
            } shadow-[0_4px_12px_-2px_rgba(33,37,41,0.12)] ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
            style={barBg}
          >
        <Container
          ref={navRef}
          className="relative flex h-16 items-center justify-between gap-4 md:h-18"
        >
          <LocalizedLink
            to={headerHref(header.logo.href) || '/'}
            className="flex h-11 w-[160px] shrink-0 items-center lg:h-[72px] lg:w-[241px]"
            aria-label={header.logo.alt || undefined}
            onMouseEnter={closeMenu}
            onClick={closeMenu}
          >
            <img
              src={dark ? header.logo.lightUrl : header.logo.darkUrl}
              alt={header.logo.alt}
              // First visit: stay hidden until the CMS header loads, so the
              // bundled default logo never flashes before the real one.
              className={`h-full w-full max-w-none object-contain object-start transition-opacity duration-200 motion-reduce:transition-none ${
                header.ready ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </LocalizedLink>

          <nav
            aria-label={t('layout.header.navLabel')}
            className="hidden h-full items-stretch gap-2 lg:flex"
          >
              {menus.map((menu) => {
                const isOpen = openMenu === menu.id
                const isCurrent = menu.id === currentLocation?.menuId

                return (
                  <button
                    key={menu.id}
                    ref={(node) => {
                      itemRefs.current[menu.id] = node
                    }}
                    type="button"
                    aria-expanded={isOpen}
                    aria-current={isCurrent ? 'page' : undefined}
                    aria-controls={`${menu.id}-mega-menu`}
                    onMouseEnter={() => setOpenMenu(menu.id)}
                    onFocus={() => setOpenMenu(menu.id)}
                    onClick={() => toggleMenu(menu.id)}
                    className={`relative flex cursor-pointer items-center whitespace-nowrap border-0 bg-transparent px-4 outline-none focus:outline-none focus-visible:outline-none ${typography.body} ${HDR_SELF_HOVER}`}
                    style={navStyle(isOpen || (!openMenu && isCurrent))}
                  >
                    {menu.label}
                  </button>
                )
              })}
          </nav>

          <div className="hidden h-full items-stretch gap-2 lg:flex">
              {header.region.show && (
                <button
                  ref={(node) => {
                    itemRefs.current[REGION_MENU] = node
                  }}
                  type="button"
                  aria-expanded={openMenu === REGION_MENU}
                  aria-controls="region-mega-menu"
                  onMouseEnter={() => setOpenMenu(REGION_MENU)}
                  onFocus={() => setOpenMenu(REGION_MENU)}
                  onClick={() => toggleMenu(REGION_MENU)}
                  className={`relative flex cursor-pointer items-center gap-1 whitespace-nowrap border-0 bg-transparent px-2 outline-none focus:outline-none focus-visible:outline-none ${HDR_SELF_HOVER}`}
                  style={navStyle(openMenu === REGION_MENU)}
                >
                  <GlobeHemisphereWest size={24} weight="regular" className="shrink-0" />
                  <span className={`${typography.caption} font-medium`}>
                    {currentPos.toUpperCase()}
                  </span>
                </button>
              )}

              {header.login.show && (
                <span
                  ref={(node) => {
                    itemRefs.current[LOGIN_ITEM] = node
                  }}
                  className="flex h-full items-stretch"
                  onMouseEnter={() => setOpenMenu(LOGIN_ITEM)}
                >
                  <LocalizedLink
                    to={headerHref(header.login.href)}
                    onFocus={() => setOpenMenu(LOGIN_ITEM)}
                    onClick={closeMenu}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-2 no-underline outline-none focus:outline-none ${HDR_SELF_HOVER}`}
                    style={navStyle(openMenu === LOGIN_ITEM)}
                  >
                    <UserCircle size={24} weight="regular" className="shrink-0" />
                    <span className={`${typography.body} font-normal`}>{header.login.label}</span>
                  </LocalizedLink>
                </span>
              )}
          </div>

          {navLine ? (
            <span
              aria-hidden
              className={`pointer-events-none absolute bottom-0 hidden h-[3px] lg:block ${
                navLine.animate
                  ? 'transition-[left,width] duration-300 ease-out motion-reduce:transition-none'
                  : ''
              }`}
              style={{
                left: navLine.left,
                width: navLine.width,
                backgroundColor: colorVar(hs.indicatorColor),
              }}
            />
          ) : null}

          <HeaderMenuButton
            open={mobileOpen}
            dark={dark}
            controlsId="header-mobile-menu"
            label={t(mobileOpen ? 'layout.header.closeMenu' : 'layout.header.menu')}
            onClick={() => {
              setOpenMenu(null)
              setMobileOpen((isOpen) => !isOpen)
            }}
          />
        </Container>
          </div>
        </div>
      </div>

      {/*
        Absolute so the panel floats over the page instead of pushing it down.
        `sticky` on the header makes it the containing block. The max height is
        the viewport minus the bar above it, so a tall panel scrolls internally.
      */}
      {(activeMenu || openMenu === REGION_MENU) && (
        <div
          id={`${openMenu}-mega-menu`}
          // Clicking inside the panel (e.g. a tab) keeps it open.
          onPointerDown={() => setPinned(true)}
          className="absolute inset-x-0 top-full hidden max-h-[calc(100dvh-74px)] overflow-y-auto shadow-[0_10px_24px_-8px_rgba(33,37,41,0.18)] lg:block"
        >
          {activeMenu && (
            <MegaMenu
              menu={activeMenu}
              headerStyle={hs}
              onNavigate={closeMenu}
              currentLocation={currentLocation}
            />
          )}
          {openMenu === REGION_MENU && <RegionMenu onNavigate={closeMenu} />}
        </div>
      )}

      <HeaderMobileMenu
        header={header}
        open={mobileOpen}
        onClose={closeMobile}
        onNavigate={closeMobile}
      />
    </header>
  )
}

export default Header
