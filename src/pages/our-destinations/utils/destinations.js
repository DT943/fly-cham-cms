import abuDhabi from '../../../assets/images/our-destenations/abu-dhabi.jpg'
import baghdad from '../../../assets/images/our-destenations/baghdad.jpg'
import damascus from '../../../assets/images/our-destenations/damascus.jpeg'
import dammam from '../../../assets/images/our-destenations/dammam.jpg'
import dubai from '../../../assets/images/our-destenations/dubai.jpg'
import erbil from '../../../assets/images/our-destenations/erbil.jpg'
import istanbul from '../../../assets/images/our-destenations/istanbul.jpg'
import kuwait from '../../../assets/images/our-destenations/kuwait.jpg'
import muscat from '../../../assets/images/our-destenations/muscat.jpg'
import featuredDemoOne from '../../../assets/images/our-destenations/ph2.jpg'
import featuredDemoTwo from '../../../assets/images/our-destenations/ph4.jpg'
import sharjah from '../../../assets/images/our-destenations/sharja.jpg'
import tripoli from '../../../assets/images/our-destenations/tripoli.jpeg'
import yerevan from '../../../assets/images/our-destenations/yerevan.jpg'

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
  { id: 'dubai', countryKey: 'uae', iata: 'DXB', image: dubai, featured: true },
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
