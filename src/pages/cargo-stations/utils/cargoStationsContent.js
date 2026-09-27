import heroImage from '../../../assets/images/cargo-stations/hero.jpg'
import requestImage from '../../../assets/images/cargo-stations/request.jpg'
import guideImage from '../../../assets/images/cargo-stations/guide.png'
import station1 from '../../../assets/images/cargo-stations/station-1-thumb.jpg'
import station2 from '../../../assets/images/cargo-stations/station-2-thumb.jpg'
import station3 from '../../../assets/images/cargo-stations/station-3-thumb.jpg'
import station4 from '../../../assets/images/cargo-stations/station-4-thumb.jpg'

/** Static content for Cargo Stations. Copy lives under `cargoStations.*`. */
export const cargoStationsHero = {
  image: heroImage,
  objectPosition: 'center 40%',
}

export const cargoStationsList = [
  { id: 'damascus', image: station1 },
  { id: 'dubai', image: station2 },
  { id: 'sharjah', image: station3 },
  { id: 'baghdad', image: station4 },
  { id: 'erbil', image: station1 },
  { id: 'beirut', image: station2 },
]

export const cargoStationsRequest = {
  image: requestImage,
  href: '/help/contact-us/forms',
}

export const cargoStationsGuide = {
  image: guideImage,
  href: '/coming-soon',
  objectPosition: '85% center',
  overlayStyle: {
    background: '',
  },
}

export default cargoStationsList
