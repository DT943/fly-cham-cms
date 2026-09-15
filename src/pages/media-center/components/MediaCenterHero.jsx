import PageMediaHero from '../../../shared/components/PageMediaHero.jsx'
import heroPhoto from '../../../assets/images/media-center/hero.png'

const MediaCenterHero = ({ title, subtitle, imageAlt }) => (
  <PageMediaHero
    image={heroPhoto}
    imageAlt={imageAlt}
    title={title}
    subtitle={subtitle}
    objectPosition="72% center"
  />
)

export default MediaCenterHero
