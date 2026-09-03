import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CaretDown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import logoDark from '../../assets/images/layout/logo-dark.png'
import Container from '../components/Container.jsx'
import LocalizedLink from '../components/LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import { helpMenuPanels } from './headerNav.js'
import HelpMegaMenu from './header/components/HelpMegaMenu.jsx'

const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const headerRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelId, setPanelId] = useState(helpMenuPanels[0].id)

  useEffect(() => {
    setMenuOpen(false)
    setPanelId(helpMenuPanels[0].id)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-background border-t-0.75 border-secondary-2"
    >
      <div className="bg-background border-b border-200">
        <Container className="h-16 md:h-18 flex items-center gap-4 md:gap-8">
          <LocalizedLink to="/" className="shrink-0" aria-label="Fly Cham">
            <img
              src={logoDark}
              alt="Fly Cham"
              className="h-8 md:h-10 w-auto"
            />
          </LocalizedLink>

          <nav aria-label={t('layout.header.navLabel')} className="flex items-stretch self-stretch">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="help-mega-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className={`relative self-stretch flex items-center gap-1.5 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer px-1 ${typography.body} font-medium text-secondary-2 ${
                menuOpen ? 'after:absolute after:inset-x-0 after:bottom-0 after:h-0.75 after:bg-secondary' : ''
              }`}
            >
              {t('layout.header.nav.help')}
              <CaretDown
                size={12}
                weight="bold"
                className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </nav>
        </Container>
      </div>

      {menuOpen && (
        <div id="help-mega-menu">
          <HelpMegaMenu
            panels={helpMenuPanels}
            activeId={panelId}
            onSelectPanel={setPanelId}
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  )
}

export default Header
