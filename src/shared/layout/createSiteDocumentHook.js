import { useEffect, useMemo, useSyncExternalStore } from 'react'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import useMediaAltLookup from '../../cms/useMediaAlts.js'

/**
 * Shared client for the CMS "site documents" (header, footer — one JSON
 * document per language, see HEADER-CONTRACT / FOOTER-CONTRACT §4).
 *
 *  1. Render immediately from the last good document cached in localStorage
 *     for this language, or from the bundled default.
 *  2. Fetch the document, then refresh it while the tab stays visible.
 *  3. When the response passes the shape check, swap it in and cache it.
 *
 * The returned document carries `ready`: false only on a first visit (no cache)
 * while the first fetch is still pending — at most READY_TIMEOUT_MS. Callers can
 * hide CMS-owned assets (the logo) until then, so a stale bundled default never
 * flashes before the CMS version.
 *     The API's `not_found` 404 (nothing saved) drops the cache and falls back
 *     to the default; any other failure (route not deployed, network, 5xx)
 *     keeps whatever is showing, silently.
 *
 * A tiny module-level store (useSyncExternalStore) instead of react-query:
 * the header/footer mount on every page and there is no global QueryClient.
 *
 * @param {object} options
 * @param {(lang: string) => Promise<{document?: unknown} | null>} options.fetchDocument
 * @param {Record<string, object>} options.defaults      bundled `{ en, ar }` documents
 * @param {string} options.storagePrefix                 localStorage key prefix (+ lang)
 * @param {(doc: unknown) => boolean} options.isValidDocument  structural check
 * @param {(doc: object, lang: string) => object | null} options.normalizeDocument
 * @param {(doc: object, lookup: Map, lang: string) => object} [options.applyMediaAlts]
 *   sets image alts from the shared media-library alt text (cms/mediaAlt.js)
 * @returns {() => object} hook returning the normalised document for the URL language
 */
const LANGS = ['en', 'ar']

/** Longest a first-visit render waits for the API before showing the default. */
const READY_TIMEOUT_MS = 2500

const createSiteDocumentHook = ({
  fetchDocument,
  defaults,
  storagePrefix,
  isValidDocument,
  normalizeDocument,
  applyMediaAlts,
}) => {
  const defaultFor = (lang) => defaults[lang] || defaults.en

  // ---- storage (every access guarded: private mode / blocked storage) ----

  const readCache = (lang) => {
    try {
      const raw = window.localStorage.getItem(storagePrefix + lang)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return isValidDocument(parsed) ? parsed : null
    } catch {
      return null
    }
  }

  const writeCache = (lang, doc) => {
    try {
      window.localStorage.setItem(storagePrefix + lang, JSON.stringify(doc))
    } catch {
      // ignore quota / disabled storage
    }
  }

  const clearCache = (lang) => {
    try {
      window.localStorage.removeItem(storagePrefix + lang)
    } catch {
      // ignore
    }
  }

  // ---- store ----

  /** lang → { doc (normalised), raw (JSON of the source document), source } */
  const entries = {}
  const inflight = new Set()
  const listeners = new Set()

  const emit = () => listeners.forEach((listener) => listener())

  const setEntry = (lang, rawDoc, source, ready = source !== 'default') => {
    const doc = normalizeDocument(rawDoc, lang)
    if (!doc) return false
    entries[lang] = { doc: { ...doc, ready }, raw: JSON.stringify(rawDoc), source }
    return true
  }

  /** The first fetch settled (or timed out): show whatever is current. */
  const markReady = (lang) => {
    const entry = entries[lang]
    if (!entry || entry.doc.ready) return
    entries[lang] = { ...entry, doc: { ...entry.doc, ready: true } }
    emit()
  }

  const ensureEntry = (lang) => {
    if (entries[lang]) return entries[lang]
    const cached = typeof window === 'undefined' ? null : readCache(lang)
    if (!cached || !setEntry(lang, cached, 'cache')) {
      setEntry(lang, defaultFor(lang), 'default')
    }
    return entries[lang]
  }

  const loadFromApi = (lang) => {
    if (inflight.has(lang)) return
    inflight.add(lang)
    const readyTimer = window.setTimeout(() => markReady(lang), READY_TIMEOUT_MS)

    fetchDocument(lang)
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
        setEntry(lang, defaultFor(lang), 'default')
        emit()
      })
      .finally(() => {
        inflight.delete(lang)
        window.clearTimeout(readyTimer)
        markReady(lang)
      })
  }

  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  /** The document for the current URL language (always renderable). */
  const useSiteDocument = () => {
    const current = useCurrentLanguage()
    const lang = LANGS.includes(current) ? current : 'en'

    const doc = useSyncExternalStore(
      subscribe,
      () => ensureEntry(lang).doc,
      () => ensureEntry(lang).doc
    )

    useEffect(() => {
      loadFromApi(lang)
      // Pick up a footer/header save while this tab stays open.
      const refresh = () => {
        if (document.visibilityState === 'visible') loadFromApi(lang)
      }
      const timer = window.setInterval(refresh, 20000)
      document.addEventListener('visibilitychange', refresh)
      window.addEventListener('focus', refresh)
      return () => {
        window.clearInterval(timer)
        document.removeEventListener('visibilitychange', refresh)
        window.removeEventListener('focus', refresh)
      }
    }, [lang])

    const altLookup = useMediaAltLookup()
    return useMemo(
      () => (applyMediaAlts ? applyMediaAlts(doc, altLookup, lang) : doc),
      [doc, altLookup, lang]
    )
  }

  return useSiteDocument
}

export default createSiteDocumentHook
