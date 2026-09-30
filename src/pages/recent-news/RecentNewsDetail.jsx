import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { withLanguage } from '../../i18n/languages.js'
import NewsArticleView from '../news-detail/components/NewsArticleView.jsx'
import { getNewsArticle } from '../news-detail/utils/newsArticles.js'
import { getRecentNewsSlug } from './utils/recentNews.js'

const RecentNewsDetail = () => {
  const { t } = useTranslation()
  const { pagePath } = useLocalizedRoute()
  const language = useCurrentLanguage()
  const article = getNewsArticle(getRecentNewsSlug(pagePath))

  if (!article) {
    return <Navigate to={withLanguage('/media-center/recent-news', language)} replace />
  }

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('recentNews.breadcrumb'), href: '/media-center/recent-news' },
    { label: t(`newsDetail.articles.${article.id}.title`) },
  ]

  return <NewsArticleView article={article} breadcrumbs={breadcrumbs} />
}

export default RecentNewsDetail
