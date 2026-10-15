import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "destination-things-to-do" block to <DestinationThingsToDo /> props
 * — a heading, a grid of image cards (badge + title + description) and a CTA.
 *
 * Stores the editor shape: `{ title, subtitle, cta, ctaHref, tags[], items[], links }`.
 * A card badge is the label of its chosen tag (`badgeId`), falling back to saved text.
 * Empty per-card image URLs render no image (no bundled fallback). Only style keys the CMS provided are forwarded, so
 * omitted keys keep the component's own defaults (the source look).
 */
export function destinationThingsToDoProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const tags = Array.isArray(content.tags) ? content.tags : []

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    cta: content.cta || '',
    ctaHref: resolveCmsHref(content.ctaHref),
    learnMore: content.learnMore || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      icon: it?.icon || 'binoculars',
      badgeId: String(it?.badgeId || '').trim(),
      badge: badgeLabel(it, tags),
      title: it?.title || '',
      description: it?.description || '',
      href: resolveCmsHref(it?.href),
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

/** Tag label for a card, or the badge text saved before tags existed. */
function badgeLabel(item, tags) {
  const badgeId = String(item?.badgeId || '').trim()
  const byId = tags.find((tag) => String(tag?.id || '') === badgeId)
  if (byId) return String(byId.label || '').trim()
  return item?.badge || ''
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
  'hideCardDescription',
  'showCardButton',
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
  'learnMoreColor',
  'learnMoreFontWeight',
  'learnMoreColorHover',
  'learnMoreFontWeightHover',
  'arrowBadgeBg',
  'arrowBadgeBgHover',
  'arrowColor',
  'carouselArrowBg',
  'carouselArrowColor',
  'carouselArrowBorder',
  'carouselArrowHover',
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
