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
    <main className="w-full bg-100">
      <Breadcrumbs items={breadcrumbs} />

      <div className="relative">
        <SearchAnchor hit="destination-hero">
          <DestinationHero
            title={t(`${i18nKey}.hero.title`)}
            country={t(`${i18nKey}.hero.country`)}
            image={guide.heroImage}
            imageAlt={t(`${i18nKey}.hero.imageAlt`)}
          />
        </SearchAnchor>

        {/* Desktop: floating stats card overlapping the hero */}
        <div className="hidden lg:block">
          <DestinationQuickStats
            i18nKey={i18nKey}
            stats={guide.stats}
            variant="card"
          />
        </div>

        {/* Mobile: white sheet with tiles + body. Desktop: body on page canvas. */}
        <section className="relative z-10 -mt-12 rounded-t-[28px] bg-background pt-5 pb-12 sm:-mt-16 sm:rounded-t-[32px] sm:pt-6 md:-mt-20 md:pt-8 md:pb-16 lg:mt-0 lg:rounded-none lg:bg-transparent lg:pt-10 lg:pb-20">
          <Container className="flex flex-col gap-10 md:gap-14 lg:gap-14">
            <div className="lg:hidden">
              <DestinationQuickStats
                i18nKey={i18nKey}
                stats={guide.stats}
                variant="tiles"
              />
            </div>

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
        </section>
      </div>
    </main>
  )
}

export default FlightsToDestination
