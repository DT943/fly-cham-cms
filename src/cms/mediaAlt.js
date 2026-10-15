/**
 * Shared alt text for media-library images.
 *
 * Alt text belongs to the IMAGE, not to the component: the admin edits it once
 * in the cms2 Insert Media modal (table `media_alt_texts`, one row per bucket +
 * object path) and it applies wherever that image is rendered. At render time
 * `applyMediaAlts` overwrites each library image's sibling alt key with the
 * library value.
 *
 * Mirror of flychamadmin/src/cms2/utils/mediaAlt.js — keep both in sync.
 */

// Public Supabase Storage object URL: .../storage/v1/object/public/<bucket>/<path>
const STORAGE_OBJECT = /\/storage\/v1\/object\/public\/([^/?#]+)\/([^?#]+)/
const IMAGE_EXT = /\.(webp|png|jpe?g|gif|svg|avif)$/i

/** Lookup key for one image: `<bucket>/<path>` (bucket ids never contain "/"). */
export function mediaAltKey(bucketId, path) {
  return `${bucketId}/${path}`
}

/** `{ bucketId, path }` for a media-library image URL, or null for anything else. */
export function mediaRefFromUrl(url) {
  if (typeof url !== 'string') return null
  const match = url.match(STORAGE_OBJECT)
  if (!match) return null
  let path = match[2]
  try {
    path = decodeURIComponent(path)
  } catch {
    // Keep the raw path when it isn't valid percent-encoding.
  }
  return IMAGE_EXT.test(path) ? { bucketId: match[1], path } : null
}

/** Map of `<bucket>/<path>` → `{ en, ar }` from `media_alt_texts` rows. */
export function buildMediaAltLookup(rows) {
  const lookup = new Map()
  for (const row of rows || []) {
    if (!row?.bucket_id || !row?.object_path) continue
    lookup.set(mediaAltKey(row.bucket_id, row.object_path), {
      en: row.alt_en || '',
      ar: row.alt_ar || '',
    })
  }
  return lookup
}

/** The language's alt for an entry; Arabic falls back to the English alt. */
export function pickMediaAlt(entry, lang) {
  if (!entry) return ''
  return (String(lang).toLowerCase() === 'ar' ? entry.ar || entry.en : entry.en) || ''
}

/**
 * Alt for `url` in `lang`: the library alt ('' when the image has none yet),
 * or null when `url` is not a media-library image (the caller keeps its own).
 */
export function resolveMediaAlt(lookup, url, lang) {
  const ref = mediaRefFromUrl(url)
  if (!ref || !lookup) return null
  return pickMediaAlt(lookup.get(mediaAltKey(ref.bucketId, ref.path)), lang)
}

/**
 * The alt key that sits next to an image key in stored content:
 * `imageUrl`→`imageAlt`, `bgUrl`→`bgAlt`, `url`/`src`/`fileUrl`→`alt`,
 * `footerLogo`→`footerLogoAlt`. `aliases` covers documents that break the rule.
 */
export function altKeyFor(key, aliases) {
  if (aliases && aliases[key]) return aliases[key]
  if (key === 'url' || key === 'src' || key === 'fileUrl') return 'alt'
  if (/.Url$/.test(key)) return key.replace(/Url$/, 'Alt')
  if (/.Src$/.test(key)) return key.replace(/Src$/, 'Alt')
  return `${key}Alt`
}

/**
 * Return `value` (block content, a site document…) with the alt of every
 * media-library image set from the library. Untouched branches keep their
 * identity. With no lookup (not loaded yet, or the table is missing) `value`
 * is returned as-is and components keep their stored alts.
 */
export function applyMediaAlts(value, lookup, lang, aliases) {
  if (!lookup) return value

  const visit = (node) => {
    if (Array.isArray(node)) {
      let changed = false
      const next = node.map((item) => {
        const out = visit(item)
        if (out !== item) changed = true
        return out
      })
      return changed ? next : node
    }
    if (!node || typeof node !== 'object') return node

    let next = node
    const set = (key, val) => {
      if (next[key] === val) return
      if (next === node) next = { ...node }
      next[key] = val
    }
    for (const [key, val] of Object.entries(node)) {
      if (typeof val === 'string') {
        const alt = resolveMediaAlt(lookup, val, lang)
        if (alt !== null) set(altKeyFor(key, aliases), alt)
      } else if (val && typeof val === 'object') {
        const out = visit(val)
        if (out !== val) set(key, out)
      }
    }
    return next
  }

  return visit(value)
}

/**
 * Site header document: the generic pass, plus its two odd keys — the mobile
 * cover (`coverImageUrl` → `coverAlt`) and the logo, whose light and dark
 * variants share one `logo.alt` (the dark one is the default view).
 */
export function applySiteHeaderAlts(doc, lookup, lang) {
  if (!lookup || !doc) return doc
  const next = applyMediaAlts(doc, lookup, lang, { coverImageUrl: 'coverAlt' })
  const logo = next.logo
  if (!logo) return next
  const dark = resolveMediaAlt(lookup, logo.darkUrl, lang)
  const light = resolveMediaAlt(lookup, logo.lightUrl, lang)
  if (dark === null && light === null) return next
  const alt = dark || light || ''
  return alt === logo.alt ? next : { ...next, logo: { ...logo, alt } }
}
