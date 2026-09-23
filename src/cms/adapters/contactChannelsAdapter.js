import { resolveContactChannelIcon } from '../../pages/contact-us/utils/contactChannels.jsx'
import { pick, pickContent, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "contact-channels" block to <ContactChannels /> props.
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - Icon names ('buildings', 'globe', …) resolve to Phosphor components.
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to ContactChannels' own default (the original look).
 */
export function contactChannelsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    channels: (content.channels || []).map((channel, index) => ({
      id: channel.id || `${channel.title}-${index}`,
      icon: resolveContactChannelIcon(channel.icon),
      href: resolveCmsHref(channel.href),
      title: channel.title,
      description: channel.description,
      cta: channel.cta,
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
  'showHeader',
  'showTitle',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'titleAlign',
  'columns',
  'cardGap',
  'cardBg',
  'iconBg',
  'iconColor',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'buttonBg',
  'buttonHoverBg',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
