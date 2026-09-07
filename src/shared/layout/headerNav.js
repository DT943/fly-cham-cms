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
import baghdad from '../../assets/images/our-destenations/baghdad.jpg'
import damascus from '../../assets/images/our-destenations/damascus.jpeg'
import dubai from '../../assets/images/our-destenations/dubai.jpg'
import istanbul from '../../assets/images/our-destenations/istanbul.jpg'
import kuwait from '../../assets/images/our-destenations/kuwait.jpg'
import muscat from '../../assets/images/our-destenations/muscat.jpg'
import yerevan from '../../assets/images/our-destenations/yerevan.jpg'

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
 * Cities shown in the "Where we fly" menu. Names come from
 * `destinations.cities.*.name`, so only the code, photo and link live here.
 * Photos are the existing destination shots used as placeholders.
 */
export const destinationHighlights = {
  damascus: { code: 'DAM', image: damascus, href: '/our-destinations/flights-to-damascus' },
  istanbul: { code: 'IST', image: istanbul, href: '/our-destinations' },
  dubai: { code: 'DXB', image: dubai, href: '/our-destinations' },
  kuwait: { code: 'KWI', image: kuwait, href: '/our-destinations' },
  yerevan: { code: 'EVN', image: yerevan, href: '/our-destinations' },
  muscat: { code: 'MCT', image: muscat, href: '/our-destinations' },
  baghdad: { code: 'BGW', image: baghdad, href: '/our-destinations' },
}

/** The first city of a region gets the wide tile; the rest sit beside it. */
export const destinationRegions = [
  { id: 'all', cityIds: ['damascus', 'istanbul', 'dubai'] },
  { id: 'middleEast', cityIds: ['damascus', 'dubai', 'kuwait'] },
  { id: 'europe', cityIds: ['istanbul', 'yerevan'] },
  { id: 'asia', cityIds: ['dubai', 'muscat', 'baghdad'] },
]

export const destinationMenuLinks = [
  { id: 'routeMap', icon: MapTrifold, href: '/our-destinations' },
  { id: 'discoverSyria', icon: Mosque, href: '/our-destinations/flights-to-damascus' },
  { id: 'flightSchedule', icon: CalendarBlank, href: '/our-destinations' },
  { id: 'travelInspiration', icon: BookOpenText, href: '/our-destinations' },
]
