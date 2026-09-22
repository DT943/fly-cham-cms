import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'
import FlightsHero from './components/FlightsHero.jsx'
import LandmarkFeature from './components/LandmarkFeature.jsx'
import FlightScheduleCta from './components/FlightScheduleCta.jsx'
import { landmarks } from './utils/flightsContent.js'

const FlightsToDamascus = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.whereWeFly'), href: '/our-destinations' },
    { label: t('flightsToDamascus.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <SearchAnchor hit="flights-damascus-hero">
        <FlightsHero />
      </SearchAnchor>

      <SearchAnchor hit="flights-damascus-landmarks" className="flex flex-col gap-6">
        {landmarks.map((landmark) => (
          <LandmarkFeature key={landmark.id} {...landmark} />
        ))}
      </SearchAnchor>

      <SearchAnchor hit="flights-damascus-cta" className="py-12 md:py-16">
        <FlightScheduleCta />
      </SearchAnchor>
    </main>
  )
}

export default FlightsToDamascus
