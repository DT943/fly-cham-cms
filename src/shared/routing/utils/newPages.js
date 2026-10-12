import { createElement } from 'react'
import BaggageCalculatorPage from '../../../pages/baggage-calculator/BaggageCalculatorPage.jsx'
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
// Every page spaces its blocks with the PageBlocks default gap only (32px,
// 60px from md) — no per-page gapClass offsets; single-block full-screen
// pages use `gap-0`.
const HELP_LAYOUT = { className: 'bg-100 min-h-[50vh]', statusClassName: 'py-5 md:py-10' }
const NO_BOTTOM_PADDING = { className: 'bg-100 w-full' }

/** Official CMS help routes. */
export const helpPages = {
  '/help': dynamicPage('help', HELP_LAYOUT),
  '/help/contact-us': dynamicPage('contact-us', HELP_LAYOUT),
  '/help/contact-us/our-offices': dynamicPage('our-offices', HELP_LAYOUT),
  '/help/contact-us/our-gsa': dynamicPage('our-gsa', HELP_LAYOUT),
  '/help/contact-us/forms': dynamicPage('forms', HELP_LAYOUT),
  '/help/contact-us/forms/request-a-form': dynamicPage('request-a-form', {
    className: 'bg-100 w-full',
  }),
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
  '/our-destinations/flights-to-dubai': dynamicPage('flights-to-dubai', {
    className: 'w-full bg-background lg:bg-100',
  }),
  '/our-destinations/things-to-do-in-damascus': dynamicPage(
    'things-to-do-in-damascus',
    NO_BOTTOM_PADDING,
  ),
  '/our-destinations/activities-and-attractions': dynamicPage(
    'activities-and-attractions',
    NO_BOTTOM_PADDING,
  ),
  // Full-screen interactive map (one full-bleed route-map-explorer block):
  // <main> fills the viewport under the header (Layout hides the footer here).
  '/our-destinations/route-map': dynamicPage('route-map', {
    className: 'bg-100 h-[calc(100dvh-65px)] w-full overflow-hidden md:h-[calc(100dvh-73px)]',
    flushBottom: true,
    gapClass: 'gap-0',
    blocksClassName: 'h-full',
  }),
  // Legacy `new-*` URLs
  '/new-our-destinations': createLanguageRedirect('/our-destinations'),
  '/our-destinations/new-flights-to-damascus': createLanguageRedirect(
    '/our-destinations/flights-to-damascus',
  ),
  '/our-destinations/new-things-to-do-in-damascus': createLanguageRedirect(
    '/our-destinations/things-to-do-in-damascus',
  ),
  '/our-destinations/city-sights': createLanguageRedirect(
    '/our-destinations/activities-and-attractions',
  ),
  '/our-destinations/new-city-sights': createLanguageRedirect(
    '/our-destinations/activities-and-attractions',
  ),
}

