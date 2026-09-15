import latestNewsPhoto from '../../../assets/images/media-center/latest-news.jpg'
import newsGridPhotoOne from '../../../assets/images/media-center/latest-news.jpg'
import newsGridPhotoTwo from '../../../assets/images/media-center/news-grid-2.jpg'
import newsGridPhotoThree from '../../../assets/images/media-center/news-grid-3.jpg'

/**
 * Media Center news content.
 *
 * Structure:
 * - Keep non-translatable fields here (image, href, category, dateTime).
 * - Featured copy: `mediaCenter.latestNews.articles.{id}`.
 * - Grid copy: `mediaCenter.newsGrid.articles.{id}`.
 * - Category labels: `mediaCenter.latestNews.categories.{category}`.
 */
export const latestNewsArticles = [
  {
    id: 'expansionPlans',
    category: 'network',
    dateTime: '2026-03-07',
    image: latestNewsPhoto,
    href: '#',
  },
]

export const newsGridArticles = [
  {
    id: 'expansionPlans',
    category: 'destinations',
    dateTime: '2026-03-07',
    image: newsGridPhotoOne,
    href: '#',
  },
  {
    id: 'newRoutes',
    category: 'network',
    dateTime: '2026-02-18',
    image: newsGridPhotoTwo,
    href: '#',
  },
  {
    id: 'fleetUpdate',
    category: 'company',
    dateTime: '2026-01-24',
    image: newsGridPhotoThree,
    href: '#',
  },
]
