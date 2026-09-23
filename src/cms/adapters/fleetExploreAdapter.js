import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "fleet-explore" block to <FleetExplore /> props — title, body
 * paragraphs, and the aircraft card grid from the static Our Fleet page.
 */
export function fleetExploreProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it, index) => ({
      id: it?.id || `p${index + 1}`,
      body: it?.body || '',
    })),
    economyLabel: content.economyLabel || 'Economy',
    businessLabel: content.businessLabel || 'Business',
    totalSeatsLabel: content.totalSeatsLabel || 'Total seats',
    cards: (Array.isArray(content.cards) ? content.cards : []).map((card, index) => ({
      id: card?.id || `aircraft-${index + 1}`,
      name: card?.name || '',
      economy: card?.economy ?? '',
      business: card?.business ?? '',
      totalSeats: card?.totalSeats ?? '',
      image: resolveCmsAsset(card?.imageUrl) || undefined,
      imageAlt: card?.imageAlt || '',
      href: resolveCmsHref(card?.href) || '#',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'showCards',
  'showCardImage',
  'showCardArrow',
  'columns',
  'cardGap',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'bodyColor',
  'bodyFontWeight',
  'bodyColorHover',
  'bodyFontWeightHover',
  'cardBg',
  'cardBorderColor',
  'cardNameColor',
  'cardNameFontWeight',
  'cardNameColorHover',
  'cardNameFontWeightHover',
  'cardMetaColor',
  'cardMetaFontWeight',
  'cardMetaColorHover',
  'cardMetaFontWeightHover',
  'cardTotalColor',
  'cardTotalFontWeight',
  'cardTotalColorHover',
  'cardTotalFontWeightHover',
  'arrowBg',
  'arrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
