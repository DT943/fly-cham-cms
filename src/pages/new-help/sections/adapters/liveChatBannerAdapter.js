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
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'showIcon',
  'iconColor',
  'showTitle',
  'showButton',
  'showDescription',
  'titleColor',
  'titleFontWeight',
  'buttonBg',
  'buttonText',
  'buttonFontWeight',
  'descriptionColor',
  'descriptionFontWeight',
  'panelBg',
  'panelBgOpacity',
  'panelRadius',
  'panelPadding',
  'sectionBg',
  'showSectionBg',
  'sectionPadding',
]
