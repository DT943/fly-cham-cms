/**
 * mobileSliderConfig
 * ------------------
 * Static configuration for MobileTiersSlider: the ordered tier artwork, the
 * swipe thresholds, the slide transition/spring, and the index clamp helper.
 * Pure data + one pure function — no React.
 */

const card = "/cham-miles/card.png";
const silverCard = "/cham-miles/silver-card.png";
const goldCard = "/cham-miles/gold-card.png";
const blackCard = "/cham-miles/black-card.png";

export const TIER_IMAGES = [card, silverCard, goldCard, blackCard];

export const SWIPE_THRESHOLD = 30;
export const SWIPE_VELOCITY = 250;
/** Side-card scale/opacity tween — keep short so swipe feels snappy. */
export const DURATION = 0.6;
export const EASE = [0.64, 0.01, 0.16, 1];
export const SLIDE_PCT = 0.78;

export const slideTransition = { duration: DURATION, ease: EASE };
export const SLIDE_SPRING = { type: "spring", stiffness: 140, damping: 22, restDelta: 0.5 };

/** Cooldown between wheel-driven card changes (ms) — avoids trackpad multi-flips. */
export const WHEEL_CARD_COOLDOWN_MS = 420;

export function clampIndex(index, length) {
  return Math.max(0, Math.min(length - 1, index));
}
