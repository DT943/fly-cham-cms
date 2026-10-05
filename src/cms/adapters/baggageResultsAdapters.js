import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const BACKLINK_KEYS = ['showLinks', 'linkColor', 'linkHoverColor', 'linkFontWeight', 'linkUnderline', 'linkItalic']

const text = (colorKey) => {
  const weightKey = colorKey.endsWith('Color')
    ? colorKey.replace(/Color$/, 'FontWeight')
    : `${colorKey}FontWeight`
  return [colorKey, weightKey, `${colorKey}Hover`, `${weightKey}Hover`]
}

const options = (rows, withImage = false) =>
  (Array.isArray(rows) ? rows : [])
    .map((row) => ({
      id: row?.id || '',
      value: String(row?.value || '').trim(),
      label: row?.label || '',
      ...(withImage ? { imageUrl: resolveCmsAsset(row?.imageUrl) || '' } : {}),
    }))
    .filter((row) => row.value || row.label)

// Union of Object.keys(DEFAULT_BAGGAGE_ROUTE_SUMMARY_STYLE) in cms2.
const SUMMARY_STYLE_KEYS = [
  'onlyAfterCalculate',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'showClass',
  'showTier',
  ...text('titleColor'),
  'arrowColor',
  'chipBg',
  ...text('chipText'),
  'dividerColor',
  ...text('nameColor'),
  ...BACKLINK_KEYS,
]

/** Map a CMS "baggage-route-summary" block to <BaggageRouteSummary /> props. */
export function baggageRouteSummaryProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    arrowIcon: content.arrowIcon || '',
    tierPrefix: content.tierPrefix || '',
    anchorId: content.anchorId || '',
    previewFrom: content.previewFrom || '',
    previewTo: content.previewTo || '',
    previewClass: content.previewClass || '',
    previewTier: content.previewTier || '',
    airports: options(content.airports),
    classes: options(content.classes),
    tiers: options(content.tiers, true),
    ...pick(style, SUMMARY_STYLE_KEYS),
  }
}

// Union of Object.keys(DEFAULT_BAGGAGE_BREAKDOWN_STYLE) in cms2.
const BREAKDOWN_STYLE_KEYS = [
  'onlyAfterCalculate',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'panelBg',
  'showDividers',
  'dividerColor',
  'showPromo',
  'showDimensions',
  'iconColor',
  ...text('titleColor'),
  ...text('cardTitleColor'),
  ...text('valueColor'),
  ...text('labelColor'),
  ...text('bodyColor'),
  ...text('itemColor'),
  'bulletColor',
  ...text('ctaColor'),
  'linkIconBg',
  'linkIconColor',
  'badgeBg',
  ...text('badgeText'),
  'countBg',
  ...text('numberColor'),
  'arrowColor',
  ...text('metaColor'),
  ...text('headingColor'),
  ...text('descriptionColor'),
  'promoBadgeBg',
  'promoBadgeIconColor',
  'buttonBg',
  'buttonBgHover',
  ...text('buttonText'),
  ...BACKLINK_KEYS,
]

const COLUMN_TEXT_KEYS = [
  'id',
  'title',
  'pieces',
  'weightLabel',
  'weightValue',
  'sizeLabel',
  'sizeValue',
  'listTitle',
  'linkLabel',
  'linkIcon',
  'imageAlt',
  'weightBadge',
  'weightUnit',
  'countBadge',
  'dimHeight',
  'dimWidth',
  'dimDepth',
]

/**
 * Map a CMS "baggage-allowance-breakdown" block to <BaggageAllowanceBreakdown />
 * props. Stored editor shape: `{ icon, title, classFilter, columns[…],
 * promo*, links }`.
 */
export function baggageAllowanceBreakdownProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    icon: content.icon || '',
    title: content.title || '',
    classFilter: content.classFilter || '',
    columns: (Array.isArray(content.columns) ? content.columns : []).map((column) => ({
      ...Object.fromEntries(COLUMN_TEXT_KEYS.map((key) => [key, column?.[key] || ''])),
      linkHref: resolveCmsHref(column?.linkHref) || '',
      imageUrl: resolveCmsAsset(column?.imageUrl) || '',
      listItems: (Array.isArray(column?.listItems) ? column.listItems : []).map((item) =>
        typeof item === 'string' ? { id: '', text: item } : { id: item?.id || '', text: item?.text || '' },
      ),
    })),
    promoTitle: content.promoTitle || '',
    promoBody: content.promoBody || '',
    promoButtonLabel: content.promoButtonLabel || '',
    promoButtonHref: resolveCmsHref(content.promoButtonHref) || '',
    promoImageUrl: resolveCmsAsset(content.promoImageUrl) || '',
    promoImageAlt: content.promoImageAlt || '',
    promoBadgeIcon: content.promoBadgeIcon || '',
    links: mapBacklinks(content.links),
    ...pick(style, BREAKDOWN_STYLE_KEYS),
  }
}

// Union of Object.keys(DEFAULT_BAGGAGE_ADDONS_STYLE) in cms2.
const ADDONS_STYLE_KEYS = [
  'onlyAfterCalculate',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'columns',
  'cardBg',
  'showCardShadow',
  'iconColor',
  ...text('titleColor'),
  ...text('labelColor'),
  ...text('valueColor'),
  ...BACKLINK_KEYS,
]

/** Map a CMS "baggage-addons" block to <BaggageAddons /> props. */
export function baggageAddonsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) => ({
      id: item?.id || '',
      icon: item?.icon || '',
      label: item?.label || '',
      price: item?.price || '',
      href: resolveCmsHref(item?.href) || '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, ADDONS_STYLE_KEYS),
  }
}
