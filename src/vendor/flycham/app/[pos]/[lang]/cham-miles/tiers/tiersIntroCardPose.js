/**

 * tiersIntroCardPose

 * ------------------

 * Single place to control the floating blue card on the

 * "Tiers and Benefits" intro step.

 *

 * These numbers are Framer offsets FROM the CSS park corner:

 *

 *   Desktop / wide park → bottom-right  (styles.css: right/bottom)

 *   Tablet park         → top-left      (styles.css: .tier-flip-host--tablet-mobile-park)

 *   Mobile park         → top-left      (inline / mobile host)

 *

 * How to tune (edit the numbers below, hard-refresh):

 *   ↑ larger  y  → move card DOWN

 *   ↓ smaller y  → move card UP

 *   ↑ larger  x  → move card RIGHT

 *   ↓ smaller x  → move card LEFT  (use negative on desktop to pull inward)

 *   scale        → size

 *   rotate       → tilt in degrees

 *

 * Benefits rest pose lives in `tiersBenefitsCardPose.js`.

 * `cardPoseToFramerRanges` scrubs intro → benefits for each viewport.

 */



import { TIERS_BENEFITS_CARD_POSE } from "./tiersBenefitsCardPose";



/** @typedef {{ x: number, y: number, scale: number, rotate: number }} CardPose */



/** @type {Record<'mobile' | 'tablet' | 'desktop' | 'wide', CardPose>} */

export const TIERS_INTRO_CARD_POSE = {

  // From mobile top-left park

  mobile: { x: 45, y: 85, scale: 1.55, rotate: 10 },



  // iPad / tablet UI — park is top-left; positive x/y push toward lower-right

  tablet: { x: 58, y: 80, scale: 1.6, rotate: 10 },



  // Mouse laptop — park is bottom-right; 0/0 = design rest. Negative x/y = inward/up.

  desktop: { x: -3, y: -7, scale: 1, rotate: 10 },



  // 2xl / wide — same park model as desktop

  wide: { x: 0, y: 0, scale: 0.9, rotate: 10 },

};



/**

 * Format intro → Benefits scrub into Framer unit arrays.

 * @param {CardPose} intro

 * @param {CardPose} benefits

 */

export function cardPoseToFramerRanges(intro, benefits) {

  return {

    x: [`${intro.x}vw`, `${benefits.x}vw`],

    y: [`${intro.y}vh`, `${benefits.y}vh`],

    scale: [intro.scale, benefits.scale],

    rotate: [intro.rotate, benefits.rotate],

  };

}



/**

 * @param {'mobile' | 'tablet' | 'desktop' | 'wide'} key

 */

export function introToBenefitsFramerRanges(key) {

  return cardPoseToFramerRanges(

    TIERS_INTRO_CARD_POSE[key],

    TIERS_BENEFITS_CARD_POSE[key]

  );

}



/**

 * @param {{ isMobile: boolean, isTabletUi: boolean, bp: string }} opts

 */

export function resolveTiersIntroCardPose({ isMobile, isTabletUi, bp }) {

  if (isMobile) return { key: "mobile", ...TIERS_INTRO_CARD_POSE.mobile };

  if (isTabletUi) return { key: "tablet", ...TIERS_INTRO_CARD_POSE.tablet };

  if (bp === "wide") return { key: "wide", ...TIERS_INTRO_CARD_POSE.wide };

  return { key: "desktop", ...TIERS_INTRO_CARD_POSE.desktop };

}


