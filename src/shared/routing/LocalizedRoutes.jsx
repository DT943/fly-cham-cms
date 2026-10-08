import { hasLocalePrefix } from '../../i18n/languages.js'
import useLocalizedRoute from './hooks/useLocalizedRoute.js'
import LanguageRedirect from './components/LanguageRedirect.jsx'

const LocalizedRoutes = () => {
  const { Page, pathname } = useLocalizedRoute()

  // Every page lives under /<pos>/<lang>; anything else is redirected there.
  if (!hasLocalePrefix(pathname)) return <LanguageRedirect />

  return <Page />
}

export default LocalizedRoutes
