import { pickContent, resolveCmsAsset } from './pick.js'
import { routeAirports } from '../../pages/route-map/utils/routeNetwork.js'

/** Every city on the network (e.g. damascus, abuDhabi, aleppo). */
const CITY_KEYS = [...new Set(routeAirports.map((airport) => airport.cityKey))]

/** Stored content key for a city's destination photo (`damascusImage`, …). */
export const cityImageKey = (cityKey) => `${cityKey}Image`

/**
 * Map a CMS "route-map-explorer" block to <RouteMapExplorerBlock /> props — the
 * full-screen interactive route map of /our-destinations/route-map.
 *
 * Stores the flat editor shape (cms2 getRouteMapExplorerEditorContent):
 * `title` (sr-only page heading), `planeUrl` (flying-plane marker) and one
 * `<cityKey>Image` URL per city. Images come only from the CMS: an empty plane
 * URL draws no plane, an empty city photo shows the card's branded header.
 */
export function routeMapExplorerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const str = (key) => (typeof content[key] === 'string' ? content[key] : '')

  const cityImages = {}
  CITY_KEYS.forEach((cityKey) => {
    const url = resolveCmsAsset(str(cityImageKey(cityKey)))
    if (url) cityImages[cityKey] = url
  })

  return {
    title: str('title'),
    planeUrl: resolveCmsAsset(str('planeUrl')),
    cityImages,
  }
}
