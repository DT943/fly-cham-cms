import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "news-detail-header" block to <NewsDetailHeader />.
 */
export function newsDetailHeaderProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    image: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: content.imageAlt || '',
    date: content.date || '',
    dateTime: content.dateTime || '',
    category: content.category || '',
    title: content.title || '',
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'imageRadius',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'metaColor',
  'metaFontWeight',
  'metaColorHover',
  'metaFontWeightHover',
  'chipText',
  'chipTextFontWeight',
  'chipTextHover',
  'chipTextFontWeightHover',
  'iconColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
