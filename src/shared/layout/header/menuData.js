import {
  Airplane,
  AirplaneTakeoff,
  AirplaneTilt,
  Armchair,
  Baby,
  BookOpen,
  Buildings,
  Cake,
  CalendarCheck,
  Camera,
  Car,
  ChatCircleText,
  ClipboardText,
  CreditCard,
  FirstAid,
  ForkKnife,
  GlobeHemisphereEast,
  GlobeHemisphereWest,
  Headset,
  ListChecks,
  MagnifyingGlass,
  MonitorPlay,
  Phone,
  Prohibit,
  PuzzlePiece,
  Question,
  Receipt,
  Seat,
  SealPercent,
  Star,
  Suitcase,
  SuitcaseRolling,
  ThumbsUp,
  Ticket,
  UserCircleCheck,
  WarningCircle,
  Wheelchair,
  WifiHigh,
  XCircle,
} from '@phosphor-icons/react'

import cardAfterTravel from '../../../assets/images/travel-experience/card-after-travel.png'
import cardAtTheAirport from '../../../assets/images/travel-experience/card-at-the-airport.png'
import cardBeforeYouFly from '../../../assets/images/travel-experience/card-before-you-fly.png'
import cardOnboard from '../../../assets/images/travel-experience/card-onboard.png'
import helpCta from '../../../assets/images/travel-experience/help-cta.png'
import formsImage from '../../../assets/images/forms/ph1.png'
import fleetHero from '../../../assets/images/our-fleet/hero.jpg'
import fleetAircraft from '../../../assets/images/our-fleet/aircraft.png'
import manageBookingImage from '../../../assets/images/before-you-fly/manage-booking.png'
import routeMap from '../../../assets/images/routes-map/flight-route-map.png'
import damascus from '../../../assets/images/our-destenations/damascus.jpeg'
import dubai from '../../../assets/images/our-destenations/dubai.jpg'
import dammam from '../../../assets/images/our-destenations/dammam.jpg'
import blueMosque from '../../../assets/images/city-sights/sight-blue-mosque.png'
import dohaCorniche from '../../../assets/images/city-sights/sight-doha-corniche.png'
import colosseum from '../../../assets/images/city-sights/sight-colosseum.png'

/**
 * Header mega menus, in display order. Each menu opens a panel with a left
 * sidebar of tabs; each tab renders a "content" area (link grid, destination
 * cards, activity cards or a route map) plus a promo image with a CTA.
 *
 * Translation keys resolve as:
 *  - tab label:  layout.header.tabs.<tabId>
 *  - link:       layout.header.items.<itemId>.title / .description
 *  - cta label:  layout.header.cta.<tabId>
 */
