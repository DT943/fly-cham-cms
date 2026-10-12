import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "destinations-explore" block to <DestinationsExplore /> props — a
 * featured destination card beside a grid of destination cards, plus pagination.
 *
 * - Content is language-scoped (`block.content[lang]`), falling back to the
 *   first available language.
 * - Stores the editor shape: `{ title, subtitle, activitiesLabel, featured{…},
 *   cards[] (each with country, href, and activitiesHref = its "Things to Do" link),
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
      activitiesHref: thingsToDoHref(featured),
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
      country: card?.country || card?.iata || '',
      title: card?.title || '',
      ctaLabel: card?.ctaLabel || '',
      href: resolveCmsHref(card?.href),
      activitiesHref: thingsToDoHref(card),
      imageUrl: resolveCmsAsset(card?.imageUrl) || '',
      imageAlt: card?.imageAlt || '',
    })),
    pagination: content.pagination || {},
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

/**
 * A destination's "Things to Do" link: its saved `activitiesHref`, else its
 * city's things-to-do page. The city comes from the flights-to link
 * (`…/flights-to-abu-dhabi`), else the id (`abuDhabi` → `abu-dhabi`).
 */
function thingsToDoHref(item) {
  const saved = resolveCmsHref(item?.activitiesHref)
  if (saved) return saved
  const city =
    String(item?.href || '').match(/flights-to-([a-z0-9]+(?:-[a-z0-9]+)*)/i)?.[1] ||
    String(item?.id || '').replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  return city ? `/our-destinations/things-to-do-in-${city.toLowerCase()}` : undefined
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
