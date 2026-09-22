import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "explore-marhaba" block to <ExploreMarhaba /> props — a year
 * filter plus a grid of magazine issue covers.
 *
 * Stores the editor shape: `{ title, items[], links }`. Empty cover URLs fall
 * back to bundled photos keyed by `coverKey` in the component.
 */
export function exploreMarhabaProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      year: it?.year || '',
      issue: it?.issue ?? '',
      month: it?.month || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      coverKey: it?.coverKey || '',
      href: resolveCmsHref(it?.href) || '/magazine-view',
      isNew: it?.isNew === true,
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'columns',
  'cardGap',
  'cardRadius',
  'sectionPadding',
  'showYearFilter',
  'showYearHeading',
  'showSectionBg',
  'sectionBg',
  'panelBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'newBadgeBg',
  'badgeText',
  'badgeTextFontWeight',
  'badgeTextHover',
  'badgeTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
