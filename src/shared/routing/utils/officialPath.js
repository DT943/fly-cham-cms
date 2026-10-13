/**
 * CMS content still stores draft `new-*` slugs. Navigation should open the
 * official route, not the legacy address that only redirects.
 */
const OFFICIAL_ALIASES = {
  '/home': '/',
  '/cargo-service': '/cargo',
  '/recent-news': '/media-center/recent-news',
  '/travel-experience/our-responsibility': '/our-responsibility',
  '/our-destinations/city-sights': '/our-destinations/activities-and-attractions',
}

export function toOfficialPath(path) {
  if (!path || typeof path !== 'string' || !path.startsWith('/')) return path

  const hashAt = path.indexOf('#')
  const hash = hashAt === -1 ? '' : path.slice(hashAt)
  const beforeHash = hashAt === -1 ? path : path.slice(0, hashAt)
  const queryAt = beforeHash.indexOf('?')
  const search = queryAt === -1 ? '' : beforeHash.slice(queryAt)
  const pathname = (queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt)) || '/'

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => (segment.startsWith('new-') ? segment.slice(4) : segment))

  const stripped = segments.length ? `/${segments.join('/')}` : '/'
  const official = OFFICIAL_ALIASES[stripped] || stripped
  return `${official}${search}${hash}`
}
