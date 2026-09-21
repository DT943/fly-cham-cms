import { resolveFormIcon } from '../../pages/forms/utils/formsDirectoryIcons.js'
import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "forms-directory" block to <FormsDirectory /> props — a tabbed grid
 * of request-form cards grouped by travel stage.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - The block stores the editor shape: `{ title, tabs:[{label, cards:[...]}], links }`.
 *   (The public renderer uses each tab's own `label`, matching the cms2 preview.)
 * - Card icon names ('payment', 'refund', …) resolve to Phosphor components.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to FormsDirectory's own default (the original look).
 */
export function formsDirectoryProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    tabs: (Array.isArray(content.tabs) ? content.tabs : []).map((tab) => ({
      label: tab?.label || '',
      cards: (Array.isArray(tab?.cards) ? tab.cards : []).map((card, index) => ({
        id: card?.id || `${card?.title || 'card'}-${index}`,
        icon: resolveFormIcon(card?.icon),
        category: card?.category || '',
        title: card?.title || '',
        description: card?.description || '',
        href: resolveCmsHref(card?.href),
      })),
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
  'showTitle',
  'showIcon',
  'showCategory',
  'showDescription',
  'showArrow',
  'showCardBg',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'columns',
  'cardGap',
  'cardRadius',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'tabActiveBg',
  'tabActiveText',
  'tabInactiveBg',
  'tabInactiveText',
  'cardBg',
  'iconBg',
  'iconColor',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'categoryColor',
  'categoryFontWeight',
  'categoryColorHover',
  'categoryFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'arrowBg',
  'arrowColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
