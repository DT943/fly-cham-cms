/**
 * Site URLs are `/<pos>/<lang>/<page>`, e.g. `/sy/en`, `/ae/ar/our-destinations`.
 *
 * POS (point of sale = the country picked in the header) only changes the URL
 * and the header's active country — page content is the same for every POS.
 * Older URLs without a POS (`/en/...`), without a language (`/ae/...`) or with
 * a language suffix (`/help/en`) are redirected to the full form by
 * LocalizedRoutes.
 */
export const SUPPORTED_LANGUAGES = ['en', 'ar']
export const DEFAULT_LANGUAGE = 'en'

/** POS codes, one per country in the header's region menu (`gl` = Global). */
export const SUPPORTED_POS = ['sy', 'ae', 'kw', 'iq', 'om', 'tr', 'ly', 'sa', 'am', 'gl']
export const DEFAULT_POS = 'sy'

export function isSupportedPos(value) {
  return SUPPORTED_POS.includes(value)
}

export function isSupportedLanguage(value) {
  return SUPPORTED_LANGUAGES.includes(value)
}

export function getPreferredLanguage(language) {
  const resolved = (language || DEFAULT_LANGUAGE).split('-')[0]
  return isSupportedLanguage(resolved) ? resolved : DEFAULT_LANGUAGE
}

export function isInternalPath(path) {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')
}

function splitPath(path = '/') {
  const [withoutHash, hash = ''] = path.split('#')
  const [pathname, search = ''] = withoutHash.split('?')
  return {
    pathname: pathname || '/',
    search: search ? `?${search}` : '',
    hash: hash ? `#${hash}` : '',
  }
}

function pathSegments(pathname) {
  return pathname.split('/').filter(Boolean)
}

/**
 * Split a pathname into its locale parts and the page segments:
 *   /sy/en/help → { pos: 'sy', lang: 'en', page: ['help'] }
 *   /en/help    → { pos: null, lang: 'en', page: ['help'] }   (legacy)
 *   /ae/help    → { pos: 'ae', lang: null, page: ['help'] }
 *   /help/en    → { pos: null, lang: 'en', page: ['help'], suffix: true }
 *   /ae/help/en → { pos: 'ae', lang: 'en', page: ['help'], suffix: true }
 */
function parseLocale(pathname) {
  const segments = pathSegments(pathname)
  let index = 0
  const pos = isSupportedPos(segments[index]) ? segments[index++] : null
  let lang = isSupportedLanguage(segments[index]) ? segments[index++] : null
  let page = segments.slice(index)
  let suffix = false
  if (!lang && page.length > 1 && isSupportedLanguage(page[page.length - 1])) {
    lang = page[page.length - 1]
    page = page.slice(0, -1)
    suffix = true
  }
  return { pos, lang, page, suffix }
}

export function getLanguageFromPath(path) {
  return parseLocale(splitPath(path).pathname).lang
}

export function getPosFromPath(path) {
  return parseLocale(splitPath(path).pathname).pos
}

/** The POS of the page being shown (from the browser URL), else the default. */
export function getCurrentPos() {
  if (typeof window === 'undefined') return DEFAULT_POS
  return getPosFromPath(window.location.pathname) || DEFAULT_POS
}

/** True when the URL already has the full `/<pos>/<lang>/...` form. */
export function hasLocalePrefix(path) {
  const { pos, lang } = parseLocale(splitPath(path).pathname)
  return Boolean(pos && lang)
}

export function hasLanguageSuffix(path) {
  return parseLocale(splitPath(path).pathname).suffix
}

/** The page path without POS and language: `/sy/en/help?x=1` → `/help?x=1`. */
export function stripLanguage(path) {
  const { pathname, search, hash } = splitPath(path)
  const { page } = parseLocale(pathname)
  return `/${page.join('/')}${search}${hash}`
}

/**
 * `path` under `/<pos>/<lang>`. The POS defaults to the one in the current URL,
 * so links keep the visitor's chosen country.
 */
export function withLanguage(path, lang, pos = getCurrentPos()) {
  const language = getPreferredLanguage(lang)
  const market = isSupportedPos(pos) ? pos : DEFAULT_POS
  const { pathname, search, hash } = splitPath(stripLanguage(path))
  const rest = pathname === '/' ? '' : pathname
  return `/${market}/${language}${rest}${search}${hash}`
}

/** Same page under another language and/or POS (header region menu). */
export function replaceLanguage(path, lang, pos) {
  return withLanguage(path, lang, pos)
}
