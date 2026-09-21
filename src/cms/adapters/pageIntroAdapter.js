import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "page-intro" block to <PageIntro /> props — a single body paragraph.
 */
export function pageIntroProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    body: content.body || '',
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
