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
  'featureColumns',
  'imageRadius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  ...text('titleColor'),
  ...text('bodyColor'),
  'showIcon',
  'iconBg',
  'iconColor',
  ...text('featureTitleColor'),
  ...text('featureDescriptionColor'),
  'showLink',
  'showLinkIcon',
  ...text('buttonText'),
  ...BACKLINK_KEYS,
]

export function featureHighlightProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    title: content.title || '',
    description: content.description || '',
    imageUrl: resolveCmsAsset(content.imageUrl) || '',
    imageAlt: content.imageAlt || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) => ({
      id: item?.id || '',
      icon: item?.icon || '',
      title: item?.title || '',
      description: item?.description || '',
      linkLabel: item?.linkLabel || '',
      href: resolveCmsHref(item?.href) || '',
      linkIcon: item?.linkIcon || '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}
