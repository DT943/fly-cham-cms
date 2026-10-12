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
  // Figma Cargo Guide banner: 360px tall on desktop.
  medium: 'min-h-[220px] sm:min-h-[320px] md:min-h-[360px]',
  default: 'min-h-[220px] sm:min-h-[360px] md:min-h-[400px]',
  spacious: 'min-h-[280px] sm:min-h-[420px] md:min-h-[480px]',
  // Figma Baggage Calculator banner: 405px on every screen.
  poster: 'min-h-[405px]',
}

/** Pixel height for a CTA banner. Presets stay readable; `default` is 360px (was 400). */
const CTA_BANNER_HEIGHT_PX = {
  compact: 280,
  medium: 340,
  default: 360,
  tall: 480,
  poster: 380,
  spacious: 440,
}

const CTA_BANNER_HEIGHT_MIN = 160
const CTA_BANNER_HEIGHT_MAX = 720

export function ctaBannerHeightPx(value) {
  const legacy = CTA_BANNER_HEIGHT_PX[value]
  if (legacy) return legacy
  const n = Number(value)
  if (!Number.isFinite(n)) return CTA_BANNER_HEIGHT_PX.default
  return Math.min(CTA_BANNER_HEIGHT_MAX, Math.max(CTA_BANNER_HEIGHT_MIN, Math.round(n)))
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

export const fontWeightValue = (token, fallback = 'medium') =>
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

  const color = colorVar(normalColor)
  const weight = fontWeightValue(normalWeight, weightFallback)
  return {
    color,
    fontWeight: weight,
    // `--cms-c` / `--cms-w` are what `.cms-text-hover` paints (with !important),
    // so a drawer color wins over link and heading styles.
    '--cms-c': color,
    '--cms-w': weight,
    '--cms-hc': colorVar(hoverColor),
    '--cms-hw': fontWeightValue(hoverWeight, weightFallback),
  }
}

/**
 * Per-button Normal/Hover styling, mirroring flychamadmin cms2's
 * getButtonStyle (styles/buttonStyle.js): background + label color + label
 * weight, each with a Hover twin. The swap is pure CSS (`.cms-btn-hover` in
 * index.css). Hover values fall back to Normal, so an uncustomised button
 * looks identical on hover.
 *
 *   const btn = getButtonStyle(style, {
 *     bgKey: 'buttonBg', bgFallback: 'secondary',
 *     textKey: 'buttonText', textFallback: 'btn', weightFallback: 'semibold',
 *   })
 *   <a className={`… ${btn.className}`} style={btn.style} />
 *
 * `bgHoverKey` defaults to `${bgKey}Hover`; pass the legacy name (e.g.
 * 'buttonHoverBg') where the block already stored one. `border: true` keeps
 * the border the same color as the background.
 */
export const CMS_BUTTON_HOVER_CLASS = 'cms-btn-hover cms-text-hover'

const buttonWeightKey = (textKey) => {
  if (!textKey) return null
  if (textKey.endsWith('Color')) return textKey.replace(/Color$/, 'FontWeight')
  return `${textKey}FontWeight`
}

export const getButtonStyle = (style, opts) => {
  const {
    bgKey,
    bgHoverKey = `${bgKey}Hover`,
    bgFallback,
    bgHoverFallback,
    textKey,
    textFallback,
    weightKey = buttonWeightKey(textKey),
    weightFallback = 'medium',
    border = false,
  } = opts

  const bgToken = style?.[bgKey] || bgFallback
  // No hover bg set: keep the built-in hover shade while the background is
  // still the default, otherwise stay on the chosen background.
  const bgHoverToken =
    style?.[bgHoverKey] ||
    (bgHoverFallback && bgToken === bgFallback ? bgHoverFallback : bgToken)
  const colorToken = style?.[textKey] ?? textFallback
  const colorHoverToken = style?.[`${textKey}Hover`] ?? colorToken
  const weight = style?.[weightKey]
  const weightHover = style?.[`${weightKey}Hover`] ?? weight

  return {
    className: `${CMS_BUTTON_HOVER_CLASS}${border ? ' cms-btn-hover-border' : ''}`,
    style: {
      backgroundColor: colorVar(bgToken),
      ...(border ? { borderColor: colorVar(bgToken) } : {}),
      color: colorVar(colorToken),
      fontWeight: fontWeightValue(weight, weightFallback),
      // `.cms-text-hover` paints these with !important — without them the
      // label falls back to the inherited color.
      '--cms-c': colorVar(colorToken),
      '--cms-w': fontWeightValue(weight, weightFallback),
      '--cms-bgh': colorVar(bgHoverToken),
      '--cms-hc': colorVar(colorHoverToken),
      '--cms-hw': fontWeightValue(weightHover, weightFallback),
    },
  }
}
