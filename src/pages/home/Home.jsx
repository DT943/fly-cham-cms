import Container from '../../shared/components/Container.jsx'
import BookingWidget from '../../shared/booking/BookingWidget.jsx'
import HomeHeroSlider from './components/HomeHeroSlider.jsx'
import HomePlanTrip from './components/HomePlanTrip.jsx'
import HomeExtraServices from './components/HomeExtraServices.jsx'
import HomeTravelExperience from './components/HomeTravelExperience.jsx'
import HomeChamMilesBanner from './components/HomeChamMilesBanner.jsx'
import HomeAbout from './components/HomeAbout.jsx'
import MediaNewsletterSignup from '../media-center/components/MediaNewsletterSignup.jsx'
import { homeNewsletterBackground } from './utils/homeNewsletter.js'

/**
 * Fly Cham marketing home — hero through newsletter.
 */
const Home = () => (
  <main className="w-full min-w-0 overflow-x-clip bg-100">
    <div className="relative">
      <HomeHeroSlider />
      <Container className="relative z-20 -mt-24 overflow-visible sm:-mt-28 md:-mt-32 lg:-mt-36">
        <BookingWidget className="w-full" />
      </Container>
    </div>

    <HomePlanTrip />
    <HomeExtraServices />
    <HomeTravelExperience />
    <HomeChamMilesBanner />
    <HomeAbout />
    <MediaNewsletterSignup layout="photo" backgroundImage={homeNewsletterBackground} />
  </main>
)

export default Home
