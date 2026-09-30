import {
  AirTrafficControl,
  Binoculars,
  Clock,
  CloudSun,
  Money,
  PersonSimpleWalk,
  ShoppingCart,
} from '@phosphor-icons/react'
import specialPhoto from '../../../assets/images/things-to-do-in-damascus/special.png'
import cuisinePhoto from '../../../assets/images/things-to-do-in-damascus/cuisine.png'
import placesPhoto from '../../../assets/images/things-to-do-in-damascus/places.png'
import activitiesPhoto from '../../../assets/images/things-to-do-in-damascus/activities.png'
import thingOnePhoto from '../../../assets/images/things-to-do-in-damascus/thing-1.jpg'
import thingTwoPhoto from '../../../assets/images/things-to-do-in-damascus/thing-2.jpg'
import thingThreePhoto from '../../../assets/images/things-to-do-in-damascus/thing-3.jpg'
import damascusHero from '../../../assets/images/things-to-do-in-damascus/hero.jpg'

export const FLIGHTS_TO_PATH = /^\/our-destinations\/flights-to-([^/]+)$/

/** Shared flights-to-destination layout: stats strip + alternating narrative rows. */
const templateStats = [
  { id: 'airport', icon: AirTrafficControl },
  { id: 'time', icon: Clock },
  { id: 'weather', icon: CloudSun },
  { id: 'currency', icon: Money },
]

const templateNarratives = [
  { id: 'special', imageFirst: true, titleClass: 'font-semibold text-700' },
  { id: 'cuisine', imageFirst: false, titleClass: 'font-semibold text-primary-800' },
  { id: 'places', imageFirst: true, titleClass: 'font-semibold text-primary-800' },
  { id: 'activities', imageFirst: false, titleClass: 'font-bold text-primary-800' },
]

const cityGuides = {
  damascus: {
    heroImage: damascusHero,
    narrativeImages: {
      special: specialPhoto,
      cuisine: cuisinePhoto,
      places: placesPhoto,
      activities: activitiesPhoto,
    },
    thingsToDo: [
      { id: 'souk', icon: ShoppingCart, image: thingThreePhoto },
      { id: 'oldCity', icon: PersonSimpleWalk, image: thingTwoPhoto },
      { id: 'umayyadMosque', icon: Binoculars, image: thingOnePhoto },
    ],
    activitiesHref: '/our-destinations/things-to-do-in-damascus',
  },
}

export function getDestinationGuide(slug) {
  const city = cityGuides[slug]
  if (!city) return null

  return {
    heroImage: city.heroImage,
    activitiesHref: city.activitiesHref,
    thingsToDo: city.thingsToDo,
    stats: templateStats,
    narratives: templateNarratives.map((row) => ({
      ...row,
      image: city.narrativeImages[row.id],
    })),
  }
}

export const destinationGuides = Object.fromEntries(
  Object.keys(cityGuides).map((slug) => [slug, getDestinationGuide(slug)])
)

export function getDestinationGuideSlug(path = '') {
  return path.match(FLIGHTS_TO_PATH)?.[1] || null
}

export function flightsToHref(slug) {
  return `/our-destinations/flights-to-${slug}`
}
