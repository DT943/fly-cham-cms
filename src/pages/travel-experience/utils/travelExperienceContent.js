import beforeYouFlyPhoto from '../../../assets/images/travel-experience/card-before-you-fly.png'
import atTheAirportPhoto from '../../../assets/images/travel-experience/card-at-the-airport.png'
import onboardPhoto from '../../../assets/images/travel-experience/card-onboard.png'
import afterTravelPhoto from '../../../assets/images/travel-experience/card-after-travel.png'

/**
 * The four journey cards. Each photo fills its card and is darkened from the
 * bottom with a per-card tint (`gradientTo`) so the white copy stays legible.
 * Every card shows the "Learn More" expand-to-pill CTA.
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
    withLabel: true,
  },
  {
    id: 'onboard',
    image: onboardPhoto,
    gradientTo: 'to-[#006080]',
    href: '/travel-experience/onboard',
    withLabel: true,
  },
  {
    id: 'afterTravel',
    image: afterTravelPhoto,
    gradientTo: 'to-[#01263b]',
    href: '/travel-experience/after-travel',
    withLabel: true,
  },
]
