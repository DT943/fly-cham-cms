import {
  Path,
  CalendarBlank,
  Receipt,
} from '@phosphor-icons/react'

/**
 * Travel Updates — listing + `/travel-updates/{slug}` detail pages.
 */
export const TRAVEL_UPDATES_PATH = '/travel-updates'
export const TRAVEL_UPDATES_PAGE_SIZE = 4
export const TRAVEL_UPDATES_DETAIL_PATH = /^\/travel-updates\/([^/]+)$/

export const getTravelUpdateDetailHref = (slug) => `/travel-updates/${slug}`

export const getTravelUpdateSlug = (path) =>
  path.match(TRAVEL_UPDATES_DETAIL_PATH)?.[1] ?? null

const GUIDELINE_ICONS = {
  path: Path,
  calendar: CalendarBlank,
  receipt: Receipt,
}

export const getGuidelineIcon = (iconId) => GUIDELINE_ICONS[iconId] || PathIcon

/** Featured advisory card on the listing page. */
export const travelUpdatesAdvisory = {
  id: 'autumnWeather',
  dateKey: 'october242025',
  href: getTravelUpdateDetailHref('autumnWeather'),
  items: [
    {
      id: 'routeChange',
      linkHref: '/help/contact-us',
      linkKey: 'contactCenter',
    },
    {
      id: 'dateChange',
      linkHref: '/coming-soon',
      linkKey: 'manageBooking',
    },
    {
      id: 'refund',
      children: [
        {
          id: 'refundOnline',
          linkHref: '/help',
          linkKey: 'flightStatus',
        },
        {
          id: 'refundAgency',
        },
      ],
    },
  ],
}

/**
 * Listing entries. `showLearnMore` links to the detail page for that id.
 */
export const travelUpdatesEntries = [
  {
    id: 'loungeAccess',
    dateKey: 'october242025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('loungeAccess'),
  },
  {
    id: 'deviceRegulations',
    dateKey: 'october242025',
    accentTitle: true,
    showLearnMore: true,
    href: getTravelUpdateDetailHref('deviceRegulations'),
  },
  {
    id: 'flightsResume',
    dateKey: 'october242025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('flightsResume'),
  },
  {
    id: 'winterSports',
    dateKey: 'october242025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('winterSports'),
  },
  {
    id: 'baggagePolicy',
    dateKey: 'september182025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('baggagePolicy'),
  },
  {
    id: 'checkInWindow',
    dateKey: 'september182025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('checkInWindow'),
  },
  {
    id: 'visaReminder',
    dateKey: 'august052025',
    accentTitle: true,
    showLearnMore: true,
    href: getTravelUpdateDetailHref('visaReminder'),
  },
  {
    id: 'cabinComfort',
    dateKey: 'august052025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('cabinComfort'),
  },
  {
    id: 'scheduleAdjustment',
    dateKey: 'july222025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('scheduleAdjustment'),
  },
  {
    id: 'loyaltyBonus',
    dateKey: 'july222025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('loyaltyBonus'),
  },
  {
    id: 'mobileBoarding',
    dateKey: 'june102025',
    showLearnMore: true,
    href: getTravelUpdateDetailHref('mobileBoarding'),
  },
  {
    id: 'sustainability',
    dateKey: 'june102025',
    accentTitle: true,
    showLearnMore: true,
    href: getTravelUpdateDetailHref('sustainability'),
  },
]

const defaultResources = [
  { id: 'flightTracker', href: '/help' },
  { id: 'damascusGuide', href: '/our-destinations/flights-to-damascus' },
  { id: 'baggageClaim', href: '/travel-experience/after-travel' },
]

const defaultHubs = [
  { id: 'lhr', tone: 'warning' },
  { id: 'fra', tone: 'warning' },
  { id: 'dam', tone: 'normal' },
]

/**
 * Detail payloads keyed by slug. `layout: 'advisory'` unlocks guidelines + hub sidebar.
 */
export const travelUpdateDetails = {
  autumnWeather: {
    id: 'autumnWeather',
    dateKey: 'october242025',
    badge: 'operationalAdvisory',
    layout: 'advisory',
    hubs: defaultHubs,
    resources: defaultResources,
    guidelines: [
      {
        id: 'routeChange',
        icon: 'path',
        linkHref: '/help/contact-us',
        linkKey: 'contactCenter',
      },
      {
        id: 'dateChange',
        icon: 'calendar',
        linkHref: '/coming-soon',
        linkKey: 'manageBooking',
      },
      {
        id: 'refund',
        icon: 'receipt',
        bullets: ['online', 'agency'],
      },
    ],
  },
  loungeAccess: {
    id: 'loungeAccess',
    dateKey: 'october242025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  deviceRegulations: {
    id: 'deviceRegulations',
    dateKey: 'october242025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  flightsResume: {
    id: 'flightsResume',
    dateKey: 'october242025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  winterSports: {
    id: 'winterSports',
    dateKey: 'october242025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  baggagePolicy: {
    id: 'baggagePolicy',
    dateKey: 'september182025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  checkInWindow: {
    id: 'checkInWindow',
    dateKey: 'september182025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  visaReminder: {
    id: 'visaReminder',
    dateKey: 'august052025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  cabinComfort: {
    id: 'cabinComfort',
    dateKey: 'august052025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  scheduleAdjustment: {
    id: 'scheduleAdjustment',
    dateKey: 'july222025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  loyaltyBonus: {
    id: 'loyaltyBonus',
    dateKey: 'july222025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  mobileBoarding: {
    id: 'mobileBoarding',
    dateKey: 'june102025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
  sustainability: {
    id: 'sustainability',
    dateKey: 'june102025',
    badge: 'travelUpdate',
    layout: 'simple',
    resources: defaultResources,
  },
}

export const getTravelUpdateDetail = (slug) => travelUpdateDetails[slug] ?? null
