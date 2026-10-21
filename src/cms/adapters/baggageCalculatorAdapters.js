import { pick, pickContent, resolveCmsHref } from './pick.js'

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

const options = (rows) =>
  (Array.isArray(rows) ? rows : [])
    .map((row) => ({
      id: row?.id || '',
      value: String(row?.value || '').trim(),
      label: row?.label || '',
    }))
    .filter((row) => row.value || row.label)

// Union of Object.keys(DEFAULT_BAGGAGE_CALCULATOR_STYLE) in cms2.
const CALCULATOR_STYLE_KEYS = [
  'overlapHero',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'cardBg',
  'showCardShadow',
  'showIntro',
  'showTier',
  'showNote',
  'fieldBg',
  'iconColor',
  ...text('titleColor'),
  ...text('labelColor'),
  ...text('valueColor'),
  ...text('placeholderColor'),
  ...text('noteColor'),
  ...text('ctaColor'),
  'showButtonIcon',
  'buttonBg',
  'buttonBgHover',
  ...text('buttonText'),
  'disabledBg',
  'disabledText',
  ...BACKLINK_KEYS,
]

const CALCULATOR_TEXT_KEYS = [
  'intro',
  'fromLabel',
  'toLabel',
  'classLabel',
  'tierLabel',
  'fromPlaceholder',
  'toPlaceholder',
  'classPlaceholder',
  'tierPlaceholder',
  'defaultFrom',
  'defaultTo',
  'defaultClass',
  'defaultTier',
  'buttonLabel',
  'buttonIcon',
  'noteText',
  'noteLinkLabel',
]

/**
 * Map a CMS "baggage-calculator" block to <BaggageCalculator /> props.
 * Stored editor shape: the text keys above + `buttonHref`, `noteLinkHref`,
 * `airports` / `classes` / `tiers` (`[{ id, value, label }]`) and `links`.
 */
export function baggageCalculatorProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    ...Object.fromEntries(CALCULATOR_TEXT_KEYS.map((key) => [key, content[key] || ''])),
    buttonHref: resolveCmsHref(content.buttonHref) || '',
    noteLinkHref: resolveCmsHref(content.noteLinkHref) || '',
    airports: options(content.airports),
    classes: options(content.classes),
    tiers: options(content.tiers),
    links: mapBacklinks(content.links),
    ...pick(style, CALCULATOR_STYLE_KEYS),
  }
}

// Union of Object.keys(DEFAULT_TITLE_WITH_LIST_STYLE) in cms2.
const LIST_STYLE_KEYS = [
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'showCardBg',
  'cardBg',
  'itemGap',
  'showIcon',
  'iconColor',
  ...text('titleColor'),
  'bulletStyle',
  'bulletColor',
  ...text('itemColor'),
  ...BACKLINK_KEYS,
]

/**
 * Map a CMS "title-with-list" block to <TitleWithList /> props.
 * Stored editor shape: `{ icon, title, items[{ id, text, icon }], links }`.
 */
export function titleWithListProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    icon: content.icon || '',
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((item) =>
      typeof item === 'string'
        ? { id: '', text: item, icon: '' }
        : {
            id: item?.id || '',
            // Keep an explicit empty text. Only read legacy `item` when `text` is absent.
            text: typeof item?.text === 'string' ? item.text : item?.item || '',
            icon: item?.icon || '',
          },
    ),
    links: mapBacklinks(content.links),
    ...pick(style, LIST_STYLE_KEYS),
  }
}

// Union of Object.keys(DEFAULT_EXCESS_BAGGAGE_STYLE) in cms2.
const EXCESS_STYLE_KEYS = [
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'showTitle',
  'showSubtitle',
  'cardBg',
  'showCardBorder',
  'cardBorderColor',
  'showCardShadow',
  'dividerColor',
  'showLink',
  'fieldBg',
  'fieldBorderColor',
  'iconColor',
  ...text('titleColor'),
  ...text('subtitleColor'),
  ...text('labelColor'),
  ...text('valueColor'),
  ...text('placeholderColor'),
  ...text('descriptionColor'),
  ...text('priceColor'),
  ...text('ctaColor'),
  'showButtonIcon',
  'buttonBg',
  'buttonBgHover',
  ...text('buttonText'),
  'disabledBg',
  'disabledText',
  ...BACKLINK_KEYS,
]

const EXCESS_TEXT_KEYS = [
  'title',
  'subtitle',
  'fromLabel',
  'toLabel',
  'weightLabel',
  'fromPlaceholder',
  'toPlaceholder',
  'weightPlaceholder',
  'defaultFrom',
  'defaultTo',
  'defaultWeight',
  'buttonLabel',
  'buttonIcon',
  'resultLabel',
  'unavailableText',
  'linkLabel',
]

/**
 * Map a CMS "excess-baggage-calculator" block to <ExcessBaggageCalculator /> props.
 * Stored editor shape: the text keys above + `linkHref`, `weights`
 * (`[{ id, value, label }]`, values in kg) and `links`. From / To options are
 * the POS list (not content); `defaultFrom` / `defaultTo` are POS codes.
 */
export function excessBaggageCalculatorProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    lang,
    ...Object.fromEntries(EXCESS_TEXT_KEYS.map((key) => [key, content[key] || ''])),
    linkHref: resolveCmsHref(content.linkHref) || '',
    weights: options(content.weights),
    links: mapBacklinks(content.links),
    ...pick(style, EXCESS_STYLE_KEYS),
  }
}
