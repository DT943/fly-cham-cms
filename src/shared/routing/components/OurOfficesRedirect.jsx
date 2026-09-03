import { Navigate, useLocation } from 'react-router-dom'
import { stripLanguage, withLanguage } from '../../../i18n/languages.js'
import useCurrentLanguage from '../../hooks/useCurrentLanguage.js'

export function createLanguageRedirect(to) {
  return function LanguageRedirect() {
    const language = useCurrentLanguage()
    return <Navigate to={withLanguage(to, language)} replace />
  }
}

export const OurOfficesRedirect = createLanguageRedirect('/help/contact-us/our-offices')
export const OurGsaRedirect = createLanguageRedirect('/help/contact-us/our-gsa')
export const FormsRedirect = createLanguageRedirect('/help/contact-us/forms')

export const LegacyFormDetailRedirect = () => {
  const language = useCurrentLanguage()
  const { pathname } = useLocation()
  const formId = stripLanguage(pathname).split('/').pop()
  return <Navigate to={withLanguage(`/help/contact-us/forms/${formId}`, language)} replace />
}

export default OurOfficesRedirect
