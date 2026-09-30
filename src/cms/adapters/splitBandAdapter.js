import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

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
  'imageSide',
  'panelTone',
  'showButton',
  'showButtonIcon',
  'buttonBg',
  ...text('titleColor'),
  ...text('descriptionColor'),
  ...text('buttonColor'),
  ...BACKLINK_KEYS,
]

export function splitBandProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    title: content.title || '',
    description: content.description || '',
    imageUrl: resolveCmsAsset(content.imageUrl) || '',
    imageAlt: content.imageAlt || '',
    buttonLabel: content.buttonLabel || '',
    buttonHref: resolveCmsHref(content.buttonHref) || '',
    buttonIcon: content.buttonIcon || 'ArrowRight',
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}
