import { CaretRight, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import coverPhoto from '../../../../assets/images/our-destenations/ph1.png'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { mobileMenuPrimaryLinks, mobileMenuSecondaryLinks } from '../../headerNav.js'

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

const PrimaryLink = ({ href, icon: Icon, title, onNavigate }) => (
  <LocalizedLink
    to={href}
    onClick={onNavigate}
    className={`${typography.itemTitle} flex items-center justify-between gap-4 py-3.5 font-normal text-800 no-underline`}
  >
    <span className="flex min-w-0 items-center gap-3">
      {Icon && <Icon size={18} weight="regular" className="shrink-0 text-700" />}
      {title}
    </span>
    <CaretRight size={16} weight="regular" className="shrink-0 text-500 rtl:-scale-x-100" />
  </LocalizedLink>
)

const HeaderMobileMenu = ({ open, onClose, onNavigate }) => {
  const { t } = useTranslation()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const [rendered, setRendered] = useState(open)
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    if (open) {
      setRendered(true)
      const frame = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }

    setVisible(false)
    const timer = window.setTimeout(() => setRendered(false), 320)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      document.getElementById('header-menu-button')?.focus()
    }
  }, [open, onClose])

  if (!rendered || typeof document === 'undefined') return null

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

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <div className="flex flex-col">
          <LocalizedLink
            to="/"
            onClick={onNavigate}
            className={`${typography.itemTitle} py-3.5 font-bold text-800 no-underline`}
          >
            {t('common.home')}
          </LocalizedLink>

          {mobileMenuPrimaryLinks.map((link) => (
            <PrimaryLink
              key={link.id}
              href={link.href}
              icon={link.icon}
              title={t(`layout.header.${link.labelKey}`)}
              onNavigate={onNavigate}
            />
          ))}
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
    </nav>,
    document.body
  )
}

export default HeaderMobileMenu
