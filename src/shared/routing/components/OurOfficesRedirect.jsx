import { Navigate } from 'react-router-dom'
import { withLanguage } from '../../../i18n/languages.js'
import useCurrentLanguage from '../../hooks/useCurrentLanguage.js'

const OurOfficesRedirect = () => {
  const language = useCurrentLanguage()
  return <Navigate to={withLanguage('/help/contact-us/our-offices', language)} replace />
}

export default OurOfficesRedirect
