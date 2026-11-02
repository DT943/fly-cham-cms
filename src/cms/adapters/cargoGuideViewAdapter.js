import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "cargo-guide-view" block to <CargoGuideView /> — title, description,
 * and brochure pages (covers + left/right spread halves).
 */
export function cargoGuideViewProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const pages = Array.isArray(content.pages) ? content.pages : []

  return {
    title: content.title || '',
    description: content.description || '',
    pages: pages
      .map((page) => ({
        id: page?.id || '',
        src: resolveCmsAsset(page?.imageUrl) || '',
        alt: page?.imageAlt || '',
        side: page?.side || undefined,
        hard: Boolean(page?.hard),
      }))
      .filter((page) => page.src),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
