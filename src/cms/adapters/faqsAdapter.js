import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "faqs" block to <Faqs /> props — a titled accordion list with a
 * browse button. The block stores the flat editor shape (`browseLabel`,
 * `browseHref`, `items[{question,answer}]`); the nested `browseButton` keys are
 * kept only as fallbacks. Only provided style keys are forwarded.
 */
export function faqsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    browseLabel: content.browseLabel ?? content.browseButton?.content,
    browseHref:
      resolveCmsHref(content.browseHref ?? content.browseButton?.href) ?? '#',
    items: (Array.isArray(content.items) ? content.items : []).map((item, index) => ({
      id: item?.id || `${item?.question || 'faq'}-${index}`,
      question: item?.question || '',
      answer: item?.answer || '',
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
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'itemGap',
  'titleAlign',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'itemBg',
  'itemBorderColor',
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
  'browseHoverBg',
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
