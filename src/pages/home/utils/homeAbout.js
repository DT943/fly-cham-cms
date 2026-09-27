import aboutImage from '../../../assets/images/about-us/vision.jpg'
import whoWeAreImage from '../../../assets/images/about-us/mission.jpg'
import missionImage from '../../../assets/images/travel-experience/hero.png'

/**
 * Home About Fly Cham — three intro cards + CTA to /about-us.
 */
export const homeAboutCards = [
  {
    id: 'aboutUs',
    image: aboutImage,
  },
  {
    id: 'whoWeAre',
    image: whoWeAreImage,
  },
  {
    id: 'ourMission',
    image: missionImage,
    imageClassName: 'object-[center_35%]',
  },
]

export const homeAboutHref = '/about-us'
