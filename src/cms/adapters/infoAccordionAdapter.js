import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "terms-and-condition" block (also the older "info-accordion" id)
 * to the terms card: a heading and a marked list.
 */
export function infoAccordionProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  const items = (Array.isArray(content.items) ? content.items : []).map((it, index) => ({
    id: it?.id || `item-${index + 1}`,
    heading:
      typeof it?.heading === 'string'
        ? it.heading.trim()
        : typeof it?.title === 'string'
          ? it.title.trim()
          : '',
    text:
      typeof it?.text === 'string'
        ? it.text.trim()
        : typeof it?.body === 'string'
          ? it.body.trim()
          : '',
  })).filter((it) => it.heading || it.text)

  return {
    title: (content.title || '').trim(),
    items,
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
  'listMarker',
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