export const headerMenus = [
  {
    id: 'bookManage',
    labelKey: 'bookManage',
    tabs: [
      {
        id: 'bookFlight',
        icon: AirplaneTakeoff,
        type: 'links',
        image: fleetHero,
        cta: '/',
        links: [
          { id: 'bookAFlight', icon: MagnifyingGlass, href: '/' },
          { id: 'offersDeals', icon: SealPercent, href: '/' },
        ],
      },
      {
        id: 'prepareToFly',
        icon: AirplaneTilt,
        type: 'links',
        image: fleetAircraft,
        cta: '/our-destinations/route-map',
        links: [
          { id: 'flightStatus', icon: Airplane, href: '/' },
          { id: 'onlineCheckin', icon: UserCircleCheck, href: '/' },
          { id: 'flightSchedule', icon: CalendarCheck, href: '/our-destinations/route-map' },
          { id: 'prohibitedItems', icon: Prohibit, href: '/travel-experience/before-you-fly' },
        ],
      },
      {
        id: 'manageBooking',
        icon: Airplane,
        type: 'links',
        withDescriptions: true,
        image: manageBookingImage,
        cta: '/',
        links: [
          { id: 'changeFlight', icon: AirplaneTilt, href: '/' },
          { id: 'changeSeat', icon: Seat, href: '/travel-experience/seat-selection' },
          { id: 'upgradeFare', icon: Star, href: '/' },
          { id: 'addBaggage', icon: Suitcase, href: '/travel-experience/before-you-fly' },
          { id: 'addInfant', icon: Baby, href: '/travel-experience/before-you-fly' },
          { id: 'cancelBooking', icon: XCircle, href: '/' },
        ],
      },
    ],
  },
  {
    id: 'whereWeFly',
    labelKey: 'whereWeFly',
    tabs: [
      {
        id: 'ourDestinations',
        icon: GlobeHemisphereEast,
        type: 'destinations',
        cta: '/our-destinations',
        cards: [
          { id: 'dammam', code: 'DMM', image: dammam, href: '/our-destinations', tag: 'new' },
          { id: 'damascus', code: 'DAM', image: damascus, href: '/our-destinations/flights-to-damascus' },
          { id: 'dubai', code: 'DXB', image: dubai, href: '/our-destinations/flights-to-dubai' },
        ],
      },
      {
        id: 'activities',
        icon: Camera,
        type: 'activities',
        cta: '/our-destinations/city-sights',
        cards: [
          { id: 'blueMosque', tag: 'religious', image: blueMosque, href: '/our-destinations/city-sights' },
          { id: 'dohaCorniche', tag: 'familyFun', image: dohaCorniche, href: '/our-destinations/city-sights' },
          { id: 'colosseum', tag: 'historical', image: colosseum, href: '/our-destinations/city-sights' },
        ],
      },
      {
        id: 'flightSchedules',
        icon: CalendarCheck,
        type: 'map',
        image: routeMap,
        cta: '/our-destinations/route-map',
      },
    ],
  },
  {
    id: 'travelExperience',
    labelKey: 'travelExperience',
    tabs: [
      {
        id: 'beforeYouFly',
        icon: ListChecks,
        type: 'links',
        withDescriptions: true,
        image: cardBeforeYouFly,
        cta: '/travel-experience/before-you-fly',
        links: [
          { id: 'allowedBaggage', icon: Suitcase, href: '/travel-experience/before-you-fly' },
          { id: 'seatSelection', icon: Seat, href: '/travel-experience/seat-selection' },
          { id: 'manageBookingService', icon: ClipboardText, href: '/travel-experience/before-you-fly' },
          { id: 'paymentMethods', icon: CreditCard, href: '/travel-experience/before-you-fly' },
          { id: 'yaMarhaba', icon: Car, href: '/travel-experience/before-you-fly' },
          { id: 'limousine', icon: Car, href: '/travel-experience/before-you-fly' },
          { id: 'unaccompaniedMinor', icon: Baby, href: '/travel-experience/before-you-fly' },
          { id: 'oxygenCylinder', icon: FirstAid, href: '/travel-experience/before-you-fly' },
        ],
      },
      {
        id: 'atTheAirport',
        icon: Airplane,
        type: 'links',
        withDescriptions: true,
        image: cardAtTheAirport,
        cta: '/travel-experience/at-the-airport',
        links: [
          { id: 'businessLounge', icon: Armchair, href: '/travel-experience/at-the-airport' },
          { id: 'priorityBoarding', icon: Ticket, href: '/travel-experience/at-the-airport' },
          { id: 'wheelchair', icon: Wheelchair, href: '/travel-experience/at-the-airport' },
        ],
      },
      {
        id: 'onboard',
        icon: Armchair,
        type: 'links',
        withDescriptions: true,
        image: cardOnboard,
        cta: '/travel-experience/onboard',
        links: [
          { id: 'travelClasses', icon: Airplane, href: '/travel-experience/onboard' },
          { id: 'meals', icon: ForkKnife, href: '/travel-experience/onboard' },
          { id: 'entertainment', icon: MonitorPlay, href: '/travel-experience/onboard' },
          { id: 'birthdayCakes', icon: Cake, href: '/travel-experience/onboard' },
          { id: 'marhabaMagazine', icon: BookOpen, href: '/travel-experience/traveler-magazine' },
          { id: 'kidsToys', icon: PuzzlePiece, href: '/travel-experience/onboard' },
          { id: 'wifiOnboard', icon: WifiHigh, href: '/travel-experience/onboard' },
        ],
      },
      {
        id: 'afterTravel',
        icon: SuitcaseRolling,
        type: 'links',
        withDescriptions: true,
        image: cardAfterTravel,
        cta: '/travel-experience/after-travel',
        links: [
          { id: 'lostBaggage', icon: Suitcase, href: '/travel-experience/after-travel' },
          { id: 'refunds', icon: Receipt, href: '/travel-experience/after-travel' },
          { id: 'loyaltyMiles', icon: Star, href: '/travel-experience/after-travel' },
          { id: 'feedbackSupport', icon: ChatCircleText, href: '/help/contact-us' },
        ],
      },
    ],
  },
  {
    id: 'help',
    labelKey: 'help',
    tabs: [
      {
        id: 'helpCenter',
        icon: Question,
        type: 'links',
        image: helpCta,
        cta: '/help',
        links: [
          { id: 'contactUs', icon: Phone, href: '/help/contact-us' },
          { id: 'generalSalesAgents', icon: GlobeHemisphereWest, href: '/help/contact-us/our-gsa' },
          { id: 'salesOffices', icon: Buildings, href: '/help/contact-us/our-offices' },
          { id: 'faq', icon: Question, href: '/help/faqs' },
        ],
      },
      {
        id: 'formsRequests',
        icon: ClipboardText,
        type: 'links',
        image: formsImage,
        cta: '/help/contact-us/forms',
        links: [
          { id: 'refundRequest', icon: Receipt, href: '/help/contact-us/forms' },
          { id: 'shareFeedback', icon: ThumbsUp, href: '/help/contact-us/forms' },
          { id: 'trackRequest', icon: MagnifyingGlass, href: '/help/contact-us/forms' },
          { id: 'ancillaryRefund', icon: Headset, href: '/help/contact-us/forms' },
          { id: 'itemLeftOnboard', icon: WarningCircle, href: '/help/contact-us/forms' },
        ],
      },
    ],
  },
]

