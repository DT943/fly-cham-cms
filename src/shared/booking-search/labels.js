/**
 * English fallbacks for every CMS label of the booking-search block (the CMS
 * stores both languages; these only cover keys an older block may lack).
 * Same keys as flychamadmin cms2 BookingSearch/utils/content.js.
 */
export const DEFAULT_LABELS = {
  bookTab: 'Book',
  manageTab: 'Manage',
  flightStatusTab: 'Flight status',
  flightStatusHref: '/coming-soon',
  roundTripLabel: 'Round-trip',
  oneWayLabel: 'One-way',
  multiCityLabel: 'Multi-city',
  milesLabel: 'Book With Miles',
  fromLabel: 'From',
  toLabel: 'To',
  fromPlaceholder: 'Select your origin',
  toPlaceholder: 'Select your destination',
  departureLabel: 'Departure',
  returnLabel: 'Return',
  datesPlaceholder: 'Dates',
  passengersLabel: 'Passengers',
  adultSingular: 'Adult',
  adultPlural: 'Adults',
  childSingular: 'Child',
  childPlural: 'Children',
  infantSingular: 'Infant',
  infantPlural: 'Infants',
  adultsHint: '12+ years',
  childrenHint: '2–11 years',
  infantsHint: 'Under 2 years',
  classLabel: 'Class',
  economyLabel: 'Economy',
  businessLabel: 'Business',
  doneLabel: 'Done',
  flight2Label: 'Flight 2',
  nearbyLabel: 'Include nearby airports',
  searchLabel: 'Search flights',
  searchingLabel: 'Searching…',
  loadingLabel: 'Loading…',
  pnrLabel: 'Booking reference',
  pnrPlaceholder: 'e.g. ABC123',
  lastNameLabel: 'Last name',
  lastNamePlaceholder: 'As on your booking',
  manageButton: 'Find booking',
  pnrError: 'Enter your 6-character booking reference',
  lastNameError: 'Enter the last name in English letters',
  defaultOrigin: 'DAM',
}

export const LABEL_KEYS = Object.keys(DEFAULT_LABELS)

/**
 * Merge stored content over the fallbacks (empty strings fall back too —
 * except `defaultOrigin`, where an empty value means "no preselected city").
 */
export const resolveLabels = (content = {}) =>
  Object.fromEntries(
    LABEL_KEYS.map((key) => {
      const value = content?.[key]
      if (key === 'defaultOrigin' && typeof value === 'string') return [key, value.trim()]
      return [key, typeof value === 'string' && value.trim() ? value : DEFAULT_LABELS[key]]
    }),
  )
