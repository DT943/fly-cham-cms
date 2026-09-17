import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "live-chat-banner" block to <LiveChatBanner /> props.
 */
export function liveChatBannerProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    description: content.description,
    cta: content.buttonLabel,
    href: resolveCmsHref(content.buttonHref),
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
  'showIcon',
  'iconColor',
  'showTitle',
  'showButton',
  'showDescription',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'buttonBg',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'panelBg',
  'panelBgOpacity',
  'panelRadius',
  'panelPadding',
  'sectionBg',
  'showSectionBg',
  'sectionPadding',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
