import {
  FacebookLogoIcon,
  InstagramLogo,
  LinkedinLogo,
  TelegramLogo,
  TiktokLogo,
  WhatsappLogo,
  XLogo,
  YoutubeLogoIcon,
} from '@phosphor-icons/react'

/**
 * Desktop: 4 column groups (stacked sections share a column).
 * Mobile accordion flattens these into a single list.
 */
export const footerColumnGroups = [
  [
    {
      id: 'about',
      href: '/about-us',
      links: ['about', 'responsibility', 'fleet', 'careers'],
    },
    {
      id: 'help',
      href: '/help',
      links: ['helpCenter', 'contactUs', 'offices', 'gsa', 'forms', 'travelUpdates', 'faqs'],
    },
  ],
  [
    {
      id: 'book',
      href: '/',
      links: ['searchFlights', 'flightSchedule', 'flightStatus'],
    },
    {
      id: 'business',
      href: '/business-center',
      links: ['businessCenter', 'b2b', 'developers', 'partner'],
    },
  ],
  [
    {
      id: 'whereWeFly',
      href: '/our-destinations',
      links: ['destinations', 'activities'],
    },
    {
      id: 'media',
      href: '/media-center',
      links: ['mediaCenter', 'recentNews', 'magazine'],
    },
  ],
  [
    {
      id: 'experience',
      href: '/travel-experience',
      links: ['beforeYouFly', 'atAirport', 'onboard', 'afterTravel'],
    },
  ],
]

/** Flat list for mobile accordion. */
export const footerColumns = footerColumnGroups.flat()

/** Bottom legal bar links (right of copyright). */
export const footerLegalLinks = [
  'sitemap',
  'terms',
  'privacy',
  'cookies',
  'bookingTerms',
]

/** Optional per-link flags (e.g. external target). */
export const footerLinkMeta = {
  careers: { external: true },
}

export const footerLinkHrefs = {
  about: '/about-us',
  responsibility: '/our-responsibility',
  fleet: '/our-fleet',
  careers: 'https://careers.flycham.com/sy/en',
  searchFlights: '/',
  flightSchedule: '/coming-soon',
  flightStatus: '/help',
  bookFlight: '/',
  manageBooking: '/coming-soon',
  destinations: '/our-destinations',
  activities: '/our-destinations/city-sights',
  beforeYouFly: '/travel-experience/before-you-fly',
  atAirport: '/travel-experience/at-the-airport',
  onboard: '/travel-experience/onboard',
  afterTravel: '/travel-experience/after-travel',
  mediaCenter: '/media-center',
  recentNews: '/recent-news',
  magazine: '/travel-experience/traveler-magazine',
  businessCenter: '/business-center',
  b2b: '/login-travel-agent',
  developers: '/coming-soon',
  partner: '/help/contact-us/forms',
  helpCenter: '/help',
  contactUs: '/help/contact-us',
  offices: '/help/contact-us/our-offices',
  gsa: '/help/contact-us/our-gsa',
  forms: '/help/contact-us/forms',
  travelUpdates: '/travel-updates',
  faqs: '/help/faqs',
  sitemap: '/coming-soon',
  terms: '/legal/terms-and-conditions',
  privacy: '/legal/privacy-policy',
  cookies: '/legal/cookies',
  bookingTerms: '/legal/booking-terms-and-conditions',
}

export const socialLinks = [
  { id: 'whatsapp', icon: WhatsappLogo, href: '#' },
  { id: 'instagram', icon: InstagramLogo, href: '#' },
  { id: 'facebook', icon: FacebookLogoIcon, href: '#' },
  { id: 'telegram', icon: TelegramLogo, href: '#' },
  { id: 'tiktok', icon: TiktokLogo, href: '#' },
  { id: 'youtube', icon: YoutubeLogoIcon, href: '#' },
  { id: 'x', icon: XLogo, href: '#' },
  { id: 'linkedin', icon: LinkedinLogo, href: '#' },
]
