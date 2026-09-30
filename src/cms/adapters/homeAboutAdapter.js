import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "home-about" block to <HomeAbout /> props — header, image cards
 * and a centered CTA.
 *
 * Stores the editor shape: `{ title, subtitle, cards[], ctaLabel, ctaHref, links }`
 * (each card: `{ id, title, description, imageUrl, imageAlt, imagePosition }`).
 * Empty card image URLs render no image (no bundled fallback). Only style keys the CMS provided are forwarded.
 */
export function homeAboutProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    cards: (Array.isArray(content.cards) ? content.cards : []).map((card) => ({
      id: card?.id || '',
      title: card?.title || '',
      description: card?.description || '',
      image: resolveCmsAsset(card?.imageUrl) || undefined,
      imageAlt: card?.imageAlt || '',
      imagePosition: card?.imagePosition || '',
    })),
    ctaLabel: content.ctaLabel || '',
    ctaHref: resolveCmsHref(content.ctaHref) || '/about-us',
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
  'columns',
  'imageRadius',
  'showCta',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'buttonBg',
  'buttonBgHover',
  'buttonText',
  'buttonTextHover',
  'buttonTextFontWeight',
  'buttonTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
