import { pick, pickContent, resolveCmsAsset } from './pick.js'
import {
  MIN_GALLERY_IMAGES,
  NEWS_DETAIL_GALLERY_FALLBACKS,
} from '../../shared/components/NewsDetailGallery.jsx'

/**
 * Map a CMS "news-detail-gallery" block to <NewsDetailGallery />.
 * Empty item URLs fall back to the bundled gallery defaults so the carousel
 * still meets MIN_GALLERY_IMAGES.
 */
export function newsDetailGalleryProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const items = Array.isArray(content.items) ? content.items : []

  const images = items.map((item, index) => {
    const resolved = resolveCmsAsset(item?.imageUrl)
    if (resolved) return resolved
    return NEWS_DETAIL_GALLERY_FALLBACKS[index] || NEWS_DETAIL_GALLERY_FALLBACKS[0]
  })

  // Only pass images when we have enough slides (component hides otherwise).
  const usable = images.length >= MIN_GALLERY_IMAGES ? images : []

  return {
    images: usable,
    altPrefix: content.altPrefix || '',
    prevLabel: content.prevLabel || '',
    nextLabel: content.nextLabel || '',
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'imageRadius',
  'progressTrack',
  'progressFill',
  'prevBg',
  'prevIcon',
  'nextBg',
  'nextIcon',
]
