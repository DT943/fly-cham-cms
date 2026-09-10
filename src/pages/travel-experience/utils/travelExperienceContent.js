import beforeYouFlyPhoto from '../../../assets/images/travel-experience/card-before-you-fly.png'
import atTheAirportPhoto from '../../../assets/images/travel-experience/card-at-the-airport.png'
import onboardPhoto from '../../../assets/images/travel-experience/card-onboard.png'
import afterTravelPhoto from '../../../assets/images/travel-experience/card-after-travel.png'

/**
 * The four journey cards. Each photo fills its card and is darkened from the
 * bottom with a per-card tint (`gradientTo`) so the white copy stays legible.
 * The first card carries the "Learn More" label; the rest show an arrow only.
 */
export const travelExperienceCards = [
  {
    id: 'beforeYouFly',
    image: beforeYouFlyPhoto,
    gradientTo: 'to-[#01263b]',
    href: '/travel-experience/before-you-fly',
    withLabel: true,
  },
  {
    id: 'atTheAirport',
    image: atTheAirportPhoto,
    gradientTo: 'to-[#504834]',
    href: '/travel-experience/at-the-airport',
  },
  {
    id: 'onboard',
    image: onboardPhoto,
    gradientTo: 'to-[#006080]',
    href: '/travel-experience/onboard',
  },
  {
    id: 'afterTravel',
    image: afterTravelPhoto,
    gradientTo: 'to-[#01263b]',
    href: '/travel-experience/after-travel',
  },
]
