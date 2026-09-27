import NewHelp from '../../../pages/new-help/NewHelp.jsx'
import NewContactUs from '../../../pages/new-contact-us/NewContactUs.jsx'
import NewOurOffices from '../../../pages/new-our-offices/NewOurOffices.jsx'
import NewOurGsa from '../../../pages/new-our-gsa/NewOurGsa.jsx'
import NewForms from '../../../pages/new-forms/NewForms.jsx'
import NewFaqs from '../../../pages/new-faqs/NewFaqs.jsx'
import NewOurDestinations from '../../../pages/new-our-destinations/NewOurDestinations.jsx'
import NewFlightsToDamascus from '../../../pages/new-flights-to-damascus/NewFlightsToDamascus.jsx'
import NewThingsToDoInDamascus from '../../../pages/new-things-to-do-in-damascus/NewThingsToDoInDamascus.jsx'
import NewCitySights from '../../../pages/new-city-sights/NewCitySights.jsx'
import NewTravelExperience from '../../../pages/new-travel-experience/NewTravelExperience.jsx'
import NewSeatSelection from '../../../pages/new-seat-selection/NewSeatSelection.jsx'
import NewBeforeYouFly from '../../../pages/new-before-you-fly/NewBeforeYouFly.jsx'
import NewTravelerMagazine from '../../../pages/new-traveler-magazine/NewTravelerMagazine.jsx'
import NewOurResponsibility from '../../../pages/new-our-responsibility/NewOurResponsibility.jsx'
import NewAboutUs from '../../../pages/new-about-us/NewAboutUs.jsx'
import NewOurFleet from '../../../pages/new-our-fleet/NewOurFleet.jsx'
import NewMediaCenter from '../../../pages/new-media-center/NewMediaCenter.jsx'
import NewRecentNews from '../../../pages/new-recent-news/NewRecentNews.jsx'
import NewNewsDetail from '../../../pages/new-news-detail/NewNewsDetail.jsx'
import NewLegal from '../../../pages/new-legal/NewLegal.jsx'
import NewLegalDocument from '../../../pages/new-legal-document/NewLegalDocument.jsx'
import NewHome from '../../../pages/new-home/NewHome.jsx'
import NewTravelUpdates from '../../../pages/new-travel-updates/NewTravelUpdates.jsx'
import NewCargoService from '../../../pages/new-cargo-service/NewCargoService.jsx'
import NewCargoStations from '../../../pages/new-cargo-stations/NewCargoStations.jsx'
import NewBusinessCenter from '../../../pages/new-business-center/NewBusinessCenter.jsx'
import { createLanguageRedirect } from '../components/OurOfficesRedirect.jsx'

/** Official CMS help routes. */
export const helpPages = {
  '/help': NewHelp,
  '/help/contact-us': NewContactUs,
  '/help/contact-us/our-offices': NewOurOffices,
  '/help/contact-us/our-gsa': NewOurGsa,
  '/help/contact-us/forms': NewForms,
  '/help/faqs': NewFaqs,
  // Legacy `new-*` URLs → official help paths
  '/new-help': createLanguageRedirect('/help'),
  '/new-help/new-contact-us': createLanguageRedirect('/help/contact-us'),
  '/help/contact-us/new-our-offices': createLanguageRedirect('/help/contact-us/our-offices'),
  '/help/contact-us/new-our-gsa': createLanguageRedirect('/help/contact-us/our-gsa'),
  '/help/contact-us/new-forms': createLanguageRedirect('/help/contact-us/forms'),
  '/help/new-faqs': createLanguageRedirect('/help/faqs'),
}

export const ourDestinationsPages = {
  '/our-destinations': NewOurDestinations,
  '/our-destinations/flights-to-damascus': NewFlightsToDamascus,
  '/our-destinations/things-to-do-in-damascus': NewThingsToDoInDamascus,
  '/our-destinations/city-sights': NewCitySights,
  // Legacy `new-*` URLs
  '/new-our-destinations': createLanguageRedirect('/our-destinations'),
  '/our-destinations/new-flights-to-damascus': createLanguageRedirect(
    '/our-destinations/flights-to-damascus',
  ),
  '/our-destinations/new-things-to-do-in-damascus': createLanguageRedirect(
    '/our-destinations/things-to-do-in-damascus',
  ),
  '/our-destinations/new-city-sights': createLanguageRedirect('/our-destinations/city-sights'),
}

export const travelExperiencePages = {
  '/travel-experience': NewTravelExperience,
  '/travel-experience/seat-selection': NewSeatSelection,
  '/travel-experience/before-you-fly': NewBeforeYouFly,
  '/travel-experience/traveler-magazine': NewTravelerMagazine,
  '/our-responsibility': NewOurResponsibility,
  // Legacy `new-*` URLs
  '/new-travel-experience': createLanguageRedirect('/travel-experience'),
  '/travel-experience/new-seat-selection': createLanguageRedirect(
    '/travel-experience/seat-selection',
  ),
  '/travel-experience/new-before-you-fly': createLanguageRedirect(
    '/travel-experience/before-you-fly',
  ),
  '/travel-experience/new-traveler-magazine': createLanguageRedirect(
    '/travel-experience/traveler-magazine',
  ),
  '/travel-experience/new-our-responsibility': createLanguageRedirect('/our-responsibility'),
}

export const legalPages = {
  '/legal': NewLegal,
  '/legal/terms-and-conditions': NewLegalDocument,
  '/legal/booking-terms-and-conditions': NewLegalDocument,
  '/legal/privacy-policy': NewLegalDocument,
  '/legal/cookies': NewLegalDocument,
  // Legacy `new-*` URLs
  '/new-legal': createLanguageRedirect('/legal'),
  '/legal/new-terms-and-conditions': createLanguageRedirect('/legal/terms-and-conditions'),
  '/legal/new-booking-terms-and-conditions': createLanguageRedirect(
    '/legal/booking-terms-and-conditions',
  ),
  '/legal/new-privacy-policy': createLanguageRedirect('/legal/privacy-policy'),
  '/legal/new-cookies': createLanguageRedirect('/legal/cookies'),
}

export const otherPages = {
  '/': NewHome,
  '/travel-updates': NewTravelUpdates,
  '/cargo-service': NewCargoService,
  '/cargo-stations': NewCargoStations,
  '/business-center': NewBusinessCenter,
  '/about-us': NewAboutUs,
  '/our-fleet': NewOurFleet,
  '/media-center': NewMediaCenter,
  '/recent-news': NewRecentNews,
  '/media-center/news/fleetUpdate': NewNewsDetail,
  // Legacy `new-*` URLs
  '/new-home': createLanguageRedirect('/'),
  '/new-travel-updates': createLanguageRedirect('/travel-updates'),
  '/new-cargo-service': createLanguageRedirect('/cargo-service'),
  '/new-cargo-stations': createLanguageRedirect('/cargo-stations'),
  '/new-business-center': createLanguageRedirect('/business-center'),
  '/new-about-us': createLanguageRedirect('/about-us'),
  '/new-our-fleet': createLanguageRedirect('/our-fleet'),
  '/new-media-center': createLanguageRedirect('/media-center'),
  '/new-recent-news': createLanguageRedirect('/recent-news'),
  '/media-center/news/new-fleetUpdate': createLanguageRedirect('/media-center/news/fleetUpdate'),
}

/** CMS-driven pages (official URLs). */
export const newPages = {
  ...helpPages,
  ...ourDestinationsPages,
  ...travelExperiencePages,
  ...legalPages,
  ...otherPages,
}

export default newPages
