/**
 * Static app paths → CMS "new-*" counterparts (sections that still use new-* URLs).
 * Help is already on the official `/help/...` CMS routes — no remap needed.
 *
 * Keep this file free of page-component imports — search hooks import it, and those
 * hooks are pulled in by SearchConsole via the CMS section registry (circular TDZ).
 */
export const staticToNewPath = {
  '/our-destinations': '/new-our-destinations',
  '/our-destinations/flights-to-damascus': '/our-destinations/new-things-to-do-in-damascus',
  '/our-destinations/things-to-do-in-damascus': '/our-destinations/new-flights-to-damascus',
  '/our-destinations/city-sights': '/our-destinations/new-city-sights',
  '/travel-experience': '/new-travel-experience',
  '/travel-experience/seat-selection': '/travel-experience/new-seat-selection',
  '/travel-experience/before-you-fly': '/travel-experience/new-before-you-fly',
  '/travel-experience/traveler-magazine': '/travel-experience/new-traveler-magazine',
  '/our-responsibility': '/travel-experience/new-our-responsibility',
  '/about-us': '/new-about-us',
  '/our-fleet': '/new-our-fleet',
  '/media-center': '/new-media-center',
  '/recent-news': '/new-recent-news',
  '/legal': '/new-legal',
  '/legal/terms-and-conditions': '/legal/new-terms-and-conditions',
  '/legal/booking-terms-and-conditions': '/legal/new-booking-terms-and-conditions',
  '/legal/privacy-policy': '/legal/new-privacy-policy',
  '/legal/cookies': '/legal/new-cookies',
}

/** Official CMS help paths (same URLs as the old static help pages). */
export const cmsHelpPaths = [
  '/help',
  '/help/contact-us',
  '/help/contact-us/our-offices',
  '/help/contact-us/our-gsa',
  '/help/contact-us/forms',
  '/help/faqs',
]

const newPagePaths = new Set([...cmsHelpPaths, ...Object.values(staticToNewPath)])

/** True when `path` is a CMS-driven route (language already stripped). */
export function isNewPagePath(path = '') {
  return newPagePaths.has(path)
}

/** Prefer the CMS new-* path when one exists; otherwise keep the static href. */
export function toNewPageHref(href = '') {
  if (!href || typeof href !== 'string') return href
  return staticToNewPath[href] || href
}
