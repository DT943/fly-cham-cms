import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/** Resolve each backlink href through the app's CMS href rules. */
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

// Union of Object.keys(DEFAULT_BAGGAGE_ALLOWANCE_STYLE) in cms2.
const ALLOWANCE_STYLE_KEYS = [
  'showHeader',
  'showDescription',
  'columns',
  'cardGap',
  'cardRadius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  ...text('titleColor'),
  ...text('descriptionColor'),
  'cardBg',
  'cardHeaderBg',
  'headerBorderColor',
  'dividerColor',
  'showDivider',
  ...text('cardTitleColor'),
  ...text('labelColor'),
  ...text('valueColor'),
  'iconColor',
  ...text('cardDescriptionColor'),
  ...BACKLINK_KEYS,
]

/**
 * Map a CMS "baggage-allowance" block to <BaggageAllowance /> props.
 * Stored editor shape: `{ title, description, cards[{ id, title, description,
 * stats[{ icon, label, value }] }], links }` — icons are Phosphor names.
 */
export function baggageAllowanceProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    cards: (Array.isArray(content.cards) ? content.cards : []).map((card) => ({
      id: card?.id || '',
      title: card?.title || '',
      description: card?.description || '',
      stats: (Array.isArray(card?.stats) ? card.stats : []).map((stat) => ({
        icon: stat?.icon || '',
        label: stat?.label || '',
        value: stat?.value || '',
      })),
    })),
    links: mapBacklinks(content.links),
    ...pick(style, ALLOWANCE_STYLE_KEYS),
  }
}

// Union of Object.keys(DEFAULT_BAGGAGE_RESOURCE_CARDS_STYLE) in cms2.
const RESOURCE_STYLE_KEYS = [
  'showHeader',
  'showDescription',
  'columns',
  'cardGap',
  'cardRadius',
  'imageHeight',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  ...text('titleColor'),
  ...text('descriptionColor'),
  'cardBg',
  'showCardShadow',
  ...text('cardTitleColor'),
  ...text('cardDescriptionColor'),
  'showButton',
  'showButtonIcon',
  'buttonBg',
  'buttonBgHover',
  ...text('buttonText'),
  ...BACKLINK_KEYS,
]

/**
 * Map a CMS "baggage-resource-cards" block to <BaggageResourceCards /> props.
 * Stored editor shape: `{ title, description, items[{ id, imageUrl, imageAlt,
 * title, description, buttonLabel, href, buttonIcon }], links }`.
 */
export function baggageResourceCardsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) => ({
      id: item?.id || '',
      imageUrl: resolveCmsAsset(item?.imageUrl) || '',
      imageAlt: item?.imageAlt || '',
      title: item?.title || '',
      description: item?.description || '',
      buttonLabel: item?.buttonLabel || '',
      href: resolveCmsHref(item?.href) || '',
      buttonIcon: item?.buttonIcon || '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, RESOURCE_STYLE_KEYS),
  }
}
