import { resolveJourneyStepIcon } from '../../pages/help/utils/journeySteps.js'
import { pick, pickContent, resolveCmsHref } from './pick.js'

function parseLinksText(linksText) {
  if (Array.isArray(linksText)) {
    return linksText
      .map((item) => (typeof item === 'string' ? { text: item } : item))
      .filter((item) => item?.text)
  }
  if (!linksText) return []
  return String(linksText)
    .split('\n')
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ text }))
}

/**
 * Map a CMS "journey-section" block to <JourneySection /> props.
 */
export function journeySectionProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    subtitle: content.subtitle,
    steps: (content.steps || []).map((step, index) => ({
      id: step.id || `${step.title}-${index}`,
      icon: resolveJourneyStepIcon(step.icon),
      title: step.title,
      links: parseLinksText(step.linksText || step.links),
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
  'showIcon',
  'columns',
  'columnGap',
  'iconBg',
  'iconColor',
  'stepLinkColor',
  'stepLinkFontWeight',
  'stepLinkColorHover',
  'stepLinkFontWeightHover',
  'showTitle',
  'showHeader',
  'showSubtitle',
  'titleAlign',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'stepTitleColor',
  'stepTitleFontWeight',
  'stepTitleColorHover',
  'stepTitleFontWeightHover',
  'panelBg',
  'showPanelBg',
  'panelRadius',
  'panelPadding',
  'sectionBg',
  'showSectionBg',
  'sectionPadding',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
