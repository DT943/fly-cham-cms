import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "sights-grid" block to <SightsGrid /> props — a filterable grid of
 * sight cards with category pills. Each item carries an assigned `category` id
 * that the pills filter on. Images come only from
 * the CMS; an empty image renders nothing.
 */
export function sightsGridProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    categories: (Array.isArray(content.categories) ? content.categories : []).map((cat) => ({
      id: cat?.id || '',
      label: cat?.label || '',
      icon: cat?.icon || 'none',
    })),
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      name: it?.name || '',
      location: it?.location || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      tags: Array.isArray(it?.tags) ? it.tags : [],
      category: it?.category || '',
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
