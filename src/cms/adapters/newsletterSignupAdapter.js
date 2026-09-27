import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "newsletter-signup" block to <NewsletterSignup /> props — an email
 * capture banner (presentational; the form does not submit). Empty artwork falls
 * back to the app's bundled plane sliver in the component.
 */
export function newsletterSignupProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    label: content.label || '',
    placeholder: content.placeholder || '',
    cta: content.cta || '',
    plane: resolveCmsAsset(content.planeUrl) || undefined,
    background: resolveCmsAsset(content.bgUrl) || undefined,
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'variant',
  'overlayOpacity',
  'bgFocus',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'inputBg',
  'inputBorder',
  'inputText',
  'iconColor',
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
