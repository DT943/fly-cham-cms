import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "recent-news" block to <RecentNews /> props — title, filters,
 * year-grouped listing cards, and pagination.
 */
export function recentNewsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    filterLabel: content.filterLabel || '',
    monthLabel: content.monthLabel || '',
    yearLabel: content.yearLabel || '',
    // Shown when no article matches the filters.
    emptyLabel: content.emptyLabel || EMPTY_LABEL[lang === 'ar' ? 'ar' : 'en'],
    previousLabel: content.previousLabel || '',
    nextLabel: content.nextLabel || '',
    months: mapOptions(content.months),
    years: mapOptions(content.years),
    topics: mapOptions(content.topics),
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      coverKey: it?.coverKey || '',
      date: it?.date || '',
      dateTime: it?.dateTime || '',
      category: it?.category || '',
      topic: it?.topic || '',
      year: it?.year || '',
      month: it?.month || '',
      title: it?.title || '',
      href: resolveCmsHref(it?.href) || '#',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

const EMPTY_LABEL = {
  en: 'No news matches the selected filters.',
  ar: 'لا توجد أخبار تطابق عوامل التصفية المحددة.',
}

function mapOptions(options) {
  if (!Array.isArray(options)) return []
  return options.map((it) => ({
    id: it?.id || '',
    label: it?.label || '',
  }))
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'pageSize',
  'showPagination',
  'columns',
  'cardGap',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'cardBg',
  'cardBorderColor',
  'iconColor',
  'topicActiveBg',
  'topicInactiveBg',
  'pageActiveBg',
  'pageInactiveBg',
  'navBg',
  'navDisabledBg',
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
  'chipActiveText',
  'chipActiveTextFontWeight',
  'chipActiveTextHover',
  'chipActiveTextFontWeightHover',
  'tabText',
  'tabTextFontWeight',
  'tabTextHover',
  'tabTextFontWeightHover',
  'sectionTitleColor',
  'sectionTitleFontWeight',
  'sectionTitleColorHover',
  'sectionTitleFontWeightHover',
  'metaColor',
  'metaFontWeight',
  'metaColorHover',
  'metaFontWeightHover',
  'chipText',
  'chipTextFontWeight',
  'chipTextHover',
  'chipTextFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
