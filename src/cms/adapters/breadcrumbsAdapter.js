import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "breadcrumbs" block to <Breadcrumbs />.
 * Reads the flat editor keys persisted by PageBuilder.
 */
export function breadcrumbsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const items = Array.isArray(content.items) ? content.items : []

  return {
    items: items.map((item) => ({
      label: item.label || '',
      href: resolveCmsHref(item.href) || '',
    })),
    separator: content.separator || '/',
    ariaLabel: content.ariaLabel || 'Breadcrumb',
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
  'crumbColor',
  'crumbFontWeight',
  'crumbColorHover',
  'crumbFontWeightHover',
  'currentColor',
  'currentFontWeight',
  'currentColorHover',
  'currentFontWeightHover',
  'focusColor',
  'focusFontWeight',
  'focusColorHover',
  'focusFontWeightHover',
  'separatorColor',
  'crumbUnderline',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
