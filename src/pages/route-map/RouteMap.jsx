import { useTranslation } from 'react-i18next'
import Container from '../../shared/components/Container.jsx'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'
import RouteMapExplorer from './components/RouteMapExplorer.jsx'
import PlacesWorthDiscovering from './components/PlacesWorthDiscovering.jsx'
import PlanJourney from './components/PlanJourney.jsx'

const RouteMap = () => {
  const { t } = useTranslation()

  return (
    <main className="bg-100 w-full">
      {/* The map opens the page, so the title is kept for assistive tech and SEO only. */}
      <h1 className="sr-only">{t('routeMap.hero.title')}</h1>

      <SearchAnchor hit="route-map-explorer">
        <RouteMapExplorer />
      </SearchAnchor>

      <Container className="flex flex-col gap-10 py-8 md:gap-14 md:py-12 lg:gap-14 lg:py-14">
        <PlacesWorthDiscovering />
        <PlanJourney />
      </Container>
    </main>
  )
}

export default RouteMap
