import {
  Baby,
  BookOpenText,
  Buildings,
  CalendarBlank,
  Car,
  ClipboardText,
  CreditCard,
  DeviceMobile,
  EnvelopeSimple,
  FirstAid,
  MagnifyingGlass,
  MapTrifold,
  Mosque,
  Prohibit,
  Question,
  Seat,
  Suitcase,
  Taxi,
} from '@phosphor-icons/react'
import damascus from '../../assets/images/our-destenations/damascus.jpeg'
import dubai from '../../assets/images/our-destenations/dubai.jpg'
import istanbul from '../../assets/images/our-destenations/istanbul.jpg'
import afterTravelPhoto from '../../assets/images/travel-experience/card-after-travel.png'

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
  { id: 'damascus', code: 'DAM', image: damascus, href: '/our-destinations/flights-to-damascus' },
  { id: 'istanbul', code: 'IST', image: istanbul, href: '/our-destinations' },
  { id: 'dubai', code: 'DXB', image: dubai, href: '/our-destinations/flights-to-dubai' },
]

export const destinationMenuLinks = [
  { id: 'routeMap', icon: MapTrifold, href: '/our-destinations/route-map' },
  { id: 'discoverSyria', icon: Mosque, href: '/our-destinations/things-to-do-in-damascus' },
  { id: 'flightSchedule', icon: CalendarBlank, href: '/our-destinations' },
  { id: 'travelInspiration', icon: BookOpenText, href: '/our-destinations' },
]

/**
 * Experience mega menu: the same journey stages as `/travel-experience`, laid
 * out as four columns plus a footer strip. Sub-links land on the matching
 * stage rather than invented URLs.
 */
export const experienceMenu = {
  columns: [
    {
      id: 'beforeYouFly',
      href: '/travel-experience#beforeYouFly',
      withIcons: true,
      links: [
        { id: 'seatSelection', icon: Seat },
        { id: 'unaccompaniedMinors', icon: Baby },
        { id: 'paymentMethods', icon: CreditCard },
        { id: 'manageBooking', icon: ClipboardText },
        { id: 'limousine', icon: Car },
        { id: 'airportTransport', icon: Taxi },
        { id: 'allowedBaggage', icon: Suitcase },
        { id: 'oxygenCylinder', icon: FirstAid },
        { id: 'prohibitedItems', icon: Prohibit },
      ],
    },
    {
      id: 'atTheAirport',
      href: '/travel-experience#atTheAirport',
      links: [{ id: 'lounge' }, { id: 'wheelchair' }, { id: 'vipBoarding' }],
    },
    {
      id: 'onBoard',
      href: '/travel-experience#onBoard',
      links: [
        { id: 'travelClasses' },
        { id: 'meals' },
        { id: 'entertainment' },
        { id: 'birthdayCakes' },
        { id: 'travelerMagazine' },
        { id: 'kidsToys' },
        { id: 'wifiOnboard' },
      ],
    },
    {
      id: 'afterTravel',
      href: '/travel-experience#afterTravel',
      image: afterTravelPhoto,
      imageBelow: true,
      links: [
        { id: 'baggageClaims' },
        { id: 'refunds' },
        { id: 'loyaltyMiles' },
        { id: 'feedbackSupport' },
      ],
    },
  ],
  footer: {
    href: '/travel-experience',
    icon: DeviceMobile,
  },
}

export const mobileMenuPrimaryLinks = [
  { id: 'searchFlight', href: '/', labelKey: 'navItems.searchFlight', icon: MagnifyingGlass },
]

export const mobileMenuSecondaryLinks = [
  { id: 'contactUs', href: '/help/contact-us', labelKey: 'navItems.contactUs' },
  { id: 'helpSupport', href: '/help', labelKey: 'mobile.helpSupport' },
]
