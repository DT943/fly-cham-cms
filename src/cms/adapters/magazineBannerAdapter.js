import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "magazine-banner" block to <MagazineBanner /> props — a promo banner
 * with a magazine cover + two spreads cluster, heading and CTA. Empty images
 * fall back to the app's bundled magazine artwork in the component.
 */
export function magazineBannerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    cta: content.cta || '',
    href: resolveCmsHref(content.ctaHref) || '/magazine-view',
    bg: resolveCmsAsset(content.bgUrl) || undefined,
    cover: resolveCmsAsset(content.coverUrl) || undefined,
    spread1: resolveCmsAsset(content.spread1Url) || undefined,
    spread2: resolveCmsAsset(content.spread2Url) || undefined,
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'bannerBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'buttonBg',
  'buttonHoverBg',
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
