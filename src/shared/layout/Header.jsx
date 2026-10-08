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
import useHideOnScroll from './hooks/useHideOnScroll.js'

const REGION_MENU = 'region'
const LOGIN_ITEM = 'login'

const Header = ({ dark = false, hideOnScroll = true }) => {
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
      onMouseLeave={closeMenu}
      className={`sticky top-0 z-[1000] shrink-0 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
        dark ? 'bg-secondary-2' : ''
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
      style={barBg}
    >
      <div
        className={`border-b-2 ${dark ? 'border-white/10 bg-secondary-2' : 'border-200'} shadow-[0_4px_12px_-2px_rgba(33,37,41,0.12)]`}
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
              className="h-full w-full max-w-none object-contain object-start"
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
                  className={`relative flex cursor-pointer items-center gap-1 whitespace-nowrap border-0 bg-transparent px-2 outline-none focus:outline-none focus-visible:outline-none ${HDR_SELF_HOVER}`}
                  style={navStyle(openMenu === REGION_MENU)}
                >
                  <GlobeHemisphereWest size={24} weight="regular" className="shrink-0" />
                  <span className={`${typography.caption} font-medium`}>{header.region.label}</span>
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
