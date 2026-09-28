import { resolveCmsHref } from '../../../cms/adapters/pick.js'
import { resolvePhosphorIcon } from '../../../cms/adapters/phosphorIcons.js'
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

export { colorVar }
