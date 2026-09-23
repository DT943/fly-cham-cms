import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "destinations-explore" block to <DestinationsExplore /> props — a
 * featured destination card beside a grid of destination cards, plus pagination.
 *
 * - Content is language-scoped (`block.content[lang]`), falling back to the
 *   first available language.
 * - Stores the editor shape: `{ title, subtitle, activitiesLabel, featured{…}, cards[],
 *   pagination{…}, links }`. Empty image URLs fall back to the app's bundled
 *   destination photos (keyed by `id`) in the component.
 * - Only style keys the CMS provided are forwarded, so omitted keys keep the
 *   component's own defaults (the source look).
 */
export function destinationsExploreProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const featured = content.featured || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    activitiesLabel: content.activitiesLabel || '',
    featured: {
      country: featured.country || '',
      title: featured.title || '',
      heading: featured.heading || '',
      description: featured.description || '',
      ctaLabel: featured.ctaLabel || '',
      href: resolveCmsHref(featured.href),
      imageAlt: featured.imageAlt || '',
      images: Array.isArray(featured.images)
        ? featured.images
            .map((entry) =>
              typeof entry === 'string'
                ? entry
                : entry?.imageUrl || entry?.url || ''
            )
            .map((u) => resolveCmsAsset(u))
            .filter(Boolean)
        : [],
    },
    cards: (Array.isArray(content.cards) ? content.cards : []).map((card) => ({
      id: card?.id || '',
      iata: card?.iata || '',
      title: card?.title || '',
      ctaLabel: card?.ctaLabel || '',
      href: resolveCmsHref(card?.href),
      imageUrl: resolveCmsAsset(card?.imageUrl) || '',
      imageAlt: card?.imageAlt || '',
    })),
    pagination: content.pagination || {},
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
  'showSubtitle',
  'showFeatured',
  'showPagination',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardRadius',
  'cardIataColor',
  'cardTitleColor',
  'cardButtonBg',
  'cardButtonTextColor',
  'cardButtonTextFontWeight',
  'cardButtonBgHover',
  'cardButtonTextColorHover',
  'cardButtonTextFontWeightHover',
  'cardActivitiesColor',
  'featuredButtonBg',
  'featuredButtonText',
  'featuredButtonTextFontWeight',
  'featuredButtonBgHover',
  'featuredButtonTextHover',
  'featuredButtonTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
