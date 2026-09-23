import { pick, pickContent, resolveCmsAsset } from './pick.js'

/**
 * Map a CMS "news-detail-figure" block to <NewsDetailFigure />.
 */
export function newsDetailFigureProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    image: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: content.imageAlt || '',
    video: resolveCmsAsset(content.videoUrl) || undefined,
    poster: resolveCmsAsset(content.posterUrl) || undefined,
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = ['imageRadius']
