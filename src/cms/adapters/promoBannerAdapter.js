import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Prefer an absolute uploaded URL (CDN) over a seeded relative path. Blocks
 * often keep both: `image.fileUrl` = "/about-us/fleet.jpg" and
 * `imageUrl` = "https://…/fleet.webp" after a CMS upload — picking the
 * nested seed first breaks the public banner.
 */
function pickPromoImageUrl(content = {}) {
  const candidates = [content.imageUrl, content.image?.fileUrl]
    .map((u) => (typeof u === 'string' ? u.trim() : ''))
    .filter(Boolean)
  const absolute = candidates.find((u) => /^(https?:|data:|blob:)/i.test(u))
  return absolute || candidates[0] || ''
}

function pickPromoImageAlt(content = {}) {
  const nested = typeof content.image?.alt === 'string' ? content.image.alt.trim() : ''
  const flat = typeof content.imageAlt === 'string' ? content.imageAlt.trim() : ''
  // Prefer a real description over an upload filename like "fleet.webp".
  if (nested && !/\.(webp|jpe?g|png|gif|svg)$/i.test(nested)) return nested
  if (flat && !/\.(webp|jpe?g|png|gif|svg)$/i.test(flat)) return flat
  return nested || flat || ''
}

/**
 * Map a CMS "promo-banner" block to <PromoBanner /> props.
 *
 * The page builder saves the fields you edit (`buttonLabel`, `buttonHref`).
 * Older seeds also keep `ctaButton`, which can stay on the old page after an
 * edit, so the flat fields win when they are present.
 */
export function promoBannerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  const ctaLabel = content.buttonLabel ?? content.ctaButton?.content
  const ctaHref = content.buttonHref ?? content.ctaButton?.href
  const imageUrl = pickPromoImageUrl(content)

  return {
    title: content.title,
    description: content.description,
    cta: ctaLabel,
    href: resolveCmsHref(ctaHref),
    image: resolveCmsAsset(imageUrl) || undefined,
    imageAlt: pickPromoImageAlt(content),
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
  'showTitle',
  'showDescription',
  'showButton',
  'showSectionBg',
  'showOverlay',
  'sectionBg',
  'sectionPadding',
  'bannerHeight',
  'bannerRadius',
  'objectPosition',
  'overlayColor',
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
