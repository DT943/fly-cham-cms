import { useLocation } from 'react-router-dom'
import { getLanguageFromPath, stripLanguage } from '../../../i18n/languages.js'
import { getPage } from '../utils/pages.js'

const useLocalizedRoute = () => {
  const { pathname, search, hash } = useLocation()
  const language = getLanguageFromPath(pathname)
  const pagePath = stripLanguage(pathname)

  return {
    language,
    pagePath,
    Page: getPage(pagePath),
    pathname,
    search,
    hash,
  }
}

export default useLocalizedRoute
