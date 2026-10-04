import {
  AirTrafficControl,
  Binoculars,
  Clock,
  CloudSun,
  Money,
  PersonSimpleWalk,
  ShoppingCart,
} from '@phosphor-icons/react'
// The live /our-destinations/flights-to-damascus page is the CMS page of the
// same slug; these cms-media images only back the static fallback + search.
const MEDIA = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/things-to-do-in-damascus'
const specialPhoto = `${MEDIA}/special.webp`
const cuisinePhoto = `${MEDIA}/cuisine.webp`
const placesPhoto = `${MEDIA}/places.webp`
const activitiesPhoto = `${MEDIA}/activities.webp`
const thingOnePhoto = `${MEDIA}/thing-1.webp`
const thingTwoPhoto = `${MEDIA}/thing-2.webp`
const thingThreePhoto = `${MEDIA}/thing-3.webp`
const damascusHero = `${MEDIA}/hero.webp`

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
