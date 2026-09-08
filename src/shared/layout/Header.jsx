import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CaretDown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/images/layout/logo.png'
import logoDark from '../../assets/images/layout/logo-dark.png'
import Container from '../components/Container.jsx'
import LocalizedLink from '../components/LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import { helpMenuPanels } from './headerNav.js'
import DestinationsMegaMenu from './header/components/DestinationsMegaMenu.jsx'
import ExperienceMegaMenu from './header/components/ExperienceMegaMenu.jsx'
import HeaderMobileMenu, { HeaderMenuButton } from './header/components/HeaderMobileMenu.jsx'
import HelpMegaMenu from './header/components/HelpMegaMenu.jsx'
import useHideOnScroll from './hooks/useHideOnScroll.js'

/** Nav entries that open a mega menu, in display order. */
const megaMenus = [
  { id: 'destinations', labelKey: 'whereWeFly' },
  { id: 'experience', labelKey: 'experience' },
  { id: 'help', labelKey: 'help' },
]

const Header = ({ dark = false }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const headerRef = useRef(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [panelId, setPanelId] = useState(helpMenuPanels[0].id)
  const hidden = useHideOnScroll({ enabled: !openMenu && !mobileOpen, resetKey: location.pathname })

  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
    setPanelId(helpMenuPanels[0].id)
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

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-[1000] border-t-0.75 border-secondary-2 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
        dark ? 'bg-secondary-2' : 'bg-background'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className={`border-b ${dark ? 'border-white/10 bg-secondary-2' : 'border-200 bg-background'}`}>
        <Container className="flex h-16 items-center gap-4 md:h-18 md:gap-8">
          <LocalizedLink to="/" className="shrink-0" aria-label="Fly Cham">
            <img
              src={dark ? logo : logoDark}
              alt="Fly Cham"
              className="h-8 md:h-10 w-auto"
            />
          </LocalizedLink>

          <nav
            aria-label={t('layout.header.navLabel')}
            className="hidden items-stretch self-stretch gap-4 md:gap-6 lg:flex"
          >
            {megaMenus.map((menu) => {
              const isOpen = openMenu === menu.id

              return (
                <button
                  key={menu.id}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${menu.id}-mega-menu`}
                  onClick={() => setOpenMenu(isOpen ? null : menu.id)}
                  className={`relative self-stretch flex items-center gap-1.5 whitespace-nowrap bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer px-1 ${typography.body} font-medium ${
                    dark ? 'text-50' : 'text-secondary-2'
                  } ${isOpen ? 'after:absolute after:inset-x-0 after:bottom-0 after:h-0.75 after:bg-secondary' : ''}`}
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
        the viewport minus the bar above it (h-16/h-18 plus its 1px bottom
        border), so a tall panel scrolls internally instead of running off-screen.
      */}
      {openMenu && (
        <div
          id={`${openMenu}-mega-menu`}
          className="absolute inset-x-0 top-full hidden overflow-y-auto max-h-[calc(100dvh-73px)] lg:block"
        >
          {openMenu === 'destinations' && <DestinationsMegaMenu onNavigate={closeMenu} />}

          {openMenu === 'experience' && <ExperienceMegaMenu onNavigate={closeMenu} />}

          {openMenu === 'help' && (
            <HelpMegaMenu
              panels={helpMenuPanels}
              activeId={panelId}
              onSelectPanel={setPanelId}
              onNavigate={closeMenu}
            />
          )}
        </div>
      )}

      <HeaderMobileMenu
        open={mobileOpen}
        onClose={closeMobile}
        onNavigate={closeMobile}
      />
    </header>
  )
}

export default Header
