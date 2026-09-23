import requestImage from '../../../assets/images/cargo-service/request.jpg'
import stationsImage from '../../../assets/images/cargo-service/stations.jpg'
import assistanceImage from '../../../assets/images/cargo-service/assistance.png'
import guideImage from '../../../assets/images/cargo-service/guide.png'
import heroImage from '../../../assets/images/cargo-service/hero.jpg'

/** Static content for the Cargo Service page. Copy lives under `cargoService.*`. */
export const cargoServiceHero = {
  image: heroImage,
  objectPosition: 'center 45%',
}

export const cargoShipmentTypes = [
  { id: 'airFreight', image: requestImage },
  { id: 'perishables', image: heroImage },
  { id: 'pharma', image: stationsImage },
  { id: 'liveAnimals', image: assistanceImage },
  { id: 'aog', image: requestImage },
  { id: 'sensitive', image: stationsImage },
  { id: 'dangerous', image: heroImage },
  { id: 'charter', image: requestImage },
]

export const cargoInfoCards = [
  {
    id: 'request',
    image: requestImage,
    href: '/help/contact-us/forms',
  },
  {
    id: 'stations',
    image: stationsImage,
    href: '/cargo-stations',
  },
  {
    id: 'assistance',
    image: assistanceImage,
    href: '/help/contact-us',
  },
]

export const cargoGuideCta = {
  image: guideImage,
  href: '/coming-soon',
  objectPosition: '',
  overlayStyle: {
    background: '',
  },
}

export default cargoInfoCards
