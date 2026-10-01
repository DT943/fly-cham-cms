import { pick, pickContent, resolveCmsHref } from './pick.js'

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const BACKLINK_KEYS = ['showLinks', 'linkColor', 'linkHoverColor', 'linkFontWeight', 'linkUnderline', 'linkItalic']

const text = (colorKey) => {
  const weightKey = colorKey.endsWith('Color') ? colorKey.replace(/Color$/, 'FontWeight') : `${colorKey}FontWeight`
  return [colorKey, weightKey, `${colorKey}Hover`, `${weightKey}Hover`]
}

const STYLE_KEYS = [
  'sectionPadding',
  'showTitle',
  'showHelp',
  'showButton',
  'cardBg',
  'fieldBg',
  'iconColor',
  'submitBg',
  ...text('titleColor'),
  ...text('labelColor'),
  ...text('helpTitleColor'),
  ...text('buttonColor'),
  ...BACKLINK_KEYS,
]

export function bookingLookupProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    title: content.title || '',
    pnrLabel: content.pnrLabel || '',
    pnrPlaceholder: content.pnrPlaceholder || '',
    pnrIcon: content.pnrIcon || 'Ticket',
    lastNameLabel: content.lastNameLabel || '',
    lastNamePlaceholder: content.lastNamePlaceholder || '',
    lastNameIcon: content.lastNameIcon || 'User',
    helpLabel: content.helpLabel || '',
    helpHref: resolveCmsHref(content.helpHref) || '',
    helpIcon: content.helpIcon || 'Info',
    buttonLabel: content.buttonLabel || '',
    buttonHref: resolveCmsHref(content.buttonHref) || content.buttonHref || '',
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}
