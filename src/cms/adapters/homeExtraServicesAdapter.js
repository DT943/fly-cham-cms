import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "home-extra-services" block to <HomeExtraServices /> props — the
 * home "Add extra services" header + service link cards.
 *
 * Stores the editor shape: `{ title, subtitle, items[{ id, icon, title,
 * description, href }], links }`. `icon` is a Phosphor PascalCase name
 * (default "Seat"). Only style keys the CMS provided are forwarded, so omitted
 * keys keep the component's own defaults (the source look).
 */
export function homeExtraServicesProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      icon: it?.icon || 'Seat',
      title: it?.title || '',
      description: it?.description || '',
      href: resolveCmsHref(it?.href) || '#',
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
  'showSubtitle',
  'columns',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'cardBg',
  'cardBorderColor',
  'iconBg',
  'iconColor',
  'caretColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
