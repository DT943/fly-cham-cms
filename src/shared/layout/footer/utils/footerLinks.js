import {
  FacebookLogoIcon,
  InstagramLogo,
  LinkedinLogo,
  TelegramLogo,
  ThreadsLogo,
  TiktokLogo,
  XLogo,
  YoutubeLogoIcon,
} from '@phosphor-icons/react'

/**
 * Footer navigation columns — headers and labels under each.
 */
export const footerColumns = [
  {
    id: 'about',
    href: '/about-us',
    links: ['about', 'responsibility', 'fleet', 'careers'],
  },
  {
    id: 'book',
    href: '/',
    links: ['bookFlight', 'manageBooking'],
  },
  {
    id: 'whereWeFly',
    href: '/our-destinations',
    links: ['destinations', 'activities'],
  },
  {
    id: 'experience',
    href: '/travel-experience',
    links: ['beforeYouFly', 'atAirport', 'onboard', 'afterTravel'],
  },
  {
    id: 'media',
    href: '/media-center',
    links: ['recentNews', 'magazine'],
  },
  {
    id: 'business',
    href: '/business-center',
    links: ['businessCenter', 'b2b', 'developers', 'partner'],
  },
  {
    id: 'help',
    href: '/help',
    links: ['helpCenter', 'contactUs', 'offices', 'gsa', 'forms', 'faqs'],
  },
  {
    id: 'legal',
    href: '/legal',
    links: ['terms', 'privacy', 'cookies', 'bookingTerms'],
  },
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
  bookFlight: '/',
  manageBooking: '/coming-soon',
  destinations: '/our-destinations',
  activities: '/our-destinations/city-sights',
  beforeYouFly: '/travel-experience/before-you-fly',
  atAirport: '/travel-experience/at-the-airport',
  onboard: '/travel-experience/onboard',
  afterTravel: '/travel-experience/after-travel',
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
  faqs: '/help/faqs',
  terms: '/legal/terms-and-conditions',
  privacy: '/legal/privacy-policy',
  cookies: '/legal/cookies',
  bookingTerms: '/legal/booking-terms-and-conditions',
}

export const socialLinks = [
  { id: 'threads', icon: ThreadsLogo, href: '#' },
  { id: 'tiktok', icon: TiktokLogo, href: '#' },
  { id: 'instagram', icon: InstagramLogo, href: '#' },
  { id: 'facebook', icon: FacebookLogoIcon, href: '#' },
  { id: 'youtube', icon: YoutubeLogoIcon, href: '#' },
  { id: 'linkedin', icon: LinkedinLogo, href: '#' },
  { id: 'x', icon: XLogo, href: '#' },
  { id: 'telegram', icon: TelegramLogo, href: '#' },
]
