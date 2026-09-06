import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'
import DestinationsExplore from './components/DestinationsExplore.jsx'
import DestinationsHero from './components/DestinationsHero.jsx'

const OurDestinations = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.whereWeFly') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>
      <SearchAnchor hit="destinations-hero">
        <DestinationsHero
          title={t('destinations.hero.title')}
          subtitle={t('destinations.hero.subtitle')}
          imageAlt={t('destinations.hero.imageAlt')}
        />
      </SearchAnchor>
      <Container className="py-8 md:py-12 lg:py-14">
        <SearchAnchor hit="destinations-explore">
          <DestinationsExplore />
        </SearchAnchor>
      </Container>
    </main>
  )
}

export default OurDestinations
