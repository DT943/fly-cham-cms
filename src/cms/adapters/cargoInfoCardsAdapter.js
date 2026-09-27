import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "cargo-info-cards" block to <CargoInfoCards /> props — a heading
 * and a grid of image-top cards with a footer link row.
 *
 * Stores the editor shape: `{ title, cards[], links }` where each card is
 * `{ id, title, description, cta, href, imageUrl, imageAlt }`. Empty image
 * URLs fall back to the bundled photos (keyed by `id`) in the component.
 * Only style keys the CMS provided are forwarded.
 */
export function cargoInfoCardsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    cards: (Array.isArray(content.cards) ? content.cards : []).map((card) => ({
      id: card?.id || '',
      title: card?.title || '',
      description: card?.description || '',
      cta: card?.cta || '',
      href: resolveCmsHref(card?.href) || '#',
      image: resolveCmsAsset(card?.imageUrl) || undefined,
      imageAlt: card?.imageAlt || '',
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
  'showHeader',
  'columns',
  'cardGap',
  'cardRadius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'cardBg',
  'ctaColor',
  'ctaFontWeight',
  'ctaColorHover',
  'ctaFontWeightHover',
  'arrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
