import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "destination-narratives" block to <DestinationNarratives /> props —
 * alternating image + text rows. Each row keeps its own side (`imageFirst`) and
 * title colour/weight. Empty per-row image falls back to the app's bundled photo
 * (keyed by `id`) in the component.
 */
export function destinationNarrativesProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      title: it?.title || '',
      description: it?.description || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      imageFirst: it?.imageFirst !== false,
      titleColor: it?.titleColor || 'primary-800',
      titleFontWeight: it?.titleFontWeight || 'semibold',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'imageRadius',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'bodyColor',
  'bodyFontWeight',
  'bodyColorHover',
  'bodyFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
