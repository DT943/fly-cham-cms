import { useEffect, useSyncExternalStore } from 'react'
import { getHeader } from '../../../cms/api/getHeader.js'
import useCurrentLanguage from '../../hooks/useCurrentLanguage.js'
import defaultHeaders from './defaultHeader.json'

/**
 * CMS-driven site header document (see HEADER-CONTRACT §4).
 *
 *  1. Render immediately from the last good document cached in localStorage
 *     for this language, or from the bundled default (defaultHeader.json).
 *  2. Fetch GET /api/public/get-header?lang= once per language per page load.
 *  3. When the response passes the shape check, swap it in and cache it.
 *     The API's `not_found` 404 (nothing saved) drops the cache and falls back
 *     to the default; any other failure (route not deployed, network, 5xx)
 *     keeps whatever is showing, silently.
 *
 * A tiny module-level store (useSyncExternalStore) instead of react-query:
 * the header mounts on every page and there is no global QueryClient.
 */

const LANGS = ['en', 'ar']
const TAB_TYPES = new Set(['links', 'destinations', 'activities', 'map'])
const STORAGE_PREFIX = 'flycham:site-header:v1:'

const isObj = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const str = (value, fallback = '') => (typeof value === 'string' ? value : fallback)
const arr = (value) => (Array.isArray(value) ? value : [])

/** Lightweight structural check — anything that could crash the header is rejected. */
const isValidDocument = (doc) =>
  isObj(doc) &&
  Array.isArray(doc.menus) &&
  doc.menus.every(
    (menu) =>
      isObj(menu) &&
      typeof menu.id === 'string' &&
      Array.isArray(menu.tabs) &&
      menu.tabs.every(
        (tab) => isObj(tab) && typeof tab.id === 'string' && TAB_TYPES.has(tab.type)
      )
  )

const normalizeLink = (link, index) => ({
  id: str(link?.id) || `link-${index}`,
  title: str(link?.title),
  description: str(link?.description),
  icon: str(link?.icon),
  badge: str(link?.badge),
  href: str(link?.href),
})

const normalizeCard = (card, index) => ({
  id: str(card?.id) || `card-${index}`,
  name: str(card?.name),
  location: str(card?.location),
  code: str(card?.code),
  tag: str(card?.tag),
  imageUrl: str(card?.imageUrl),
  href: str(card?.href),
})

const normalizeTab = (tab) => ({
  id: tab.id,
  label: str(tab.label),
  icon: str(tab.icon),
  badge: str(tab.badge),
  type: tab.type,
  withDescriptions: tab.withDescriptions === true,
  imageUrl: str(tab.imageUrl),
  imageAlt: str(tab.imageAlt),
  ctaLabel: str(tab.ctaLabel),
  ctaHref: str(tab.ctaHref),
  links: arr(tab.links).filter(isObj).map(normalizeLink),
  cards: arr(tab.cards).filter(isObj).map(normalizeCard),
})

/** A tab with nothing to show is skipped rather than rendered empty. */
const tabHasContent = (tab) => {
  if (tab.type === 'links') return tab.links.length > 0
  if (tab.type === 'map') return Boolean(tab.imageUrl)
  return tab.cards.length > 0
}

/**
 * Validated + normalised document, ready to render: every field present with
 * the right type, missing style/logo/login/region keys filled from the bundled
 * default, hidden menus and empty tabs/menus removed. Returns null if invalid.
 */
const normalizeDocument = (doc, lang) => {
  if (!isValidDocument(doc)) return null
  const base = defaultHeaders[lang] || defaultHeaders.en

  const menus = doc.menus
    .filter((menu) => menu.visible !== false)
    .map((menu) => ({
      id: menu.id,
      label: str(menu.label),
      visible: true,
      tabs: menu.tabs.map(normalizeTab).filter(tabHasContent),
    }))
    .filter((menu) => menu.tabs.length > 0)

  const style = { ...base.style }
  if (isObj(doc.style)) {
    for (const [key, value] of Object.entries(doc.style)) {
      if (typeof value === 'string' && value) style[key] = value
    }
  }

  return {
    schemaVersion: 1,
    logo: {
      lightUrl: str(doc.logo?.lightUrl) || base.logo.lightUrl,
      darkUrl: str(doc.logo?.darkUrl) || base.logo.darkUrl,
      alt: str(doc.logo?.alt, base.logo.alt),
      href: str(doc.logo?.href) || base.logo.href,
    },
    login: {
      show: doc.login?.show !== false,
      label: str(doc.login?.label, base.login.label),
      href: str(doc.login?.href) || base.login.href,
    },
    region: {
      show: doc.region?.show !== false,
      label: str(doc.region?.label, base.region.label),
    },
    menus,
    style,
  }
}

// ---- storage (every access guarded: private mode / blocked storage) ----

const readCache = (lang) => {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + lang)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isValidDocument(parsed) ? parsed : null
  } catch {
    return null
  }
}

const writeCache = (lang, doc) => {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + lang, JSON.stringify(doc))
  } catch {
    // ignore quota / disabled storage
  }
}

const clearCache = (lang) => {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + lang)
  } catch {
    // ignore
  }
}

// ---- store ----

/** lang → { doc (normalised), raw (JSON of the source document), source } */
const entries = {}
const requested = new Set()
const listeners = new Set()

const emit = () => listeners.forEach((listener) => listener())

const setEntry = (lang, rawDoc, source) => {
  const doc = normalizeDocument(rawDoc, lang)
  if (!doc) return false
  entries[lang] = { doc, raw: JSON.stringify(rawDoc), source }
  return true
}

const ensureEntry = (lang) => {
  if (entries[lang]) return entries[lang]
  const cached = typeof window === 'undefined' ? null : readCache(lang)
  if (!cached || !setEntry(lang, cached, 'cache')) {
    setEntry(lang, defaultHeaders[lang] || defaultHeaders.en, 'default')
  }
  return entries[lang]
}

const loadFromApi = (lang) => {
  if (requested.has(lang)) return
  requested.add(lang)

  getHeader(lang)
    .then((result) => {
      const remote = result?.document
      if (!isValidDocument(remote)) return
      const current = ensureEntry(lang)
      const raw = JSON.stringify(remote)
      writeCache(lang, remote)
      if (raw === current.raw) return
      if (setEntry(lang, remote, 'api')) emit()
    })
    .catch((error) => {
      // The API's own 404 (`not_found` = no document saved for this language):
      // drop a stale cache and use the default. Anything else — a route that
      // is not deployed yet, network, 5xx — keeps what is showing.
      const { status, data } = error?.response || {}
      if (status !== 404 || data?.error?.code !== 'not_found') return
      clearCache(lang)
      if (ensureEntry(lang).source === 'default') return
      setEntry(lang, defaultHeaders[lang] || defaultHeaders.en, 'default')
      emit()
    })
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** The header document for the current URL language (always renderable). */
const useSiteHeader = () => {
  const current = useCurrentLanguage()
  const lang = LANGS.includes(current) ? current : 'en'

  const doc = useSyncExternalStore(
    subscribe,
    () => ensureEntry(lang).doc,
    () => ensureEntry(lang).doc
  )

  useEffect(() => {
    loadFromApi(lang)
  }, [lang])

  return doc
}

export default useSiteHeader
