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
    ...pick(style, STYLE_KEYS),
  }
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
  'submitBg',
  'submitTextColor',
  'submitFontWeight',
  'labelColor',
  'labelFontWeight',
  'chipTextColor',
  'chipBorderColor',
  'popularLabelColor',
  'gradientFrom',
  'gradientTo',
  'gradientDirection',
  'panelRadius',
  'panelPadding',
]

function pickContent(content, lang) {
  if (!content) return {}
  const keys = Object.keys(content)
  return content[lang] || content[keys[0]] || {}
}

function pick(source, keys) {
  const out = {}
  for (const key of keys) {
    if (source[key] !== undefined) out[key] = source[key]
  }
  return out
}
