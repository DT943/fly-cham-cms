import { pick, pickContent, pickStyle, resolveCmsAsset, resolveCmsHref } from './pick.js'

/** Prefer flat imageUrl; also accept media-picker shapes left over from Airport Service Cards. */
function resolveItemImage(it) {
  const raw =
    it?.imageUrl ||
    (typeof it?.image === 'string' ? it.image : '') ||
    it?.image?.fileUrl ||
    it?.image?.url ||
    it?.fileUrl ||
    ''
  return resolveCmsAsset(raw) || undefined
}

/**
 * Map a CMS "seat-plan" block to <SeatPlan /> props — a heading and a grid of
 * image-top cards with a title, description and a "Learn More" link.
 *
 * Stores the editor shape: `{ title, description, learnMore, items[], links }`.
 * Empty per-card image URLs render no image (no bundled fallback). Only style keys the CMS provided are forwarded.
 */
export function seatPlanProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = pickStyle(block.style, lang)

  return {
    title: content.title || '',
    description: content.description || '',
    learnMore: content.learnMore || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      image: resolveItemImage(it),
      imageAlt: it?.imageAlt || it?.image?.alt || '',
      title: it?.title || '',
      description: it?.description || '',
      href: resolveCmsHref(it?.href) || '#',
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
  'showDescription',
  'headerAlign',
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
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'learnMoreAlign',
  'cardBg',
  'arrowBadgeBg',
  'arrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
