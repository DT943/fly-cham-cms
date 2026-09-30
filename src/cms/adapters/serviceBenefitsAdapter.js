import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const BACKLINK_KEYS = [
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]

const text = (colorKey) => {
  const weightKey = colorKey.endsWith('Color')
    ? colorKey.replace(/Color$/, 'FontWeight')
    : `${colorKey}FontWeight`
  return [colorKey, weightKey, `${colorKey}Hover`, `${weightKey}Hover`]
}

// Union of Object.keys(DEFAULT_SERVICE_BENEFITS_STYLE) in cms2.
const STYLE_KEYS = [
  'showHeader',
  'columns',
  'radius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'showOverlay',
  'overlayColor',
  ...text('titleColor'),
  'showIcon',
  'iconBg',
  'iconColor',
  ...text('itemTitleColor'),
  ...text('itemDescriptionColor'),
  'showLink',
  'showLinkIcon',
  ...text('buttonText'),
  ...BACKLINK_KEYS,
]

/**
 * Map a CMS "service-benefits" block to <ServiceBenefits /> props.
 * Stored editor shape: `{ title, imageUrl, imageAlt, items[{ id, icon, title,
 * description, linkLabel, href, linkIcon }], links }`.
 */
export function serviceBenefitsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
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
