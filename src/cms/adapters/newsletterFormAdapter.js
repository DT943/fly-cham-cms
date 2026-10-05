import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "newsletter-form" block to <NewsletterForm />.
 * The crew photo comes only from the CMS; an empty URL hides the image.
 */
export function newsletterFormProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    image: resolveCmsAsset(content.imageUrl) || '',
    imageAlt: content.imageAlt || '',
    titles: Array.isArray(content.titles) ? content.titles : [],
    firstNameLabel: content.firstNameLabel || '',
    lastNameLabel: content.lastNameLabel || '',
    emailLabel: content.emailLabel || '',
    destinationLabel: content.destinationLabel || '',
    destinations: Array.isArray(content.destinations) ? content.destinations : [],
    preferencesLabel: content.preferencesLabel || '',
    preferences: Array.isArray(content.preferences) ? content.preferences : [],
    languageLabel: content.languageLabel || '',
    languages: Array.isArray(content.languages) ? content.languages : [],
    consentBefore: content.consentBefore || '',
    privacyLabel: content.privacyLabel || '',
    consentAfter: content.consentAfter || '',
    privacyHref: resolveCmsHref(content.privacyHref) || '/legal/privacy-policy',
    submitLabel: content.submitLabel || '',
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'cardBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'labelColor',
  'labelFontWeight',
  'labelColorHover',
  'labelFontWeightHover',
  'bodyColor',
  'bodyFontWeight',
  'bodyColorHover',
  'bodyFontWeightHover',
  'linkColor',
  'linkFontWeight',
  'linkColorHover',
  'linkFontWeightHover',
  'buttonBg',
  'buttonBgHover',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'showLinks',
  'linkUnderline',
  'linkItalic',
]
