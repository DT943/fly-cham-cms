import newsOne from '../../../assets/images/media-center/latest-news.jpg'
import newsTwo from '../../../assets/images/media-center/news-grid-2.jpg'
import newsThree from '../../../assets/images/media-center/news-grid-3.jpg'
import newsFour from '../../../assets/images/our-destenations/damascus.jpeg'
import newsFive from '../../../assets/images/our-destenations/istanbul.jpg'
import newsSix from '../../../assets/images/our-destenations/dubai.jpg'
import { getNewsDetailHref } from '../../news-detail/utils/newsArticles.js'

/**
 * Recent News listing content.
 *
 * Structure:
 * - Non-translatable fields here (image, href, category, dateTime, year, month).
 * - Copy under `recentNews.articles.{id}`.
 * - Topic labels under `recentNews.topics.{topic}`.
 * - Category labels under `recentNews.categories.{category}`.
 */
export const recentNewsTopics = [
  'all',
  'corporate',
  'network',
  'sponsorships',
  'events',
  'customerExperience',
]

export const recentNewsMonths = [
  'all',
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

export const recentNewsYears = ['all', '2025', '2024', '2023']

export const recentNewsArticles = [
  {
    id: 'expansionPlans',
    category: 'network',
    topic: 'network',
    year: 2025,
    month: 'july',
    dateTime: '2025-07-24',
    image: newsOne,
    href: getNewsDetailHref('expansionPlans'),
  },
  {
    id: 'corporateUpdate',
    category: 'corporate',
    topic: 'corporate',
    year: 2025,
    month: 'july',
    dateTime: '2025-07-18',
    image: newsTwo,
    href: getNewsDetailHref('corporateUpdate'),
  },
  {
    id: 'sponsorshipLaunch',
    category: 'sponsorships',
    topic: 'sponsorships',
    year: 2025,
    month: 'june',
    dateTime: '2025-06-12',
    image: newsThree,
    href: getNewsDetailHref('sponsorshipLaunch'),
  },
  {
    id: 'communityEvent',
    category: 'events',
    topic: 'events',
    year: 2025,
    month: 'june',
    dateTime: '2025-06-05',
    image: newsFour,
    href: getNewsDetailHref('communityEvent'),
  },
  {
    id: 'customerExperience',
    category: 'customerExperience',
    topic: 'customerExperience',
    year: 2025,
    month: 'may',
    dateTime: '2025-05-22',
    image: newsFive,
    href: getNewsDetailHref('customerExperience'),
  },
  {
    id: 'routeExpansion',
    category: 'network',
    topic: 'network',
    year: 2025,
    month: 'may',
    dateTime: '2025-05-10',
    image: newsSix,
    href: getNewsDetailHref('routeExpansion'),
  },
]

export const RECENT_NEWS_PAGE_SIZE = 6
