import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CaretDown, Globe, List, User, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/images/layout/logo.png'
import { typography } from '../../styles/typography.js'
import { headerNav } from './headerNav.js'

const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="bg-primary-1 text-50">
      <div className="max-w-[1222px] mx-auto px-4 sm:px-8 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0" aria-label="Fly Cham">
          <img
            src={logo}
            alt="Fly Cham"
            className="h-8 md:h-10 w-auto mix-blend-screen"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label={t('layout.header.navLabel')}>
          {headerNav.map((item) => (
            <HeaderMenu key={item.id} item={item} />
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <span className="w-px h-6 bg-50/40" aria-hidden="true" />
          <button
            type="button"
            className={`flex items-center gap-2 bg-transparent border-none text-50 cursor-pointer p-0 ${typography.caption} font-medium`}
          >
            <Globe size={18} weight="regular" />
            {t('layout.header.region')}
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 bg-transparent border-none text-50 cursor-pointer p-0 ${typography.caption} font-medium`}
          >
            <User size={18} weight="regular" />
            {t('layout.header.login')}
          </button>
        </div>

        <button
          type="button"
          className="lg:hidden bg-transparent border-none text-50 p-1 cursor-pointer"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={t('layout.header.menu')}
        >
          {menuOpen ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-50/20 px-4 sm:px-8 pb-6 pt-4 flex flex-col gap-4">
          {headerNav.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <p className={`${typography.caption} font-semibold m-0 text-50`}>
                {t(`layout.header.nav.${item.id}`)}
              </p>
              {item.children.map((child) =>
                child.href === '#' ? (
                  <a
                    key={child.id}
                    href="#"
                    className={`${typography.caption} text-50/80 no-underline ps-2`}
                  >
                    {t(`layout.header.navItems.${child.id}`)}
                  </a>
                ) : (
                  <NavLink
                    key={child.id}
                    to={child.href}
                    end={child.href === '/help'}
                    className={`${typography.caption} text-50/80 no-underline ps-2`}
                  >
                    {t(`layout.header.navItems.${child.id}`)}
                  </NavLink>
                )
              )}
            </div>
          ))}
          <div className="flex items-center gap-5 pt-2 border-t border-50/20">
            <span className={`flex items-center gap-2 ${typography.caption}`}>
              <Globe size={18} />
              {t('layout.header.region')}
            </span>
            <span className={`flex items-center gap-2 ${typography.caption}`}>
              <User size={18} />
              {t('layout.header.login')}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}

const HeaderMenu = ({ item }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const isActive =
    item.id === 'help'
      ? location.pathname.startsWith('/help')
      : item.children.some((child) => child.href !== '#' && location.pathname === child.href)

  return (
    <div className="relative group">
      <button
        type="button"
        className={`flex items-center gap-1 bg-transparent border-none text-50 cursor-pointer p-0 ${typography.caption} ${isActive ? 'font-semibold' : 'font-medium'}`}
      >
        {t(`layout.header.nav.${item.id}`)}
        <CaretDown size={12} weight="bold" />
      </button>
      <div className="absolute top-full start-0 pt-3 hidden group-hover:block group-focus-within:block z-30">
        <div className="min-w-48 bg-background rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-2">
          {item.children.map((child) =>
            child.href === '#' ? (
              <a
                key={child.id}
                href="#"
                className={`block px-4 py-2 no-underline ${typography.caption} text-700 hover:bg-100`}
              >
                {t(`layout.header.navItems.${child.id}`)}
              </a>
            ) : (
              <NavLink
                key={child.id}
                to={child.href}
                end={child.href === '/help'}
                className={({ isActive: linkActive }) =>
                  `block px-4 py-2 no-underline ${typography.caption} ${linkActive ? 'text-primary-1 font-semibold' : 'text-700 hover:bg-100'}`
                }
              >
                {t(`layout.header.navItems.${child.id}`)}
              </NavLink>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
