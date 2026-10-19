import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'
import { MEDIA_NEWSLETTER_DEFAULT_PATTERN } from '../../shared/components/mediaNewsletterSignupConstants.js'

/**
 * Map a CMS "media-newsletter-signup" block to <MediaNewsletterSignup />.
 */
export function mediaNewsletterSignupProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    label: content.label || '',
    placeholder: content.placeholder || '',
    cta: content.cta || '',
    pattern:
      resolveCmsAsset(content.patternUrl) || MEDIA_NEWSLETTER_DEFAULT_PATTERN,
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'sectionBg',
  'cardBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'inputBg',
  'inputText',
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
