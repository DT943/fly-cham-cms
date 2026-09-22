import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../../shared/components/Breadcrumbs.jsx'
import Container from '../../../shared/components/Container.jsx'
import MediaNewsletterSignup from '../../media-center/components/MediaNewsletterSignup.jsx'
import NewsDetailFigure from './NewsDetailFigure.jsx'
import NewsDetailGallery from './NewsDetailGallery.jsx'
import NewsDetailHeader from './NewsDetailHeader.jsx'
import NewsDetailParagraphs from './NewsDetailParagraphs.jsx'

/**
 * Shared news article layout: hero + meta header, intro copy, gallery carousel,
 * closing copy, inline figure, and the newsletter sign-up.
 *
 * Reused by both news detail routes — the article's copy lives under
 * `newsDetail.articles.{id}`; only the breadcrumb trail differs per entry point.
 */
const NewsArticleView = ({ article, breadcrumbs }) => {
  const { t } = useTranslation()
  const copyPrefix = `newsDetail.articles.${article.id}`
  const intro = t(`${copyPrefix}.intro`, { returnObjects: true }) || []
  const afterGallery = t(`${copyPrefix}.afterGallery`, { returnObjects: true }) || []

  return (
    <main className="bg-100 w-full overflow-x-clip pb-12 md:pb-16">
      <Container className="min-w-0 pt-5 pb-4 md:pt-10 md:pb-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <Container className="flex flex-col gap-8 pt-2 md:gap-10 md:pt-4">
        <NewsDetailHeader
          image={article.heroImage}
          imageAlt={t(`${copyPrefix}.heroImageAlt`)}
          date={t(`${copyPrefix}.date`)}
          dateTime={article.dateTime}
          category={t(`newsDetail.categories.${article.category}`)}
          title={t(`${copyPrefix}.title`)}
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
          video={article.video}
          poster={article.videoPoster}
        />
      </Container>

      <MediaNewsletterSignup layout="fullBleed" />
    </main>
  )
}

export default NewsArticleView
