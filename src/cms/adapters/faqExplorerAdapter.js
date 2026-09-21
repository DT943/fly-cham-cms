import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "faq-explorer" block to <FaqExplorer /> props.
 *
 * cms2 stores this block's content with a nested browse button
 * (`browseButton.content`, `browseButton.href`) and categories carrying
 * `questions[{ question, answer }]`. Only the style keys the CMS actually
 * provided are forwarded, so any omitted key falls through to the component's
 * own default (the original look).
 */
export function faqExplorerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    browseLabel: content.browseButton?.content ?? content.browseLabel,
    browseHref: resolveCmsHref(content.browseButton?.href ?? content.browseHref) ?? '#',
    categories: (Array.isArray(content.categories) ? content.categories : []).map((cat) => ({
      label: cat?.label || '',
      questions: (Array.isArray(cat?.questions) ? cat.questions : []).map((q) => ({
        question: q?.question || '',
        answer: q?.answer || '',
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
  'showBrowse',
  'showItemBg',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'titleAlign',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'activeTabColor',
  'inactiveTabColor',
  'itemBg',
  'itemRadius',
  'questionColor',
  'questionFontWeight',
  'questionColorHover',
  'questionFontWeightHover',
  'answerColor',
  'answerFontWeight',
  'answerColorHover',
  'answerFontWeightHover',
  'iconColor',
  'browseBg',
  'browseText',
  'browseTextFontWeight',
  'browseTextHover',
  'browseTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
