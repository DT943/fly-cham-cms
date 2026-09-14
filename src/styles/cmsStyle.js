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

/** Resolve a CMS colour token (primary-1, 700, background, …) to a CSS variable. */
export const colorVar = (token) => (token ? `var(--color-${token})` : undefined)
