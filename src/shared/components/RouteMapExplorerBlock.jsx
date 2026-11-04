import { Suspense, lazy } from 'react'
import SearchAnchor from '../search/components/SearchAnchor.jsx'

const RouteMapExplorer = lazy(
  () => import('../../pages/route-map/components/RouteMapExplorer.jsx'),
)

/**
 * CMS block "route-map-explorer": interactive route map only.
 *
 * Breadcrumbs + title/description come from the page's CMS blocks
 * (`breadcrumbs`, `page-intro`). This block only mounts the map and its
 * overlays (search fields, destination card) — those stay page-aligned via
 * `LOGO_CONTENT_INSET_CLASS` inside RouteMapExplorer.
 */
const RouteMapExplorerBlock = ({
  planeUrl = '',
  cityImages = {},
  cityImageAlts = {},
}) => (
  <div className="w-full pb-8 md:pb-12">
    <SearchAnchor hit="route-map-explorer" className="block w-full">
      <Suspense
        fallback={
          <div className="mx-auto h-[min(70dvh,44rem)] min-h-112 w-full max-w-[min(100%,90rem)] rounded-2xl bg-100 px-4 lg:h-[min(75dvh,52rem)]" />
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
)

export default RouteMapExplorerBlock
