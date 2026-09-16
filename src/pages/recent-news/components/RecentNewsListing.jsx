import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import {
  RECENT_NEWS_PAGE_SIZE,
  recentNewsArticles,
} from '../utils/recentNews.js'
import RecentNewsCard from './RecentNewsCard.jsx'
import RecentNewsPagination from './RecentNewsPagination.jsx'

const RecentNewsListing = ({ activeTopic, currentPage, onPageChange }) => {
  const { t } = useTranslation()

  const filteredArticles = useMemo(() => {
    if (activeTopic === 'all') return recentNewsArticles
    return recentNewsArticles.filter((article) => article.topic === activeTopic)
  }, [activeTopic])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / RECENT_NEWS_PAGE_SIZE))

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * RECENT_NEWS_PAGE_SIZE
    return filteredArticles.slice(start, start + RECENT_NEWS_PAGE_SIZE)
  }, [currentPage, filteredArticles])

  const articlesByYear = useMemo(() => {
    return paginatedArticles.reduce((groups, article) => {
      const year = String(article.year)
      if (!groups[year]) groups[year] = []
      groups[year].push(article)
      return groups
    }, {})
  }, [paginatedArticles])

  return (
    <section className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-8 md:gap-10">
        {Object.entries(articlesByYear).map(([year, articles]) => (
          <div key={year} className="flex flex-col gap-5 md:gap-6">
            <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>{year}</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {articles.map(({ id, category, dateTime, image, href }) => (
                <RecentNewsCard
                  key={id}
                  image={image}
                  imageAlt={t(`recentNews.articles.${id}.imageAlt`)}
                  date={t(`recentNews.articles.${id}.date`)}
                  dateTime={dateTime}
                  category={t(`recentNews.categories.${category}`)}
                  title={t(`recentNews.articles.${id}.title`)}
                  href={href}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <RecentNewsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        previousLabel={t('recentNews.pagination.previous')}
        nextLabel={t('recentNews.pagination.next')}
      />
    </section>
  )
}

export default RecentNewsListing
