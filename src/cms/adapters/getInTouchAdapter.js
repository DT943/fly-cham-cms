import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "get-in-touch" block to <GetInTouch /> props.
 *
 * `contained` is false so CMS pages keep using their own block gap
 * instead of the static-page bottom margin. The band is full-bleed via
 * the section registry (`fullBleed: true`).
 */
export function getInTouchProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    label: content.label,
    phoneDisplay: content.phoneDisplay,
    phoneHref: content.phoneHref,
    hours: content.hours,
    note: content.note,
    image: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: content.imageAlt,
    contained: false,
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
  'showNote',
  'noteColor',
  'showHours',
  'showImage',
  'showLabel',
  'showPhone',
  'showTitle',
  'hoursColor',
  'labelColor',
  'phoneColor',
  'titleColor',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'phoneFontWeight',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'labelColorHover',
  'labelFontWeightHover',
  'phoneColorHover',
  'phoneFontWeightHover',
  'hoursColorHover',
  'hoursFontWeightHover',
  'noteColorHover',
  'noteFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
