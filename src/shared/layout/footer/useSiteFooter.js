import { getFooter } from '../../../cms/api/getFooter.js'
import createSiteDocumentHook from '../createSiteDocumentHook.js'
import defaultFooters from './defaultFooter.json'

/**
 * CMS-driven site footer document (see FOOTER-CONTRACT §4) — same client
 * behaviour as the header (createSiteDocumentHook):
 *
 *  1. Render immediately from the last good document cached in localStorage
 *     for this language, or from the bundled default (defaultFooter.json).
 *  2. Fetch GET /api/public/get-footer?lang= once per language per page load.
 *  3. When the response passes the shape check, swap it in and cache it.
 *     The API's `not_found` 404 drops the cache and falls back to the default;
 *     any other failure keeps whatever is showing, silently.
 */

const STORAGE_PREFIX = 'flycham:site-footer:v1:'

const isObj = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const str = (value, fallback = '') => (typeof value === 'string' ? value : fallback)
const arr = (value) => (Array.isArray(value) ? value : [])
const optionalArray = (value) => value === undefined || Array.isArray(value)

/** Lightweight structural check — anything that could crash the footer is rejected. */
const isValidDocument = (doc) =>
  isObj(doc) &&
  Array.isArray(doc.columns) &&
  doc.columns.every(
    (column) => isObj(column) && typeof column.id === 'string' && optionalArray(column.links)
  ) &&
  optionalArray(doc.social) &&
  (doc.legal === undefined || (isObj(doc.legal) && optionalArray(doc.legal.links)))

const GROUPS = [1, 2, 3, 4]

const normalizeLink = (link, index) => ({
  id: str(link?.id) || `link-${index}`,
  icon: str(link?.icon),
  label: str(link?.label),
  href: str(link?.href) || '#',
  external: link?.external === true,
  highlight: link?.highlight === true,
})

const normalizeSocial = (item, index) => ({
  id: str(item?.id) || `social-${index}`,
  icon: str(item?.icon),
  label: str(item?.label),
  href: str(item?.href) || '#',
  showOnMobile: item?.showOnMobile !== false,
})

const normalizeLegalLink = (link, index) => ({
  id: str(link?.id) || `legal-${index}`,
  label: str(link?.label),
  href: str(link?.href) || '#',
  showOnMobile: link?.showOnMobile === true,
})

const normalizeColumn = (column) => {
  const group = Number(column.group)
  return {
    id: column.id,
    icon: str(column.icon),
    title: str(column.title),
    href: str(column.href),
    group: GROUPS.includes(group) ? group : 1,
    links: arr(column.links).filter(isObj).map(normalizeLink),
  }
}

/**
 * Validated + normalised document, ready to render: every field present with
 * the right type, missing brand/legal/style keys filled from the bundled
 * default. Returns null if invalid.
 */
const normalizeDocument = (doc, lang) => {
  if (!isValidDocument(doc)) return null
  const base = defaultFooters[lang] || defaultFooters.en
  const brand = isObj(doc.brand) ? doc.brand : {}
  const legal = isObj(doc.legal) ? doc.legal : {}

  const style = { ...base.style }
  if (isObj(doc.style)) {
    for (const [key, value] of Object.entries(doc.style)) {
      if (key === 'showPattern') {
        if (typeof value === 'boolean') style.showPattern = value
      } else if (typeof value === 'string' && value) {
        style[key] = value
      }
    }
  }

  return {
    schemaVersion: 1,
    brand: {
      logoUrl: str(brand.logoUrl) || base.brand.logoUrl,
      logoAlt: str(brand.logoAlt, base.brand.logoAlt),
      logoHref: str(brand.logoHref) || base.brand.logoHref,
      followText: str(brand.followText, base.brand.followText),
      // Empty string = no pattern image.
      patternUrl: str(brand.patternUrl, base.brand.patternUrl),
    },
    social: arr(doc.social).filter(isObj).map(normalizeSocial),
    columns: doc.columns.map(normalizeColumn),
    legal: {
      copyright: str(legal.copyright, base.legal.copyright),
      links: isObj(doc.legal)
        ? arr(legal.links).filter(isObj).map(normalizeLegalLink)
        : base.legal.links.map(normalizeLegalLink),
    },
    style,
  }
}

/** The footer document for the current URL language (always renderable). */
const useSiteFooter = createSiteDocumentHook({
  fetchDocument: getFooter,
  defaults: defaultFooters,
  storagePrefix: STORAGE_PREFIX,
  isValidDocument,
  normalizeDocument,
})

export default useSiteFooter
