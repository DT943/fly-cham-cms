import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getLanguageFromPath, getPreferredLanguage } from '../../i18n/languages.js'

const useCurrentLanguage = () => {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()

  return getLanguageFromPath(pathname) || getPreferredLanguage(i18n.resolvedLanguage || i18n.language)
}

export default useCurrentLanguage
