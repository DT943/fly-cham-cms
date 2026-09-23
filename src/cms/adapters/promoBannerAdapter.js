import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "promo-banner" block to <PromoBanner /> props.
 *
 * cms2 stores this block's content nested (`ctaButton.content`,
 * `image.fileUrl`); flat keys are read as a fallback for robustness.
 */
export function promoBannerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  const ctaLabel = content.ctaButton?.content ?? content.buttonLabel
  const ctaHref = content.ctaButton?.href ?? content.buttonHref
  const imageUrl = content.image?.fileUrl ?? content.imageUrl
  const imageAlt = content.image?.alt ?? content.imageAlt

  return {
    title: content.title,
    description: content.description,
    cta: ctaLabel,
    href: resolveCmsHref(ctaHref),
    image: resolveCmsAsset(imageUrl) || undefined,
    imageAlt,
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
  'showSectionBg',
  'showOverlay',
  'sectionBg',
  'sectionPadding',
  'bannerHeight',
  'bannerRadius',
  'overlayColor',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'buttonBg',
  'buttonBgHover',
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
