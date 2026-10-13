import { pick, pickContent, resolveCmsHref } from './pick.js'

/** Same rule as the cms2 Travel Updates Advisory helper. */
function renderedLine(label, text, linkLabel) {
  const body = `${text || ''}${linkLabel || ''}`
  if (label && body) return `${label} ${body}`
  return `${label || ''}${body}`
}

function repairTextAfter(label, text, linkLabel, textAfter) {
  const after = textAfter || ''
  const line = renderedLine(label, text, linkLabel)
  if (!after || !line) return after
  if (after.startsWith(line)) return ''
  return after
}

/**
 * Map a CMS "travel-updates-advisory" block to <TravelUpdatesAdvisory /> props —
 * the Travel Updates "Latest Advisories" header + advisory card.
 *
 * Stores the flat editor shape:
 * `{ title, subtitle, date, heading, description,
 *    items[{ id, label, text, linkLabel, linkHref, textAfter,
 *            bullets[{ id, text, linkLabel, linkHref, textAfter }] }],
 *    learnMoreLabel, learnMoreHref, links }`.
 * Only style keys the CMS provided are forwarded, so omitted keys keep the
 * component's own defaults (the Figma look).
 */
export function travelUpdatesAdvisoryProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    date: content.date || '',
    heading: content.heading || '',
    description: content.description || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      label: it?.label || '',
      text: it?.text || '',
      linkLabel: it?.linkLabel || '',
      linkHref: resolveCmsHref(it?.linkHref),
      textAfter: repairTextAfter(it?.label, it?.text, it?.linkLabel, it?.textAfter),
      bullets: (Array.isArray(it?.bullets) ? it.bullets : []).map((b) => ({
        id: b?.id || '',
        text: b?.text || '',
        linkLabel: b?.linkLabel || '',
        linkHref: resolveCmsHref(b?.linkHref),
        textAfter: repairTextAfter('', b?.text, b?.linkLabel, b?.textAfter),
      })),
    })),
    learnMoreLabel: content.learnMoreLabel || '',
    learnMoreHref: resolveCmsHref(content.learnMoreHref),
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
  'showLearnMore',
  'sectionPadding',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardBg',
  'badgeBg',
  'badgeText',
  'badgeTextFontWeight',
  'badgeTextHover',
  'badgeTextFontWeightHover',
  'headingColor',
  'headingFontWeight',
  'headingColorHover',
  'headingFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'labelColor',
  'labelFontWeight',
  'labelColorHover',
  'labelFontWeightHover',
  'bodyColor',
  'bodyFontWeight',
  'bodyColorHover',
  'bodyFontWeightHover',
  'ctaColor',
  'ctaFontWeight',
  'ctaColorHover',
  'ctaFontWeightHover',
  'checkIconColor',
  'bulletDotColor',
  'learnMoreColor',
  'learnMoreFontWeight',
  'learnMoreColorHover',
  'learnMoreFontWeightHover',
  'learnMoreCircleBg',
  'learnMoreArrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
