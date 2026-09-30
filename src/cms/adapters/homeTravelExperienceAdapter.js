import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "home-travel-experience" block to <HomeTravelExperience /> props.
 *
 * Stores the flat editor shape:
 * `{ title, subtitle, exploreLabel, exploreHref, learnMoreLabel,
 *    cards: [{ id, title, description, imageUrl, imageAlt, href }], links }`
 * (cards[0] is the featured desktop card). Images come only from the CMS; an
 * empty image URL renders nothing. Only style keys the CMS provided are forwarded, so omitted keys keep the component defaults.
 */
export function homeTravelExperienceProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    exploreLabel: content.exploreLabel || '',
    exploreHref: resolveCmsHref(content.exploreHref) || '#',
    learnMoreLabel: content.learnMoreLabel || '',
    cards: (Array.isArray(content.cards) ? content.cards : []).map((card) => ({
      id: card?.id || '',
      title: card?.title || '',
      description: card?.description || '',
      image: resolveCmsAsset(card?.imageUrl) || undefined,
      imageAlt: card?.imageAlt || '',
      href: resolveCmsHref(card?.href) || '#',
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
  'cardBg',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'learnMoreColor',
  'learnMoreFontWeight',
  'learnMoreColorHover',
  'learnMoreFontWeightHover',
  'arrowBadgeBg',
  'arrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
