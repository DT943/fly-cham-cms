import { CMS_API_BASE_URL } from '../api/cmsClient.js'
import { stripLanguage, SUPPORTED_LANGUAGES } from '../../i18n/languages.js'

/** Language-scoped CMS content, falling back to the first available language. */
export function pickContent(content, lang) {
  if (!content) return {}
  const keys = Object.keys(content)
  return content[lang] || content[keys[0]] || {}
}

/** True when `value` is a per-language map ({ en: {...}, ar: {...} }), not a flat object. */
function isLanguageMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value)
  return keys.length > 0 && keys.every((k) => SUPPORTED_LANGUAGES.includes(k))
}

/**
 * Language-scoped CMS style. Content and style are both per-language now, but
 * older components stored a single flat style shared across languages:
 *   - per-language map → `style[lang]` (fallback to first authored language),
 *   - legacy flat style → returned as-is (it applies to every language).
 */
export function pickStyle(style, lang) {
  if (!style || typeof style !== 'object' || Array.isArray(style)) return {}
  if (isLanguageMap(style)) {
    const keys = Object.keys(style)
    return style[lang] || style[keys[0]] || {}
  }
  return style
}

/** Copy only the keys that are actually present, so component defaults still apply. */
export function pick(source, keys) {
  const out = {}
  if (!source) return out
  for (const key of keys) {
    if (source[key] !== undefined) out[key] = source[key]
  }
  return out
}

/** Prefix relative CMS media paths with the CMS origin. Absolute URLs pass through. */
export function resolveCmsAsset(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed
  const base = CMS_API_BASE_URL.replace(/\/$/, '')
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${base}${path}`
}

/** FlyCham CMS links are often `/gb/en/...` (POS + language). Strip those for this app. */
const POS_AND_LANG = /^\/[a-z]{2}\/(en|ar)(?=\/|$)/i

/** This site's own hosts: full URLs to them are treated as in-app links. */
const SITE_HOSTS = new Set(['cms-flycham.alpatrose.com'])

/** `https://<this site>/en/help?x` → `/en/help?x`; any other value is unchanged. */
function toSitePath(href) {
  if (!/^https?:\/\//i.test(href)) return href
  try {
    const url = new URL(href)
    const own =
      SITE_HOSTS.has(url.host) ||
      (typeof window !== 'undefined' && url.host === window.location.host)
    return own ? `${url.pathname}${url.search}${url.hash}` : href
  } catch {
    return href
  }
}

export function resolveCmsHref(href) {
  if (!href || typeof href !== 'string') return undefined
  // Same-site full URLs become app paths, so they keep the visitor's POS/language.
  const trimmed = toSitePath(href.trim())
  if (!trimmed) return undefined
  if (/^(https?:|mailto:|tel:|#)/i.test(trimmed) || trimmed.startsWith('//')) {
    return trimmed
  }

  let path = trimmed.replace(POS_AND_LANG, '') || '/'
  if (!path.startsWith('/')) path = `/${path}`
  return stripLanguage(path)
}
