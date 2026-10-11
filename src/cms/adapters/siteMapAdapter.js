import { pick, pickContent, resolveCmsHref } from './pick.js'

const STYLE_KEYS = [
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'sectionTitleColor',
  'sectionTitleFontWeight',
  'sectionTitleColorHover',
  'sectionTitleFontWeightHover',
  'groupTitleColor',
  'groupTitleFontWeight',
  'groupTitleColorHover',
  'groupTitleFontWeightHover',
  'linkColor',
  'linkFontWeight',
  'linkColorHover',
  'linkFontWeightHover',
  'crumbColor',
  'crumbFontWeight',
  'crumbColorHover',
  'crumbFontWeightHover',
  'focusColor',
  'focusFontWeight',
  'focusColorHover',
  'focusFontWeightHover',
]

function mapLink(link) {
  return {
    label: link?.label || '',
    href: resolveCmsHref(link?.href),
  }
}

/**
 * Map a CMS "site-map" block to <SiteMap />.
 */
export function siteMapProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const sections = Array.isArray(content.sections) ? content.sections : []

  return {
    crumbs: (Array.isArray(content.crumbs) ? content.crumbs : []).map(mapLink),
    title: content.title,
    description: content.description,
    sections: sections.map((section) => ({
      title: section?.title || '',
      href: resolveCmsHref(section?.href),
      groups: (Array.isArray(section?.groups) ? section.groups : []).map((group) => ({
        title: group?.title || '',
        href: resolveCmsHref(group?.href),
        links: (Array.isArray(group?.links) ? group.links : []).map(mapLink),
      })),
    })),
    ...pick(style, STYLE_KEYS),
  }
}
