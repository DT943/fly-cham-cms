import { CMS_API_BASE_URL } from '../../api/cmsClient.js'
import { stripLanguage } from '../../../../i18n/languages.js'

/** Language-scoped CMS content, falling back to the first available language. */
export function pickContent(content, lang) {
  if (!content) return {}
  const keys = Object.keys(content)
  return content[lang] || content[keys[0]] || {}
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

export function resolveCmsHref(href) {
  if (!href || typeof href !== 'string') return undefined
  const trimmed = href.trim()
  if (!trimmed) return undefined
  if (/^(https?:|mailto:|tel:|#)/i.test(trimmed) || trimmed.startsWith('//')) {
    return trimmed
  }

  let path = trimmed.replace(POS_AND_LANG, '') || '/'
  if (!path.startsWith('/')) path = `/${path}`
  return stripLanguage(path)
}
