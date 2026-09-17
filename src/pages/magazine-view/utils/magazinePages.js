import magazineCover from '../../../assets/images/city-sights/magazine-cover.jpg'
import magazineSpreadOne from '../../../assets/images/city-sights/magazine-spread-1.jpg'
import magazineSpreadTwo from '../../../assets/images/city-sights/magazine-spread-2.jpg'
import latestNews from '../../../assets/images/media-center/latest-news.jpg'
import newsGridTwo from '../../../assets/images/media-center/news-grid-2.jpg'
import newsGridThree from '../../../assets/images/media-center/news-grid-3.jpg'
import damascus from '../../../assets/images/our-destenations/damascus.jpeg'
import dubai from '../../../assets/images/our-destenations/dubai.jpg'
import istanbul from '../../../assets/images/our-destenations/istanbul.jpg'
import ph2 from '../../../assets/images/our-destenations/ph2.jpg'

/**
 * Marhaba magazine flipbook pages.
 * Non-translatable image sources live here; labels use `magazineView.pages.{id}`.
 */
export const magazinePages = [
  { id: 'cover', src: magazineCover },
  { id: 'spreadOne', src: magazineSpreadOne },
  { id: 'spreadTwo', src: magazineSpreadTwo },
  { id: 'destinationOne', src: damascus },
  { id: 'destinationTwo', src: dubai },
  { id: 'destinationThree', src: istanbul },
  { id: 'featureOne', src: latestNews },
  { id: 'featureTwo', src: newsGridTwo },
  { id: 'featureThree', src: newsGridThree },
  { id: 'closing', src: ph2 },
]

export const MAGAZINE_PAGE_COUNT = magazinePages.length

/** Static PDF download for the current magazine issue. */
export const MAGAZINE_PDF_URL =
  'https://flycham.com/api/gallery/Sky-Talk-Magazine-August-2025.pdf'

export const MAGAZINE_PDF_FILENAME = 'Sky-Talk-Magazine-August-2025.pdf'
