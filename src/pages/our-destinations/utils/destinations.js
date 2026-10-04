// Unrouted legacy data — images point at the cms-media bucket copies.
const abuDhabi = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/abu-dhabi.webp'
const baghdad = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/baghdad.webp'
const damascus = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/damascus.webp'
const dammam = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/dammam.webp'
const dubai = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/dubai.webp'
const erbil = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/erbil.webp'
const istanbul = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/istanbul.webp'
const kuwait = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/kuwait.webp'
const muscat = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/muscat.webp'
const featuredDemoOne = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/ph2.webp'
const featuredDemoTwo = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/ph4.webp'
const sharjah = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/sharja.webp'
const tripoli = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/tripoli.webp'
const yerevan = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/our-destenations/yerevan.webp'

export const ITEMS_PER_PAGE = 12

export const destinations = [
  {
    id: 'damascus',
    countryKey: 'syria',
    iata: 'DAM',
    image: damascus,
    href: '/our-destinations/flights-to-damascus',
  },
  {
    id: 'abuDhabi',
    countryKey: 'uae',
    iata: 'AUH',
    image: abuDhabi,
  },
  {
    id: 'sharjah',
    countryKey: 'uae',
    iata: 'SHJ',
    image: sharjah,
  },
  { id: 'dubai', countryKey: 'uae', iata: 'DXB', image: dubai, featured: true, href: '/our-destinations/flights-to-dubai' },
  { id: 'dammam', countryKey: 'saudiArabia', iata: 'DMM', image: dammam },
  { id: 'muscat', countryKey: 'oman', iata: 'MCT', image: muscat },
  { id: 'istanbul', countryKey: 'turkey', iata: 'SAW', image: istanbul },
  {
    id: 'tripoli',
    countryKey: 'libya',
    iata: 'MJI',
    image: tripoli,
  },
  { id: 'erbil', countryKey: 'iraq', iata: 'EBL', image: erbil },
  { id: 'baghdad', countryKey: 'iraq', iata: 'BGW', image: baghdad },
  { id: 'yerevan', countryKey: 'armenia', iata: 'EVN', image: yerevan },
  { id: 'kuwait', countryKey: 'kuwait', iata: 'KWI', image: kuwait },
]

export const featuredDestinationId = 'dubai'

export const featuredDestination =
  destinations.find((item) => item.id === featuredDestinationId) || destinations[0]

export const featuredImages = [
  featuredDestination.image,
  featuredDemoOne,
  featuredDemoTwo,
]

export function getDestinationPage(page) {
  const start = (page - 1) * ITEMS_PER_PAGE
  return destinations.slice(start, start + ITEMS_PER_PAGE)
}

export function getDestinationPageCount() {
  return Math.max(1, Math.ceil(destinations.length / ITEMS_PER_PAGE))
}
