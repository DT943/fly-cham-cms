import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import TravelUpdatesAdvisory from './components/TravelUpdatesAdvisory.jsx'
import TravelUpdatesHero from './components/TravelUpdatesHero.jsx'
import TravelUpdatesList from './components/TravelUpdatesList.jsx'

/**
 * Travel Updates — advisories, update feed, and pagination.
 */
const TravelUpdates = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('travelUpdates.breadcrumb') },
  ]

  return (
    <main className="w-full min-w-0 bg-100 pb-12 md:pb-16">
      <Container className="min-w-0 pb-4 pt-5 md:pb-6 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <TravelUpdatesHero
        title={t('travelUpdates.hero.title')}
        subtitle={t('travelUpdates.hero.subtitle')}
        imageAlt={t('travelUpdates.hero.imageAlt')}
      />

      <Container className="flex min-w-0 flex-col gap-4 pt-10 md:gap-5 md:pt-14">
        <TravelUpdatesAdvisory />
        <TravelUpdatesList currentPage={currentPage} onPageChange={setCurrentPage} />
      </Container>
    </main>
  )
}

export default TravelUpdates
