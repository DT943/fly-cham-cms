import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "travel-agent-login" block to <TravelAgentLogin /> props — the whole
 * standalone Travel Agent B2B login screen (sky, plane, logo, welcome copy and
 * the glass login card).
 *
 * Stores the flat editor shape (cms2 getTravelAgentLoginEditorContent). Empty
 * image URLs fall back to the app's bundled assets in the component. Only style
 * keys the CMS provided are forwarded, so omitted keys keep the component's own
 * defaults (the source look).
 */
export function travelAgentLoginProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const str = (key) => (typeof content[key] === 'string' ? content[key] : '')

  return {
    welcome: str('welcome'),
    headline: str('headline'),
    bgUrl: resolveCmsAsset(content.bgUrl) || undefined,
    bgAlt: str('bgAlt'),
    planeUrl: resolveCmsAsset(content.planeUrl) || undefined,
    planeAlt: str('planeAlt'),
    logoUrl: resolveCmsAsset(content.logoUrl) || undefined,
    logoHref: resolveCmsHref(content.logoHref) || '/',
    formTitle: str('formTitle'),
    formSubtitle: str('formSubtitle'),
    usernameLabel: str('usernameLabel'),
    usernamePlaceholder: str('usernamePlaceholder'),
    passwordLabel: str('passwordLabel'),
    passwordPlaceholder: str('passwordPlaceholder'),
    rememberMeLabel: str('rememberMeLabel'),
    forgotLabel: str('forgotLabel'),
    forgotHref: resolveCmsHref(content.forgotHref) || '#',
    loginLabel: str('loginLabel'),
    noAccountText: str('noAccountText'),
    joinLabel: str('joinLabel'),
    joinHref: resolveCmsHref(content.joinHref) || '#',
    needHelpText: str('needHelpText'),
    supportLabel: str('supportLabel'),
    supportHref: resolveCmsHref(content.supportHref) || '#',
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
  'showPlane',
  'eyebrowColor',
  'eyebrowFontWeight',
  'eyebrowColorHover',
  'eyebrowFontWeightHover',
  'headingColor',
  'headingFontWeight',
  'headingColorHover',
  'headingFontWeightHover',
  'cardBg',
  'cardBgOpacity',
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
