import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "seat-journey" block to <SeatJourney /> props — a single image + text
 * row (heading, paragraph, side photo).
 *
 * Stores the editor shape: `{ title, description, imageUrl, imageAlt, links }`.
 * An empty image URL falls back to the app's bundled journey photo in the
 * component. Only style keys the CMS provided are forwarded, so omitted keys keep
 * the component's own defaults (the source look).
 */
export function seatJourneyProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    image: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: content.imageAlt || '',
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
  'imageSide',
  'imageRadius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'bodyColor',
  'bodyFontWeight',
  'bodyColorHover',
  'bodyFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
