/**
 * Official CMS page paths (language already stripped).
 * Kept free of page-component imports — search hooks import this file, and those
 * hooks are pulled in by SearchConsole via the CMS section registry (circular TDZ).
 */
export const cmsPagePaths = [
  '/help',
  '/help/contact-us',
  '/help/contact-us/our-offices',
  '/help/contact-us/our-gsa',
  '/help/contact-us/forms',
  '/help/contact-us/forms/request-a-form',
  '/help/faqs',
  '/our-destinations',
  '/our-destinations/flights-to-damascus',
  '/our-destinations/flights-to-dubai',
  '/our-destinations/things-to-do-in-damascus',
  '/our-destinations/city-sights',
  '/travel-experience',
  '/travel-experience/seat-selection',
  '/travel-experience/before-you-fly',
  '/travel-experience/before-you-fly/allowed-baggage',
  '/travel-experience/before-you-fly/prohibited-items',
  '/travel-experience/before-you-fly/unaccompanied-minors',
  '/travel-experience/before-you-fly/oxygen-service',
  '/travel-experience/before-you-fly/limousine-service',
  '/travel-experience/before-you-fly/transportation-service',
  '/travel-experience/before-you-fly/manage-booking',
  '/travel-experience/before-you-fly/payment-methods',
  '/travel-experience/at-the-airport',
  '/travel-experience/at-the-airport/business-lounge',
  '/travel-experience/at-the-airport/wheelchair-service',
  '/travel-experience/at-the-airport/vip-boarding',
  '/travel-experience/on-board',
  '/travel-experience/on-board/birthday-onboard',
  '/travel-experience/on-board/kids-toys',
  '/travel-experience/on-board/entertainment-system',
  '/travel-experience/on-board/meals-onboard',
  '/travel-experience/on-board/travel-classes',
  '/travel-experience/on-board/onboard-wi-fi',
  '/travel-experience/traveler-magazine',
  '/our-responsibility',
  '/cargo',
  '/about-us',
  '/our-fleet',
  '/media-center',
  '/magazine-view',
  '/media-center/news/fleetUpdate',
  '/media-center/recent-news',
  '/legal',
  '/legal/terms-and-conditions',
  '/legal/booking-terms-and-conditions',
  '/legal/privacy-policy',
  '/legal/cookies',
]

const cmsPagePathSet = new Set(cmsPagePaths)

/** @deprecated Use cmsPagePaths — kept for older import sites. */
export const cmsHelpPaths = cmsPagePaths.filter((path) => path.startsWith('/help'))

/** True when `path` is a CMS-driven route (language already stripped). */
export function isNewPagePath(path = '') {
  return cmsPagePathSet.has(path)
}

/**
 * CMS pages now live on official URLs — hrefs pass through unchanged.
 * Kept so search hooks stay import-compatible.
 */
export function toNewPageHref(href = '') {
  return href
}
