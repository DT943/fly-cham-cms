/**
 * Static app paths → CMS "new-*" counterparts.
 * Used so Search Console on a new page navigates to the new route when one exists.
 */
export const staticToNewPath = {
  '/help': '/new-help',
  '/help/contact-us': '/new-help/new-contact-us',
  '/help/contact-us/our-offices': '/help/contact-us/new-our-offices',
  '/help/contact-us/our-gsa': '/help/contact-us/new-our-gsa',
  '/help/contact-us/forms': '/help/contact-us/new-forms',
  '/help/faqs': '/help/new-faqs',
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

/** Prefer the CMS new-* path when one exists; otherwise keep the static href. */
export function toNewPageHref(href = '') {
  if (!href || typeof href !== 'string') return href
  return staticToNewPath[href] || href
}
