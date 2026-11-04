import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import SearchAnchor from '../search/components/SearchAnchor.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'
import Container from './Container.jsx'
import { typography } from '../../styles/typography.js'

const RouteMapExplorer = lazy(
  () => import('../../pages/route-map/components/RouteMapExplorer.jsx'),
)

/**
 * CMS block "route-map-explorer": breadcrumbs, page intro, and the interactive
 * route map card for /our-destinations/route-map.
 */
const RouteMapExplorerBlock = ({
  title = '',
  description = '',
  planeUrl = '',
  cityImages = {},
  cityImageAlts = {},
}) => {
  const { t } = useTranslation()
  // Visible hero follows the designed copy; CMS `title` stays available to AT/SEO.
  const heading = t('routeMap.hero.title')
  const subtitle = description || t('routeMap.hero.description')
  const documentTitle = title || heading

  const crumbs = [
    { href: '/', label: t('common.home') },
    { href: '/our-destinations', label: t('routeMap.whereWeFly') },
    { href: '', label: t('routeMap.breadcrumb') },
  ]

  return (
    <div className="flex w-full flex-col gap-4 pb-8 md:gap-6 md:pb-12">
      <Breadcrumbs items={crumbs} />

      <Container className="flex flex-col gap-2 md:gap-3">
        <header className="flex flex-col gap-2">
          <h1 className={`m-0 font-bold text-secondary-2 ${typography.pageTitle}`}>
            {heading}
          </h1>
          {documentTitle !== heading ? (
            <span className="sr-only">{documentTitle}</span>
          ) : null}
          {subtitle ? (
            <p className="m-0 max-w-3xl text-base text-700 md:text-lg">{subtitle}</p>
          ) : null}
        </header>
      </Container>

      {/* Wider than the page container on large screens so the map can breathe. */}
      <div className="mx-auto w-full max-w-[min(100%,90rem)] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <SearchAnchor hit="route-map-explorer" className="block w-full">
          <Suspense
            fallback={
              <div className="h-[min(70dvh,44rem)] min-h-112 w-full rounded-2xl bg-100 lg:h-[min(75dvh,52rem)]" />
            }
          >
            <RouteMapExplorer
              planeUrl={planeUrl}
              cityImages={cityImages}
              cityImageAlts={cityImageAlts}
            />
          </Suspense>
        </SearchAnchor>
      </div>
    </div>
  )
}

export default RouteMapExplorerBlock
