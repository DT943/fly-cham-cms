export const gsaCountries = [
  { id: 'armenia', locationIds: ['armeniaYerevan'] },
  { id: 'iraq', locationIds: ['iraqBaghdad', 'iraqBasrah', 'iraqErbil', 'iraqNajaf'] },
  { id: 'kuwait', locationIds: ['kuwaitMalek'] },
  { id: 'libya', locationIds: ['libyaTripoli'] },
  { id: 'oman', locationIds: ['omanMuscat'] },
  { id: 'pakistan', locationIds: ['pakistanKarachi', 'pakistanLahore'] },
  { id: 'sudan', locationIds: ['sudanKhartoum'] },
  { id: 'turkey', locationIds: ['turkeyIstanbul'] },
  { id: 'uae', locationIds: ['uaeDubai'] },
]

export const gsaLocations = {
  armeniaYerevan: {
    lat: 40.1772,
    lng: 44.5035,
    phone: '+374 11202015',
    email: 'wingstourarm@gmail.com',
  },
  iraqBaghdad: {
    lat: 33.324,
    lng: 44.4156,
    phone: '+964 7707962651',
    email: 'sales@flycham-iq.com',
  },
  iraqBasrah: {
    lat: 30.5152,
    lng: 47.7835,
    phone: '+964 7730500070',
    email: 'fly.alrafidainco@yahoo.com',
  },
  iraqErbil: {
    lat: 36.1911,
    lng: 44.0094,
    phone: '+964 7501000405',
    email: 'flycham@zozik-air.net',
  },
  iraqNajaf: {
    lat: 32.0256,
    lng: 44.346,
    phone: '+964 7810615819',
    email: 'fly.alrafidainco@yahoo.com',
  },
  kuwaitMalek: {
    lat: 29.3721,
    lng: 47.9748,
    phone: '+965 22444434',
    email: 'operations@malektravel.com',
  },
  libyaTripoli: {
    lat: 32.8872,
    lng: 13.1913,
    phone: '+218 935940176',
    email: 'libya.gsa@flycham.com',
  },
  omanMuscat: {
    lat: 23.599,
    lng: 58.4308,
    phone: '+968 71113247',
    email: 'sales.oman@flycham.com',
  },
  pakistanKarachi: {
    lat: 24.8475,
    lng: 67.0308,
    phone: '+92 2135623305',
    email: 'info@quantumaviation.aero',
  },
  pakistanLahore: {
    lat: 31.5104,
    lng: 74.3444,
    phone: '+92 4235751651',
    email: 'info@quantumaviation.aero',
  },
  sudanKhartoum: {
    lat: 15.5933,
    lng: 32.5342,
    phone: '+249 183746859',
    email: 'naga@sabratravel-sd.com',
  },
  turkeyIstanbul: {
    lat: 41.0486,
    lng: 28.9872,
    phone: '+90 5467609322',
    email: 'sales.turkey@flycham.com',
  },
  uaeDubai: {
    lat: 25.2532,
    lng: 55.3331,
    phone: '+971 42222777',
    email: 'info@flyandmore.com',
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
