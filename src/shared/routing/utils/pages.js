import Home from '../../../pages/Home.jsx'
import Help from '../../../pages/help/Help.jsx'
import ContactUs from '../../../pages/contact-us/ContactUs.jsx'
import OurOffices from '../../../pages/our-offices/OurOffices.jsx'
import OurGsa from '../../../pages/our-gsa/OurGsa.jsx'
import Forms from '../../../pages/forms/Forms.jsx'
import FormDetail from '../../../pages/forms/FormDetail.jsx'
import Faqs from '../../../pages/faqs/Faqs.jsx'

export const pages = {
  '/': Home,
  '/help': Help,
  '/help/contact-us': ContactUs,
  '/help/our-offices': OurOffices,
  '/help/forms': Forms,
  '/help/faqs': Faqs,
  '/help/our-gsa': OurGsa,
}

const formDetailPath = /^\/help\/forms\/([^/]+)$/

export function getPage(path) {
  if (pages[path]) return pages[path]
  if (formDetailPath.test(path)) return FormDetail
  return null
}
