/**
 * Viewport helpers for Cham Miles scroll / scrub motion.
 *
 * "After tablet" (≥1024) and landscape tablet (768–1023 landscape) use the
 * same soft-desktop timing as xl+ (≥1280). Phone + portrait tablet keep the
 * gentler compact scrub / longer track.
 */

export const AFTER_TABLET_PX = 1024;
export const PHONE_MAX_PX = 767;

/**
 * True when hero/tiers should use big-screen scrub lag, track length, and
 * free-scroll behavior (not the compact tablet touch pacing).
 */
export function prefersDesktopChamMilesMotion() {
  if (typeof window === "undefined") return true;
  const w = window.innerWidth;
  if (w >= AFTER_TABLET_PX) return true;
  if (w <= PHONE_MAX_PX) return false;
  // 768–1023 landscape (short height): match desktop motion so Welcome /
  // second-layer don't feel sluggish vs xl+.
  return window.matchMedia("(orientation: landscape)").matches;
}

/** matchMedia string — fire when desktop-vs-compact motion should rebuild. */
export const CHAM_MILES_DESKTOP_MOTION_MQ = [
  `(min-width: ${AFTER_TABLET_PX}px)`,
  `(min-width: 768px) and (max-width: ${AFTER_TABLET_PX - 1}px) and (orientation: landscape)`,
].join(", ");
