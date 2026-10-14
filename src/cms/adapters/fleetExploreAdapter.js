import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

const LABEL_FALLBACKS = [
  'Economy',
  'Business',
  'Total seats',
  'الدرجة السياحية',
  'درجة رجال الأعمال',
  'إجمالي المقاعد',
]

/** Drop seat counts that inline editing saved onto the shared card label. */
function repairLabel(label, fallback) {
  const value = String(label || fallback)
  const trimmed = value.trim()
  for (const known of LABEL_FALLBACKS) {
    if (trimmed === known) return known
    if (!trimmed.startsWith(`${known} `)) continue
    const rest = trimmed.slice(known.length).trim()
    if (/^\d+(?:\s+\d+)*$/.test(rest)) return known
  }
  return value
}

function repairCount(value) {
  const text = String(value ?? '').trim()
  if (!text || /^\d+$/.test(text)) return text
  const match = text.match(/(\d+)\s*$/)
  return match ? match[1] : text
}

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
    economyLabel: repairLabel(content.economyLabel, 'Economy'),
    businessLabel: repairLabel(content.businessLabel, 'Business'),
    totalSeatsLabel: repairLabel(content.totalSeatsLabel, 'Total seats'),
    cards: (Array.isArray(content.cards) ? content.cards : []).map((card, index) => ({
      id: card?.id || `aircraft-${index + 1}`,
      name: card?.name || '',
      economy: repairCount(card?.economy),
      business: repairCount(card?.business),
      totalSeats: repairCount(card?.totalSeats),
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
