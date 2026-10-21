import { footerIcon } from './footerStyle.js'

/**
 * Footer social glyphs — Phosphor icons (CMS stores Phosphor names).
 * Figma uses PaperPlaneTilt for Telegram; map TelegramLogo for older CMS docs.
 * Keep in sync with flychamadmin/src/cms2/components/footer/socialIcons.js
 */
const ICON_ALIASES = {
  TelegramLogo: 'PaperPlaneTilt',
}

export const socialIcon = (name) => footerIcon(ICON_ALIASES[name] || name)
