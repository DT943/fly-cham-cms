import { resolveHelpCategoryIcon } from '../../../help/utils/helpCategories.jsx'
import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "help-categories" block to <HelpCategories /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to HelpCategories' own default.
 */
export function helpCategoriesProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    subtitle: content.subtitle,
    cards: (content.cards || []).map((card, index) => ({
      id: card.id || `${card.title}-${index}`,
      href: resolveCmsHref(card.href),
      icon: resolveHelpCategoryIcon(card.icon),
      title: card.title,
      description: card.description,
    })),
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'showHeader',
  'showSectionTitle',
  'showSectionSubtitle',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'sectionTitleColor',
  'sectionTitleFontWeight',
  'sectionSubtitleColor',
  'titleAlign',
  'columns',
  'cardGap',
  'showIcon',
  'showArrow',
  'showCardBg',
  'showCardTitle',
  'showCardDescription',
  'cardBg',
  'iconBg',
  'iconColor',
  'arrowBg',
  'arrowColor',
  'cardRadius',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardDescriptionColor',
]
