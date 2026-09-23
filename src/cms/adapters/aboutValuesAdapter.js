import { pick, pickContent, pickStyle, resolveCmsHref } from './pick.js'

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

/**
 * Map a CMS "about-values" block to <AboutValues /> props.
 */
export function aboutValuesProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = pickStyle(block.style, lang)

  return {
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it, index) => ({
      id: it?.id || `value-${index}`,
      icon: it?.icon || '',
      title: it?.title || '',
      description: it?.description || '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'showTitle',
  'columns',
  'cardGap',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'cardBg',
  'iconBg',
  'iconColor',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
