import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPreferredLanguage, withLanguage } from '../../../i18n/languages.js'

const LanguageRedirect = () => {
  const { pathname, search, hash } = useLocation()
  const { i18n } = useTranslation()
  const language = getPreferredLanguage(i18n.resolvedLanguage || i18n.language)

  return <Navigate to={withLanguage(`${pathname}${search}${hash}`, language)} replace />
}

export default LanguageRedirect
