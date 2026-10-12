import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './Header.jsx'
import Footer from './footer/Footer.jsx'
import CookieConsent from './CookieConsent.jsx'
import { getLanguageFromPath, isSupportedLanguage, stripLanguage } from '../../i18n/languages.js'
import useSearchHit from '../search/hooks/useSearchHit.js'

const Layout = () => {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const language = getLanguageFromPath(pathname)
  const pagePath = stripLanguage(pathname)
  const hideChrome = pagePath === '/login-travel-agent' || pagePath === '/cham-miles'
  const hideFooter = hideChrome || pagePath === '/our-destinations/route-map'

  useSearchHit()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const current = (i18n.resolvedLanguage || i18n.language || '').split('-')[0]
    if (isSupportedLanguage(language) && current !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip">
      {!hideChrome && (
        <Header showTravelNotice={pagePath === '/'} />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
      <CookieConsent />
    </div>
  )
}

export default Layout
