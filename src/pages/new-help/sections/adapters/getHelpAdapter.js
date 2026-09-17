import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "get-help" block to <GetHelp /> props.
 *
 * Content is language-scoped; icon names ('headset', 'clipboard', …) are passed
 * through and resolved to Phosphor components inside <GetHelp />. Only the style
 * keys the CMS actually provided are forwarded, so any omitted key falls back to
 * GetHelp's own default (the original OurOffices look).
 */
export function getHelpProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    subtitle: content.subtitle,
    items: (content.items || []).map((item, index) => ({
      id: item.id || `${item.title}-${index}`,
      icon: item.icon,
      href: resolveCmsHref(item.href),
      title: item.title,
      description: item.description,
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
  'showHeader',
  'showTitle',
  'showSubtitle',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'columns',
  'cardGap',
  'titleAlign',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardBg',
  'iconColor',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'arrowBg',
  'arrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
