import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "cham-miles-register" block to <ChamMilesRegister /> props — the
 * whole standalone /cham-miles screen (background, logo, welcome copy and the
 * create-account / sign-in card).
 *
 * Stores the flat editor shape (cms2 getChamMilesRegisterEditorContent).
 * Images render only from CMS URLs (empty = no image). Only style keys the CMS
 * provided are forwarded, so omitted keys keep the component's own defaults
 * (the source look).
 */
const TEXT_KEYS = [
  'bgAlt',
  'logoAlt',
  'headlineBefore',
  'headlineBrand',
  'headlineAfter',
  'description',
  'formTitle',
  'formSubtitle',
  'titlePlaceholder',
  'titleOptions',
  'firstNamePlaceholder',
  'lastNamePlaceholder',
  'emailPlaceholder',
  'countryCodePlaceholder',
  'countryCodeOptions',
  'phonePlaceholder',
  'dobLabel',
  'dayPlaceholder',
  'monthPlaceholder',
  'monthOptions',
  'yearPlaceholder',
  'agreeTermsPrefix',
  'termsLabel',
  'agreeTermsAnd',
  'privacyLabel',
  'agreeMarketingLabel',
  'continueLabel',
  'hasAccountText',
  'loginLinkLabel',
  'loginTitle',
  'loginSubtitle',
  'loginEmailPlaceholder',
  'loginPasswordPlaceholder',
  'showPasswordLabel',
  'hidePasswordLabel',
  'rememberMeLabel',
  'forgotLabel',
  'loginSubmitLabel',
  'noAccountText',
  'createAccountLabel',
]

export function chamMilesRegisterProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  const text = {}
  for (const key of TEXT_KEYS) {
    text[key] = typeof content[key] === 'string' ? content[key] : ''
  }

  return {
    ...text,
    bgUrl: resolveCmsAsset(content.bgUrl) || undefined,
    logoUrl: resolveCmsAsset(content.logoUrl) || undefined,
    logoHref: resolveCmsHref(content.logoHref) || '/',
    termsHref: resolveCmsHref(content.termsHref) || '#',
    privacyHref: resolveCmsHref(content.privacyHref) || '#',
    // Empty = the source's inert "Forgot password?" button.
    forgotHref: resolveCmsHref(content.forgotHref) || '',
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
  'headingColor',
  'headingFontWeight',
  'headingColorHover',
  'headingFontWeightHover',
  'highlightColor',
  'highlightFontWeight',
  'highlightColorHover',
  'highlightFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'cardBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'labelColor',
  'labelFontWeight',
  'labelColorHover',
  'labelFontWeightHover',
  'inputBg',
  'inputBorder',
  'continueBg',
  'continueBgHover',
  'continueText',
  'continueTextFontWeight',
  'continueTextHover',
  'continueTextFontWeightHover',
  'buttonBg',
  'buttonBgHover',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'ctaColor',
  'ctaFontWeight',
  'ctaColorHover',
  'ctaFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
