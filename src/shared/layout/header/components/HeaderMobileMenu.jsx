import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import coverPhoto from '../../../../assets/images/our-destenations/ph1.png'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import {
  helpMenuPanels,
  mobileMenuPrimaryLinks,
  mobileMenuSecondaryLinks,
} from '../../headerNav.js'
import DestinationsMegaMenu from './DestinationsMegaMenu.jsx'
import ExperienceMegaMenu from './ExperienceMegaMenu.jsx'
import HelpMegaMenu from './HelpMegaMenu.jsx'

const headerItems = [
  { id: 'destinations', labelKey: 'whereWeFly' },
  { id: 'experience', labelKey: 'experience' },
  { id: 'help', labelKey: 'help' },
]

export const HeaderMenuButton = ({ open, dark, onClick, label, controlsId }) => (
  <button
    type="button"
    onClick={onClick}
    aria-expanded={open}
    aria-controls={controlsId}
    id="header-menu-button"
    aria-label={label}
    className={`relative ms-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent lg:hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
      dark ? 'text-50' : 'text-secondary-2'
    }`}
  >
    <span className="relative block h-3.5 w-5" aria-hidden="true">
      <span
        className={`absolute inset-x-0 top-0 h-0.5 rounded-full bg-current transition duration-300 ease-out motion-reduce:transition-none ${
          open ? 'top-1.5 rotate-45' : ''
        }`}
      />
      <span
        className={`absolute inset-x-0 top-1.5 h-0.5 rounded-full bg-current transition duration-200 ease-out motion-reduce:transition-none ${
          open ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current transition duration-300 ease-out motion-reduce:transition-none ${
          open ? 'bottom-1.5 -rotate-45' : ''
        }`}
      />
    </span>
  </button>
)

const HeaderMobileMenu = ({ open, onClose, onNavigate }) => {
  const { t } = useTranslation()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const [rendered, setRendered] = useState(open)
  const [visible, setVisible] = useState(open)
  const [view, setView] = useState('root')
  const [helpPanelId, setHelpPanelId] = useState(helpMenuPanels[0].id)
  const viewRef = useRef(view)
  viewRef.current = view

  const closeToRoot = () => setView('root')

  useEffect(() => {
    if (open) {
      setRendered(true)
      const frame = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }

    setVisible(false)
    const timer = window.setTimeout(() => {
      setRendered(false)
      setView('root')
      setHelpPanelId(helpMenuPanels[0].id)
    }, 320)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (viewRef.current !== 'root') closeToRoot()
      else onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      document.getElementById('header-menu-button')?.focus()
    }
  }, [open, onClose])

  if (!rendered || typeof document === 'undefined') return null

  const nested = view !== 'root'
  const nestedTitle =
    view === 'destinations'
      ? t('layout.header.nav.whereWeFly')
      : view === 'experience'
        ? t('layout.header.nav.experience')
        : view === 'help'
          ? t('layout.header.nav.help')
          : ''

  return createPortal(
    <nav
      id="header-mobile-menu"
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={t('layout.header.navLabel')}
      className={`fixed inset-0 z-60 flex flex-col bg-background outline-none lg:hidden transition duration-300 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      {!nested && (
        <div className="relative h-[28vh] min-h-36 max-h-56 shrink-0 overflow-hidden">
          <img
            src={coverPhoto}
            alt={t('layout.header.mobile.coverAlt')}
            className="size-full object-cover object-[center_35%]"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('layout.header.closeMenu')}
            className="absolute top-4 inset-e-4 flex size-10 items-center justify-center rounded-full border-0 bg-background/80 text-800 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <X size={22} weight="regular" />
          </button>
        </div>
      )}

      {nested && (
        <div className="flex h-14 shrink-0 items-center gap-1 border-b border-200 px-2">
          <button
            type="button"
            onClick={closeToRoot}
            className="flex size-10 items-center justify-center rounded-full border-0 bg-transparent text-800 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            aria-label={t('layout.header.mobile.back')}
          >
            <CaretLeft size={22} weight="regular" className="rtl:-scale-x-100" />
          </button>
          <p className={`${typography.itemTitle} m-0 min-w-0 flex-1 truncate font-semibold text-800`}>
            {nestedTitle}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('layout.header.closeMenu')}
            className="flex size-10 items-center justify-center rounded-full border-0 bg-transparent text-800 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <X size={22} weight="regular" />
          </button>
        </div>
      )}

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 flex flex-col overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 transition-transform duration-300 ease-out motion-reduce:transition-none ${
            nested ? 'pointer-events-none -translate-x-full rtl:translate-x-full' : 'translate-x-0'
          }`}
          aria-hidden={nested}
        >
          <div className="flex flex-col">
            <LocalizedLink
              to="/"
              onClick={onNavigate}
              className={`${typography.itemTitle} py-3.5 font-bold text-800 no-underline`}
            >
              {t('common.home')}
            </LocalizedLink>

            {headerItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`${typography.itemTitle} flex w-full items-center justify-between gap-4 border-0 bg-transparent py-3.5 text-start font-normal text-800 cursor-pointer`}
              >
                {t(`layout.header.nav.${item.labelKey}`)}
                <CaretRight size={16} weight="regular" className="shrink-0 text-500 rtl:-scale-x-100" />
              </button>
            ))}

            {mobileMenuPrimaryLinks.map((link) => {
              const Icon = link.icon

              return (
                <LocalizedLink
                  key={link.id}
                  to={link.href}
                  onClick={onNavigate}
                  className={`${typography.itemTitle} flex items-center justify-between gap-4 py-3.5 font-normal text-800 no-underline`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {Icon && <Icon size={18} weight="regular" className="shrink-0 text-700" />}
                    {t(`layout.header.${link.labelKey}`)}
                  </span>
                  <CaretRight size={16} weight="regular" className="shrink-0 text-500 rtl:-scale-x-100" />
                </LocalizedLink>
              )
            })}
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-10 pb-2">
            {mobileMenuSecondaryLinks.map((link) => (
              <LocalizedLink
                key={link.id}
                to={link.href}
                onClick={onNavigate}
                className={`${typography.caption} font-medium text-primary-1 no-underline`}
              >
                {t(`layout.header.${link.labelKey}`)}
              </LocalizedLink>
            ))}
          </div>
        </div>

        <div
          className={`absolute inset-0 overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out motion-reduce:transition-none ${
            nested ? 'translate-x-0' : 'pointer-events-none translate-x-full rtl:-translate-x-full'
          }`}
          aria-hidden={!nested}
        >
          {view === 'destinations' && (
            <DestinationsMegaMenu embedded onNavigate={onNavigate} />
          )}
          {view === 'experience' && (
            <ExperienceMegaMenu embedded onNavigate={onNavigate} />
          )}
          {view === 'help' && (
            <HelpMegaMenu
              embedded
              panels={helpMenuPanels}
              activeId={helpPanelId}
              onSelectPanel={setHelpPanelId}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </div>
    </nav>,
    document.body
  )
}

export default HeaderMobileMenu
