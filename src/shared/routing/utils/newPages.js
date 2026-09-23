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
import NewLegal from '../../../pages/new-legal/NewLegal.jsx'
import NewLegalDocument from '../../../pages/new-legal-document/NewLegalDocument.jsx'
import { createLanguageRedirect } from '../components/OurOfficesRedirect.jsx'

/** Official CMS help routes (same paths as the old static help pages). */
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
  '/new-our-destinations': NewOurDestinations,
  '/our-destinations/new-flights-to-damascus': NewFlightsToDamascus,
  '/our-destinations/new-things-to-do-in-damascus': NewThingsToDoInDamascus,
  '/our-destinations/new-city-sights': NewCitySights,
}

export const travelExperiencePages = {
  '/new-travel-experience': NewTravelExperience,
  '/travel-experience/new-seat-selection': NewSeatSelection,
  '/travel-experience/new-before-you-fly': NewBeforeYouFly,
  '/travel-experience/new-traveler-magazine': NewTravelerMagazine,
  '/travel-experience/new-our-responsibility': NewOurResponsibility,
}

export const legalPages = {
  '/new-legal': NewLegal,
  '/legal/new-terms-and-conditions': NewLegalDocument,
  '/legal/new-booking-terms-and-conditions': NewLegalDocument,
  '/legal/new-privacy-policy': NewLegalDocument,
  '/legal/new-cookies': NewLegalDocument,
}

export const otherPages = {
  '/new-about-us': NewAboutUs,
  '/new-our-fleet': NewOurFleet,
  '/new-media-center': NewMediaCenter,
  '/new-recent-news': NewRecentNews,
}

/** CMS-driven pages. */
export const newPages = {
  ...helpPages,
  ...ourDestinationsPages,
  ...travelExperiencePages,
  ...legalPages,
  ...otherPages,
}

export default newPages
