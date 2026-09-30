import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "cargo-shipment-types" block to <CargoShipmentTypes /> props —
 * header + tabbed shipment-type card (tab label, panel title/description, image).
 *
 * Stores the editor shape: `{ title, description, tabsLabel, items[], links }`.
 * Empty per-item image URLs render no image (no bundled fallback). Only style keys the CMS provided are forwarded, so
 * omitted keys keep the component's own defaults (the Figma look).
 */
export function cargoShipmentTypesProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    tabsLabel: content.tabsLabel || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      label: it?.label || '',
      title: it?.title || '',
      description: it?.description || '',
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
  'showHeader',
  'showDescription',
  'sectionPadding',
  'imageRadius',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'cardBg',
  'currentColor',
  'currentFontWeight',
  'currentColorHover',
  'currentFontWeightHover',
  'tabColor',
  'tabFontWeight',
  'tabColorHover',
  'tabFontWeightHover',
  'indicatorColor',
  'dividerColor',
  'itemTitleColor',
  'itemTitleFontWeight',
  'itemTitleColorHover',
  'itemTitleFontWeightHover',
  'itemBodyColor',
  'itemBodyFontWeight',
  'itemBodyColorHover',
  'itemBodyFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
