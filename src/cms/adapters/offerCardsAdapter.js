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

// Union of Object.keys(DEFAULT_OFFER_CARDS_STYLE) in cms2.
const STYLE_KEYS = [
  'showHeader',
  'columns',
  'cardGap',
  'imageRadius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'showImageOverlay',
  ...text('titleColor'),
  ...text('cardTitleColor'),
  ...text('cardDescriptionColor'),
  'showIcon',
  'iconColor',
  'showLink',
  'showLinkIcon',
  ...text('buttonText'),
  ...BACKLINK_KEYS,
]

/**
 * Map a CMS "offer-cards" block to <OfferCards /> props.
 * Stored editor shape: `{ title, items[{ id, imageUrl, imageAlt, showOverlay,
 * icon, title, description, linkLabel, href, linkIcon }], links }`.
 */
export function offerCardsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) => ({
      id: item?.id || '',
      imageUrl: resolveCmsAsset(item?.imageUrl) || '',
      imageAlt: item?.imageAlt || '',
      showOverlay: item?.showOverlay !== false,
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
