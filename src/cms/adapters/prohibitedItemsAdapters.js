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

// Union of Object.keys(DEFAULT_PROHIBITED_ITEMS_GRID_STYLE) in cms2.
const GRID_STYLE_KEYS = [
  'showHeader',
  'showDescription',
  'columns',
  'cardGap',
  'cardRadius',
  'cardHeight',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  ...text('titleColor'),
  ...text('descriptionColor'),
  'cardBg',
  'showCardBorder',
  'cardBorderColor',
  'showCardShadow',
  'showIcon',
  'iconSize',
  'iconColor',
  'iconWeight',
  ...text('labelColor'),
  ...BACKLINK_KEYS,
]

/**
 * Map a CMS "prohibited-items-grid" block to <ProhibitedItemsGrid /> props.
 * Stored editor shape: `{ title, description, items[{ id, iconSource, iconUrl,
 * iconAlt, icon, label, href }], links }` — `icon` is a Phosphor name.
 */
export function prohibitedItemsGridProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) => ({
      id: item?.id || '',
      iconSource: item?.iconSource === 'phosphor' ? 'phosphor' : 'image',
      iconUrl: resolveCmsAsset(item?.iconUrl) || '',
      iconAlt: item?.iconAlt || '',
      icon: item?.icon || '',
      label: item?.label || '',
      href: item?.href ? resolveCmsHref(item.href) : '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, GRID_STYLE_KEYS),
  }
}

// Union of Object.keys(DEFAULT_INSTRUCTIONS_CARD_STYLE) in cms2.
const INSTRUCTIONS_STYLE_KEYS = [
  'showHeader',
  'showDescription',
  'showImage',
  'imageSide',
  'imageRadius',
  'imageHeight',
  'listStyle',
  'listGap',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  ...text('titleColor'),
  ...text('descriptionColor'),
  'cardBg',
  'cardRadius',
  'showCardShadow',
  ...text('listColor'),
  'markerColor',
  'showButton',
  'showButtonIcon',
  'buttonBg',
  'buttonBgHover',
  ...text('buttonText'),
  ...BACKLINK_KEYS,
]

/**
 * Map a CMS "instructions-card" block to <InstructionsCard /> props.
 * Stored editor shape: `{ title, description, items[{ id, text }], imageUrl,
 * imageAlt, buttonLabel, buttonHref, buttonIcon, links }`.
 */
export function instructionsCardProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) =>
      typeof item === 'string'
        ? { id: '', text: item }
        : { id: item?.id || '', text: item?.text || '' },
    ),
    imageUrl: resolveCmsAsset(content.imageUrl) || '',
    imageAlt: content.imageAlt || '',
    buttonLabel: content.buttonLabel || '',
    buttonHref: content.buttonHref ? resolveCmsHref(content.buttonHref) : '',
    buttonIcon: content.buttonIcon || '',
    links: mapBacklinks(content.links),
    ...pick(style, INSTRUCTIONS_STYLE_KEYS),
  }
}
