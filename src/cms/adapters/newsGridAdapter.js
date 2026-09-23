import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "news-grid" block to <NewsGrid /> props.
 */
export function newsGridProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    learnMore: content.learnMore || '',
    viewAll: content.viewAll || '',
    viewAllHref: resolveCmsHref(content.viewAllHref) || '/recent-news',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      coverKey: it?.coverKey || '',
      date: it?.date || '',
      dateTime: it?.dateTime || '',
      category: it?.category || '',
      title: it?.title || '',
      excerpt: it?.excerpt || '',
      cta: it?.cta || '',
      href: resolveCmsHref(it?.href) || '#',
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
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'metaColor',
  'metaFontWeight',
  'metaColorHover',
  'metaFontWeightHover',
  'chipText',
  'chipTextFontWeight',
  'chipTextHover',
  'chipTextFontWeightHover',
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
  'viewAllBg',
  'viewAllBorder',
  'viewAllHoverBg',
  'viewAllText',
  'viewAllTextFontWeight',
  'viewAllTextHover',
  'viewAllTextFontWeightHover',
  'iconColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
