import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'
import termsHero from '../../assets/images/legal/terms-hero.jpg'
import privacyHero from '../../assets/images/legal/privacy-hero.jpg'
import cookiesHero from '../../assets/images/legal/cookies-hero.png'

const COVER_BY_KEY = {
  'legal-terms': termsHero,
  'legal-privacy': privacyHero,
  'legal-cookies': cookiesHero,
}

/**
 * Map a CMS "page-media-hero" block to <PageMediaHero /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to PageMediaHero's own default.
 * - `coverKey` is an optional local fallback used when the CMS image URL is empty
 *   (legal document heroes).
 */
export function pageMediaHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  // `block.style` is already resolved to the active language by BlockRenderer.
  const style = block.style || {}
  const cmsImage =
    resolveCmsAsset(content.imageUrl) ||
    resolveCmsAsset(content.image?.fileUrl) ||
    ''

  return {
    title: content.title,
    subtitle: content.subtitle,
    image: cmsImage || COVER_BY_KEY[content.coverKey] || undefined,
    imageAlt: content.imageAlt || content.image?.alt,
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
