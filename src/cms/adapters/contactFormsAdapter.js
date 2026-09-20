import { resolveContactFormIcon } from '../../pages/contact-us/utils/contactForms.jsx'
import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "contact-forms" block to <ContactForms /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Icon names ('paymentIssue', 'refund', …) resolve to Phosphor components.
 * - The "View all" button is stored as `footerButton { content, href }`.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to ContactForms' own default (the original look).
 */
export function contactFormsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    subtitle: content.subtitle,
    // The block stores the editor shape (flat `buttonLabel`/`buttonHref`);
    // the nested `footerButton` / `viewAll` keys are kept as fallbacks.
    buttonLabel:
      content.buttonLabel ?? content.footerButton?.content ?? content.viewAll,
    buttonHref: resolveCmsHref(
      content.buttonHref ?? content.footerButton?.href ?? content.viewAllHref
    ),
    forms: (content.forms || []).map((form, index) => ({
      id: form.id || `${form.title}-${index}`,
      icon: resolveContactFormIcon(form.icon),
      href: resolveCmsHref(form.href),
      title: form.title,
      description: form.description,
    })),
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
  'showHeader',
  'showTitle',
  'showSubtitle',
  'showButton',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'columns',
  'cardGap',
  'titleAlign',
  'buttonAlign',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardBg',
  'iconBg',
  'iconColor',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'arrowBg',
  'arrowColor',
  'buttonBg',
  'buttonHoverBg',
  'buttonBorderColor',
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
