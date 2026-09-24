import { staticToNewPath } from '../../routing/utils/toNewPageHref.js'

/** Static path → i18n key for the search-result page chip. */
const PAGE_CHIP_KEYS = {
  '/help': 'common.help',
  '/help/contact-us': 'common.contactUs',
  '/help/contact-us/our-offices': 'common.ourOffices',
  '/help/contact-us/our-gsa': 'common.ourGsa',
  '/help/contact-us/forms': 'help.search.chips.forms',
  '/help/faqs': 'common.faqs',
  '/our-destinations': 'common.ourDestinations',
  '/our-destinations/flights-to-damascus': 'destinationGuides.damascus.breadcrumb',
  '/our-destinations/things-to-do-in-damascus': 'flightsToDamascus.breadcrumb',
  '/our-destinations/city-sights': 'citySights.breadcrumb',
  '/our-destinations/route-map': 'routeMap.breadcrumb',
  '/travel-experience': 'travelExperience.breadcrumb',
  '/travel-experience/seat-selection': 'seatSelection.breadcrumb',
  '/travel-experience/before-you-fly': 'beforeYouFly.breadcrumb',
  '/travel-experience/at-the-airport': 'atTheAirport.breadcrumb',
  '/travel-experience/onboard': 'onboard.breadcrumb',
  '/travel-experience/after-travel': 'afterTravel.breadcrumb',
  '/travel-experience/traveler-magazine': 'travelerMagazine.breadcrumb',
  '/our-responsibility': 'ourResponsibility.breadcrumb',
  '/about-us': 'aboutUs.breadcrumb',
  '/our-fleet': 'ourFleet.breadcrumb',
  '/media-center': 'mediaCenter.breadcrumb',
  '/recent-news': 'recentNews.breadcrumb',
  '/travel-updates': 'travelUpdates.breadcrumb',
  '/legal': 'legal.hub.breadcrumb',
  '/legal/terms-and-conditions': 'legal.terms.breadcrumb',
  '/legal/booking-terms-and-conditions': 'legal.bookingTerms.breadcrumb',
  '/legal/privacy-policy': 'legal.privacy.breadcrumb',
  '/legal/cookies': 'legal.cookies.breadcrumb',
}

const newToStaticPath = Object.fromEntries(
  Object.entries(staticToNewPath).map(([staticPath, newPath]) => [newPath, staticPath]),
)

function resolvePageChipKey(href = '') {
  if (!href) return null
  return PAGE_CHIP_KEYS[href] || PAGE_CHIP_KEYS[newToStaticPath[href]] || null
}

/**
 * Label for a search-result type chip.
 * FAQ / Form stay as type names; page hits use the destination page name.
 */
export function getSearchChipLabel(item, t) {
  if (item?.type === 'faq') return t('help.search.chips.faq')
  if (item?.type === 'form') return t('help.search.chips.form')

  const pageKey = resolvePageChipKey(item?.href)
  if (pageKey) {
    const label = t(pageKey)
    if (label && label !== pageKey) return label
  }

  return t('help.search.chips.page')
}
