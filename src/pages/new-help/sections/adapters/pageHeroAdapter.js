/**
 * Map a CMS "page-hero" block to <PageHero /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to PageHero's own default (nothing is overridden with
 *   `undefined`). This is what keeps the "keep the current/default" behaviour.
 */
export function pageHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    // content → PageHero content props (renamed to the component's vocabulary)
    title: content.title,
    subtitle: content.subtitle,
    image: content.imageUrl,
    mask: content.imageMask,
    imageAlt: content.imageAlt,
    // style → forwarded verbatim, but only the keys that exist
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'showTitle',
  'showSubtitle',
  'showImage',
  'showMask',
  'imageSide',
  'imageRadius',
  'titleAlign',
  'titleColor',
  'subtitleColor',
  'titleFontWeight',
  'subtitleFontWeight',
  'sectionBg',
  'showSectionBg',
  'sectionPadding',
]

function pickContent(content, lang) {
  if (!content) return {}
  const keys = Object.keys(content)
  return content[lang] || content[keys[0]] || {}
}

function pick(source, keys) {
  const out = {}
  for (const key of keys) {
    if (source[key] !== undefined) out[key] = source[key]
  }
  return out
}
