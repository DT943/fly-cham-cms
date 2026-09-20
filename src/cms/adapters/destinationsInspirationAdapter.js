import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "destinations-inspiration" block to <DestinationsInspiration /> props.
 *
 * - Content is language-scoped (`block.content[lang]`), falling back to the
 *   first available language.
 * - Stores the flat editor shape: `{ title, description, buttonLabel,
 *   buttonHref, bgImageUrl, coast/falls/city ImageUrl+Alt, links }`. Empty
 *   image URLs fall back to the app's bundled photos in the component.
 * - Only style keys the CMS provided are forwarded, so omitted keys keep the
 *   component's own defaults (the source look).
 */
export function destinationsInspirationProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    description: content.description,
    cta: content.buttonLabel ?? content.ctaButton?.content,
    href: resolveCmsHref(content.buttonHref ?? content.ctaButton?.href),
    bgImage: resolveCmsAsset(content.bgImageUrl) || undefined,
    coastImage: resolveCmsAsset(content.coastImageUrl) || undefined,
    coastImageAlt: content.coastImageAlt,
    fallsImage: resolveCmsAsset(content.fallsImageUrl) || undefined,
    fallsImageAlt: content.fallsImageAlt,
    cityImage: resolveCmsAsset(content.cityImageUrl) || undefined,
    cityImageAlt: content.cityImageAlt,
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
  'showDescription',
  'showButton',
  'showBgImage',
  'showOverlay',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'bannerBg',
  'bannerRadius',
  'titleColor',
  'descriptionColor',
  'buttonBg',
  'buttonText',
  'titleFontWeight',
  'descriptionFontWeight',
  'buttonTextFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
