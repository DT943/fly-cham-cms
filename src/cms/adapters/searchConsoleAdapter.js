import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "search-console" block to <SearchConsole /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to SearchConsole's own default.
 */
export function searchConsoleProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    label: content.label,
    placeholder: content.placeholder,
    submit: style.showSubmit === false ? null : content.submitLabel,
    popularLabel: content.popularLabel,
    popularItems: (content.popularItems || []).map((item, index) => ({
      id: item.id || `${item.label}-${index}`,
      label: item.label,
      query: item.query || item.label,
    })),
    types: normalizeTypes(content.types),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

function normalizeTypes(types) {
  if (Array.isArray(types) && types.length) {
    return types.map((item) => String(item || '').trim()).filter(Boolean)
  }
  if (typeof types === 'string' && types.trim()) {
    return types.split(',').map((item) => item.trim()).filter(Boolean)
  }
  return undefined
}

const STYLE_KEYS = [
  'showLabel',
  'showSubmit',
  'showPopular',
  'showSearchIcon',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'inputBg',
  'inputTextColor',
  'inputTextColorHover',
  'inputTextFontWeightHover',
  'submitBg',
  'submitTextColor',
  'submitFontWeight',
  'submitTextColorHover',
  'submitTextFontWeightHover',
  'labelColor',
  'labelFontWeight',
  'labelColorHover',
  'labelFontWeightHover',
  'chipTextColor',
  'chipTextColorHover',
  'chipTextFontWeightHover',
  'chipBorderColor',
  'popularLabelColor',
  'popularLabelColorHover',
  'popularLabelFontWeightHover',
  'gradientFrom',
  'gradientTo',
  'gradientDirection',
  'panelRadius',
  'panelPadding',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
