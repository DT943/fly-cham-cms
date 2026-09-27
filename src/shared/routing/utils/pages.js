import Home from '../../../pages/Home.jsx'
import RouteMap from '../../../pages/route-map/RouteMap.jsx'
import MagazineView from '../../../pages/magazine-view/MagazineView.jsx'
import BeforeYouFly from '../../../pages/before-you-fly/BeforeYouFly.jsx'
import ThingsToDoInDamascus from '../../../pages/things-to-do-in-damascus/ThingsToDoInDamascus.jsx'
import FormDetail from '../../../pages/forms/FormDetail.jsx'
import RequestAForm from '../../../pages/forms/RequestAForm.jsx'
import RecentNewsDetail from '../../../pages/recent-news/RecentNewsDetail.jsx'
import TravelUpdateDetail from '../../../pages/travel-updates/TravelUpdateDetail.jsx'
import NewsDetail from '../../../pages/news-detail/NewsDetail.jsx'
import NotFound from '../../../pages/not-found/NotFound.jsx'
import ComingSoon from '../../../pages/coming-soon/ComingSoon.jsx'
import { NEWS_DETAIL_PATH } from '../../../pages/news-detail/utils/newsArticles.js'
import { RECENT_NEWS_DETAIL_PATH } from '../../../pages/recent-news/utils/recentNews.js'
import { TRAVEL_UPDATES_DETAIL_PATH } from '../../../pages/travel-updates/utils/travelUpdates.js'
import {
  getDestinationGuide,
  getDestinationGuideSlug,
} from '../../../pages/things-to-do-in-damascus/utils/destinationGuides.js'
import {
  getJourneyStage,
  getJourneyStageSlug,
} from '../../../pages/before-you-fly/utils/journeyStages.js'
import {
  FormsRedirect,
  LegacyFormDetailRedirect,
  OurGsaRedirect,
  OurOfficesRedirect,
} from '../components/OurOfficesRedirect.jsx'
import { newPages } from './newPages.js'

export { newPages } from './newPages.js'

/**
 * Non-CMS app routes that still use static React pages
 * (home, route map, magazine viewer, journey-stage aliases, legacy redirects).
 */
export const appPages = {
  '/': Home,
  '/our-destinations/route-map': RouteMap,
  '/our-destinations/flights-to-dubai': ThingsToDoInDamascus,
  '/magazine-view': MagazineView,
  // Journey stage pages still use the static BeforeYouFly shell
  '/travel-experience/at-the-airport': BeforeYouFly,
  '/travel-experience/onboard': BeforeYouFly,
  '/travel-experience/after-travel': BeforeYouFly,
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

const formRequestPath = /^\/help\/contact-us\/forms\/([^/]+)\/request$/
const formDetailPath = /^\/help\/contact-us\/forms\/([^/]+)$/
const legacyFormDetailPath = /^\/help\/forms\/([^/]+)$/

export function getPage(path) {
  if (pages[path]) return pages[path]
  if (RECENT_NEWS_DETAIL_PATH.test(path)) return RecentNewsDetail
  if (TRAVEL_UPDATES_DETAIL_PATH.test(path)) return TravelUpdateDetail
  if (NEWS_DETAIL_PATH.test(path)) return NewsDetail
  if (getJourneyStage(getJourneyStageSlug(path))) return BeforeYouFly
  if (getDestinationGuide(getDestinationGuideSlug(path))) return ThingsToDoInDamascus
  if (formRequestPath.test(path)) return RequestAForm
  if (formDetailPath.test(path)) return FormDetail
  if (legacyFormDetailPath.test(path)) return LegacyFormDetailRedirect
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
