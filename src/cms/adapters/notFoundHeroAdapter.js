import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "not-found-hero" block to <NotFoundHero /> props.
 *
 * Stores the editor shape: `{ eyebrow, title, description, ctaLabel, ctaHref,
 * imageUrl, imageAlt }`. Empty strings are passed through as-is (an admin can
 * blank a line on purpose); only keys the CMS never stored are left undefined
 * so the component falls back to its translations / bundled photo.
 */
export function notFoundHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    eyebrow: content.eyebrow,
    title: content.title,
    description: content.description,
    ctaLabel: content.ctaLabel,
    ctaHref: resolveCmsHref(content.ctaHref) || '/',
    image: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: content.imageAlt || undefined,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'height',
  'overlayColor',
  'overlayOpacity',
  'showEyebrow',
  'showDescription',
  'showButton',
  'eyebrowColor',
  'eyebrowFontWeight',
  'eyebrowColorHover',
  'eyebrowFontWeightHover',
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
]
