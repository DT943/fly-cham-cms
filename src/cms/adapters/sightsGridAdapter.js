import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "sights-grid" block to <SightsGrid /> props — a filterable grid of
 * sight cards with category pills. Each item carries an assigned `category`
 * slug that the pills filter on; the pills themselves come from the
 * destination_categories table (SightsGrid loads them). Images come only from
 * the CMS; an empty image renders nothing.
 */
export function sightsGridProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      name: it?.name || '',
      location: it?.location || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      tags: Array.isArray(it?.tags) ? it.tags : [],
      category: it?.category || '',
      href: resolveCmsHref(it?.href) || '',
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
  'columns',
  'cardGap',
  'cardRadius',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
