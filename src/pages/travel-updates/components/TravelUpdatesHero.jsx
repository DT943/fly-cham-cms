import PageMediaHero from '../../../shared/components/PageMediaHero.jsx'
import heroPhoto from '../../../assets/images/cargo-stations/hero.jpg'

/**
 * Travel Updates hero — full-bleed tarmac photo with start-anchored white fade.
 */
const TravelUpdatesHero = ({ title, subtitle, imageAlt }) => (
  <PageMediaHero
    image={heroPhoto}
    imageAlt={imageAlt}
    title={title}
    subtitle={subtitle}
    objectPosition="68% center"
    height="compact"
  />
)

export default TravelUpdatesHero
