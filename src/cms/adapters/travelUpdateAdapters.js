import { pick, pickContent, resolveCmsHref } from './pick.js'

const str = (value) => (typeof value === 'string' ? value : '')
const list = (value) => (Array.isArray(value) ? value : [])

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

/**
 * Map a CMS "travel-update-hero" block to <TravelUpdateHero /> props.
 * Stored editor shape: `{ tag, title, subtitle, links }`.
 */
export function travelUpdateHeroProps(block, lang) {
  const content = pickContent(block.content, lang)
  return {
    tag: str(content.tag),
    title: str(content.title),
    subtitle: str(content.subtitle),
    links: mapBacklinks(content.links),
    ...pick(block.style || {}, HERO_STYLE_KEYS),
  }
}

/**
 * Map a CMS "travel-update-detail" block to <TravelUpdateDetail /> props.
 * Stored editor shape: `{ overviewTitle, overview, guidelinesIcon,
 * guidelinesTitle, guidelines[{icon,title,body,bullets}], hubsTitle,
 * hubs[{name,status,tone}], resourcesTitle, resources[{label,href}] }`.
 */
export function travelUpdateDetailProps(block, lang) {
  const content = pickContent(block.content, lang)
  return {
    overviewTitle: str(content.overviewTitle),
    overview: str(content.overview),
    guidelinesIcon: str(content.guidelinesIcon) || 'Question',
    guidelinesTitle: str(content.guidelinesTitle),
    guidelines: list(content.guidelines).map((item) => ({
      icon: str(item?.icon) || 'Info',
      title: str(item?.title),
      body: str(item?.body),
      bullets: str(item?.bullets),
    })),
    hubsTitle: str(content.hubsTitle),
    hubs: list(content.hubs).map((item) => ({
      name: str(item?.name),
      status: str(item?.status),
      tone: item?.tone === 'normal' ? 'normal' : 'warning',
    })),
    resourcesTitle: str(content.resourcesTitle),
    resources: list(content.resources)
      .map((item) => ({ label: str(item?.label), href: resolveCmsHref(item?.href) }))
      .filter((item) => item.label),
    ...pick(block.style || {}, DETAIL_STYLE_KEYS),
  }
}

// Keep in sync with cms2 DEFAULT_TRAVEL_UPDATE_HERO_STYLE.
const HERO_STYLE_KEYS = [
  'showTag',
  'showSubtitle',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'tagBg',
  'badgeText',
  'badgeTextFontWeight',
  'badgeTextHover',
  'badgeTextFontWeightHover',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]

// Keep in sync with cms2 DEFAULT_TRAVEL_UPDATE_DETAIL_STYLE.
const DETAIL_STYLE_KEYS = [
  'showGuidelines',
  'showSidebar',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'articleBg',
  'sidebarBg',
  'guidelineBg',
  'dividerColor',
  'titleColor',
  'titleFontWeight',
  'bodyColor',
  'bodyFontWeight',
  'headingColor',
  'headingFontWeight',
  'headingIconColor',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardIconColor',
  'cardBodyColor',
  'cardBodyFontWeight',
  'bulletColor',
  'inlineLinkColor',
  'sectionTitleColor',
  'sectionTitleFontWeight',
  'nameColor',
  'nameFontWeight',
  'statusWarningColor',
  'statusNormalColor',
  'itemColor',
  'itemFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'bodyColorHover',
  'bodyFontWeightHover',
  'headingColorHover',
  'headingFontWeightHover',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardBodyColorHover',
  'cardBodyFontWeightHover',
  'sectionTitleColorHover',
  'sectionTitleFontWeightHover',
  'nameColorHover',
  'nameFontWeightHover',
  'itemColorHover',
  'itemFontWeightHover',
]
