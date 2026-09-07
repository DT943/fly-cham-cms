import baghdad from '../../../assets/images/our-destenations/baghdad.jpg'
import dammam from '../../../assets/images/our-destenations/dammam.jpg'
import dubai from '../../../assets/images/our-destenations/dubai.jpg'
import erbil from '../../../assets/images/our-destenations/erbil.jpg'
import istanbul from '../../../assets/images/our-destenations/istanbul.jpg'
import kuwait from '../../../assets/images/our-destenations/kuwait.jpg'
import muscat from '../../../assets/images/our-destenations/muscat.jpg'
import yerevan from '../../../assets/images/our-destenations/yerevan.jpg'

export const ITEMS_PER_PAGE = 12

export const destinations = [
  {
    id: 'damascus',
    countryKey: 'syria',
    image: 'https://images.unsplash.com/photo-1577588090498-d5fa6ed6cb9f?w=600&q=80',
    href: '/our-destinations/flights-to-damascus',
  },
  {
    id: 'abuDhabi',
    countryKey: 'uae',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
  },
  {
    id: 'sharjah',
    countryKey: 'uae',
    image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=600&q=80',
  },
  { id: 'dubai', countryKey: 'uae', image: dubai, featured: true },
  { id: 'dammam', countryKey: 'saudiArabia', image: dammam },
  { id: 'muscat', countryKey: 'oman', image: muscat },
  { id: 'istanbul', countryKey: 'turkey', image: istanbul },
  {
    id: 'tripoli',
    countryKey: 'libya',
    image: 'https://images.unsplash.com/photo-1580735916561-4df883025f3c?w=600&q=80',
  },
  { id: 'erbil', countryKey: 'iraq', image: erbil },
  { id: 'baghdad', countryKey: 'iraq', image: baghdad },
  { id: 'yerevan', countryKey: 'armenia', image: yerevan },
  { id: 'kuwait', countryKey: 'kuwait', image: kuwait },
]

export const featuredDestinationId = 'dubai'

export const featuredDestination =
  destinations.find((item) => item.id === featuredDestinationId) || destinations[0]

export function getDestinationPage(page) {
  const start = (page - 1) * ITEMS_PER_PAGE
  return destinations.slice(start, start + ITEMS_PER_PAGE)
}

export function getDestinationPageCount() {
  return Math.max(1, Math.ceil(destinations.length / ITEMS_PER_PAGE))
}
