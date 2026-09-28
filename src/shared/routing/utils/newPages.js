import { createElement } from 'react'
import DynamicPage from '../../../pages/dynamic-page/DynamicPage.jsx'
import { createLanguageRedirect } from '../components/OurOfficesRedirect.jsx'

/**
 * Route component for a CMS page: the shared DynamicPage bound to one CMS slug
 * plus its layout options (`className` for <main>, `statusClassName` for the
 * error row, `gapClass`, `flushBottom`). Created once at module load,
 * so each route keeps a stable component identity.
 */
function dynamicPage(slug, options = {}) {
  const Page = () => createElement(DynamicPage, { ...options, slug })
  Page.displayName = `DynamicPage(${slug})`
  return Page
}

// Shared layouts (DynamicPage's default is `bg-100 w-full pb-12 md:pb-16`).
const HELP_LAYOUT = { className: 'bg-100 min-h-[50vh]', statusClassName: 'py-5 md:py-10' }
const NO_BOTTOM_PADDING = { className: 'bg-100 w-full' }

/** Official CMS help routes. */
export const helpPages = {
  '/help': dynamicPage('help', HELP_LAYOUT),
  '/help/contact-us': dynamicPage('contact-us', HELP_LAYOUT),
  '/help/contact-us/our-offices': dynamicPage('our-offices', HELP_LAYOUT),
  '/help/contact-us/our-gsa': dynamicPage('our-gsa', HELP_LAYOUT),
  '/help/contact-us/forms': dynamicPage('forms', HELP_LAYOUT),
  '/help/faqs': dynamicPage('faqs', NO_BOTTOM_PADDING),
  // Legacy `new-*` URLs → official help paths
  '/new-help': createLanguageRedirect('/help'),
  '/new-help/new-contact-us': createLanguageRedirect('/help/contact-us'),
  '/help/contact-us/new-our-offices': createLanguageRedirect('/help/contact-us/our-offices'),
  '/help/contact-us/new-our-gsa': createLanguageRedirect('/help/contact-us/our-gsa'),
  '/help/contact-us/new-forms': createLanguageRedirect('/help/contact-us/forms'),
  '/help/new-faqs': createLanguageRedirect('/help/faqs'),
}

export const ourDestinationsPages = {
  '/our-destinations': dynamicPage('our-destinations', HELP_LAYOUT),
  '/our-destinations/flights-to-damascus': dynamicPage('flights-to-damascus', {
    className: 'w-full bg-background lg:bg-100',
  }),
  '/our-destinations/things-to-do-in-damascus': dynamicPage(
    'things-to-do-in-damascus',
    NO_BOTTOM_PADDING,
  ),
  '/our-destinations/city-sights': dynamicPage('city-sights', NO_BOTTOM_PADDING),
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
  '/travel-experience': dynamicPage('travel-experience'),
  '/travel-experience/seat-selection': dynamicPage('seat-selection'),
  // Journey stages — same components (hero, services, next steps) per stage.
  '/travel-experience/before-you-fly': dynamicPage('before-you-fly'),
  '/travel-experience/at-the-airport': dynamicPage('at-the-airport'),
  '/travel-experience/onboard': dynamicPage('onboard'),
  '/travel-experience/after-travel': dynamicPage('after-travel'),
  '/travel-experience/traveler-magazine': dynamicPage('traveler-magazine'),
  '/our-responsibility': dynamicPage('our-responsibility'),
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
  '/legal': dynamicPage('legal'),
  '/legal/terms-and-conditions': dynamicPage('terms-and-conditions', NO_BOTTOM_PADDING),
  '/legal/booking-terms-and-conditions': dynamicPage(
    'booking-terms-and-conditions',
    NO_BOTTOM_PADDING,
  ),
  '/legal/privacy-policy': dynamicPage('privacy-policy', NO_BOTTOM_PADDING),
  '/legal/cookies': dynamicPage('cookies', NO_BOTTOM_PADDING),
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
  // Ends in the full-width newsletter band → flush with the footer.
  '/': dynamicPage('home', {
    className: 'w-full min-w-0 overflow-x-clip bg-100',
    flushBottom: true,
  }),
  // Page-specific vertical rhythm (measured against Figma) via `gapClass`.
  '/travel-updates': dynamicPage('travel-updates', {
    gapClass: 'gap-6 [&>*:nth-child(2)]:mt-3 md:[&>*:nth-child(2)]:mt-9',
  }),
  '/cargo-service': dynamicPage('cargo-service', {
    gapClass:
      'gap-8 md:gap-[60px] md:[&>*:nth-child(2)]:-mt-[11px] md:[&>*:last-child]:-mt-8',
  }),
  '/cargo-stations': dynamicPage('cargo-stations', {
    gapClass: 'gap-8 md:gap-[56px] md:[&>*:nth-child(2)]:mt-[46px]',
  }),
  '/business-center': dynamicPage('business-center', {
    gapClass:
      'gap-10 md:gap-[60px] [&>*:nth-child(2)]:-mt-5 md:[&>*:nth-child(2)]:-mt-[39px] [&>*:nth-child(3)]:-mt-10 md:[&>*:nth-child(3)]:-mt-[63px] [&>*:nth-child(4)]:-mt-8 md:[&>*:nth-child(4)]:-mt-10',
  }),
  // Full-screen standalone login (Layout.jsx hides header/footer for this path):
  // one full-bleed block, no page padding around it.
  '/login-travel-agent': dynamicPage('login-travel-agent', {
    className: 'relative min-h-dvh w-full min-w-0 overflow-x-clip bg-100',
    flushBottom: true,
    gapClass: 'gap-0',
  }),
  '/about-us': dynamicPage('about-us'),
  '/our-fleet': dynamicPage('our-fleet'),
  '/media-center': dynamicPage('media-center'),
  '/recent-news': dynamicPage('recent-news'),
  '/media-center/news/fleetUpdate': dynamicPage('news-fleet-update', {
    className: 'bg-100 w-full overflow-x-clip pb-12 md:pb-16',
  }),
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
