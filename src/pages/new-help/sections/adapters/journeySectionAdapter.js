import { resolveJourneyStepIcon } from '../../../help/utils/journeySteps.js'
import { pick, pickContent } from './pick.js'

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
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'showIcon',
  'columns',
  'columnGap',
  'iconBg',
  'iconColor',
  'linkColor',
  'linkColorHover',
  'linkFontWeightHover',
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
]
