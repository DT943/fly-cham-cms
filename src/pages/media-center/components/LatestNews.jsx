import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { latestNewsArticles } from '../utils/mediaNews.js'
import NewsArticleCard from './NewsArticleCard.jsx'

const LatestNews = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6 md:gap-8">
      <h2 className={`m-0 font-semibold text-primary-1 ${typography.sectionTitle}`}>
        {t('mediaCenter.latestNews.title')}
      </h2>

      <div className="flex flex-col gap-10 md:gap-12">
        {latestNewsArticles.map(({ id, category, dateTime, image, href }) => (
          <NewsArticleCard
            key={id}
            image={image}
            imageAlt={t(`mediaCenter.latestNews.articles.${id}.imageAlt`)}
            date={t(`mediaCenter.latestNews.articles.${id}.date`)}
            dateTime={dateTime}
            category={t(`mediaCenter.latestNews.categories.${category}`)}
            title={t(`mediaCenter.latestNews.articles.${id}.title`)}
            excerpt={t(`mediaCenter.latestNews.articles.${id}.excerpt`)}
            cta={t('mediaCenter.latestNews.readMore')}
            href={href}
          />
        ))}
      </div>
    </section>
  )
}

export default LatestNews
