import latestNewsPhoto from '../../../assets/images/media-center/latest-news.jpg'
import newsGridPhotoTwo from '../../../assets/images/media-center/news-grid-2.jpg'
import newsGridPhotoThree from '../../../assets/images/media-center/news-grid-3.jpg'
import damascusPhoto from '../../../assets/images/our-destenations/damascus.jpeg'
import istanbulPhoto from '../../../assets/images/our-destenations/istanbul.jpg'
import dubaiPhoto from '../../../assets/images/our-destenations/dubai.jpg'
import ph2Photo from '../../../assets/images/our-destenations/ph2.jpg'
import newsVideo from '../../../assets/videos/news-expansion.mp4'
import newsVideoPoster from '../../../assets/images/recent-news/news-video-poster.jpg'

export const NEWS_DETAIL_PATH = /^\/media-center\/news\/([^/]+)$/

export const MIN_GALLERY_IMAGES = 3

/**
 * News detail page content.
 *
 * Structure:
 * - Non-translatable fields here (images, category, dateTime).
 * - Copy under `newsDetail.articles.{id}`.
 * - Category labels under `newsDetail.categories.{category}`.
 *
 * The closing figure is a looping video (`video` + `videoPoster`); values are
 * shared defaults applied by `withDefaultMedia` and can be overridden per article.
 */
const withDefaultMedia = (articles) =>
  articles.map((article) => ({ video: newsVideo, videoPoster: newsVideoPoster, ...article }))

export const newsArticles = withDefaultMedia([
  {
    id: 'expansionPlans',
    category: 'events',
    dateTime: '2025-07-24',
    heroImage: latestNewsPhoto,
    inlineImage: ph2Photo,
    galleryImages: [latestNewsPhoto, newsGridPhotoTwo, newsGridPhotoThree],
  },
  {
    id: 'newRoutes',
    category: 'network',
    dateTime: '2026-02-18',
    heroImage: newsGridPhotoTwo,
    inlineImage: istanbulPhoto,
    galleryImages: [newsGridPhotoTwo, latestNewsPhoto, dubaiPhoto],
  },
  {
    id: 'fleetUpdate',
    category: 'company',
    dateTime: '2026-01-24',
    heroImage: newsGridPhotoThree,
    inlineImage: damascusPhoto,
    galleryImages: [newsGridPhotoThree, newsGridPhotoTwo, latestNewsPhoto],
  },
  {
    id: 'corporateUpdate',
    category: 'corporate',
    dateTime: '2025-07-18',
    heroImage: newsGridPhotoTwo,
    inlineImage: dubaiPhoto,
    galleryImages: [newsGridPhotoTwo, damascusPhoto, latestNewsPhoto],
  },
  {
    id: 'sponsorshipLaunch',
    category: 'sponsorships',
    dateTime: '2025-06-12',
    heroImage: newsGridPhotoThree,
    inlineImage: istanbulPhoto,
    galleryImages: [newsGridPhotoThree, dubaiPhoto, newsGridPhotoTwo],
  },
  {
    id: 'communityEvent',
    category: 'events',
    dateTime: '2025-06-05',
    heroImage: damascusPhoto,
    inlineImage: ph2Photo,
    galleryImages: [damascusPhoto, latestNewsPhoto, newsGridPhotoThree],
  },
  {
    id: 'customerExperience',
    category: 'customerExperience',
    dateTime: '2025-05-22',
    heroImage: istanbulPhoto,
    inlineImage: newsGridPhotoTwo,
    galleryImages: [istanbulPhoto, newsGridPhotoThree, latestNewsPhoto],
  },
  {
    id: 'routeExpansion',
    category: 'network',
    dateTime: '2025-05-10',
    heroImage: dubaiPhoto,
    inlineImage: damascusPhoto,
    galleryImages: [dubaiPhoto, istanbulPhoto, newsGridPhotoTwo],
  },
])

export const getNewsDetailHref = (id) => `/media-center/news/${id}`

export const getNewsArticleId = (path) => {
  const match = path.match(NEWS_DETAIL_PATH)
  return match ? match[1] : null
}

export const getNewsArticle = (id) => newsArticles.find((article) => article.id === id) ?? null
