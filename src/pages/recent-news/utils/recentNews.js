
/** Recent News article detail lives at `/recent-news/{slug}`. */
export const RECENT_NEWS_DETAIL_PATH = /^\/recent-news\/([^/]+)$/

export const getRecentNewsDetailHref = (slug) => `/recent-news/${slug}`

export const getRecentNewsSlug = (path) => path.match(RECENT_NEWS_DETAIL_PATH)?.[1] ?? null

/**
 * Recent News listing content.
 *
 * Structure:
 * - Non-translatable fields here (href, category, dateTime, year, month).
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
    href: getRecentNewsDetailHref('expansionPlans'),
  },
  {
    id: 'corporateUpdate',
    category: 'corporate',
    topic: 'corporate',
    year: 2025,
    month: 'july',
    dateTime: '2025-07-18',
    href: getRecentNewsDetailHref('corporateUpdate'),
  },
  {
    id: 'sponsorshipLaunch',
    category: 'sponsorships',
    topic: 'sponsorships',
    year: 2025,
    month: 'june',
    dateTime: '2025-06-12',
    href: getRecentNewsDetailHref('sponsorshipLaunch'),
  },
  {
    id: 'communityEvent',
    category: 'events',
    topic: 'events',
    year: 2025,
    month: 'june',
    dateTime: '2025-06-05',
    href: getRecentNewsDetailHref('communityEvent'),
  },
  {
    id: 'customerExperience',
    category: 'customerExperience',
    topic: 'customerExperience',
    year: 2025,
    month: 'may',
    dateTime: '2025-05-22',
    href: getRecentNewsDetailHref('customerExperience'),
  },
  {
    id: 'routeExpansion',
    category: 'network',
    topic: 'network',
    year: 2025,
    month: 'may',
    dateTime: '2025-05-10',
    href: getRecentNewsDetailHref('routeExpansion'),
  },
]

export const RECENT_NEWS_PAGE_SIZE = 6
