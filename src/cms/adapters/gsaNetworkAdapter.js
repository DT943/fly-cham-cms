import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "gsa-network" block to <GsaNetwork /> props — a country filter, an
 * interactive Leaflet map, and GSA office cards. Content is a nested
 * countries → locations → hours structure (stored as-is). Only provided style
 * keys are forwarded, so omitted keys fall through to the component defaults.
 */
export function gsaNetworkProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    countriesLabel: content.countriesLabel,
    openMapLabel: content.openMapLabel,
    countries: (Array.isArray(content.countries) ? content.countries : []).map((country) => ({
      label: country?.label || '',
      shortLabel: country?.shortLabel || '',
      locations: (Array.isArray(country?.locations) ? country.locations : []).map((loc) => ({
        name: loc?.name || '',
        city: loc?.city || '',
        address: loc?.address || '',
        phone: loc?.phone || '',
        email: loc?.email || '',
        lat: loc?.lat ?? '',
        lng: loc?.lng ?? '',
        hours: (Array.isArray(loc?.hours) ? loc.hours : []).map((row) => ({
          days: row?.days || '',
          time: row?.time || '',
        })),
      })),
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
  'showTitle',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'titleAlign',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'activeTabBg',
  'activeTabText',
  'inactiveTabBg',
  'inactiveTabText',
  'tabBorderColor',
  'cardBg',
  'selectedBorderColor',
  'dividerColor',
  'nameColor',
  'nameFontWeight',
  'nameColorHover',
  'nameFontWeightHover',
  'cityColor',
  'rowColor',
  'rowFontWeight',
  'rowColorHover',
  'rowFontWeightHover',
  'linkTextColor',
  'iconColor',
  'arrowColor',
  'hoursColor',
  'hoursFontWeight',
  'hoursColorHover',
  'hoursFontWeightHover',
  'pinColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
