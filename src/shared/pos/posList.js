import { useEffect, useSyncExternalStore } from 'react'
import { getPosList } from '../../cms/api/getPosList.js'
import { setSupportedPos } from '../../i18n/languages.js'

/**
 * POS list (point of sale = country picked in the header), managed in the
 * admin at /cms2/pos and served by GET /api/public/pos-list.
 *
 * One store for every consumer — header country/region picker, booking
 * currency dropdowns, `/<pos>/` URL validation:
 *  1. Start from the last good list cached in localStorage, else the bundled
 *     default below (the list the site shipped with).
 *  2. Fetch the API once per page load; a valid non-empty list replaces the
 *     current one, is cached, and updates the valid POS codes for URLs.
 *  3. Any failure (offline, API not deployed, table missing) keeps what is
 *     showing, silently.
 *
 * Item shape: { code, nameEn, nameAr, flagUrl, currency, languages, position }
 * (`flagUrl` "" = no flag → the UI shows a globe, e.g. Global).
 */

const MEDIA = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags'
const STORAGE_KEY = 'flycham:pos-list:v1'

const item = (code, nameEn, nameAr, currency, languages, position, flag = true) => ({
  code,
  nameEn,
  nameAr,
  flagUrl: flag ? `${MEDIA}/${code}.svg` : '',
  currency,
  languages,
  position,
})

export const DEFAULT_POS_LIST = [
  item('sy', 'Syria', 'سوريا', 'SYP', ['en', 'ar'], 1),
  item('ae', 'United Arab Emirates', 'الإمارات العربية المتحدة', 'AED', ['en', 'ar'], 2),
  item('kw', 'Kuwait', 'الكويت', 'KWD', ['en', 'ar'], 3),
  item('iq', 'Iraq', 'العراق', 'IQD', ['en', 'ar'], 4),
  item('om', 'Oman', 'عُمان', 'OMR', ['en', 'ar'], 5),
  item('tr', 'Turkey', 'تركيا', 'TRY', ['en', 'ar'], 6),
  item('ly', 'Libya', 'ليبيا', 'LYD', ['en', 'ar'], 7),
  item('sa', 'Saudi Arabia', 'المملكة العربية السعودية', 'SAR', ['en', 'ar'], 8),
  item('am', 'Armenia', 'أرمينيا', 'AMD', ['en'], 9),
  item('gl', 'Global', 'عالمي', 'USD', ['en', 'ar'], 10, false),
]

const str = (value) => (typeof value === 'string' ? value.trim() : '')

/** Keep only well-formed rows; null when nothing usable remains. */
function normalize(list) {
  if (!Array.isArray(list)) return null
  const seen = new Set()
  const rows = list
    .map((row) => ({
      code: str(row?.code).toLowerCase(),
      nameEn: str(row?.nameEn),
      nameAr: str(row?.nameAr),
      flagUrl: str(row?.flagUrl),
      currency: str(row?.currency).toUpperCase(),
      languages: (Array.isArray(row?.languages) ? row.languages : []).filter((l) => l === 'en' || l === 'ar'),
      position: Number(row?.position) || 0,
    }))
    .filter((row) => {
      if (!/^[a-z]{2}$/.test(row.code) || seen.has(row.code)) return false
      if (!row.nameEn || !/^[A-Z]{3}$/.test(row.currency)) return false
      seen.add(row.code)
      return true
    })
    .map((row) => ({
      ...row,
      nameAr: row.nameAr || row.nameEn,
      languages: row.languages.length ? row.languages : ['en', 'ar'],
    }))
    .sort((a, b) => a.position - b.position || a.code.localeCompare(b.code))
  return rows.length ? rows : null
}

function readCache() {
  try {
    return normalize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null'))
  } catch {
    return null
  }
}

function writeCache(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* storage full / disabled — the in-memory list still works */
  }
}

let current = (typeof window !== 'undefined' && readCache()) || DEFAULT_POS_LIST
setSupportedPos(current.map((row) => row.code))

const listeners = new Set()
let fetchStarted = false

function loadOnce() {
  if (fetchStarted || typeof window === 'undefined') return
  fetchStarted = true
  getPosList()
    .then((data) => {
      const next = normalize(data)
      if (!next) return
      current = next
      writeCache(next)
      setSupportedPos(next.map((row) => row.code))
      listeners.forEach((listener) => listener())
    })
    .catch(() => {
      /* keep the cached / bundled list */
    })
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getSnapshot = () => current

/** The POS list (re-renders when the API copy arrives). */
export function usePosList() {
  useEffect(loadOnce, [])
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** Display name for the page language. */
export const posName = (pos, lang) => (lang === 'ar' ? pos.nameAr : pos.nameEn) || pos.nameEn
