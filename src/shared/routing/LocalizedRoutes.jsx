import useLocalizedRoute from './hooks/useLocalizedRoute.js'
import LanguageRedirect from './components/LanguageRedirect.jsx'
import HomeRedirect from './components/HomeRedirect.jsx'

const LocalizedRoutes = () => {
  const { language, Page } = useLocalizedRoute()

  if (!language) return <LanguageRedirect />
  if (!Page) return <HomeRedirect language={language} />

  return <Page />
}

export default LocalizedRoutes
