import { FLYCHAM_POS } from '../../../vendor/shims/next-navigation.jsx'
import { FLYCHAM_SITE_URL } from '../../../vendor/flycham/lib/flychamSite.js'
import { searchHitId, buildSearchHitHref } from '../../../shared/search/utils/searchHit.js'

export const destinationFaqIds = ['whereWeFly', 'visa', 'airport', 'baggage', 'manageBooking']

export const destinationNetwork = [
  {
    countryKey: 'syria',
    cities: [
      { cityKey: 'damascus', codes: ['DAM'] },
      { cityKey: 'aleppo', codes: ['ALP'] },
    ],
  },
  {
    countryKey: 'uae',
    cities: [
      { cityKey: 'dubai', codes: ['DXB', 'DWC'] },
      { cityKey: 'sharjah', codes: ['SHJ'] },
      { cityKey: 'abuDhabi', codes: ['AUH'] },
    ],
  },
  {
    countryKey: 'saudiArabia',
    cities: [{ cityKey: 'dammam', codes: ['DMM'] }],
  },
  {
    countryKey: 'kuwait',
    cities: [{ cityKey: 'kuwaitCity', codes: ['KWI'] }],
  },
  {
    countryKey: 'iraq',
    cities: [
      { cityKey: 'baghdad', codes: ['BGW'] },
      { cityKey: 'erbil', codes: ['EBL'] },
    ],
  },
  {
    countryKey: 'armenia',
    cities: [{ cityKey: 'yerevan', codes: ['EVN'] }],
  },
  {
    countryKey: 'oman',
    cities: [{ cityKey: 'muscat', codes: ['MCT'] }],
  },
  {
    countryKey: 'turkey',
    cities: [{ cityKey: 'istanbul', codes: ['SAW'] }],
  },
  {
    countryKey: 'libya',
    cities: [{ cityKey: 'tripoli', codes: ['MJI'] }],
  },
]

const faqPageHref = (questionId) =>
  buildSearchHitHref({
    href: '/help/faqs',
    targetId: searchHitId(questionId),
    questionId,
  })

export const destinationFaqCtas = {
  whereWeFly: faqPageHref('flightSchedules-schedulesAndFares-1'),
  visa: faqPageHref('travelInformation-visa-1'),
  airport: faqPageHref('atTheAirport-wheelchairAssistance-1'),
  baggage: faqPageHref('baggage-checkedBaggage-1'),
}

export function getManageBookingHref(language) {
  return `${FLYCHAM_SITE_URL}/${FLYCHAM_POS}/${language}/manage-booking`
}

export function getDestinationNetworkSearchText() {
  const flatten = (joinCodes) =>
    destinationNetwork
      .flatMap((country) => [
        country.countryKey,
        ...country.cities.flatMap((city) => [city.cityKey, joinCodes(city.codes)]),
      ])
      .join(' ')

  return {
    en: flatten((codes) => codes.join(' ')),
    ar: flatten((codes) => codes.join(' ')),
  }
}
