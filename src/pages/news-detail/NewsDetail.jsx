import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { withLanguage } from '../../i18n/languages.js'
import NewsArticleView from './components/NewsArticleView.jsx'
import { getNewsArticle, getNewsArticleId } from './utils/newsArticles.js'

const NewsDetail = () => {
  const { t } = useTranslation()
  const { pagePath } = useLocalizedRoute()
  const language = useCurrentLanguage()
  const article = getNewsArticle(getNewsArticleId(pagePath))

  if (!article) {
    return <Navigate to={withLanguage('/media-center', language)} replace />
  }

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('mediaCenter.breadcrumb'), href: '/media-center' },
    { label: t('recentNews.breadcrumb'), href: '/recent-news' },
    { label: t(`newsDetail.articles.${article.id}.title`) },
  ]

  return <NewsArticleView article={article} breadcrumbs={breadcrumbs} />
}

export default NewsDetail
