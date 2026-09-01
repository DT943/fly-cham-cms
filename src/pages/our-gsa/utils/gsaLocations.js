export const gsaCountries = [
  { id: 'kuwait', locationIds: ['kuwaitAviation', 'kuwaitCto'] },
  { id: 'uae', locationIds: ['uaeDubai', 'uaeAbuDhabi'] },
  { id: 'iraq', locationIds: ['iraqBaghdad'] },
  { id: 'armenia', locationIds: ['armeniaYerevan'] },
  { id: 'oman', locationIds: ['omanMuscat'] },
  { id: 'turkey', locationIds: ['turkeyIstanbul', 'turkeyAnkara'] },
]

export const gsaLocations = {
  kuwaitAviation: {
    lat: 29.3792,
    lng: 47.9903,
    phone: '+965 2242 5600',
    email: 'flycham@kuwaitaviation.com',
    days: 'Sun-Sat',
    hours: '08:30 - 17:00',
  },
  kuwaitCto: {
    lat: 29.3675,
    lng: 47.9784,
    phone: '+965 2243 1100',
    email: 'cto@kuwaitaviation.com',
    days: 'Sun-Thu',
    hours: '09:00 - 16:00',
  },
  uaeDubai: {
    lat: 25.2048,
    lng: 55.2708,
    phone: '+971 4 295 8800',
    email: 'dubai@flycham-gsa.ae',
    days: 'Sun-Thu',
    hours: '09:00 - 18:00',
  },
  uaeAbuDhabi: {
    lat: 24.4539,
    lng: 54.3773,
    phone: '+971 2 445 2200',
    email: 'abudhabi@flycham-gsa.ae',
    days: 'Sun-Thu',
    hours: '09:00 - 17:30',
  },
  iraqBaghdad: {
    lat: 33.3152,
    lng: 44.3661,
    phone: '+964 1 719 3300',
    email: 'baghdad@flycham-gsa.iq',
    days: 'Sat-Thu',
    hours: '09:00 - 16:00',
  },
  armeniaYerevan: {
    lat: 40.1872,
    lng: 44.5152,
    phone: '+374 10 53 2200',
    email: 'yerevan@flycham-gsa.am',
    days: 'Mon-Fri',
    hours: '09:30 - 18:00',
  },
  omanMuscat: {
    lat: 23.588,
    lng: 58.3829,
    phone: '+968 2456 7700',
    email: 'muscat@flycham-gsa.om',
    days: 'Sun-Thu',
    hours: '08:00 - 16:30',
  },
  turkeyIstanbul: {
    lat: 41.0082,
    lng: 28.9784,
    phone: '+90 212 465 8800',
    email: 'istanbul@flycham-gsa.tr',
    days: 'Mon-Fri',
    hours: '09:00 - 18:00',
  },
  turkeyAnkara: {
    lat: 39.9334,
    lng: 32.8597,
    phone: '+90 312 440 2100',
    email: 'ankara@flycham-gsa.tr',
    days: 'Mon-Fri',
    hours: '09:00 - 17:00',
  },
}

export const countryIds = gsaCountries.map((country) => country.id)

export function getCountryById(id) {
  return gsaCountries.find((country) => country.id === id)
}

export function getPhoneHref(phone) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

export function getMapsHref(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`
}
