// A CMS page URL: one or more lowercase slug segments. "Add new page" stores a
// flat slug; when the page has a parent the public address is the parent's
// path plus that slug. The last segment is always the CMS slug.
const CMS_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** The CMS slug for a language-stripped path, else null. */
export function cmsSlugFromPath(path) {
  const pathname = String(path || '').split(/[?#]/)[0]
  const segments = pathname.split('/').filter(Boolean)
  const slug = segments[segments.length - 1]
  if (!slug || !CMS_SLUG.test(slug)) return null
  return slug
}
