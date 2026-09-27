import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "business-quick-access" block to <BusinessQuickAccess /> props.
 * Stores the editor shape: `{ title, items[{ id, icon, label, shortLabel,
 * href }], links }` — icons are Phosphor PascalCase names.
 */
export function businessQuickAccessProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      icon: it?.icon || '',
      label: it?.label || '',
      shortLabel: it?.shortLabel || '',
      href: resolveCmsHref(it?.href) || '',
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
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'cardBg',
  'iconBg',
  'iconColor',
  'labelColor',
  'labelFontWeight',
  'labelColorHover',
  'labelFontWeightHover',
  'chevronColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
