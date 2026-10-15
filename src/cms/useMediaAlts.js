import { useEffect, useSyncExternalStore } from 'react'
import { buildMediaAltLookup } from './mediaAlt.js'

/**
 * Shared alt text for media-library images, read straight from the CMS
 * Supabase project (`media_alt_texts`, public read via the publishable key —
 * the same project that serves the images). See ./mediaAlt.js.
 */
const SUPABASE_URL = (
  import.meta.env.VITE_CMS_SUPABASE_URL || 'https://xbqrfakpcisqunyugrqt.supabase.co'
).replace(/\/$/, '')
const SUPABASE_KEY =
  import.meta.env.VITE_CMS_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_DVuilPL7OZyKMZ266JYJGA_eEaVyfpL'

const PAGE = 1000
// Admin edits show up on the next page view after this long.
const STALE_MS = 60_000

async function fetchMediaAltRows() {
  const rows = []
  for (let offset = 0; ; offset += PAGE) {
    const params = new URLSearchParams({
      select: 'bucket_id,object_path,alt_en,alt_ar',
      order: 'bucket_id,object_path',
      offset: String(offset),
      limit: String(PAGE),
    })
    const response = await fetch(`${SUPABASE_URL}/rest/v1/media_alt_texts?${params}`, {
      headers: { apikey: SUPABASE_KEY },
    })
    if (!response.ok) throw new Error(`media_alt_texts: HTTP ${response.status}`)
    const page = await response.json()
    rows.push(...page)
    if (page.length < PAGE) return rows
  }
}

// Module-level store: every block shares one fetch.
let lookup = null
let fetchedAt = 0
let pending = null
const listeners = new Set()

function loadMediaAlts() {
  if (pending || Date.now() - fetchedAt < STALE_MS) return
  pending = fetchMediaAltRows()
    .then((rows) => {
      lookup = buildMediaAltLookup(rows)
      listeners.forEach((listener) => listener())
    })
    .catch(() => {
      // Keep what we have (null → components keep their stored alts).
    })
    .finally(() => {
      fetchedAt = Date.now()
      pending = null
    })
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getLookup = () => lookup

/**
 * The alt lookup (`<bucket>/<path>` → `{ en, ar }`), or null until it loads —
 * or if it can't, in which case blocks render their stored alts unchanged.
 */
export default function useMediaAltLookup() {
  const value = useSyncExternalStore(subscribe, getLookup, getLookup)
  useEffect(() => {
    loadMediaAlts()
  }, [])
  return value
}
