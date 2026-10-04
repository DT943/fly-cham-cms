import { Navigate } from 'react-router-dom'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { withLanguage } from '../../i18n/languages.js'
import { getNewsArticle, getNewsDetailHref } from '../news-detail/utils/newsArticles.js'
import { getRecentNewsSlug } from './utils/recentNews.js'

/** Legacy /recent-news/<id> → the article's CMS page at /media-center/news/<id>. */
const RecentNewsDetail = () => {
  const { pagePath } = useLocalizedRoute()
  const language = useCurrentLanguage()
  const article = getNewsArticle(getRecentNewsSlug(pagePath))
  const target = article ? getNewsDetailHref(article.id) : '/media-center/recent-news'

  return <Navigate to={withLanguage(target, language)} replace />
}

export default RecentNewsDetail
