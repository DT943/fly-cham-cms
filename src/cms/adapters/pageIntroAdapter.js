import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "page-intro" block to <PageIntro /> props — a single body paragraph.
 */
export function pageIntroProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    lead: content.lead || '',
    body: content.body || '',
    imageUrl: resolveCmsAsset(content.imageUrl) || '',
    imageAlt: content.imageAlt || '',
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
  'leadSize',
  'textAlign',
  'showSectionBg',
  'sectionBg',
  'leadColor',
  'leadFontWeight',
  'leadColorHover',
  'leadFontWeightHover',
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
