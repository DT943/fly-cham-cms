import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "destination-things-to-do" block to <DestinationThingsToDo /> props
 * — a heading, a grid of image cards (badge + title + description) and a CTA.
 *
 * Stores the editor shape: `{ title, subtitle, cta, ctaHref, items[], links }`.
 * Empty per-card image URLs fall back to the app's bundled photos (keyed by
 * `id`) in the component. Only style keys the CMS provided are forwarded, so
 * omitted keys keep the component's own defaults (the source look).
 */
export function destinationThingsToDoProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    cta: content.cta || '',
    ctaHref: resolveCmsHref(content.ctaHref),
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      icon: it?.icon || 'binoculars',
      badge: it?.badge || '',
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
  'showSubtitle',
  'showCta',
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
  'overlayColor',
  'badgeBorderColor',
  'buttonBg',
  'buttonHoverBg',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
