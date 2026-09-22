import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "media-contact-cards" block to <MediaContactCards /> props.
 */
export function mediaContactCardsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      icon: it?.icon || 'envelopeSimple',
      title: it?.title || '',
      description: it?.description || '',
      department: it?.department || '',
      location: it?.location || '',
      email: it?.email || '',
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
  'columns',
  'cardGap',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'cardBg',
  'cardBorderColor',
  'iconBg',
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
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
