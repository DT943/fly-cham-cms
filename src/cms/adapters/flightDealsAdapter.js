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

// == Object.keys(DEFAULT_FLIGHT_DEALS_STYLE) in flychamadmin cms2 FlightDeals/utils/style.js.
const STYLE_KEYS = [
  'mobileLayout',
  'showArrows',
  'showDots',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  ...text('titleColor'),
  'showOriginPicker',
  ...text('originColor'),
  'showTripToggle',
  'showClassPicker',
  'filterBg',
  'toggleActiveBg',
  'toggleActiveText',
  'toggleText',
  ...text('labelColor'),
  ...text('valueColor'),
  'caretColor',
  'cardBg',
  ...text('cardTitleColor'),
  ...text('fareColor'),
  ...text('priceColor'),
  'showDates',
  ...text('datesColor'),
  'showBadge',
  'badgeBg',
  ...text('badgeText'),
  'showButton',
  'buttonBg',
  'buttonBgHover',
  ...text('buttonText'),
  'arrowColor',
  'dotColor',
  ...BACKLINK_KEYS,
]

const LABEL_KEYS = [
  'title',
  'roundTripLabel',
  'oneWayLabel',
  'classLabel',
  'economyLabel',
  'businessLabel',
  'roundTripFareLabel',
  'oneWayFareLabel',
  'fromLabel',
  'buttonLabel',
  'emptyLabel',
]

/**
 * CMS "flight-deals" block → <FlightDeals />. Stored editor shape:
 * `{ title, …labels, origins:[{id,label}], deals:[{id,title,imageUrl,imageAlt,
 * badge,origin,tripType,cabin,price,dates,href}], links }`.
 */
export function flightDealsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    content: {
      ...Object.fromEntries(LABEL_KEYS.map((key) => [key, content[key] || ''])),
      origins: (Array.isArray(content.origins) ? content.origins : []).map((origin) => ({
        id: origin?.id || '',
        label: origin?.label || '',
      })),
      deals: (Array.isArray(content.deals) ? content.deals : []).map((deal) => ({
        id: deal?.id || '',
        title: deal?.title || '',
        imageUrl: resolveCmsAsset(deal?.imageUrl) || '',
        imageAlt: deal?.imageAlt || '',
        badge: deal?.badge || '',
        origin: deal?.origin || '',
        tripType: deal?.tripType === 'one-way' ? 'one-way' : 'round-trip',
        cabin: deal?.cabin === 'business' ? 'business' : 'economy',
        price: deal?.price || '',
        dates: deal?.dates || '',
        href: resolveCmsHref(deal?.href) || '',
      })),
      links: mapBacklinks(content.links),
    },
    style: pick(style, STYLE_KEYS),
    lang: String(lang || '').toLowerCase() === 'ar' ? 'ar' : 'en',
  }
}
