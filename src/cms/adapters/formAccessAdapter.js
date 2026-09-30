import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "form-access" block to <FormAccess /> props — the "Find your
 * booking" card on the request-a-form page.
 *
 * - The block stores the editor shape: `{ subtitle, pnrLabel, pnrHint,
 *   lastNameLabel, submitLabel, links }`. The stage label + title are not CMS
 *   content — FormAccess reads them from the form in the URL.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to FormAccess's own default.
 */
export function formAccessProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    subtitle: content.subtitle || '',
    pnrLabel: content.pnrLabel || '',
    pnrHint: content.pnrHint || '',
    lastNameLabel: content.lastNameLabel || '',
    submitLabel: content.submitLabel || '',
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

// Keep in sync with cms2 `DEFAULT_FORM_ACCESS_STYLE`.
const STYLE_KEYS = [
  'showEyebrow',
  'showTitle',
  'showSubtitle',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'cardBg',
  'inputBg',
  'iconColor',
  'eyebrowColor',
  'eyebrowFontWeight',
  'eyebrowColorHover',
  'eyebrowFontWeightHover',
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
  'submitBg',
  'submitBgHover',
  'submitTextColor',
  'submitTextFontWeight',
  'submitTextColorHover',
  'submitTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
