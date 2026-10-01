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
  'columns',
  'headerAlign',
  'cardRadius',
  'sectionPadding',
  'showHeader',
  'showSubtitle',
  'iconColor',
  ...text('titleColor'),
  ...text('subtitleColor'),
  ...text('cardTitleColor'),
  ...text('cardDescriptionColor'),
  ...BACKLINK_KEYS,
]

export function overlayCardsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) => ({
      id: item?.id || '',
      imageUrl: resolveCmsAsset(item?.imageUrl) || '',
      imageAlt: item?.imageAlt || '',
      icon: item?.icon || '',
      title: item?.title || '',
      description: item?.description || '',
      href: resolveCmsHref(item?.href) || '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}
