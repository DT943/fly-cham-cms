import beforeYouFlyPhoto from '../../../assets/images/travel-experience/before-you-fly.png'
import atTheAirportPhoto from '../../../assets/images/travel-experience/at-the-airport.png'
import onBoardPhoto from '../../../assets/images/travel-experience/on-board.png'
import afterTravelPhoto from '../../../assets/images/travel-experience/after-travel.png'

/**
 * Full-bleed journey stages. Each row keeps the copy on the start (left) side
 * over a directional gradient, so `gradient` carries the tint that anchors the
 * text side and fades to transparent across the photo (mirrored in RTL).
 */
export const travelExperienceStages = [
  {
    id: 'beforeYouFly',
    image: beforeYouFlyPhoto,
    gradient: 'from-[#021b31] via-[#011726]/60 to-transparent to-[78%]',
  },
  {
    id: 'atTheAirport',
    image: atTheAirportPhoto,
    gradient: 'from-[#624314] via-[#5e3f11]/60 to-transparent to-[72%]',
  },
  {
    id: 'onBoard',
    image: onBoardPhoto,
    gradient: 'from-[#006080] via-[#003a4d]/60 to-transparent to-[62%]',
  },
  {
    id: 'afterTravel',
    image: afterTravelPhoto,
    gradient: 'from-[#006080] via-[#003a4d]/60 to-transparent to-[62%]',
  },
]
