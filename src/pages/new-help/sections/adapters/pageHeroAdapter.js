import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "page-hero" block to <PageHero /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to PageHero's own default (nothing is overridden with
 *   `undefined`). This is what keeps the "keep the current/default" behaviour.
 */
export function pageHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  // `block.style` is already resolved to the active language by BlockRenderer.
  const style = block.style || {}

  return {
    title: content.title,
    subtitle: content.subtitle,
    image: resolveCmsAsset(content.imageUrl) || undefined,
    mask: resolveCmsAsset(content.imageMask) || undefined,
    imageAlt: content.imageAlt,
    links: mapBacklinks(content.links),
    // Explicit direction so RTL logical alignment + the mask mirror work even
    // if the global <html dir> hasn't settled when this CMS page renders.
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    ...pick(style, STYLE_KEYS),
  }
}

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'showTitle',
  'showSubtitle',
  'showImage',
  'showMask',
  'imageSide',
  'imageRadius',
  'titleAlign',
  'titleColor',
  'subtitleColor',
  'titleFontWeight',
  'subtitleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'sectionBg',
  'showSectionBg',
  'sectionPadding',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
