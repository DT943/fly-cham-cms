import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "office-directory" block to <OfficeDirectory /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Offices carry plain fields (name/address/phone/email/hours/weekend); the
 *   component builds `tel:` / `mailto:` links itself, so no href resolving here.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to OfficeDirectory's own default (the original look).
 */
export function officeDirectoryProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    tabsLabel: content.tabsLabel,
    callLabel: content.callLabel,
    emailLabel: content.emailLabel,
    weekendLabel: content.weekendLabel,
    tabs: (content.tabs || []).map((tab) => ({
      label: tab?.label || '',
      offices: (Array.isArray(tab?.offices) ? tab.offices : []).map((office) => ({
        name: office?.name || '',
        address: office?.address || '',
        phone: office?.phone || '',
        email: office?.email || '',
        hours: office?.hours || '',
        weekend: office?.weekend || '',
      })),
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
  'showPin',
  'showDashedLine',
  'showWeekend',
  'showButtons',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'activeTabColor',
  'inactiveTabColor',
  'pinBg',
  'pinColor',
  'lineColor',
  'nameColor',
  'nameFontWeight',
  'nameColorHover',
  'nameFontWeightHover',
  'rowColor',
  'rowFontWeight',
  'rowColorHover',
  'rowFontWeightHover',
  'dividerColor',
  'buttonBg',
  'buttonBgHover',
  'buttonColor',
  'buttonFontWeight',
  'buttonColorHover',
  'buttonFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
