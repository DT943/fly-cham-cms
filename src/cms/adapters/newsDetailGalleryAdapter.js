import { pick, pickContent, resolveCmsAsset } from './pick.js'
import { MIN_GALLERY_IMAGES } from '../../shared/components/NewsDetailGallery.jsx'

/**
 * Map a CMS "news-detail-gallery" block to <NewsDetailGallery />.
 * Items with an empty image URL are skipped; the carousel still needs
 * MIN_GALLERY_IMAGES CMS images or it renders nothing.
 */
export function newsDetailGalleryProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const items = Array.isArray(content.items) ? content.items : []

  const slides = items
    .map((item) => ({ src: resolveCmsAsset(item?.imageUrl), alt: item?.imageAlt || '' }))
    .filter((slide) => slide.src)

  // Only pass images when we have enough slides (component hides otherwise).
  const usable = slides.length >= MIN_GALLERY_IMAGES ? slides : []

  return {
    images: usable.map((slide) => slide.src),
    // Each photo's media-library alt (aligned with images).
    alts: usable.map((slide) => slide.alt),
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
