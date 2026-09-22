import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'
import BookingWidget from '../../shared/booking/BookingWidget.jsx'
import DestinationsExplore from './components/DestinationsExplore.jsx'
import DestinationsHero from './components/DestinationsHero.jsx'
import DestinationsFaqs from './components/DestinationsFaqs.jsx'
import DestinationsInspiration from './components/DestinationsInspiration.jsx'

const OurDestinations = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.whereWeFly') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
      </Container>
      <SearchAnchor hit="destinations-hero">
        <DestinationsHero
          title={t('destinations.hero.title')}
          subtitle={t('destinations.hero.subtitle')}
          imageAlt={t('destinations.hero.imageAlt')}
        />
      </SearchAnchor>
      <Container className="flex flex-col gap-10 py-8 md:gap-14 md:py-12 lg:gap-16 lg:py-14">
        <SearchAnchor hit="destinations-explore">
          <DestinationsExplore />
        </SearchAnchor>
        <SearchAnchor hit="destinations-inspiration">
          <DestinationsInspiration />
        </SearchAnchor>
        <DestinationsFaqs />
        <BookingWidget />
      </Container>
    </main>
  )
}

export default OurDestinations
