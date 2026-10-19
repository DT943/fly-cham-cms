import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/** Same cms-media default as flychamadmin SeatJourney constants. */
export const SEAT_JOURNEY_DEFAULT_IMAGE =
  'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/seat-selection/journey.webp'

/**
 * Map a CMS "seat-journey" block to <SeatJourney /> props — a single image + text
 * row (heading, paragraph, side photo).
 *
 * Stores the editor shape: `{ title, description, imageUrl, imageAlt, buttonLabel, buttonHref, links }`.
 * An empty image URL uses the bucket default so the public site matches admin
 * preview. Only style keys the CMS provided are forwarded.
 */
export function seatJourneyProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    image:
      resolveCmsAsset(content.imageUrl) || SEAT_JOURNEY_DEFAULT_IMAGE,
    imageAlt: content.imageAlt || '',
    buttonLabel: content.buttonLabel || '',
    buttonHref: resolveCmsHref(content.buttonHref) || '',
    buttonIcon: content.buttonIcon || '',
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
  'imageSide',
  'contentAlign',
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
  'showButton',
  'showButtonIcon',
  'buttonSize',
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
