import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Home from '../../pages/Home.jsx'
import Help from '../../pages/help/Help.jsx'
import ContactUs from '../../pages/contact-us/ContactUs.jsx'
import OurOffices from '../../pages/our-offices/OurOffices.jsx'
import OurGsa from '../../pages/our-gsa/OurGsa.jsx'
import Forms from '../../pages/forms/Forms.jsx'
import Faqs from '../../pages/faqs/Faqs.jsx'
import {
  getLanguageFromPath,
  getPreferredLanguage,
  withLanguage,
  stripLanguage,
} from '../../i18n/languages.js'

const pages = {
  '/': Home,
  '/help': Help,
  '/help/contact-us': ContactUs,
  '/help/our-offices': OurOffices,
  '/help/our-gsa': OurGsa,
  '/help/forms': Forms,
  '/help/faqs': Faqs,
}

const LocalizedRoutes = () => {
  const { pathname, search, hash } = useLocation()
  const { i18n } = useTranslation()
  const language = getLanguageFromPath(pathname)
  const pagePath = stripLanguage(pathname)
  const Page = pages[pagePath]

  if (!language) {
    const preferred = getPreferredLanguage(i18n.resolvedLanguage || i18n.language)
    return <Navigate to={`${withLanguage(pathname, preferred)}${search}${hash}`} replace />
  }

  if (!Page) {
    return <Navigate to={`/${language}`} replace />
  }

  return <Page />
}

export default LocalizedRoutes
