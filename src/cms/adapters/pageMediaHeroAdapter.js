import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "page-media-hero" block to <PageMediaHero /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to PageMediaHero's own default.
 */
export function pageMediaHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  // `block.style` is already resolved to the active language by BlockRenderer.
  const style = block.style || {}

  return {
    title: content.title,
    subtitle: content.subtitle,
    image: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: content.imageAlt,
    links: mapBacklinks(content.links),
    // CMS pages render blocks inside a max-w-page Container; this hero is a
    // full-bleed section, so break it out to the viewport width.
    fullBleed: true,
    ...pick(style, STYLE_KEYS),
  }
}

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'layout',
  'sectionBg',
  'height',
  'contentWidth',
  'objectPosition',
  'showTitle',
  'showSubtitle',
  'showOverlay',
  'titleColor',
  'subtitleColor',
  'titleFontWeight',
  'subtitleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
