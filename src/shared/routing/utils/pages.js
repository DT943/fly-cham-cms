import Home from '../../../pages/Home.jsx'
import Help from '../../../pages/help/Help.jsx'
import NewHelp from '../../../pages/new-help/NewHelp.jsx'
import NewContactUs from '../../../pages/new-contact-us/NewContactUs.jsx'
import NewOurOffices from '../../../pages/new-our-offices/NewOurOffices.jsx'
import NewOurGsa from '../../../pages/new-our-gsa/NewOurGsa.jsx'
import NewForms from '../../../pages/new-forms/NewForms.jsx'
import NewOurDestinations from '../../../pages/new-our-destinations/NewOurDestinations.jsx'
import NewFlightsToDamascus from '../../../pages/new-flights-to-damascus/NewFlightsToDamascus.jsx'
import NewThingsToDoInDamascus from '../../../pages/new-things-to-do-in-damascus/NewThingsToDoInDamascus.jsx'
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
import TravelerMagazine from '../../../pages/traveler-magazine/TravelerMagazine.jsx'
import BeforeYouFly from '../../../pages/before-you-fly/BeforeYouFly.jsx'
import SeatSelection from '../../../pages/seat-selection/SeatSelection.jsx'
import AboutUs from '../../../pages/about-us/AboutUs.jsx'
import OurFleet from '../../../pages/our-fleet/OurFleet.jsx'
import OurResponsibility from '../../../pages/our-responsibility/OurResponsibility.jsx'
import MediaCenter from '../../../pages/media-center/MediaCenter.jsx'
import RecentNews from '../../../pages/recent-news/RecentNews.jsx'
import Legal from '../../../pages/legal/Legal.jsx'
import TermsAndConditions from '../../../pages/legal/TermsAndConditions.jsx'
import BookingTermsAndConditions from '../../../pages/legal/BookingTermsAndConditions.jsx'
import PrivacyPolicy from '../../../pages/legal/PrivacyPolicy.jsx'
import Cookies from '../../../pages/legal/Cookies.jsx'
import RecentNewsDetail from '../../../pages/recent-news/RecentNewsDetail.jsx'
import NewsDetail from '../../../pages/news-detail/NewsDetail.jsx'
import MagazineView from '../../../pages/magazine-view/MagazineView.jsx'
import { NEWS_DETAIL_PATH } from '../../../pages/news-detail/utils/newsArticles.js'
import { RECENT_NEWS_DETAIL_PATH } from '../../../pages/recent-news/utils/recentNews.js'
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
  '/new-help': NewHelp,
  '/new-help/new-contact-us': NewContactUs,
  '/help/contact-us': ContactUs,
  '/help/contact-us/our-offices': OurOffices,
  '/help/contact-us/new-our-offices': NewOurOffices,
  '/help/contact-us/our-gsa': OurGsa,
  '/help/our-gsa': OurGsaRedirect,
  '/help/contact-us/new-our-gsa': NewOurGsa,
  '/help/contact-us/forms': Forms,
  '/help/contact-us/new-forms': NewForms,
  '/help/forms': FormsRedirect,
  '/help/our-offices': OurOfficesRedirect,
  '/help/faqs': Faqs,
  '/our-destinations': OurDestinations,
  '/new-our-destinations': NewOurDestinations,
  '/our-destinations/flights-to-damascus': ThingsToDoInDamascus,
  '/our-destinations/new-flights-to-damascus': NewFlightsToDamascus,
  '/our-destinations/new-things-to-do-in-damascus': NewThingsToDoInDamascus,
  '/our-destinations/things-to-do-in-damascus': FlightsToDamascus,
  '/our-destinations/flights-to-dubai': ThingsToDoInDamascus,
  '/our-destinations/city-sights': CitySights,
  '/our-destinations/route-map': RouteMap,
  '/travel-experience': TravelExperience,
  '/travel-experience/seat-selection': SeatSelection,
  '/travel-experience/before-you-fly': BeforeYouFly,
  '/travel-experience/at-the-airport': BeforeYouFly,
  '/travel-experience/onboard': BeforeYouFly,
  '/travel-experience/after-travel': BeforeYouFly,
  '/travel-experience/traveler-magazine': TravelerMagazine,
  '/our-responsibility': OurResponsibility,
  '/about-us': AboutUs,
  '/our-fleet': OurFleet,
  '/media-center': MediaCenter,
  '/recent-news': RecentNews,
  '/magazine-view': MagazineView,
  '/legal': Legal,
  '/legal/terms-and-conditions': TermsAndConditions,
  '/legal/booking-terms-and-conditions': BookingTermsAndConditions,
  '/legal/privacy-policy': PrivacyPolicy,
  '/legal/cookies': Cookies,
}

const formRequestPath = /^\/help\/contact-us\/forms\/([^/]+)\/request$/
const formDetailPath = /^\/help\/contact-us\/forms\/([^/]+)$/
const legacyFormDetailPath = /^\/help\/forms\/([^/]+)$/

export function getPage(path) {
  if (pages[path]) return pages[path]
  if (RECENT_NEWS_DETAIL_PATH.test(path)) return RecentNewsDetail
  if (NEWS_DETAIL_PATH.test(path)) return NewsDetail
  if (getJourneyStage(getJourneyStageSlug(path))) return BeforeYouFly
  if (getDestinationGuide(getDestinationGuideSlug(path))) return ThingsToDoInDamascus
  if (formRequestPath.test(path)) return RequestAForm
  if (formDetailPath.test(path)) return FormDetail
  if (legacyFormDetailPath.test(path)) return LegacyFormDetailRedirect
  return null
}
