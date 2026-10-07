/**
 * tiersJoinEarlyPose
 * ------------------
 * Single place to control "Join Early Earn More" title + description
 * for every screen: mobile | tablet | desktop | wide.
 *
 * Units:
 *   x              → horizontal inset as vw
 *   y              → vertical park / padding-top, as vh
 *   maxWidthVw     → max width of the copy column, as vw
 *   maxWidthRem    → hard rem cap for the column (desktop titles need >28rem)
 *   dock           → "flow" | "top-left" | "left-stack"
 *                    left-stack = desktop/wide: left column, vertically centered,
 *                    large stacked title + desc (matches reference screenshot)
 *   titleFontRem   → title font-size in rem (inline)
 *   descFontRem    → description font-size in rem (inline)
 *   descMaxRem     → description max-width in rem; null = full column
 */

/** @typedef {{
 *   x: number,
 *   y: number,
 *   maxWidthVw?: number,
 *   maxWidthRem?: number,
 *   dock?: 'flow' | 'top-left' | 'left-stack',
 *   titleFontRem?: number,
 *   descFontRem?: number,
 *   descMaxRem?: number | null,
 * }} JoinEarlyPose */

/** @type {Record<'mobile' | 'tablet' | 'desktop' | 'wide', JoinEarlyPose>} */
export const TIERS_JOIN_EARLY_POSE = {
  mobile: {
    x: 4,
    y: 10,
    maxWidthVw: 92,
    maxWidthRem: 28,
    dock: "flow",
    titleFontRem: 3.25,
    descFontRem: 1,
    descMaxRem: null,
  },

  tablet: {
    x: 6,
    y: 8,
    maxWidthVw: 58,
    maxWidthRem: 28,
    dock: "top-left",
    titleFontRem: 4.25,
    descFontRem: 1.125,
    descMaxRem: null,
  },

  // Mouse laptop — left stack + card mid-right (reference screenshot)
  desktop: {
    x: 6,
    y: 0,
    maxWidthVw: 44,
    maxWidthRem: 34,
    dock: "left-stack",
    titleFontRem: 4.75,
    descFontRem: 1.125,
    descMaxRem: null,
  },

  // 2xl / wide — same composition
  wide: {
    x: 7,
    y: 0,
    maxWidthVw: 38,
    maxWidthRem: 38,
    dock: "left-stack",
    titleFontRem: 5.25,
    descFontRem: 1.1875,
    descMaxRem: null,
  },
};

/** Arabic: same docks, narrower left column so copy clears the card. */
export const TIERS_JOIN_EARLY_POSE_AR = {
  mobile: {
    x: 4,
    y: 8,
    maxWidthVw: 52,
    maxWidthRem: 18,
    dock: "flow",
    titleFontRem: 2.35,
    descFontRem: 0.9375,
    descMaxRem: 16,
  },
  tablet: {
    x: 5,
    y: 8,
    maxWidthVw: 42,
    maxWidthRem: 22,
    dock: "top-left",
    titleFontRem: 3.25,
    descFontRem: 1.0625,
    descMaxRem: 20,
  },
  desktop: {
    x: 5,
    y: 0,
    maxWidthVw: 30,
    maxWidthRem: 22,
    dock: "left-stack",
    titleFontRem: 3.75,
    descFontRem: 1.0625,
    descMaxRem: 20,
  },
  wide: {
    x: 6,
    y: 0,
    maxWidthVw: 28,
    maxWidthRem: 24,
    dock: "left-stack",
    titleFontRem: 4.25,
    descFontRem: 1.125,
    descMaxRem: 22,
  },
};

/**
 * Pick the pose for the current viewport flags.
 * @param {{ isMobile: boolean, isTabletUi: boolean, bp: string, isAr?: boolean }} opts
 */
export function resolveTiersJoinEarlyPose({
  isMobile,
  isTabletUi,
  bp,
  isAr = false,
}) {
  const table = isAr ? TIERS_JOIN_EARLY_POSE_AR : TIERS_JOIN_EARLY_POSE;
  if (isMobile) return { key: "mobile", ...table.mobile };
  if (isTabletUi || bp === "tablet") {
    return { key: "tablet", ...table.tablet };
  }
  if (bp === "wide") return { key: "wide", ...table.wide };
  return { key: "desktop", ...table.desktop };
}