export const travelExperiencePages = {
  '/travel-experience': dynamicPage('travel-experience'),
  '/travel-experience/seat-selection': dynamicPage('seat-selection'),
  // Journey stages — same components (hero, services, next steps) per stage.
  '/travel-experience/before-you-fly': dynamicPage('before-you-fly'),
  '/travel-experience/before-you-fly/allowed-baggage': dynamicPage('allowed-baggage'),
  '/travel-experience/before-you-fly/prohibited-items': dynamicPage('prohibited-items'),
  '/travel-experience/before-you-fly/unaccompanied-minors': dynamicPage('unaccompanied-minors'),
  '/travel-experience/before-you-fly/oxygen-service': dynamicPage('oxygen-service'),
  '/travel-experience/before-you-fly/baggage-calculator': BaggageCalculatorPage,
  '/travel-experience/before-you-fly/limousine-service': dynamicPage('limousine-service'),
  '/travel-experience/before-you-fly/transportation-service': dynamicPage('transportation-service'),
  '/travel-experience/before-you-fly/manage-booking': dynamicPage('manage-booking'),
  '/travel-experience/before-you-fly/payment-methods': dynamicPage('payment-methods'),
  '/travel-experience/at-the-airport': dynamicPage('at-the-airport'),
  '/travel-experience/at-the-airport/business-lounge': dynamicPage('business-lounge'),
  '/travel-experience/at-the-airport/wheelchair-service': dynamicPage('wheelchair-service'),
  '/travel-experience/at-the-airport/vip-boarding': dynamicPage('vip-boarding'),
  '/travel-experience/onboard': dynamicPage('onboard'),
  '/travel-experience/on-board': dynamicPage('on-board'),
  '/travel-experience/on-board/birthday-onboard': dynamicPage('birthday-onboard'),
  '/travel-experience/on-board/kids-toys': dynamicPage('kids-toys'),
  '/travel-experience/on-board/entertainment-system': dynamicPage('entertainment-system'),
  '/travel-experience/on-board/meals-onboard': dynamicPage('meals-onboard'),
  '/travel-experience/on-board/travel-classes': dynamicPage('travel-classes'),
  '/travel-experience/on-board/onboard-wi-fi': dynamicPage('onboard-wi-fi'),
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
  // Offers & Deals (Figma 40951:24297): hero + booking box + deals, ends in
  // the full-width newsletter band → flush with the footer, like home.
  '/offers-and-deals': dynamicPage('offers-and-deals', {
    className: 'w-full min-w-0 overflow-x-clip bg-100',
    flushBottom: true,
  }),
  '/travel-updates': dynamicPage('travel-updates'),
  '/cargo': dynamicPage('cargo'),
  '/cargo-stations': dynamicPage('cargo-stations'),
  '/business-center': dynamicPage('business-center'),
  // Full-screen standalone login (Layout.jsx hides header/footer for this path):
  // one full-bleed block, no page padding around it.
  '/login-travel-agent': dynamicPage('login-travel-agent', {
    className: 'relative min-h-dvh w-full min-w-0 overflow-x-clip bg-100',
    flushBottom: true,
    gapClass: 'gap-0',
  }),
  // One full-bleed "coming-soon-hero" block that pulls itself under the header
  // (dark over media — isFullBleedPath in pages.js) and fills the viewport.
  '/coming-soon': dynamicPage('coming-soon', {
    className: 'flex w-full flex-1 flex-col',
    blocksClassName: 'flex-1',
    flushBottom: true,
    gapClass: 'gap-0',
  }),
  '/cham-miles': dynamicPage('cham-miles', {
    className: 'relative min-h-dvh w-full min-w-0 overflow-x-clip bg-100',
    flushBottom: true,
    gapClass: 'gap-0',
  }),
  '/about-us': dynamicPage('about-us'),
  '/site-map': dynamicPage('site-map', {
    className: 'bg-100 w-full',
    gapClass: 'gap-0',
  }),
  '/our-fleet': dynamicPage('our-fleet'),
  '/media-center': dynamicPage('media-center'),
  '/magazine-view': dynamicPage('magazine-view'),
  '/media-center/recent-news': dynamicPage('recent-news'),
  '/media-center/newsletter': dynamicPage('newsletter'),
  // News articles: one CMS page each (slug news-<kebab id>).
  ...Object.fromEntries(
    [
      'fleetUpdate',
      'expansionPlans',
      'newRoutes',
      'corporateUpdate',
      'sponsorshipLaunch',
      'communityEvent',
      'customerExperience',
      'routeExpansion',
    ].map((id) => [
      `/media-center/news/${id}`,
      dynamicPage(`news-${id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`, {
        className: 'bg-100 w-full overflow-x-clip pb-12 md:pb-16',
      }),
    ]),
  ),
  // Legacy `new-*` URLs
  '/new-home': createLanguageRedirect('/'),
  '/new-travel-updates': createLanguageRedirect('/travel-updates'),
  '/cargo-service': createLanguageRedirect('/cargo'),
  '/new-cargo-service': createLanguageRedirect('/cargo'),
  '/new-cargo-stations': createLanguageRedirect('/cargo-stations'),
  '/new-business-center': createLanguageRedirect('/business-center'),
  '/new-about-us': createLanguageRedirect('/about-us'),
  '/new-our-fleet': createLanguageRedirect('/our-fleet'),
  '/new-media-center': createLanguageRedirect('/media-center'),
  '/recent-news': createLanguageRedirect('/media-center/recent-news'),
  '/new-recent-news': createLanguageRedirect('/media-center/recent-news'),
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
