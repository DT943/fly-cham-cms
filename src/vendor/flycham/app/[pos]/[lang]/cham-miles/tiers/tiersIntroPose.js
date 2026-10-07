/**

 * tiersIntroPose

 * --------------

 * Single place to control "Tiers and Benefits" title + description

 * for every screen: mobile | tablet | desktop | wide.

 *

 * Units (same knobs on every breakpoint):

 *   x            → CSS `left` (LTR) or `right` (RTL), as vw

 *   y            → vertical center of the text block, as vh

 *                  (mobile uses flow padding; x/y still kept for parity)

 *   maxWidthVw   → max width of the whole copy column (title + desc), as vw

 *   titleMaxCh   → max width of the TITLE only, in `ch` (characters).

 *                  ~9–10 wraps "Tiers and Benefits" onto 2 lines;

 *                  ~20+ keeps it on one line (when the column is wide enough).

 *   titleNowrap  → true  = force one line (`white-space: nowrap`)

 *                  false = allow wrap (then titleMaxCh controls the break)

 *

 * How to tune (edit the numbers below, hard-refresh):

 *   ↑ larger  y  → move text DOWN

 *   ↓ smaller y  → move text UP

 *   ↑ larger  x  → move text RIGHT (LTR)

 *   ↓ smaller x  → move text LEFT  (LTR)

 */



/** @typedef {{

 *   x: number,

 *   y: number,

 *   maxWidthVw?: number,

 *   titleMaxCh?: number,

 *   titleNowrap?: boolean,

 * }} IntroPose */



/** @type {Record<'mobile' | 'tablet' | 'desktop' | 'wide', IntroPose>} */

export const TIERS_INTRO_POSE = {

  // Phone (<768)

  mobile: {

    x: 7,

    y: 10,

    maxWidthVw: 86,

    titleMaxCh: 9,

    titleNowrap: false,

  },



  // iPad / tablet UI (isTabletUi)

  tablet: {

    x: 6,

    y: 30,

    maxWidthVw: 72,

    titleMaxCh: 28,

    titleNowrap: true,

  },



  // Mouse laptop / lg–xl

  desktop: {

    x: 6,

    y: 50,

    maxWidthVw: 40,

    titleMaxCh: 20,

    titleNowrap: true,

  },



  // 2xl / wide

  wide: {

    x: 7,

    y: 35,

    maxWidthVw: 36,

    titleMaxCh: 20,

    titleNowrap: true,

  },

};



/**

 * Pick the pose for the current viewport flags.

 * @param {{ isMobile: boolean, isTabletUi: boolean, bp: string }} opts

 */

export function resolveTiersIntroPose({ isMobile, isTabletUi, bp }) {

  if (isMobile) return { key: "mobile", ...TIERS_INTRO_POSE.mobile };

  if (isTabletUi) return { key: "tablet", ...TIERS_INTRO_POSE.tablet };

  if (bp === "wide") return { key: "wide", ...TIERS_INTRO_POSE.wide };

  return { key: "desktop", ...TIERS_INTRO_POSE.desktop };

}


