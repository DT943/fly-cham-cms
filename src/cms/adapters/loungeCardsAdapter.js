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
  'showHeader',
  'columns',
  'radius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'showOverlay',
  'showArrows',
  'showDots',
  ...text('titleColor'),
  ...text('cardTitleColor'),
  ...text('cardDescriptionColor'),
  'showLink',
  'showLinkIcon',
  'arrowBadgeBg',
  'arrowColor',
  ...BACKLINK_KEYS,
]

export function loungeCardsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) => ({
      id: item?.id || '',
      imageUrl: resolveCmsAsset(item?.imageUrl) || '',
      imageAlt: item?.imageAlt || '',
      title: item?.title || '',
      description: item?.description || '',
      href: resolveCmsHref(item?.href) || '',
      icon: item?.icon || '',
    })),
    links: mapBacklinks(content.links),
    dir: String(lang || '').toLowerCase() === 'ar' ? 'rtl' : 'ltr',
    ...pick(style, STYLE_KEYS),
  }
}
