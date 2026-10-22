import { resolveCmsHref } from '../../../../cms/adapters/pick.js'
import { resolvePhosphorIcon } from '../../../../cms/adapters/phosphorIcons.js'
import { colorVar } from '../../../../styles/cmsStyle.js'
import { roleStyle } from '../../header/headerStyle.js'

/**
 * Footer style helpers (CMS footer document `style`, FOOTER-CONTRACT §1).
 *
 * Text roles use the header's CSS-variable hover mechanism: Normal colour /
 * weight inline + `--cms-hc` / `--cms-hw`, swapped in on :hover by the
 * `.cms-ftr-hover` / `.cms-ftr-hover-color` rules in index.css (kept next to
 * a `transition-colors` class, like the original static footer).
 */
export const FTR_HOVER = 'cms-ftr-hover'
export const FTR_HOVER_COLOR = 'cms-ftr-hover-color'

export { colorVar, roleStyle }

/**
 * CMS colour token at a fixed opacity — the same `color-mix(in oklab, …)`
 * Tailwind v4 emits for `text-50/90`, so default colours compute identically.
 */
export const colorAlpha = (token, opacity) =>
  token ? `color-mix(in oklab, ${colorVar(token)} ${opacity}%, transparent)` : undefined

/**
 * Divider colour. The design's dividers are pure white (`white/15`, `white/20`);
 * the palette's near-white token `50` (the default) maps to `white` so the
 * default document stays pixel-identical. Any other token is used as-is.
 */
export const dividerAlpha = (token, opacity) =>
  colorAlpha(!token || token === '50' ? 'white' : token, opacity)

/**
 * Social icon button: icon and border (`border-current`) in one colour, like
 * the flychamwebsite footer; hover colour via `--cms-hc` (FTR_HOVER_COLOR).
 */
export const socialStyle = (style) => ({
  color: colorVar(style.socialColor || 'gold'),
  '--cms-hc': colorVar(style.socialColorHover || style.socialColor || 'gold'),
})

/** Legal bar text — Figma uses solid #f5f5f4 / white (full opacity). */
export const legalStyle = (style) => ({
  color: colorVar(style.legalColor || '50'),
  '--cms-hc': colorVar(style.legalColorHover || style.legalColor),
})

/** Phosphor component for a stored icon name (unknown → Question). */
export const footerIcon = (name) => resolvePhosphorIcon(name)

/** CMS href → app path (no language prefix) or absolute URL for LocalizedLink. */
export const footerHref = (href) => resolveCmsHref(href) || '#'
