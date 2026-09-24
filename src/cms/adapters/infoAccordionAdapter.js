import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "info-accordion" block to <InfoAccordion /> props — a white card
 * with stacked expandable title/body sections.
 */
export function infoAccordionProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    items: (Array.isArray(content.items) ? content.items : []).map((it, index) => ({
      id: it?.id || `item-${index + 1}`,
      title: it?.title || '',
      body: it?.body || '',
      defaultOpen: it?.defaultOpen !== false,
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'cardBg',
  'cardRadius',
  'dividerColor',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'bodyColor',
  'bodyFontWeight',
  'bodyColorHover',
  'bodyFontWeightHover',
  'iconColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
