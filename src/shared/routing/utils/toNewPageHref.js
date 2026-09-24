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
  '/help/faqs',
  '/our-destinations',
  '/our-destinations/flights-to-damascus',
  '/our-destinations/things-to-do-in-damascus',
  '/our-destinations/city-sights',
  '/travel-experience',
  '/travel-experience/seat-selection',
  '/travel-experience/before-you-fly',
  '/travel-experience/traveler-magazine',
  '/our-responsibility',
  '/about-us',
  '/our-fleet',
  '/media-center',
  '/media-center/news/fleetUpdate',
  '/recent-news',
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
