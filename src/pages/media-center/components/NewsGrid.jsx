import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { newsGridArticles } from '../utils/mediaNews.js'
import NewsGridCard from './NewsGridCard.jsx'

const NewsGrid = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-2 md:gap-3">
        <h2 className={`m-0 font-semibold text-primary-1 ${typography.sectionTitle}`}>
          {t('mediaCenter.newsGrid.title')}
        </h2>
        <p className={`m-0 font-normal leading-relaxed text-700 ${typography.sectionDescription}`}>
          {t('mediaCenter.newsGrid.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {newsGridArticles.map(({ id, category, dateTime, image, href }) => (
          <NewsGridCard
            key={id}
            image={image}
            imageAlt={t(`mediaCenter.newsGrid.articles.${id}.imageAlt`)}
            date={t(`mediaCenter.newsGrid.articles.${id}.date`)}
            dateTime={dateTime}
            category={t(`mediaCenter.latestNews.categories.${category}`)}
            title={t(`mediaCenter.newsGrid.articles.${id}.title`)}
            excerpt={t(`mediaCenter.newsGrid.articles.${id}.excerpt`)}
            cta={t('mediaCenter.newsGrid.learnMore')}
            href={href}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <LocalizedLink
          href="#"
          className={`${typography.button} font-semibold text-primary-1 bg-background border border-primary-1 hover:bg-100 no-underline rounded-lg px-10 py-3`}
        >
          {t('mediaCenter.newsGrid.viewAll')}
        </LocalizedLink>
      </div>
    </section>
  )
}

export default NewsGrid
