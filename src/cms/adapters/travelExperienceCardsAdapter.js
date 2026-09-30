import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "travel-experience-cards" block to <TravelExperienceCards /> props —
 * a heading and a grid of full-bleed journey cards (photo + tint + title +
 * description + arrow link).
 *
 * Stores the editor shape: `{ title, subtitle, learnMore, items[], links }`.
 * Images come only from the CMS; an empty per-card image renders nothing. Only
 * style keys the CMS provided are forwarded, so
 * omitted keys keep the component's own defaults (the source look).
 */
export function travelExperienceCardsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    learnMore: content.learnMore || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      title: it?.title || '',
      description: it?.description || '',
      href: resolveCmsHref(it?.href) || '#',
      tint: it?.tint || '#01263b',
      withLabel: it?.withLabel !== false,
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
  'showSubtitle',
  'columns',
  'cardGap',
  'cardRadius',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'learnMoreColor',
  'learnMoreFontWeight',
  'learnMoreColorHover',
  'learnMoreFontWeightHover',
  'cardBg',
  'cardBorderColor',
  'arrowBadgeBg',
  'arrowBadgeBgHover',
  'arrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
