import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "latest-news" block to <LatestNews /> props — featured news rows.
 */
export function latestNewsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    readMore: content.readMore || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
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
  'imageRadius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
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
  'readMoreColor',
  'readMoreFontWeight',
  'readMoreColorHover',
  'readMoreFontWeightHover',
  'arrowBadgeBg',
  'arrowColor',
  'buttonBg',
  'buttonHoverBg',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'iconColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
