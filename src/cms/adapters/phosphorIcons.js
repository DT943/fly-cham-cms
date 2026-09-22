// Dynamic Phosphor icon resolver for CMS-driven content (public app).
//
// Icons are stored by their Phosphor PascalCase name (e.g. "MapPin"). Older
// content used curated keys ("mapPin", "creditCard", ...) — LEGACY_ICON_ALIASES
// maps those to the same glyph so existing pages keep working.
//
// Keep LEGACY_ICON_ALIASES in sync with the admin copy at
// flychamadmin/src/cms2/cmsComponents/shared/phosphorIcons.js
import * as Phosphor from '@phosphor-icons/react'

export const LEGACY_ICON_ALIASES = {
  phone: 'Phone',
  question: 'Question',
  mapPin: 'MapPin',
  clipboard: 'ClipboardText',
  track: 'PaperPlaneTilt',
  search: 'MagnifyingGlass',
  headset: 'Headset',
  chat: 'ChatCircleText',
  envelope: 'EnvelopeSimple',
  info: 'Info',
  buildings: 'Buildings',
  globe: 'GlobeHemisphereWest',
  creditCard: 'CreditCard',
  refund: 'ArrowUUpLeft',
  suitcase: 'TrolleySuitcase',
  wheelchair: 'Wheelchair',
  lifebuoy: 'Lifebuoy',
}

export const DEFAULT_ICON_NAME = 'Question'

export function normalizeIconName(name, aliases = {}) {
  if (!name) return DEFAULT_ICON_NAME
  return aliases[name] || LEGACY_ICON_ALIASES[name] || name
}

/**
 * Stored name (Pascal or legacy key) → a Phosphor React component.
 * `aliases` is an optional per-component legacy key → Pascal map (takes
 * precedence over the shared LEGACY_ICON_ALIASES).
 */
export function resolvePhosphorIcon(name, aliases = {}) {
  const pascal = normalizeIconName(name, aliases)
  return (
    Phosphor[`${pascal}Icon`] ||
    Phosphor[pascal] ||
    Phosphor.QuestionIcon
  )
}
