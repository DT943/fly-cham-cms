import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CaretDown, GlobeHemisphereWest, UserCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/images/layout/logo.png'
import logoDark from '../../assets/images/layout/logo-dark.png'
import Container from '../components/Container.jsx'
import LocalizedLink from '../components/LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import { headerMenus } from './header/menuData.js'
import MegaMenu from './header/components/MegaMenu.jsx'
import RegionMenu from './header/components/RegionMenu.jsx'
import HeaderMobileMenu, { HeaderMenuButton } from './header/components/HeaderMobileMenu.jsx'
import useHideOnScroll from './hooks/useHideOnScroll.js'

const REGION_MENU = 'region'

const Header = ({ dark = false }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const headerRef = useRef(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const hidden = useHideOnScroll({ enabled: !openMenu && !mobileOpen, resetKey: location.pathname })

  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [location.pathname])

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

  const activeMenu = headerMenus.find((menu) => menu.id === openMenu)

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-[1000] transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
        dark ? 'bg-secondary-2' : 'bg-50'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div
        className={`border-b-2 ${dark ? 'border-white/10 bg-secondary-2' : 'border-200 bg-50'} shadow-[0_4px_4px_rgba(33,37,41,0.04)]`}
      >
        <Container className="flex h-16 items-center justify-between gap-4 md:h-18">
          <LocalizedLink to="/" className="shrink-0" aria-label="Fly Cham" onClick={closeMenu}>
            <img src={dark ? logo : logoDark} alt="Fly Cham" className="h-9 w-auto md:h-11" />
          </LocalizedLink>

          <nav
            aria-label={t('layout.header.navLabel')}
            className="hidden h-full items-stretch gap-2 lg:flex"
          >
            {headerMenus.map((menu) => {
              const isOpen = openMenu === menu.id

              return (
                <button
                  key={menu.id}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${menu.id}-mega-menu`}
                  onClick={() => toggle(menu.id)}
                  className={`relative flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-0 bg-transparent px-4 outline-none focus:outline-none focus-visible:outline-none ${typography.body} ${
                    isOpen ? 'font-medium text-primary-1' : `font-normal ${dark ? 'text-50' : 'text-700'} hover:text-primary-1`
                  } ${isOpen ? 'after:absolute after:inset-x-2 after:bottom-0 after:h-0.75 after:bg-primary-2' : ''}`}
                >
                  {t(`layout.header.nav.${menu.labelKey}`)}
                  <CaretDown
                    size={12}
                    weight="bold"
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              )
            })}
          </nav>

          <div className="hidden items-stretch gap-2 lg:flex">
            <button
              type="button"
              aria-expanded={openMenu === REGION_MENU}
              aria-controls="region-mega-menu"
              onClick={() => toggle(REGION_MENU)}
              className={`relative flex cursor-pointer items-center gap-1 whitespace-nowrap border-0 bg-transparent px-2 outline-none focus:outline-none focus-visible:outline-none ${
                openMenu === REGION_MENU
                  ? 'text-primary-1 after:absolute after:inset-x-2 after:bottom-0 after:h-0.75 after:bg-primary-2'
                  : `${dark ? 'text-50' : 'text-700'} hover:text-primary-1`
              }`}
            >
              <GlobeHemisphereWest size={24} weight="regular" className="shrink-0" />
              <span className={`${typography.caption} font-medium`}>{t('layout.header.region')}</span>
            </button>

            <LocalizedLink
              to="/"
              onClick={closeMenu}
              className={`flex items-center gap-1.5 whitespace-nowrap px-2 no-underline outline-none focus:outline-none ${
                dark ? 'text-50' : 'text-700'
              } hover:text-primary-1`}
            >
              <UserCircle size={24} weight="regular" className="shrink-0" />
              <span className={`${typography.body} font-normal`}>{t('layout.header.login')}</span>
            </LocalizedLink>
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

      {/*
        Absolute so the panel floats over the page instead of pushing it down.
        `sticky` on the header makes it the containing block. The max height is
        the viewport minus the bar above it, so a tall panel scrolls internally.
      */}
      {(activeMenu || openMenu === REGION_MENU) && (
        <div
          id={`${openMenu}-mega-menu`}
          className="absolute inset-x-0 top-full hidden max-h-[calc(100dvh-74px)] overflow-y-auto lg:block"
        >
          {activeMenu && <MegaMenu menu={activeMenu} onNavigate={closeMenu} />}
          {openMenu === REGION_MENU && <RegionMenu onNavigate={closeMenu} />}
        </div>
      )}

      <HeaderMobileMenu open={mobileOpen} onClose={closeMobile} onNavigate={closeMobile} />
    </header>
  )
}

export default Header
