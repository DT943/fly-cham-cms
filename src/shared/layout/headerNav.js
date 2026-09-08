import {
  BookOpenText,
  Buildings,
  CalendarBlank,
  ClipboardText,
  EnvelopeSimple,
  MagnifyingGlass,
  MapTrifold,
  Mosque,
  Question,
} from '@phosphor-icons/react'
import damascus from '../../assets/images/our-destenations/damascus.jpeg'
import dubai from '../../assets/images/our-destenations/dubai.jpg'
import istanbul from '../../assets/images/our-destenations/istanbul.jpg'

export const helpMenuPanels = [
  {
    id: 'getHelp',
    icon: Question,
    links: [
      { id: 'faq', icon: Question, href: '/help/faqs' },
      { id: 'contactUs', icon: EnvelopeSimple, href: '/help/contact-us' },
      { id: 'offices', icon: Buildings, href: '/help/contact-us/our-offices' },
    ],
    ctaHref: '/help',
    quickLinks: [
      { id: 'faq', icon: Question, href: '/help/faqs' },
      { id: 'contactUs', icon: EnvelopeSimple, href: '/help/contact-us' },
    ],
  },
  {
    id: 'requests',
    icon: ClipboardText,
    links: [
      { id: 'forms', icon: ClipboardText, href: '/help/contact-us/forms' },
      { id: 'trackRequest', icon: MagnifyingGlass, href: '/help/contact-us/forms' },
    ],
    ctaHref: '/help/contact-us/forms',
    quickLinks: [
      { id: 'forms', icon: ClipboardText, href: '/help/contact-us/forms' },
      { id: 'trackRequest', icon: MagnifyingGlass, href: '/help/contact-us/forms' },
    ],
  },
]

/**
 * Cards in the "Where we fly" menu; the first one gets the wide tile. Names
 * come from `destinations.cities.*.name`, so only the code, photo and link
 * live here. Photos are the existing destination shots used as placeholders.
 */
export const featuredDestinations = [
  { id: 'damascus', code: 'DAM', image: damascus, href: '/our-destinations/things-to-do-in-damascus' },
  { id: 'istanbul', code: 'IST', image: istanbul, href: '/our-destinations' },
  { id: 'dubai', code: 'DXB', image: dubai, href: '/our-destinations' },
]

export const destinationMenuLinks = [
  { id: 'routeMap', icon: MapTrifold, href: '/our-destinations/route-map' },
  { id: 'discoverSyria', icon: Mosque, href: '/our-destinations/things-to-do-in-damascus' },
  { id: 'flightSchedule', icon: CalendarBlank, href: '/our-destinations' },
  { id: 'travelInspiration', icon: BookOpenText, href: '/our-destinations' },
]

export const mobileMenuPrimaryLinks = [
  { id: 'searchFlight', href: '/', labelKey: 'navItems.searchFlight', icon: MagnifyingGlass },
]

export const mobileMenuSecondaryLinks = [
  { id: 'contactUs', href: '/help/contact-us', labelKey: 'navItems.contactUs' },
  { id: 'helpSupport', href: '/help', labelKey: 'mobile.helpSupport' },
]
