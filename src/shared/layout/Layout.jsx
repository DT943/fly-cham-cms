import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './Header.jsx'
import Footer from './footer/Footer.jsx'
import { getLanguageFromPath, isSupportedLanguage, stripLanguage } from '../../i18n/languages.js'
import useSearchHit from '../search/hooks/useSearchHit.js'



const Layout = () => {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const language = getLanguageFromPath(pathname)

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
    <div className="min-h-screen flex flex-col">
      <Header dark={true} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
