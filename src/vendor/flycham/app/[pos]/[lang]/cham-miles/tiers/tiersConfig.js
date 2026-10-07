/**
 * tiersConfig
 * -----------
 * Static configuration for TiersSection: card/background image paths, benefit
 * imagery + timing, the step-transition timing/threshold constants, the mobile
 * card offsets, and the canonical scroll rests / phase thresholds. Pure data —
 * no React — shared by the component and its geometry helpers (tiersGeometry).
 */

// Tier + background artwork.
export const tierBg = "/cham-miles/tier-bg.png";
export const card = "/cham-miles/card.png";
export const silverCard = "/cham-miles/silver-card.png";
export const goldCard = "/cham-miles/gold-card.png";
export const blackCard = "/cham-miles/black-card.png";

const c1 = "/cham-miles/benefits/c1.png";
const c3 = "/cham-miles/benefits/c3.png";
const c4 = "/cham-miles/benefits/c4.png";
const c5 = "/cham-miles/benefits/c5.png";
export const EASE = [0.64, 0.01, 0.16, 1];
export const DURATION = 1.4;
export const SNAP_DURATION_MS = 200;
/** Desktop step snap — matches hero handoff duration so CTAs feel like wheel scroll. */
export const DESKTOP_SNAP_DURATION_MS = 1150;
/**
 * Tablet / iPad one-step snap (blue card + step copy). Also used on phone so
 * mobile step glides match the deliberate tablet pace (was capped at 720ms).
 */
export const TABLET_SNAP_DURATION_MS = 1700;
/**
 * Our Tiers → Join panel swipe — same duration as the hero canvas handoff
 * (`useSwipeGate` slideToNext ≈ 950ms) so the last section enters as one swipe.
 */
export const JOIN_SWIPE_DURATION_MS = 950;
/** Phone + tablet Join swipe — slower to match the longer step snaps. */
export const TABLET_JOIN_SWIPE_DURATION_MS = 1300;
/** Reverse hero handoff — matches `useSwipeGate` SWIPE_DURATION_MS (950). */
export const HERO_REVERSE_SNAP_MS = 950;
/** Block next step until scroll snap + phase motion fully settle. */
export const STEP_TRANSITION_LOCK_MS = SNAP_DURATION_MS + DURATION * 1000 ;
/** Minimum net wheel/touch delta to count as one step gesture. */
export const WHEEL_GESTURE_THRESHOLD = 5;
/** Idle time before committing a trackpad gesture (ms). */
export const WHEEL_GESTURE_SETTLE_MS = 50;
/** Once threshold is met, commit quickly so the first tiny flick advances. */
export const WHEEL_COMMIT_SETTLE_MS = 28;
/** Retry queued step flush while scroll lock is still active after animation. */
export const PENDING_STEP_FLUSH_RETRY_MS = 48;
/** Mouse-wheel notch — commit on the first tick. */
export const WHEEL_INSTANT_DELTA = 36;
/**
 * How long to HARD-block all scroll once the Our Tiers cards begin their entrance
 * (rise + rotate), so the step cannot be scrolled past until the cards have taken
 * their places and finished rotating. Covers the GSAP rise/spin: duration 0.95s +
 * 3× stagger 0.16s ≈ 1.43s, plus a small settle buffer. Time-based so it can't be
 * released early if the entrance tween is interrupted mid-arrival.
 */
export const TIER_ENTRANCE_LOCK_MS = 1600;

// Final vertical nudge (in vh) for the active blue card once it lands on the
// mobile tiers slider. The landing Y is auto-measured to centre the card on the
// slider's blue slot; this offset is added on top so you can fine-tune it.
// Negative = move the card UP, positive = move it DOWN.
export const MOBILE_CARD_FINAL_Y_OFFSET_VH = -3;
// Mobile "Join Early Earn More" card Y — prefer `tiersJoinEarlyCardPose.js`
// (`TIERS_JOIN_EARLY_CARD_POSE.mobile.y`). Kept as a documented alias.
export const MOBILE_JOIN_EARLY_CARD_Y_VH = 74;

// Index-aligned with content.benefitsPanel.items. Free Ticket (c4) leads.
export const BENEFIT_IMAGES = [c4, c5, c3, c1];
export const BENEFIT_TIMING = [
  { start: 0.30, end: 0.45 },
  { start: 0.45, end: 0.60 },
  { start: 0.60, end: 0.75 },
  { start: 0.75, end: 0.90 },
];

// Canonical scroll rests for the 5 tiers-section steps (matches NAV_LINKS.progress).
// The gap between adjacent rests is that step's SHARE of the scroll (the story is
// scrubbed to scroll). These fractions set the RELATIVE pacing between steps; the
// ABSOLUTE number of scrolls per step is set by the section height knob
// (`--cham-tiers-scroll-vh` in styles.css) — lower that to make every step take
// fewer scrolls in proportion. Many downstream thresholds (0.40 / 0.70 / 0.72 /
// 0.86 / 0.90) are pinned to these values, so prefer the height knob for global
// speed and only touch these to re-balance one step vs another.
// Gaps are proportional to each scrub step's target scroll count: intro→Benefits
// : Benefits→Early Bird : Early Bird→Our Tiers ≈ 6 : 15 : 12, laid out across
// [0, 0.732] (R[3]/R[4] deliberately UNCHANGED so the 0.70/0.72/0.84/0.86/0.95
// thresholds pinned to them stay valid). Absolute scroll counts are then set by
// the height knob (--cham-tiers-scroll-vh). If you retune R[1]/R[2], mirror them
// into navLinks[].progress in content/en.js + content/ar.js.
export const TIERS_STEP_REST = [0, 0.133, 0.466, 0.732, 0.95];
/**
 * Within the intro → Benefits scroll span [R0, R1], `t` reaches 1 at this
 * fraction so the FINAL part of that span is a settle hold (blue card + benefit
 * rows stay put). Exit to Join Early only begins after R[1], on the next scroll
 * — so the last Benefits scroll does not also start the exit.
 */
export const BENEFITS_ENTER_COMPLETE = 0.78;
/**
 * Within Benefits → Join Early [R1, R2], `exit` reaches 1 at this fraction so
 * the FINAL part is a settle hold on Join Early. Our Tiers (phase4) only
 * begins after R[2], on the next scroll.
 */
export const JOIN_EARLY_ENTER_COMPLETE = 0.78;
// Phase thresholds — step i occupies [TIERS_PHASE_BOUNDS[i-1], TIERS_PHASE_BOUNDS[i]).
export const TIERS_PHASE_BOUNDS = [0.08, 0.40, 0.72, 0.86];
/** Join form + footer slide/fade track live scroll between Our Tiers and Join rests. */
export const JOIN_STEP_SCROLL_START = TIERS_PHASE_BOUNDS[3];
export const JOIN_STEP_SCROLL_END = TIERS_STEP_REST[4];
// Hysteresis for phase-4 (Our Tiers) so progress jitter around 0.72 does not
// flip the mobile slider on/off mid-gesture (CTA scroll or wheel snap).
export const PHASE4_ENTER_PROGRESS = TIERS_PHASE_BOUNDS[2];
export const PHASE4_EXIT_PROGRESS = TIERS_PHASE_BOUNDS[2] - 0.04;
