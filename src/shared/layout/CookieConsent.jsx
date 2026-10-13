import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Cookie, X } from '@phosphor-icons/react'
import Container from '../components/Container.jsx'
import LocalizedLink from '../components/LocalizedLink.jsx'
import { COOKIES_BANNER_KEY } from '../../vendor/flycham/lib/analytics.js'

// The choice lives in a real cookie so clearing cookies brings the bar back.
// Analytics reads consent from localStorage (any value under
// COOKIES_BANNER_KEY), so that key is kept in sync with the cookie.
const CONSENT_COOKIE = 'flycham_cookie_consent'
const CLOSED_COOKIE = 'flycham_cookie_banner_closed'
const ONE_YEAR = 60 * 60 * 24 * 365

const readCookie = (name) => {
  const match = document.cookie.split('; ').find((part) => part.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

// No maxAge → session cookie (gone when the browser closes).
const writeCookie = (name, value, maxAge) => {
  const expiry = maxAge ? `; max-age=${maxAge}` : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${expiry}`
}

const syncAnalyticsConsent = (consent) => {
  try {
    if (consent === 'accepted') window.localStorage.setItem(COOKIES_BANNER_KEY, 'accepted')
    else window.localStorage.removeItem(COOKIES_BANNER_KEY)
  } catch {
    // Storage blocked (private mode) — analytics just stays off.
  }
}

// The browser reports F5 and Ctrl+Shift+R both as a plain 'reload', so a hard
// reload is caught by its shortcut just before the page unloads.
const HARD_RELOAD_FLAG = 'flycham_cookie_hard_reload'

const isHardReloadKey = (event) =>
  event.shiftKey && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r'

const markHardReload = (event) => {
  if (!isHardReloadKey(event)) return
  try {
    window.sessionStorage.setItem(HARD_RELOAD_FLAG, '1')
  } catch {
    // Storage blocked — the bar just won't reappear on hard reload.
  }
}

// Read once per page load: StrictMode runs state initialisers twice, and the
// flag is removed on first read.
let hardReload
const consumeHardReload = () => {
  if (hardReload !== undefined) return hardReload
  try {
    hardReload = window.sessionStorage.getItem(HARD_RELOAD_FLAG) === '1'
    window.sessionStorage.removeItem(HARD_RELOAD_FLAG)
  } catch {
    hardReload = false
  }
  return hardReload
}

const shouldOpen = () => {
  const consent = readCookie(CONSENT_COOKIE)
  syncAnalyticsConsent(consent)
  if (consumeHardReload()) return true
  return !consent && !readCookie(CLOSED_COOKIE)
}

const CookieConsent = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && shouldOpen())
  const [shown, setShown] = useState(false)

  useEffect(() => {
    window.addEventListener('keydown', markHardReload)
    return () => window.removeEventListener('keydown', markHardReload)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const frame = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(frame)
  }, [open])

  if (!open) return null

  const hide = () => {
    hardReload = false
    setShown(false)
    setTimeout(() => setOpen(false), 300)
  }

  const choose = (consent) => {
    writeCookie(CONSENT_COOKIE, consent, ONE_YEAR)
    syncAnalyticsConsent(consent)
    hide()
  }

  const accept = () => choose('accepted')
  const decline = () => choose('declined')
  const dismiss = () => {
    writeCookie(CLOSED_COOKIE, '1')
    hide()
  }

  return (
    <div className="fixed inset-0 z-1100 flex flex-col justify-end">
      <div
        aria-hidden
        className={`absolute inset-0 bg-secondary-2/40 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-consent-text"
        className={`relative bg-background shadow-[0_-8px_24px_-12px_rgba(33,37,41,0.25)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          shown ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <Container className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-6 md:py-6">
          <div className="flex min-w-0 flex-1 items-start gap-4 md:items-center">
            <Cookie size={32} weight="regular" className="shrink-0 text-primary-1" aria-hidden />
            <p id="cookie-consent-text" className="m-0 text-xs leading-relaxed text-700 md:text-sm">
              {t('cookieConsent.message')} {t('cookieConsent.readOur')}{' '}
              <LocalizedLink
                href="/legal/cookies"
                className="font-semibold text-primary-1 underline hover:text-primary-800"
              >
                {t('cookieConsent.policy')}
              </LocalizedLink>{' '}
              {t('cookieConsent.settings')}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-end md:self-auto">
            <button
              type="button"
              onClick={decline}
              className="h-10 min-w-30 cursor-pointer rounded-lg border border-solid border-primary-1 bg-transparent px-6 text-sm font-semibold text-primary-1 transition-colors hover:bg-primary-1/5"
            >
              {t('cookieConsent.decline')}
            </button>
            <button
              type="button"
              onClick={accept}
              className="h-10 min-w-30 cursor-pointer rounded-lg border-0 bg-secondary px-6 text-sm font-semibold text-btn transition-colors hover:bg-secondary-800"
            >
              {t('cookieConsent.accept')}
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t('cookieConsent.close')}
              className="grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-700 transition-colors hover:bg-100"
            >
              <X size={20} />
            </button>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default CookieConsent