import syFlag from '../../../assets/images/flags/sy.svg'
import aeFlag from '../../../assets/images/flags/ae.svg'
import kwFlag from '../../../assets/images/flags/kw.svg'
import iqFlag from '../../../assets/images/flags/iq.svg'
import omFlag from '../../../assets/images/flags/om.svg'
import trFlag from '../../../assets/images/flags/tr.svg'
import lyFlag from '../../../assets/images/flags/ly.svg'
import saFlag from '../../../assets/images/flags/sa.svg'
import amFlag from '../../../assets/images/flags/am.svg'

/**
 * Country/region picker shown under the "SY" control. `langs` lists the
 * languages offered for that region (matches the app's supported locales).
 * `global` renders the globe icon instead of a flag.
 */
export const regions = [
  { id: 'syria', code: 'SY', flag: syFlag, langs: ['en', 'ar'] },
  { id: 'uae', code: 'AE', flag: aeFlag, langs: ['en', 'ar'] },
  { id: 'kuwait', code: 'KW', flag: kwFlag, langs: ['en', 'ar'] },
  { id: 'iraq', code: 'IQ', flag: iqFlag, langs: ['en', 'ar'] },
  { id: 'oman', code: 'OM', flag: omFlag, langs: ['en', 'ar'] },
  { id: 'turkey', code: 'TR', flag: trFlag, langs: ['en', 'ar'] },
  { id: 'libya', code: 'LY', flag: lyFlag, langs: ['en', 'ar'] },
  { id: 'saudiArabia', code: 'SA', flag: saFlag, langs: ['en', 'ar'] },
  { id: 'armenia', code: 'AM', flag: amFlag, langs: ['en'] },
  { id: 'global', code: 'GL', global: true, langs: ['en', 'ar'] },
]

export const mobileMenuSecondaryLinks = [
  { id: 'contactUs', href: '/help/contact-us', labelKey: 'navItems.contactUs' },
  { id: 'helpSupport', href: '/help', labelKey: 'mobile.helpSupport' },
]
