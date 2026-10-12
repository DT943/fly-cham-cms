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

// == Object.keys(DEFAULT_SERVICE_DEALS_STYLE) in flychamadmin cms2 ServiceDeals/utils/style.js.
const STYLE_KEYS = [
  'mobileLayout',
  'showArrows',
  'showDots',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  ...text('titleColor'),
  'cardBg',
  ...text('cardTitleColor'),
  ...text('routeColor'),
  ...text('fareColor'),
  ...text('priceColor'),
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

/**
 * CMS "service-deals" block → <ServiceDeals />. Stored editor shape:
 * `{ title, buttonLabel, endsInLabel, deals:[{id,title,imageUrl,imageAlt,badge,
 * endsAt,routes:[{from,to}],fareText,price,href}], links }`.
 */
export function serviceDealsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  return {
    content: {
      title: content.title || '',
      buttonLabel: content.buttonLabel || '',
      endsInLabel: content.endsInLabel || '',
      deals: (Array.isArray(content.deals) ? content.deals : []).map((deal) => ({
        id: deal?.id || '',
        title: deal?.title || '',
        imageUrl: resolveCmsAsset(deal?.imageUrl) || '',
        imageAlt: deal?.imageAlt || '',
        badge: deal?.badge || '',
        endsAt: deal?.endsAt || '',
        routes: (Array.isArray(deal?.routes) ? deal.routes : []).map((route) => ({
          from: route?.from || '',
          to: route?.to || '',
        })),
        fareText: deal?.fareText || '',
        price: deal?.price || '',
        href: resolveCmsHref(deal?.href) || '',
      })),
      links: mapBacklinks(content.links),
    },
    style: pick(style, STYLE_KEYS),
    lang: String(lang || '').toLowerCase() === 'ar' ? 'ar' : 'en',
  }
}
