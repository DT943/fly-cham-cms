/**
 * tiersJoinEarlyCardPose
 * ----------------------
 * Floating blue card rest pose on "Join Early Earn More" (Early Bird).
 *
 * Offsets are Framer x/y FROM the CSS park corner:
 *
 *   Desktop / wide park → bottom-right  (styles.css: right/bottom)
 *   Tablet park         → top-left      (.tier-flip-host--tablet-mobile-park)
 *   Mobile park         → top-left
 *
 * Tablet layout (LTR): copy top-left + card bottom-right.
 * From the top-left park, use a large x and a large y.
 *
 * How to tune (edit below, hard-refresh):
 *   ↑ larger  y  → move card DOWN
 *   ↓ smaller y  → move card UP
 *   ↑ larger  x  → move card RIGHT (LTR). AR mirrors x on tablet/mobile.
 *   ↓ smaller x  → move card LEFT
 *   scale        → size
 *   rotate       → tilt in degrees
 *
 * Scrub path: Benefits rest (`tiersBenefitsCardPose.js`) → these values via `exit`.
 */

/** @typedef {{ x: number, y: number, scale: number, rotate: number }} CardPose */

/** @type {Record<'mobile' | 'tablet' | 'desktop' | 'wide', CardPose>} */
export const TIERS_JOIN_EARLY_CARD_POSE = {
  // Phone — park top-left; keep card low so headline + CTA stay clear
  mobile: { x: 35, y: 74, scale: 1.05, rotate: 0 },

  // iPad / tablet UI — park top-left → bottom-right corner
  tablet: { x: 52, y: 62, scale: 1.12, rotate: 0},

  // Mouse laptop — park bottom-right; mid-right beside vertically centered copy
  desktop: { x: -14, y: -28, scale: 0.68, rotate: 0},

  // 2xl / wide
  wide: { x: -30, y: -26, scale: 0.35, rotate: 0 },
};

/**
 * @param {{ isMobile: boolean, isTabletUi: boolean, bp: string }} opts
 */
export function resolveTiersJoinEarlyCardPose({ isMobile, isTabletUi, bp }) {
  if (isMobile) return { key: "mobile", ...TIERS_JOIN_EARLY_CARD_POSE.mobile };
  if (isTabletUi || bp === "tablet") {
    return { key: "tablet", ...TIERS_JOIN_EARLY_CARD_POSE.tablet };
  }
  if (bp === "wide") return { key: "wide", ...TIERS_JOIN_EARLY_CARD_POSE.wide };
  return { key: "desktop", ...TIERS_JOIN_EARLY_CARD_POSE.desktop };
}

/**
 * Format for Framer Motion style units. Arabic nudges the card further right
 * so the left copy column stays clear.
 *
 * @param {CardPose & { key?: string }} pose
 * @param {{ isAr?: boolean }} [opts]
 */
export function formatJoinEarlyCardPose(pose, { isAr = false } = {}) {
  const key = pose.key;
  let x = pose.x;
  let scale = pose.scale;
  if (isAr) {
    if (key === "mobile") {
      x = 58;
      scale = Math.min(scale, 0.92);
    } else if (key === "tablet") {
      x = pose.x + 10;
      scale = Math.min(scale, 1.02);
    } else {
      // Desktop / wide: park is bottom-right; less negative x = further right
      x = Math.min(2, pose.x + 12);
      scale = Math.min(scale, key === "wide" ? 0.32 : 0.58);
    }
  }
  return {
    x: `${x}vw`,
    y: `${pose.y}vh`,
    scale,
    rotate: pose.rotate,
  };
}

