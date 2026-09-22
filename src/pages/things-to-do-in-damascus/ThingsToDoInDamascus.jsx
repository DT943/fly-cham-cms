import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'
import BookingWidget from '../../shared/booking/BookingWidget.jsx'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import { withLanguage } from '../../i18n/languages.js'
import DestinationHero from './components/DamascusHero.jsx'
import DestinationQuickStats from './components/DamascusQuickStats.jsx'
import DestinationNarratives from './components/DamascusNarratives.jsx'
import DestinationThingsToDo from './components/DamascusThingsToDo.jsx'
import { getDestinationGuide, getDestinationGuideSlug } from './utils/destinationGuides.js'

const FlightsToDestination = () => {
  const { t } = useTranslation()
  const { pagePath, language } = useLocalizedRoute()
  const slug = getDestinationGuideSlug(pagePath)
  const guide = getDestinationGuide(slug)

  if (!guide) {
    return <Navigate to={withLanguage('/our-destinations', language)} replace />
  }

  const i18nKey = `destinationGuides.${slug}`

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.whereWeFly'), href: '/our-destinations' },
    { label: t(`${i18nKey}.breadcrumb`) },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <SearchAnchor hit="destination-hero">
        <DestinationHero
          title={t(`${i18nKey}.hero.title`)}
          country={t(`${i18nKey}.hero.country`)}
          image={guide.heroImage}
          imageAlt={t(`${i18nKey}.hero.imageAlt`)}
        />
      </SearchAnchor>

      <DestinationQuickStats i18nKey={i18nKey} stats={guide.stats} />

      <Container className="flex flex-col gap-10 py-8 md:gap-14 md:py-12 lg:gap-14 lg:py-14">
        <SearchAnchor hit="destination-narratives">
          <DestinationNarratives i18nKey={i18nKey} narratives={guide.narratives} />
        </SearchAnchor>
        <SearchAnchor hit="destination-things-to-do">
          <DestinationThingsToDo
            i18nKey={i18nKey}
            items={guide.thingsToDo}
            activitiesHref={guide.activitiesHref}
          />
        </SearchAnchor>
        <BookingWidget />
      </Container>
    </main>
  )
}

export default FlightsToDestination
