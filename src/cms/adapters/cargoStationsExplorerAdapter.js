import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "cargo-stations-explorer" block to <CargoStationsExplorer /> props —
 * page header + full-bleed photo band with a stations panel.
 *
 * Stores the editor shape:
 * `{ title, subtitle, bgUrl, bgAlt, panelTitle, stations[], links }`.
 * Empty image URLs fall back to the app's bundled cargo-station photos (band,
 * and per-station by `id`) in the component. Only style keys the CMS provided
 * are forwarded, so omitted keys keep the component's own defaults (Figma look).
 */
export function cargoStationsExplorerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    bgImage: resolveCmsAsset(content.bgUrl) || undefined,
    bgAlt: content.bgAlt || '',
    panelTitle: content.panelTitle || '',
    stations: (Array.isArray(content.stations) ? content.stations : []).map((it) => ({
      id: it?.id || '',
      name: it?.name || '',
      location: it?.location || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
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
  'headerPaddingTop',
  'overlayOpacity',
  'bgFocus',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'panelBg',
  'headingColor',
  'headingFontWeight',
  'headingColorHover',
  'headingFontWeightHover',
  'listHeight',
  'cardBg',
  'cardBorderColor',
  'nameColor',
  'nameFontWeight',
  'nameColorHover',
  'nameFontWeightHover',
  'stationIconColor',
  'metaColor',
  'metaFontWeight',
  'metaColorHover',
  'metaFontWeightHover',
  'scrollTrackColor',
  'scrollThumbColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
