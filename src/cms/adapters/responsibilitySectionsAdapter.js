import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "responsibility-sections" block to <ResponsibilitySections /> props —
 * alternating image + text rows (title + paragraph beside a photo).
 *
 * Stores the editor shape: `{ items[], links }`. Empty per-row image URLs fall
 * back to the app's bundled photos (keyed by `id`) in the component. Only style
 * keys the CMS provided are forwarded.
 */
export function responsibilitySectionsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      title: it?.title || '',
      description: it?.description || '',
      imageFirst: it?.imageFirst !== false,
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
  'rowGap',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
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
