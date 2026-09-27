// A root CMS page URL: one lowercase slug segment (matches the admin's
// "Add new page" slug rule), optionally with a trailing slash.
const CMS_PAGE_PATH = /^\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/

/** The CMS slug for a language-stripped path like `/summer-offers`, else null. */
export function cmsSlugFromPath(path) {
  const pathname = String(path || '').split(/[?#]/)[0]
  return pathname.match(CMS_PAGE_PATH)?.[1] ?? null
}
