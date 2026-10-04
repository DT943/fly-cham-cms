import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "coming-soon-hero" block to <ComingSoonHero /> props — the whole
 * /coming-soon page (photo, wash, title, description).
 *
 * Stores the flat editor shape (cms2 getComingSoonHeroEditorContent):
 * `{ imageUrl, imageAlt, title, description, links }`. The image comes only
 * from the CMS (no bundled fallback). Only style keys the CMS provided are
 * forwarded, so omitted keys keep the component's defaults (the source look).
 */
export function comingSoonHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const str = (key) => (typeof content[key] === 'string' ? content[key] : '')

  return {
    imageUrl: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: str('imageAlt'),
    title: str('title'),
    description: str('description'),
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
  'overlayColor',
  'overlayOpacity',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'descriptionOpacity',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
