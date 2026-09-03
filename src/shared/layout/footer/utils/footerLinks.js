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

export const footerColumns = [
  {
    id: 'about',
    links: ['story', 'mission', 'vision', 'values', 'responsibility', 'fleet', 'media', 'chairman'],
  },
  {
    id: 'book',
    links: ['searchFlight', 'schedules', 'hotel', 'carRental', 'visa', 'groupTravel', 'privateFlights'],
  },
  {
    id: 'destinations',
    sections: [
      { links: ['domestic', 'international', 'indirect'] },
      { titleId: 'holidays', links: ['discoverSyria', 'tourism', 'family', 'honeymoon'] },
    ],
  },
  {
    id: 'miles',
    links: ['aboutMiles', 'join', 'claim', 'partners', 'terms', 'calculator'],
  },
  {
    id: 'experience',
    links: ['before', 'airport', 'onBoard', 'additional'],
  },
  {
    id: 'help',
    links: ['contactUs', 'inquiries', 'offices', 'agents', 'partner', 'faqs'],
  },
]

export const footerLinkHrefs = {
  groupTravel: '/help/contact-us/forms',
  contactUs: '/help/contact-us',
  inquiries: '/help/contact-us/forms',
  offices: '/help/contact-us/our-offices',
  agents: '/help/contact-us/our-gsa',
  partner: '/help/contact-us/our-gsa',
  faqs: '/help/faqs',
}

export const footerLegal = ['sitemap', 'privacy', 'terms']

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
