import { Suspense, lazy } from 'react'
import SearchAnchor from '../search/components/SearchAnchor.jsx'

// The map (Leaflet + MapLibre) is heavy — load it only when the block renders.
const RouteMapExplorer = lazy(
  () => import('../../pages/route-map/components/RouteMapExplorer.jsx'),
)

/**
 * CMS block "route-map-explorer": the full-screen interactive route map that
 * fills /our-destinations/route-map. The page <main> (see newPages.js) sets the
 * viewport height; this block fills it.
 *
 * The map opens the page, so the title is kept for assistive tech and SEO only.
 */
const RouteMapExplorerBlock = ({ title = '', planeUrl = '', cityImages = {} }) => (
  <div className="relative h-full min-h-0 w-full flex-1">
    {title && <h1 className="sr-only">{title}</h1>}

    <SearchAnchor hit="route-map-explorer" className="block h-full w-full">
      <Suspense fallback={<div className="h-full w-full bg-100" />}>
        <RouteMapExplorer planeUrl={planeUrl} cityImages={cityImages} />
      </Suspense>
    </SearchAnchor>
  </div>
)

export default RouteMapExplorerBlock
