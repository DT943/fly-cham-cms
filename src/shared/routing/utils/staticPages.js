import Home from '../../../pages/Home.jsx'
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
import MagazineView from '../../../pages/magazine-view/MagazineView.jsx'
import Legal from '../../../pages/legal/Legal.jsx'
import TermsAndConditions from '../../../pages/legal/TermsAndConditions.jsx'
import BookingTermsAndConditions from '../../../pages/legal/BookingTermsAndConditions.jsx'
import PrivacyPolicy from '../../../pages/legal/PrivacyPolicy.jsx'
import Cookies from '../../../pages/legal/Cookies.jsx'
import {
  FormsRedirect,
  OurGsaRedirect,
  OurOfficesRedirect,
} from '../components/OurOfficesRedirect.jsx'

/** Legacy help path aliases → official `/help/contact-us/...` routes. */
export const helpPages = {
  '/help/our-gsa': OurGsaRedirect,
  '/help/forms': FormsRedirect,
  '/help/our-offices': OurOfficesRedirect,
}

export const ourDestinationsPages = {
  '/our-destinations': OurDestinations,
  '/our-destinations/flights-to-damascus': ThingsToDoInDamascus,
  '/our-destinations/things-to-do-in-damascus': FlightsToDamascus,
  '/our-destinations/flights-to-dubai': ThingsToDoInDamascus,
  '/our-destinations/city-sights': CitySights,
  '/our-destinations/route-map': RouteMap,
}

export const travelExperiencePages = {
  '/travel-experience': TravelExperience,
  '/travel-experience/seat-selection': SeatSelection,
  '/travel-experience/before-you-fly': BeforeYouFly,
  '/travel-experience/at-the-airport': BeforeYouFly,
  '/travel-experience/onboard': BeforeYouFly,
  '/travel-experience/after-travel': BeforeYouFly,
  '/travel-experience/traveler-magazine': TravelerMagazine,
}

export const legalPages = {
  '/legal': Legal,
  '/legal/terms-and-conditions': TermsAndConditions,
  '/legal/booking-terms-and-conditions': BookingTermsAndConditions,
  '/legal/privacy-policy': PrivacyPolicy,
  '/legal/cookies': Cookies,
}

export const otherPages = {
  '/': Home,
  '/our-responsibility': OurResponsibility,
  '/about-us': AboutUs,
  '/our-fleet': OurFleet,
  '/media-center': MediaCenter,
  '/recent-news': RecentNews,
  '/magazine-view': MagazineView,
}

/** Static / legacy app pages. */
export const staticPages = {
  ...helpPages,
  ...ourDestinationsPages,
  ...travelExperiencePages,
  ...legalPages,
  ...otherPages,
}

export default staticPages
