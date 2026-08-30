export const officeCities = [
  {
    id: 'damascus',
    locationIds: ['freeZone', 'fardous', 'masaPlaza', 'damascusAirport'],
  },
  {
    id: 'aleppo',
    locationIds: ['azizieh', 'jamiliyah', 'aleppoAirport'],
  },
]

export const officeLocations = {
  freeZone: {
    phone: '+963 -11-2122222',
    email: 'cs@flycham.com',
  },
  fardous: {
    phone: '+963 -11-2274444',
    email: 'cs@flycham.com',
  },
  masaPlaza: {
    phone: '+963 -11-8842222',
    email: 'cs@flycham.com',
  },
  damascusAirport: {
    phone: '+963 -11-5400714',
    email: 'cs@flycham.com',
  },
  azizieh: {
    phone: '+963-21-2211111',
    email: 'cs@flycham.com',
  },
  jamiliyah: {
    phone: '+963-21-3322222',
    email: 'cs@flycham.com',
  },
  aleppoAirport: {
    phone: '+963-21-5400888',
    email: 'cs@flycham.com',
  },
}

export function getPhoneHref(phone) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}
