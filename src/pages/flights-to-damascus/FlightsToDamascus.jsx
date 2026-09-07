import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'
import BookingWidget from '../../shared/booking/BookingWidget.jsx'
import DamascusHero from './components/DamascusHero.jsx'
import DamascusQuickStats from './components/DamascusQuickStats.jsx'
import DamascusNarratives from './components/DamascusNarratives.jsx'
import DamascusThingsToDo from './components/DamascusThingsToDo.jsx'

const FlightsToDamascus = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.whereWeFly'), href: '/our-destinations' },
    { label: t('flightsToDamascus.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <SearchAnchor hit="damascus-hero">
        <DamascusHero
          eyebrow={t('flightsToDamascus.hero.eyebrow')}
          title={t('flightsToDamascus.hero.title')}
          country={t('flightsToDamascus.hero.country')}
          imageAlt={t('flightsToDamascus.hero.imageAlt')}
        />
      </SearchAnchor>

      <DamascusQuickStats />

      <Container className="flex flex-col gap-10 py-8 md:gap-14 md:py-12 lg:gap-14 lg:py-14">
        <SearchAnchor hit="damascus-narratives">
          <DamascusNarratives />
        </SearchAnchor>
        <SearchAnchor hit="damascus-things-to-do">
          <DamascusThingsToDo />
        </SearchAnchor>
        <BookingWidget />
      </Container>
    </main>
  )
}

export default FlightsToDamascus
