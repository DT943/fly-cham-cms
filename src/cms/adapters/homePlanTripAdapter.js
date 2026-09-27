import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "home-plan-trip" block to <HomePlanTrip /> props — the home
 * "Plan Your Trip With Us" header + destination slider.
 *
 * Stores the editor shape: `{ title, subtitle, viewAllLabel, viewAllHref,
 * newLabel, priceLabel, items[{ id, name, imageUrl, imageAlt, href, isNew,
 * price, currency }], links }`. Empty image URLs fall back to the bundled
 * photos (keyed by `id`) in the component. Only style keys the CMS provided are
 * forwarded, so omitted keys keep the component's own defaults (the source look).
 */
export function homePlanTripProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    viewAllLabel: content.viewAllLabel || '',
    viewAllHref: resolveCmsHref(content.viewAllHref) || '/our-destinations',
    newLabel: content.newLabel || '',
    priceLabel: content.priceLabel || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      name: it?.name || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      href: resolveCmsHref(it?.href) || '#',
      isNew: it?.isNew === true,
      price: it?.price === null || it?.price === undefined ? '' : String(it.price),
      currency: it?.currency || '',
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
  'showSubtitle',
  'showViewAll',
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
  'ctaColor',
  'ctaFontWeight',
  'ctaColorHover',
  'ctaFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'badgeBg',
  'badgeText',
  'badgeTextFontWeight',
  'badgeTextHover',
  'badgeTextFontWeightHover',
  'arrowBg',
  'arrowBgHover',
  'arrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
