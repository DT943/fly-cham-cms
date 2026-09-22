import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "journey-stage-next-steps" block to <JourneyStageNextSteps /> props
 * — a 2-up grid of icon + title + description + CTA cards.
 *
 * Stores the editor shape: `{ items[], links }`. Icon names
 * ('airplaneTakeoff', 'headset', …) are passed through and resolved to
 * Phosphor components inside <JourneyStageNextSteps />. Only style keys the
 * CMS provided are forwarded, so omitted keys keep the component's own
 * defaults (the source look).
 */
export function journeyStageNextStepsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      icon: it?.icon || 'airplaneTakeoff',
      title: it?.title || '',
      description: it?.description || '',
      href: resolveCmsHref(it?.href) || '#',
      cta: it?.cta || '',
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
  'columns',
  'cardGap',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'cardBg',
  'cardBorderColor',
  'iconColor',
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
