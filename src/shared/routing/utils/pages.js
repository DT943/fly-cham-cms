import FormDetail from '../../../pages/forms/FormDetail.jsx'
import RequestAForm from '../../../pages/forms/RequestAForm.jsx'
import RecentNewsDetail from '../../../pages/recent-news/RecentNewsDetail.jsx'
import TravelUpdateDetail from '../../../pages/travel-updates/TravelUpdateDetail.jsx'
import NewsDetail from '../../../pages/news-detail/NewsDetail.jsx'
import BeforeYouFly from '../../../pages/before-you-fly/BeforeYouFly.jsx'
import ThingsToDoInDamascus from '../../../pages/things-to-do-in-damascus/ThingsToDoInDamascus.jsx'
import NotFound from '../../../pages/not-found/NotFound.jsx'
import ComingSoon from '../../../pages/coming-soon/ComingSoon.jsx'
import { NEWS_DETAIL_PATH } from '../../../pages/news-detail/utils/newsArticles.js'
import { RECENT_NEWS_DETAIL_PATH } from '../../../pages/recent-news/utils/recentNews.js'
import { TRAVEL_UPDATES_DETAIL_PATH } from '../../../pages/travel-updates/utils/travelUpdates.js'
import { getDestinationGuide, getDestinationGuideSlug } from '../../../pages/things-to-do-in-damascus/utils/destinationGuides.js'
import { getJourneyStage, getJourneyStageSlug } from '../../../pages/before-you-fly/utils/journeyStages.js'
import { LegacyFormDetailRedirect } from '../components/OurOfficesRedirect.jsx'
import { staticPages } from './staticPages.js'
import { newPages } from './newPages.js'

export { staticPages } from './staticPages.js'
export { newPages } from './newPages.js'

export const pages = {
  ...staticPages,
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
