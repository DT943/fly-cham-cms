import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "legal-hub" block to <LegalHub /> — page title, 2-up directory
 * cards, and the help banner.
 */
export function legalHubProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const help = content.help || {}

  return {
    title: content.title,
    subtitle: content.subtitle,
    items: (content.items || []).map((item, index) => ({
      id: item.id || `${item.title}-${index}`,
      icon: item.icon,
      title: item.title,
      description: item.description,
      cta: item.cta,
      href: resolveCmsHref(item.href),
    })),
    help: {
      title: help.title,
      description: help.description,
      cta: help.cta,
      href: resolveCmsHref(help.href) || '/help',
      image: resolveCmsAsset(help.imageUrl) || undefined,
      imageAlt: help.imageAlt,
      objectPosition: help.objectPosition || '70% center',
    },
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'showHeader',
  'showTitle',
  'showSubtitle',
  'showCards',
  'showHelpCta',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardBg',
  'iconTileBg',
  'iconColor',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'ctaColor',
  'ctaFontWeight',
  'ctaColorHover',
  'ctaFontWeightHover',
  'helpTitleColor',
  'helpTitleFontWeight',
  'helpTitleColorHover',
  'helpTitleFontWeightHover',
  'helpDescriptionColor',
  'helpDescriptionFontWeight',
  'helpDescriptionColorHover',
  'helpDescriptionFontWeightHover',
  'helpButtonBg',
  'helpButtonBgHover',
  'helpButtonText',
  'helpButtonTextHover',
  'helpButtonTextFontWeight',
  'helpButtonTextFontWeightHover',
  'helpOverlayColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
