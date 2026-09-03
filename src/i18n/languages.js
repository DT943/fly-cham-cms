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

function pathSegments(pathname) {
  return pathname.split('/').filter(Boolean)
}

export function getLanguageFromPath(path) {
  const { pathname } = splitPath(path)
  const segments = pathSegments(pathname)
  if (isSupportedLanguage(segments[0])) return segments[0]
  const last = segments[segments.length - 1]
  return isSupportedLanguage(last) ? last : null
}

export function hasLanguageSuffix(path) {
  const { pathname } = splitPath(path)
  const segments = pathSegments(pathname)
  if (segments.length < 2) return false
  return isSupportedLanguage(segments[segments.length - 1]) && !isSupportedLanguage(segments[0])
}

export function stripLanguage(path) {
  const { pathname, search, hash } = splitPath(path)
  const segments = pathSegments(pathname)

  if (isSupportedLanguage(segments[0])) {
    const stripped = `/${segments.slice(1).join('/')}`
    return `${stripped === '/' ? '/' : stripped}${search}${hash}`
  }

  if (isSupportedLanguage(segments[segments.length - 1])) {
    const stripped = `/${segments.slice(0, -1).join('/')}`
    return `${stripped === '/' ? '/' : stripped}${search}${hash}`
  }

  return `${pathname}${search}${hash}`
}

export function withLanguage(path, lang) {
  const language = getPreferredLanguage(lang)
  const { pathname, search, hash } = splitPath(stripLanguage(path))
  const rest = pathname === '/' ? '' : pathname
  return `/${language}${rest}${search}${hash}`
}

export function replaceLanguage(path, lang) {
  return withLanguage(path, lang)
}
