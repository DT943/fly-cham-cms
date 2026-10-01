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

// Union of Object.keys(DEFAULT_AIRPORT_SERVICE_CARDS_STYLE) in cms2.
const STYLE_KEYS = [
  'showHeader',
  'showTitle',
  'showSubtitle',
  'headerAlign',
  'columns',
  'cardGap',
  'cardRadius',
  'imageHeight',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  ...text('titleColor'),
  ...text('subtitleColor'),
  'cardBg',
  'showCardShadow',
  ...text('cardTitleColor'),
  ...text('cardDescriptionColor'),
  'showLink',
  'showLinkIcon',
  'linkAlign',
  ...text('learnMoreColor'),
  'arrowBadgeBg',
  'arrowColor',
  ...BACKLINK_KEYS,
]

/**
 * Map a CMS "airport-service-cards" block to <AirportServiceCards />.
 * Stored editor shape: `{ title, subtitle, items[{ id, imageUrl, imageAlt,
 * title, description, cta, href, icon }], links }`.
 */
export function airportServiceCardsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) => ({
      id: item?.id || '',
      imageUrl: resolveCmsAsset(item?.imageUrl) || '',
      imageAlt: item?.imageAlt || '',
      title: item?.title || '',
      description: item?.description || '',
      cta: item?.cta || '',
      href: resolveCmsHref(item?.href) || '',
      icon: item?.icon || 'ArrowRight',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}
