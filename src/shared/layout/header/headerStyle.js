import { resolveCmsHref } from '../../../cms/adapters/pick.js'
import { resolvePhosphorIcon } from '../../../cms/adapters/phosphorIcons.js'
import { stripLanguage } from '../../../i18n/languages.js'
import { colorVar, fontWeightValue } from '../../../styles/cmsStyle.js'

/**
 * Header text role: Normal color/weight inline plus the Hover pair as
 * `--cms-hc` / `--cms-hw` (the same CSS-variable hover mechanism as
 * CMS_TEXT_HOVER_CLASS). `active` pins the Hover values — used for the open
 * nav button and the selected sidebar tab. Omit `weight` for colour-only
 * roles (icons).
 */
export const roleStyle = ({ color, colorHover, weight, weightHover, active = false }) => {
  const hoverColor = colorHover || color
  const out = {
    color: colorVar(active ? hoverColor : color),
    '--cms-hc': colorVar(hoverColor),
  }
  if (weight !== undefined) {
    const normal = fontWeightValue(weight, 'normal')
    const hover = fontWeightValue(weightHover || weight, 'normal')
    out.fontWeight = active ? hover : normal
    out['--cms-hw'] = hover
  }
  return out
}

/**
 * Hover driven by an ancestor (`group/hdr`) instead of the element itself —
 * e.g. hovering a whole mega-menu link recolours its icon and title.
 * See the `.group\/hdr` rules in index.css.
 */
export const HDR_SELF_HOVER = 'cms-hdr-self-hover'
export const HDR_GROUP = 'group/hdr'
export const HDR_GROUP_TEXT = 'cms-hdr-hover'
export const HDR_GROUP_COLOR = 'cms-hdr-hover-color'

/** Phosphor component for a stored icon name; null when the name is empty. */
export const headerIcon = (name) => (name ? resolvePhosphorIcon(name) : null)

/** CMS href → app path (no language prefix) or absolute URL for LocalizedLink. */
export const headerHref = (href) => resolveCmsHref(href)

const pagePathname = (path) => {
  const stripped = stripLanguage(path || '/')
  const pathname = stripped.split('?')[0].split('#')[0] || '/'
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

/** App path for a header href. External links and the bare home path are ignored. */
const matchablePath = (href) => {
  const resolved = headerHref(href)
  if (!resolved || /^(https?:|mailto:|tel:|#)/i.test(resolved)) return ''
  const path = pagePathname(resolved)
  return path === '/' ? '' : path
}

/** Longest header path that owns the current page, among the given hrefs. */
export function currentHeaderPath(hrefs, pathname) {
  const current = pagePathname(pathname)
  if (!current || current === '/') return ''

  let best = ''
  for (const href of hrefs || []) {
    const path = matchablePath(href)
    if (!path) continue
    if (current !== path && !current.startsWith(`${path}/`)) continue
    if (path.length > best.length) best = path
  }
  return best
}

/** True when this href is exactly the header path that owns the current page. */
export function hrefMatchesHeaderPath(href, path) {
  return Boolean(path) && matchablePath(href) === path
}

/**
 * Menu and tab that own the current page. The longest matching link wins, so
 * a child page stays on its own item when a parent link is also in the menu.
 * When two menus share that same path, `preferredMenuId` (the menu the visitor
 * actually clicked) keeps the underline there instead of the first menu in the list.
 */
export function findHeaderLocation(menus, pathname, preferredMenuId = null) {
  const current = pagePathname(pathname)
  if (!current || current === '/') return null

  let best = null
  let bestLength = -1

  for (const menu of menus || []) {
    for (const tab of menu.tabs || []) {
      const hrefs = [
        ...(tab.links || []).map((link) => link.href),
        ...(tab.cards || []).map((card) => card.href),
        tab.ctaHref,
      ]
      const path = currentHeaderPath(hrefs, pathname)
      if (!path || path.length < bestLength) continue
      const preferred = Boolean(preferredMenuId) && menu.id === preferredMenuId
      if (path.length === bestLength && !preferred) continue
      bestLength = path.length
      best = { menuId: menu.id, tabId: tab.id, path }
    }
  }

  return best
}

export { colorVar }
