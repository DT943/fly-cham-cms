import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_POS,
  getLanguageFromPath,
  getPosFromPath,
  getPreferredLanguage,
  withLanguage,
} from '../../../i18n/languages.js'

/**
 * Sends a URL that lacks the POS and/or language (`/`, `/en/help`, `/ae/help`,
 * `/help/en`) to the full `/<pos>/<lang>/...` form, keeping whatever POS or
 * language it already had (defaults: DEFAULT_POS, the visitor's language).
 */
const LanguageRedirect = () => {
  const { pathname, search, hash } = useLocation()
  const { i18n } = useTranslation()
  const language =
    getLanguageFromPath(pathname) || getPreferredLanguage(i18n.resolvedLanguage || i18n.language)
  const pos = getPosFromPath(pathname) || DEFAULT_POS

  return <Navigate to={withLanguage(`${pathname}${search}${hash}`, language, pos)} replace />
}

export default LanguageRedirect
