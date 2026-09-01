export const SUPPORTED_LANGUAGES = ['en', 'ar']
export const DEFAULT_LANGUAGE = 'en'

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

export function getLanguageFromPath(path) {
  const { pathname } = splitPath(path)
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  return isSupportedLanguage(last) ? last : null
}

export function stripLanguage(path) {
  const { pathname, search, hash } = splitPath(path)
  const lang = getLanguageFromPath(pathname)
  if (!lang) return `${pathname}${search}${hash}`

  const stripped = pathname.replace(new RegExp(`/${lang}/?$`), '') || '/'
  return `${stripped}${search}${hash}`
}

export function withLanguage(path, lang) {
  const language = getPreferredLanguage(lang)
  const { pathname, search, hash } = splitPath(stripLanguage(path))
  const base = pathname.replace(/\/+$/, '')
  return `${base === '' || base === '/' ? '' : base}/${language}${search}${hash}`
}

export function replaceLanguage(path, lang) {
  return withLanguage(path, lang)
}
