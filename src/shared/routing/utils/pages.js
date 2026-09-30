import RouteMap from '../../../pages/route-map/RouteMap.jsx'
import ThingsToDoInDamascus from '../../../pages/things-to-do-in-damascus/ThingsToDoInDamascus.jsx'
import FormDetail from '../../../pages/forms/FormDetail.jsx'
import RecentNewsDetail from '../../../pages/recent-news/RecentNewsDetail.jsx'
import TravelUpdateDetail from '../../../pages/travel-updates/TravelUpdateDetail.jsx'
import NewsDetail from '../../../pages/news-detail/NewsDetail.jsx'
import NotFound from '../../../pages/not-found/NotFound.jsx'
import ComingSoon from '../../../pages/coming-soon/ComingSoon.jsx'
import ChamMiles from '../../../pages/cham-miles/ChamMiles.jsx'
import DynamicPage from '../../../pages/dynamic-page/DynamicPage.jsx'
import { cmsSlugFromPath } from '../../../pages/dynamic-page/cmsPagePath.js'
import { NEWS_DETAIL_PATH } from '../../../pages/news-detail/utils/newsArticles.js'
import { RECENT_NEWS_DETAIL_PATH } from '../../../pages/recent-news/utils/recentNews.js'
import {
  TRAVEL_UPDATE_CMS_PREFIX,
  TRAVEL_UPDATES_DETAIL_PATH,
} from '../../../pages/travel-updates/utils/travelUpdates.js'
import {
  getDestinationGuide,
  getDestinationGuideSlug,
} from '../../../pages/things-to-do-in-damascus/utils/destinationGuides.js'
import {
  FormRequestRedirect,
  FormsRedirect,
  LegacyFormDetailRedirect,
  OurGsaRedirect,
  OurOfficesRedirect,
} from '../components/OurOfficesRedirect.jsx'
import { newPages } from './newPages.js'

export { newPages } from './newPages.js'

/**
 * Non-CMS app routes that still use static React pages
 * (route map, legacy redirects).
 * The home page `/` is CMS-driven (see newPages.js → dynamicPage('home')).
 */
export const appPages = {
  '/cham-miles': ChamMiles,
  '/our-destinations/route-map': RouteMap,
  // Legacy help path aliases → official `/help/contact-us/...`
  '/help/our-gsa': OurGsaRedirect,
  '/help/forms': FormsRedirect,
  '/help/our-offices': OurOfficesRedirect,
}

export const pages = {
  ...appPages,
  ...newPages,
  '/404': NotFound,
  '/coming-soon': ComingSoon,
}

/**
 * Last segments of nested static routes (`/help/faqs` → `faqs`). Those CMS
 * pages already have their official nested URL, so the root catch-all must not
 * serve a duplicate at `/faqs`.
 */
const nestedRouteSlugs = new Set([
  ...Object.keys(pages)
    .map((path) => path.split('/').filter(Boolean))
    .filter((segments) => segments.length > 1)
    .map((segments) => segments[segments.length - 1]),
])

const formRequestPath = /^\/help\/contact-us\/forms\/([^/]+)\/request$/
const formDetailPath = /^\/help\/contact-us\/forms\/([^/]+)$/
const legacyFormDetailPath = /^\/help\/forms\/([^/]+)$/

export function getPage(path) {
  if (pages[path]) return pages[path]
  if (RECENT_NEWS_DETAIL_PATH.test(path)) return RecentNewsDetail
  if (TRAVEL_UPDATES_DETAIL_PATH.test(path)) return TravelUpdateDetail
  if (NEWS_DETAIL_PATH.test(path)) return NewsDetail
  if (getDestinationGuide(getDestinationGuideSlug(path))) return ThingsToDoInDamascus
  if (formRequestPath.test(path)) return FormRequestRedirect
  if (formDetailPath.test(path)) return FormDetail
  if (legacyFormDetailPath.test(path)) return LegacyFormDetailRedirect
  // Any other single-segment URL may be a page created in the CMS admin
  // ("Add new page"); DynamicPage (no fixed slug) reads the slug from the URL
  // and renders NotFound when it's unknown.
  const cmsSlug = cmsSlugFromPath(path)
  // Travel update pages live at /travel-updates/<id>, never at the root.
  if (
    cmsSlug &&
    !nestedRouteSlugs.has(cmsSlug) &&
    !cmsSlug.startsWith(TRAVEL_UPDATE_CMS_PREFIX)
  ) {
    return DynamicPage
  }
  return NotFound
}

/** True for the explicit /404 route or any path that falls through to NotFound. */
export function isNotFoundPath(path) {
  if (path === '/404') return true
  if (pages[path]) return false
  return getPage(path) === NotFound
}

/** Full-bleed hero pages that use a dark header over media. */
export function isFullBleedPath(path) {
  return path === '/coming-soon' || isNotFoundPath(path)
}
