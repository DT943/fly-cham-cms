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

/** Quick facts strip that overlaps the hero. */
export const damascusStats = [
  { id: 'airport', icon: AirTrafficControl },
  { id: 'weather', icon: CloudSun },
  { id: 'time', icon: Clock },
  { id: 'currency', icon: Money },
]

/**
 * Alternating image / copy rows. `imageFirst` puts the photo on the start side.
 * Heading colour and weight are per-row because the design varies them: the
 * opening row is neutral, and the closing row is bold rather than semibold.
 */
export const damascusNarratives = [
  { id: 'special', image: specialPhoto, imageFirst: true, titleClass: 'font-semibold text-700' },
  { id: 'cuisine', image: cuisinePhoto, imageFirst: false, titleClass: 'font-semibold text-primary-800' },
  { id: 'places', image: placesPhoto, imageFirst: true, titleClass: 'font-semibold text-primary-800' },
  { id: 'activities', image: activitiesPhoto, imageFirst: false, titleClass: 'font-bold text-primary-800' },
]

export const damascusThingsToDo = [
  { id: 'umayyadMosque', icon: Binoculars, image: thingOnePhoto },
  { id: 'oldCity', icon: PersonSimpleWalk, image: thingTwoPhoto },
  { id: 'souk', icon: ShoppingCart, image: thingThreePhoto },
]
