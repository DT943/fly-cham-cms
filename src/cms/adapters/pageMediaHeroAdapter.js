import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "page-media-hero" block to <PageMediaHero /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to PageMediaHero's own default.
 * - The image comes only from the CMS; an empty URL passes no image.
 */
export function pageMediaHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  // `block.style` is already resolved to the active language by BlockRenderer.
  const style = block.style || {}
  const cmsImage =
    resolveCmsAsset(content.imageUrl) ||
    resolveCmsAsset(content.image?.fileUrl) ||
    ''

  return {
    title: content.title,
    subtitle: content.subtitle,
    image: cmsImage || undefined,
    imageAlt: content.imageAlt || content.image?.alt,
    buttonLabel: content.buttonLabel || '',
    buttonHref: resolveCmsHref(content.buttonHref) || '',
    slides: mapSlides(content.slides),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

/** Extra hero slides — only those with a usable image are kept. */
function mapSlides(slides) {
  if (!Array.isArray(slides)) return []
  return slides
    .map((slide, index) => ({
      id: slide?.id || `slide-${index + 2}`,
      image: resolveCmsAsset(slide?.imageUrl || slide?.image?.fileUrl) || '',
      imageAlt: slide?.imageAlt || slide?.image?.alt || '',
      objectPosition: slide?.objectPosition || undefined,
      title: slide?.title || '',
      subtitle: slide?.subtitle || '',
      buttonLabel: slide?.buttonLabel || '',
      buttonHref: resolveCmsHref(slide?.buttonHref) || '',
    }))
    .filter((slide) => slide.image)
}

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'layout',
  'sectionBg',
  'height',
  'contentWidth',
  'objectPosition',
  'showTitle',
  'showSubtitle',
  'showOverlay',
  'overlayWidth',
  'titleColor',
  'subtitleColor',
  'titleFontWeight',
  'subtitleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'titleSize',
  'showButton',
  'buttonBg',
  'buttonBgHover',
  'buttonText',
  'buttonTextHover',
  'buttonTextFontWeight',
  'buttonTextFontWeightHover',
  'autoplay',
  'slideDuration',
  'showControls',
  'controlsColor',
  'controlsBottom',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
