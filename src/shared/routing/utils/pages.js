import Home from '../../../pages/Home.jsx'
import Help from '../../../pages/help/Help.jsx'
import ContactUs from '../../../pages/contact-us/ContactUs.jsx'
import OurOffices from '../../../pages/our-offices/OurOffices.jsx'
import OurGsa from '../../../pages/our-gsa/OurGsa.jsx'
import Forms from '../../../pages/forms/Forms.jsx'
import FormDetail from '../../../pages/forms/FormDetail.jsx'
import RequestAForm from '../../../pages/forms/RequestAForm.jsx'
import Faqs from '../../../pages/faqs/Faqs.jsx'
import OurDestinations from '../../../pages/our-destinations/OurDestinations.jsx'
import ThingsToDoInDamascus from '../../../pages/things-to-do-in-damascus/ThingsToDoInDamascus.jsx'
import FlightsToDamascus from '../../../pages/flights-to-damascus/FlightsToDamascus.jsx'
import CitySights from '../../../pages/city-sights/CitySights.jsx'
import RouteMap from '../../../pages/route-map/RouteMap.jsx'
import TravelExperience from '../../../pages/travel-experience/TravelExperience.jsx'
import BeforeYouFly from '../../../pages/before-you-fly/BeforeYouFly.jsx'
import { getDestinationGuide, getDestinationGuideSlug } from '../../../pages/things-to-do-in-damascus/utils/destinationGuides.js'
import { getJourneyStage, getJourneyStageSlug } from '../../../pages/before-you-fly/utils/journeyStages.js'
import {
  FormsRedirect,
  LegacyFormDetailRedirect,
  OurGsaRedirect,
  OurOfficesRedirect,
} from '../components/OurOfficesRedirect.jsx'

export const pages = {
  '/': Home,
  '/help': Help,
  '/help/contact-us': ContactUs,
  '/help/contact-us/our-offices': OurOffices,
  '/help/contact-us/our-gsa': OurGsa,
  '/help/contact-us/forms': Forms,
  '/help/our-offices': OurOfficesRedirect,
  '/help/our-gsa': OurGsaRedirect,
  '/help/forms': FormsRedirect,
  '/help/faqs': Faqs,
  '/our-destinations': OurDestinations,
  '/our-destinations/things-to-do-in-damascus': FlightsToDamascus,
  '/our-destinations/flights-to-damascus': ThingsToDoInDamascus,
  '/our-destinations/flights-to-dubai': ThingsToDoInDamascus,
  '/our-destinations/city-sights': CitySights,
  '/our-destinations/route-map': RouteMap,
  '/travel-experience': TravelExperience,
  '/travel-experience/before-you-fly': BeforeYouFly,
  '/travel-experience/at-the-airport': BeforeYouFly,
  '/travel-experience/onboard': BeforeYouFly,
  '/travel-experience/after-travel': BeforeYouFly,
}

const formRequestPath = /^\/help\/contact-us\/forms\/([^/]+)\/request$/
const formDetailPath = /^\/help\/contact-us\/forms\/([^/]+)$/
const legacyFormDetailPath = /^\/help\/forms\/([^/]+)$/

export function getPage(path) {
  if (pages[path]) return pages[path]
  if (getJourneyStage(getJourneyStageSlug(path))) return BeforeYouFly
  if (getDestinationGuide(getDestinationGuideSlug(path))) return ThingsToDoInDamascus
  if (formRequestPath.test(path)) return RequestAForm
  if (formDetailPath.test(path)) return FormDetail
  if (legacyFormDetailPath.test(path)) return LegacyFormDetailRedirect
  return null
}
