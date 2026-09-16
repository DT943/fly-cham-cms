/**
 * CMS style token maps. Keep class names as literals so Tailwind's scanner
 * sees every utility at build time.
 *
 * Used by PageHero, SearchConsole, and any other section the CMS can restyle.
 */

export const RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

export const WEIGHT = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

export const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export const SECTION_PADDING = {
  none: '',
  compact: 'py-4 md:py-6',
  default: '',
  spacious: 'py-8 md:py-16',
}

export const PANEL_PADDING = {
  none: '',
  compact: 'px-4 py-4 sm:px-6 sm:py-5',
  default: 'px-4 py-5 sm:px-10 md:px-14 sm:py-8',
  spacious: 'px-6 py-8 sm:px-12 md:px-16 sm:py-10',
}

export const GRADIENT_DIR = {
  topRight: { ltr: 'to top right', rtl: 'to top left' },
  topLeft: { ltr: 'to top left', rtl: 'to top right' },
  bottomRight: { ltr: 'to bottom right', rtl: 'to bottom left' },
  bottomLeft: { ltr: 'to bottom left', rtl: 'to bottom right' },
  right: { ltr: 'to right', rtl: 'to left' },
  left: { ltr: 'to left', rtl: 'to right' },
  top: { ltr: 'to top', rtl: 'to top' },
  bottom: { ltr: 'to bottom', rtl: 'to bottom' },
}

export const CARD_GAP = {
  none: 'gap-0',
  compact: 'gap-2 md:gap-3',
  default: 'gap-3 md:gap-5',
  spacious: 'gap-5 md:gap-8',
}

export const COLUMN_GAP = {
  none: 'gap-0',
  compact: 'gap-4 lg:gap-6',
  default: 'gap-6 lg:gap-10',
  spacious: 'gap-8 lg:gap-14',
}

export const BANNER_HEIGHT = {
  compact: 'min-h-[180px] sm:min-h-[240px] md:min-h-[280px]',
  default: 'min-h-[220px] sm:min-h-[360px] md:min-h-[400px]',
  spacious: 'min-h-[280px] sm:min-h-[420px] md:min-h-[480px]',
}

export const VERTICAL_ALIGN = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
}

export const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

/** Resolve a CMS colour token (primary-1, 700, background, …) to a CSS variable. */
export const colorVar = (token) => (token ? `var(--color-${token})` : undefined)

/** Mix a CMS colour token with transparency (opacity 0–100). */
export const colorMix = (token, opacity) => {
  if (!token) return undefined
  const amount = Number(opacity)
  if (!Number.isFinite(amount) || amount >= 100) return colorVar(token)
  return `color-mix(in srgb, ${colorVar(token)} ${amount}%, transparent)`
}

/**
 * Per-role text hover, mirroring flychamadmin cms2's getTextStyleVars.
 * Numeric font-weight values (inline) so the `:hover` swap can override the
 * element's own inline weight; see the `.cms-text-hover` rule in index.css.
 */
export const CMS_TEXT_HOVER_CLASS = 'cms-text-hover'

const FONT_WEIGHT_VALUE = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
}

const fontWeightValue = (token, fallback = 'medium') =>
  FONT_WEIGHT_VALUE[token] ?? FONT_WEIGHT_VALUE[fallback] ?? 500

/** Derive the weight key paired with a text color key (titleColor → titleFontWeight). */
const weightKeyForColorKey = (colorKey) => {
  if (!colorKey) return null
  if (colorKey.endsWith('Color')) return colorKey.replace(/Color$/, 'FontWeight')
  if (colorKey.endsWith('Text')) return `${colorKey}FontWeight`
  return null
}

/**
 * Inline style for a text role: Normal color/weight plus the Hover color/weight
 * as `--cms-hc` / `--cms-hw` custom properties. Hover falls back to the Normal
 * value when unset, so uncustomised text looks identical on hover.
 * Pair with `className={CMS_TEXT_HOVER_CLASS}`.
 */
export const getTextStyleVars = (style, colorKey, colorFallback, weightFallback = 'medium') => {
  const weightKey = weightKeyForColorKey(colorKey)
  const normalColor = style?.[colorKey] ?? colorFallback
  const normalWeight = weightKey ? style?.[weightKey] : undefined
  const hoverColor = style?.[`${colorKey}Hover`] ?? normalColor
  const hoverWeight = weightKey
    ? (style?.[`${weightKey}Hover`] ?? normalWeight)
    : undefined

  return {
    color: colorVar(normalColor),
    fontWeight: fontWeightValue(normalWeight, weightFallback),
    '--cms-hc': colorVar(hoverColor),
    '--cms-hw': fontWeightValue(hoverWeight, weightFallback),
  }
}
