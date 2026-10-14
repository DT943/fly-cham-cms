import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "coming-soon-hero" block to <ComingSoonHero />.
 *
 * Stores the flat editor shape (cms2 getComingSoonHeroEditorContent):
 * `{ title, description, ctaLabel, ctaHref, imageUrl, imageAlt, links }`.
 * Only style keys the CMS provided are forwarded, so omitted keys keep the
 * component's defaults.
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
    ctaLabel: str('ctaLabel'),
    ctaHref: resolveCmsHref(str('ctaHref')) || '/',
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
  'backgroundColor',
  'showButton',
  'showImage',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'buttonBg',
  'buttonBgHover',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
