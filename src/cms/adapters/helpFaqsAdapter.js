import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "help-faqs" block to <HelpFaqs /> — nested categories, topics,
 * questions, method tabs, and table extras.
 */
export function helpFaqsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    categories: (Array.isArray(content.categories) ? content.categories : []).map(
      mapCategory,
    ),
    navLabel: content.navLabel || '',
    changeTopic: content.changeTopic || '',
    openAll: content.openAll || '',
    closeAll: content.closeAll || '',
    empty: content.empty || '',
    language: lang,
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapCategory(category) {
  return {
    id: category?.id || '',
    title: category?.title || '',
    icon: category?.icon || '',
    topics: (Array.isArray(category?.topics) ? category.topics : []).map((topic) => ({
      id: topic?.id || '',
      title: topic?.title || '',
      methodTabs: (Array.isArray(topic?.methodTabs) ? topic.methodTabs : [])
        .map((tab) => ({
          id: tab?.id || '',
          title: tab?.title || '',
        }))
        .filter((tab) => tab.id || tab.title),
      questions: (Array.isArray(topic?.questions) ? topic.questions : []).map((q) => ({
        id: q?.id || '',
        question: q?.question || '',
        answer: q?.answer || '',
        branch: q?.branch || '',
        extra: q?.extra || '',
        methodTab: q?.methodTab || '',
      })),
    })),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'iconColor',
  'focusColor',
  'activeTabColor',
  'inactiveTabColor',
  'focusWashColor',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'questionColor',
  'questionFontWeight',
  'questionColorHover',
  'questionFontWeightHover',
  'answerColor',
  'answerFontWeight',
  'answerColorHover',
  'answerFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
