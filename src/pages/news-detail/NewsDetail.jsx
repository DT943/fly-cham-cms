import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { withLanguage } from '../../i18n/languages.js'
import MediaNewsletterSignup from '../media-center/components/MediaNewsletterSignup.jsx'
import NewsDetailFigure from './components/NewsDetailFigure.jsx'
import NewsDetailGallery from './components/NewsDetailGallery.jsx'
import NewsDetailHeader from './components/NewsDetailHeader.jsx'
import NewsDetailParagraphs from './components/NewsDetailParagraphs.jsx'
import { getNewsArticle, getNewsArticleId } from './utils/newsArticles.js'

const NewsDetail = () => {
  const { t } = useTranslation()
  const { pagePath } = useLocalizedRoute()
  const language = useCurrentLanguage()
  const articleId = getNewsArticleId(pagePath)
  const article = getNewsArticle(articleId)

  if (!article) {
    return <Navigate to={withLanguage('/media-center', language)} replace />
  }

  const copyPrefix = `newsDetail.articles.${article.id}`
  const title = t(`${copyPrefix}.title`)
  const intro = t(`${copyPrefix}.intro`, { returnObjects: true }) || []
  const afterGallery = t(`${copyPrefix}.afterGallery`, { returnObjects: true }) || []

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('mediaCenter.breadcrumb'), href: '/media-center' },
    { label: t('recentNews.breadcrumb'), href: '/recent-news' },
    { label: title },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="flex min-w-0 items-center justify-between gap-2 pt-5 pb-4 sm:gap-4 md:pt-10 md:pb-6">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <Container className="flex flex-col gap-8 pt-2 md:gap-10 md:pt-4">
        <NewsDetailHeader
          image={article.heroImage}
          imageAlt={t(`${copyPrefix}.heroImageAlt`)}
          date={t(`${copyPrefix}.date`)}
          dateTime={article.dateTime}
          category={t(`newsDetail.categories.${article.category}`)}
          title={title}
        />

        <NewsDetailParagraphs paragraphs={intro} />

        <NewsDetailGallery
          images={article.galleryImages}
          altPrefix={t(`${copyPrefix}.galleryAltPrefix`)}
        />

        <NewsDetailParagraphs paragraphs={afterGallery} />

        <NewsDetailFigure
          image={article.inlineImage}
          imageAlt={t(`${copyPrefix}.inlineImageAlt`)}
        />
      </Container>

      <MediaNewsletterSignup layout="fullBleed" />
    </main>
  )
}

export default NewsDetail
