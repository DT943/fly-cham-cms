import { pick, pickContent, resolveCmsHref } from './pick.js'

/** Designed highlight flags. Keep in sync with the cms2 list helper. */
const DEFAULT_ITEM_ACCENT = {
  loungeAccess: false,
  deviceRegulations: true,
  flightsResume: false,
  winterSports: false,
  baggagePolicy: false,
  checkInWindow: false,
  visaReminder: true,
  cabinComfort: false,
  scheduleAdjustment: false,
  loyaltyBonus: false,
  mobileBoarding: false,
  sustainability: true,
}

function resolveAccent(item) {
  if (item?.id && Object.prototype.hasOwnProperty.call(DEFAULT_ITEM_ACCENT, item.id)) {
    return DEFAULT_ITEM_ACCENT[item.id]
  }
  return Boolean(item?.accentTitle)
}

/**
 * Map a CMS "travel-updates-list" block to <TravelUpdatesList /> props — a
 * paginated feed of travel update cards (date badge, title, description,
 * optional Learn More link).
 *
 * Stores the editor shape: `{ learnMoreLabel, items[{ id, date, title,
 * description, href }], links }`. An item without an href renders no Learn
 * More link. Only style keys the CMS provided are forwarded, so omitted keys
 * keep the component's own defaults (the Figma look).
 */
export function travelUpdatesListProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    learnMoreLabel: content.learnMoreLabel || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      date: it?.date || '',
      title: it?.title || '',
      description: it?.description || '',
      href: resolveCmsHref(it?.href) || '',
      accentTitle: resolveAccent(it),
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'accentTitleColor',
  'pageSize',
  'showPagination',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'cardBg',
  'badgeBg',
  'badgeText',
  'badgeTextFontWeight',
  'badgeTextHover',
  'badgeTextFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'learnMoreBg',
  'learnMoreArrowColor',
  'learnMoreColor',
  'learnMoreFontWeight',
  'learnMoreColorHover',
  'learnMoreFontWeightHover',
  'activePageBg',
  'activePageColor',
  'pageBg',
  'pageColor',
  'arrowBg',
  'arrowColor',
  'arrowDisabledBg',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
