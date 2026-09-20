import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "destination-hero-stats" block to <DestinationHeroStats /> props —
 * a full-bleed destination hero with an overlapping quick-stats card.
 *
 * - Content is language-scoped (`block.content[lang]`), falling back to the
 *   first available language.
 * - Stores the flat editor shape: `{ title, country, imageUrl, imageAlt,
 *   stats:[{icon,label,value,detail}], links }`. Empty image falls back to the
 *   app's bundled hero in the component.
 */
export function destinationHeroStatsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    country: content.country,
    image: resolveCmsAsset(content.imageUrl ?? content.image?.fileUrl) || undefined,
    imageAlt: content.imageAlt ?? content.image?.alt,
    stats: (Array.isArray(content.stats) ? content.stats : []).map((s) => ({
      icon: s?.icon || 'airTrafficControl',
      label: s?.label || '',
      value: s?.value || '',
      detail: s?.detail || '',
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
  'height',
  'overlayColor',
  'showStats',
  'cardBg',
  'iconColor',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'countryColor',
  'countryFontWeight',
  'countryColorHover',
  'countryFontWeightHover',
  'tileLabelColor',
  'tileValueColor',
  'metaColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
