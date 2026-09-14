import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "cta-banner" block to <CtaBanner /> props.
 */
export function ctaBannerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    description: content.description,
    cta: content.buttonLabel,
    href: resolveCmsHref(content.buttonHref),
    image: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: content.imageAlt,
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'showTitle',
  'showButton',
  'showDescription',
  'showHeroImage',
  'showOverlay',
  'overlayColor',
  'bannerHeight',
  'bannerRadius',
  'titleAlign',
  'titleColor',
  'titleFontWeight',
  'descriptionColor',
  'descriptionFontWeight',
  'buttonBg',
  'buttonText',
  'buttonTextFontWeight',
  'verticalAlign',
  'sectionBg',
  'showSectionBg',
  'sectionPadding',
]
