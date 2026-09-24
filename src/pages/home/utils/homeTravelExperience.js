import beforeTravel from '../../../assets/images/travel-experience/card-before-you-fly.png'
import atAirport from '../../../assets/images/travel-experience/card-at-the-airport.png'
import onboard from '../../../assets/images/travel-experience/card-onboard.png'
import afterTravel from '../../../assets/images/travel-experience/card-after-travel.png'

/**
 * Home Travel Experience cards — same featured + row shape as Business Center.
 */
export const homeTravelExperience = {
  featured: {
    id: 'beforeTravel',
    image: beforeTravel,
    href: '/travel-experience/before-you-fly',
  },
  cards: [
    {
      id: 'atAirport',
      image: atAirport,
      href: '/travel-experience/at-the-airport',
    },
    {
      id: 'onboard',
      image: onboard,
      href: '/travel-experience/onboard',
    },
    {
      id: 'afterTravel',
      image: afterTravel,
      href: '/travel-experience/after-travel',
    },
  ],
}

export default homeTravelExperience
