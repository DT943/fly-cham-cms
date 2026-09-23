import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "news-detail-paragraphs" block to <NewsDetailParagraphs />.
 */
export function newsDetailParagraphsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const paragraphs = Array.isArray(content.paragraphs) ? content.paragraphs : []

  return {
    paragraphs: paragraphs.map((p, index) => ({
      id: p?.id || `p-${index}`,
      bold: p?.bold || '',
      text: p?.text || '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'bodyColor',
  'bodyFontWeight',
  'bodyColorHover',
  'bodyFontWeightHover',
  'boldColor',
  'boldFontWeight',
  'boldColorHover',
  'boldFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
