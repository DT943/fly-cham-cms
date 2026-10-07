/**

 * tiersBenefitsCardPose

 * ---------------------

 * Single place to control the floating blue card on the

 * "Benefits that matter to you" step (rest pose).

 *

 * These numbers are Framer offsets FROM the CSS park corner:

 *

 *   Desktop / wide park → bottom-right  (styles.css: right/bottom)

 *   Tablet park         → top-left      (styles.css: .tier-flip-host--tablet-mobile-park)

 *   Mobile park         → top-left      (styles.css / mobile host)

 *

 * How to tune (edit the numbers below, hard-refresh):

 *   ↑ larger  y  → move card DOWN

 *   ↓ smaller y  → move card UP

 *   ↑ larger  x  → move card RIGHT

 *   ↓ smaller x  → move card LEFT  (use negative on desktop to pull inward)

 *   scale        → size

 *   rotate       → tilt in degrees

 *

 * The intro → Benefits scrub starts from `tiersIntroCardPose.js` (intro)

 * and ends at these values.

 */



/** @typedef {{ x: number, y: number, scale: number, rotate: number }} CardPose */



/** @type {Record<'mobile' | 'tablet' | 'desktop' | 'wide', CardPose>} */

export const TIERS_BENEFITS_CARD_POSE = {

  // Phone — park top-left; screenshot-like left peek over the panel

  mobile: { x: 10, y: 16, scale: 0.8, rotate: -8 },



  // iPad / tablet UI — park top-left

  tablet: { x: 15, y: 20, scale:1.4, rotate: -16 },



  // Mouse laptop — park bottom-right; negative x/y = inward / up (left of panel)

  desktop: { x: -65, y: -25, scale: 0.7, rotate: -8 },



  // 2xl / wide — same park model as desktop

  wide: { x: -65, y: -25, scale: 0.7, rotate: -8 },

};



/**

 * @param {{ isMobile: boolean, isTabletUi: boolean, bp: string }} opts

 */

export function resolveTiersBenefitsCardPose({ isMobile, isTabletUi, bp }) {

  if (isMobile) return { key: "mobile", ...TIERS_BENEFITS_CARD_POSE.mobile };

  if (isTabletUi) return { key: "tablet", ...TIERS_BENEFITS_CARD_POSE.tablet };

  if (bp === "wide") return { key: "wide", ...TIERS_BENEFITS_CARD_POSE.wide };

  return { key: "desktop", ...TIERS_BENEFITS_CARD_POSE.desktop };

}


