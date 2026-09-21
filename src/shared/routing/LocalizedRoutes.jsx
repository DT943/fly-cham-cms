import { Navigate } from 'react-router-dom'
import { hasLanguageSuffix, withLanguage } from '../../i18n/languages.js'
import useLocalizedRoute from './hooks/useLocalizedRoute.js'
import LanguageRedirect from './components/LanguageRedirect.jsx'

const LocalizedRoutes = () => {
  const { language, Page, pathname, search, hash } = useLocalizedRoute()

  if (hasLanguageSuffix(pathname)) {
    return <Navigate to={withLanguage(`${pathname}${search}${hash}`, language)} replace />
  }

  if (!language) return <LanguageRedirect />

  return <Page />
}

export default LocalizedRoutes
