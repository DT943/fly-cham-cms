import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CaretDown, GlobeHemisphereWest, UserCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../components/Container.jsx'
import LocalizedLink from '../components/LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import { HDR_SELF_HOVER, colorVar, headerHref, roleStyle } from './header/headerStyle.js'
import useSiteHeader from './header/useSiteHeader.js'
import MegaMenu from './header/components/MegaMenu.jsx'
import RegionMenu from './header/components/RegionMenu.jsx'
import HeaderMobileMenu, { HeaderMenuButton } from './header/components/HeaderMobileMenu.jsx'
import TravelUpdatesNotice from './header/TravelUpdatesNotice.jsx'
import useHideOnScroll from './hooks/useHideOnScroll.js'

const REGION_MENU = 'region'

const Header = ({ dark = false, hideOnScroll = true, showTravelNotice = false }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const header = useSiteHeader()
  const { menus, style: hs } = header
  const headerRef = useRef(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const hidden = useHideOnScroll({
    enabled: hideOnScroll && !openMenu && !mobileOpen,
    resetKey: location.pathname,
  })

  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [location.pathname])

  // Browser tab icon comes from the header document (admin → Header → Logo).
  const faviconUrl = header.logo?.faviconUrl
  useEffect(() => {
    if (!faviconUrl) return
    const link = document.querySelector('link[rel="icon"]')
    if (link && link.getAttribute('href') !== faviconUrl) {
      link.setAttribute('href', faviconUrl)
      link.setAttribute('type', 'image/webp')
    }
  }, [faviconUrl])

  useEffect(() => {
    if (!openMenu) return undefined

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpenMenu(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
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

  const closeMenu = () => setOpenMenu(null)
  const closeMobile = () => setMobileOpen(false)
  const toggle = (id) => setOpenMenu((current) => (current === id ? null : id))
  const navRef = useRef(null)
  const itemRefs = useRef({})
  const linePlaced = useRef(false)
  const [navLine, setNavLine] = useState(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    const item = itemRefs.current[openMenu]
    const isNavItem = menus.some((menu) => menu.id === openMenu)

    if (!nav || !item || !isNavItem) {
      linePlaced.current = false
      setNavLine(null)
      return undefined
    }

    const place = () => {
      const current = itemRefs.current[openMenu]
      if (!current) return
      const inset = 8
      setNavLine({
        left: current.offsetLeft + inset,
        width: Math.max(0, current.offsetWidth - inset * 2),
        animate: linePlaced.current,
      })
      linePlaced.current = true
    }

    place()
    const observer = new ResizeObserver(place)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [openMenu, menus])

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
      className={`sticky top-0 z-[1000] shrink-0 ${dark ? 'bg-secondary-2' : ''}`}
      style={barBg}
    >
      {showTravelNotice && <TravelUpdatesNotice />}
      {/* Only the nav bar collapses on scroll. The notice stays pinned above it. */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          hidden ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-b-2 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
              hidden ? '-translate-y-full' : 'translate-y-0'
            } ${dark ? 'border-white/10 bg-secondary-2' : 'border-200'} shadow-[0_4px_12px_-2px_rgba(33,37,41,0.12)]`}
            style={barBg}
          >
        <Container className="flex h-16 items-center justify-between gap-4 md:h-18">
          <LocalizedLink
            to={headerHref(header.logo.href) || '/'}
            className="flex h-11 w-[160px] shrink-0 items-center lg:h-[72px] lg:w-[241px]"
            aria-label={header.logo.alt || undefined}
            onClick={closeMenu}
          >
            <img
              src={dark ? header.logo.lightUrl : header.logo.darkUrl}
              alt={header.logo.alt}
              className="h-full w-full max-w-none object-contain object-left"
            />
          </LocalizedLink>

          <nav
            ref={navRef}
            aria-label={t('layout.header.navLabel')}
            className="relative hidden h-full items-stretch gap-2 lg:flex"
          >
            {menus.map((menu) => {
              const isOpen = openMenu === menu.id

              return (
                <button
                  key={menu.id}
                  ref={(node) => {
                    itemRefs.current[menu.id] = node
                  }}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${menu.id}-mega-menu`}
                  onClick={() => toggle(menu.id)}
                  className={`relative flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-0 bg-transparent px-4 outline-none focus:outline-none focus-visible:outline-none ${typography.body} ${HDR_SELF_HOVER}`}
                  style={navStyle(isOpen)}
                >
                  {menu.label}
                  <CaretDown
                    size={12}
                    weight="bold"
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              )
            })}
            {navLine ? (
              <span
                aria-hidden
                className={`pointer-events-none absolute bottom-0 h-[3px] ${
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
          </nav>

          <div className="hidden items-stretch gap-2 lg:flex">
            {header.region.show && (
              <button
                type="button"
                aria-expanded={openMenu === REGION_MENU}
                aria-controls="region-mega-menu"
                onClick={() => toggle(REGION_MENU)}
                className={`relative flex cursor-pointer items-center gap-1 whitespace-nowrap border-0 bg-transparent px-2 outline-none focus:outline-none focus-visible:outline-none ${HDR_SELF_HOVER}`}
                style={navStyle(openMenu === REGION_MENU)}
              >
                <GlobeHemisphereWest size={24} weight="regular" className="shrink-0" />
                <span className={`${typography.caption} font-medium`}>{header.region.label}</span>
              </button>
            )}

            {header.login.show && (
              <LocalizedLink
                to={headerHref(header.login.href)}
                onClick={closeMenu}
                className={`flex items-center gap-1.5 whitespace-nowrap px-2 no-underline outline-none focus:outline-none ${HDR_SELF_HOVER}`}
                style={navStyle()}
              >
                <UserCircle size={24} weight="regular" className="shrink-0" />
                <span className={`${typography.body} font-normal`}>{header.login.label}</span>
              </LocalizedLink>
            )}
          </div>

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
          className="absolute inset-x-0 top-full hidden max-h-[calc(100dvh-74px)] overflow-y-auto shadow-[0_10px_24px_-8px_rgba(33,37,41,0.18)] lg:block"
        >
          {activeMenu && <MegaMenu menu={activeMenu} headerStyle={hs} onNavigate={closeMenu} />}
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
