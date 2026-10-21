import { getHeader } from '../../../cms/api/getHeader.js'
import createSiteDocumentHook from '../createSiteDocumentHook.js'
import { applySiteHeaderAlts } from '../../../cms/mediaAlt.js'
import defaultHeaders from './defaultHeader.json'
import {
  HIDE_WELCOME_PANEL_ID,
  loginShowsWelcomePanel,
  visibleLoginBenefits,
} from './loginWelcome.js'

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
 * Store / cache / fetch behaviour lives in createSiteDocumentHook (shared
 * with the footer).
 */

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

/** Mobile menu extras; absent/invalid fields fall back to the bundled default. */
const normalizeMobile = (mobile, base) => {
  const fallback = base.mobile
  if (!isObj(mobile)) return fallback
  const links = Array.isArray(mobile.links)
    ? mobile.links
        .filter((link) => isObj(link) && str(link.label))
        .map((link, index) => ({
          id: str(link.id) || `mobile-link-${index}`,
          label: str(link.label),
          href: str(link.href) || '/',
        }))
    : fallback.links
  return {
    coverImageUrl: str(mobile.coverImageUrl, fallback.coverImageUrl),
    coverAlt: str(mobile.coverAlt, fallback.coverAlt),
    homeLabel: str(mobile.homeLabel) || fallback.homeLabel,
    links,
  }
}

/**
 * Header search panel (Figma 39439:37653). Absent/invalid fields fall back to
 * the bundled default, so a document saved before search existed still shows it.
 */
const normalizeSearch = (search, base) => {
  const fallback = base.search
  if (!isObj(search)) return fallback
  const quickLinks = Array.isArray(search.quickLinks)
    ? search.quickLinks
        .filter((link) => isObj(link) && str(link.label))
        .map((link, index) => ({
          id: str(link.id) || `search-link-${index}`,
          label: str(link.label),
          href: str(link.href) || '/',
        }))
    : fallback.quickLinks
  return {
    show: search.show !== false,
    placeholder: str(search.placeholder) || fallback.placeholder,
    buttonLabel: str(search.buttonLabel) || fallback.buttonLabel,
    quickLinksTitle: str(search.quickLinksTitle, fallback.quickLinksTitle),
    emptyText: str(search.emptyText) || fallback.emptyText,
    quickLinks,
  }
}

/**
 * Log-in dropdown (Figma 41671:57278). Older documents only had show/label/href;
 * the rest is filled from the bundled default so the panel still renders.
 */
const normalizeLogin = (login, base) => {
  const fallback = base.login
  if (!isObj(login)) return fallback
  const rawBenefits = Array.isArray(login.benefits)
    ? login.benefits
        .filter(
          (item) =>
            isObj(item) &&
            (item.id === HIDE_WELCOME_PANEL_ID || str(item.text)),
        )
        .map((item, index) => ({
          id: str(item.id) || `benefit-${index}`,
          text: str(item.text),
        }))
    : fallback.benefits
  const showWelcomePanel = loginShowsWelcomePanel({
    showWelcomePanel: login.showWelcomePanel,
    benefits: rawBenefits,
  })
  return {
    show: login.show !== false,
    showWelcomePanel,
    label: str(login.label, fallback.label),
    href: str(login.href) || fallback.href,
    panelTitle: str(login.panelTitle, fallback.panelTitle),
    panelSubtitle: str(login.panelSubtitle, fallback.panelSubtitle),
    benefits: visibleLoginBenefits(rawBenefits),
    panelImageUrl: str(login.panelImageUrl, fallback.panelImageUrl),
    brandLogoUrl: str(login.brandLogoUrl, fallback.brandLogoUrl),
    emailLabel: str(login.emailLabel) || fallback.emailLabel,
    emailPlaceholder: str(login.emailPlaceholder, fallback.emailPlaceholder),
    passwordLabel: str(login.passwordLabel) || fallback.passwordLabel,
    passwordPlaceholder: str(login.passwordPlaceholder, fallback.passwordPlaceholder),
    submitLabel: str(login.submitLabel) || fallback.submitLabel,
    orLabel: str(login.orLabel) || fallback.orLabel,
    createAccountLabel: str(login.createAccountLabel, fallback.createAccountLabel),
    createAccountHref: str(login.createAccountHref) || fallback.createAccountHref,
    showPasswordLabel: str(login.showPasswordLabel) || fallback.showPasswordLabel,
    hidePasswordLabel: str(login.hidePasswordLabel) || fallback.hidePasswordLabel,
  }
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
      faviconUrl: str(doc.logo?.faviconUrl) || base.logo.faviconUrl,
    },
    login: normalizeLogin(doc.login, base),
    region: {
      show: doc.region?.show !== false,
      label: str(doc.region?.label, base.region.label),
    },
    mobile: normalizeMobile(doc.mobile, base),
    search: normalizeSearch(doc.search, base),
    menus,
    style,
  }
}

/** The header document for the current URL language (always renderable). */
const useSiteHeader = createSiteDocumentHook({
  fetchDocument: getHeader,
  defaults: defaultHeaders,
  storagePrefix: STORAGE_PREFIX,
  isValidDocument,
  normalizeDocument,
  applyMediaAlts: applySiteHeaderAlts,
})

export default useSiteHeader
