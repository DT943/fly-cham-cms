import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "home-cham-miles-banner" block to <HomeChamMilesBanner /> props —
 * the "Join Cham Miles" gradient + photo split banner.
 *
 * Stores the editor shape: `{ title, description, joinLabel, joinHref,
 * discoverLabel, discoverHref, photoUrl, photoAlt, markUrl, links }`. Empty
 * image URLs fall back to the bundled artwork in the component. Only style keys
 * the CMS provided are forwarded, so omitted keys keep the component defaults
 * (the source look).
 */
export function homeChamMilesBannerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    joinLabel: content.joinLabel || '',
    joinHref: resolveCmsHref(content.joinHref) || '#',
    discoverLabel: content.discoverLabel || '',
    discoverHref: resolveCmsHref(content.discoverHref) || '#',
    photo: resolveCmsAsset(content.photoUrl) || undefined,
    photoAlt: content.photoAlt || '',
    mark: resolveCmsAsset(content.markUrl) || undefined,
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
  'sectionPadding',
  'bannerRadius',
  'showSectionBg',
  'sectionBg',
  'showDescription',
  'showMark',
  'markOpacity',
  'photoBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'descriptionOpacity',
  'showJoinButton',
  'showDiscoverButton',
  'joinButtonBg',
  'joinButtonBgHover',
  'joinButtonText',
  'joinButtonTextHover',
  'joinButtonTextFontWeight',
  'joinButtonTextFontWeightHover',
  'discoverButtonBg',
  'discoverButtonBgHover',
  'discoverButtonText',
  'discoverButtonTextHover',
  'discoverButtonTextFontWeight',
  'discoverButtonTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
