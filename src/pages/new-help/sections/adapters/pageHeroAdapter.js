import { pick, pickContent, resolveCmsAsset } from './pick.js'

/**
 * Map a CMS "page-hero" block to <PageHero /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to PageHero's own default (nothing is overridden with
 *   `undefined`). This is what keeps the "keep the current/default" behaviour.
 */
export function pageHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    subtitle: content.subtitle,
    image: resolveCmsAsset(content.imageUrl) || undefined,
    mask: resolveCmsAsset(content.imageMask) || undefined,
    imageAlt: content.imageAlt,
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'showTitle',
  'showSubtitle',
  'showImage',
  'showMask',
  'imageSide',
  'imageRadius',
  'titleAlign',
  'titleColor',
  'subtitleColor',
  'titleFontWeight',
  'subtitleFontWeight',
  'sectionBg',
  'showSectionBg',
  'sectionPadding',
]
