/**
 * Travel Updates — featured advisory + paginated update entries.
 */
export const TRAVEL_UPDATES_PATH = '/travel-updates'

export const TRAVEL_UPDATES_PAGE_SIZE = 4

/** Featured advisory card (Latest Advisories). */
export const travelUpdatesAdvisory = {
  id: 'autumnWeather',
  dateKey: 'october242025',
  href: '/help',
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
 * List entries. Enough items for multi-page pagination demo.
 * `accentTitle` matches the teal title treatment on select cards.
 */
export const travelUpdatesEntries = [
  {
    id: 'loungeAccess',
    dateKey: 'october242025',
    showLearnMore: true,
    href: '/cham-miles',
  },
  {
    id: 'deviceRegulations',
    dateKey: 'october242025',
    accentTitle: true,
    showLearnMore: false,
  },
  {
    id: 'flightsResume',
    dateKey: 'october242025',
    showLearnMore: false,
  },
  {
    id: 'winterSports',
    dateKey: 'october242025',
    showLearnMore: false,
  },
  {
    id: 'baggagePolicy',
    dateKey: 'september182025',
    showLearnMore: true,
    href: '/travel-experience/before-you-fly',
  },
  {
    id: 'checkInWindow',
    dateKey: 'september182025',
    showLearnMore: false,
  },
  {
    id: 'visaReminder',
    dateKey: 'august052025',
    accentTitle: true,
    showLearnMore: true,
    href: '/help',
  },
  {
    id: 'cabinComfort',
    dateKey: 'august052025',
    showLearnMore: false,
  },
  {
    id: 'scheduleAdjustment',
    dateKey: 'july222025',
    showLearnMore: true,
    href: '/help',
  },
  {
    id: 'loyaltyBonus',
    dateKey: 'july222025',
    showLearnMore: false,
  },
  {
    id: 'mobileBoarding',
    dateKey: 'june102025',
    showLearnMore: false,
  },
  {
    id: 'sustainability',
    dateKey: 'june102025',
    accentTitle: true,
    showLearnMore: true,
    href: '/our-responsibility',
  },
]
