/**
 * heroConfig
 * ----------
 * Static configuration for ChamMilesCanvasHero: the frame sequence, the
 * scroll-scrubbed welcome-intro exit thresholds, the second-layer reveal
 * window, and the brand gradient backdrop. Pure data — no React, no logic —
 * so both the component and its hooks can share one source of truth.
 */

// ── Frame sequence ────────────────────────────────────────────────────────
// The real files in /public/cham-miles/frames are `frame-001.webp` …
// `frame-085.webp` — the frame number is ALWAYS zero-padded to 3 digits
// (frame-001, frame-010, frame-085), so pad accordingly. (A naive `frame-00${n}`
// only works for 1–9 and 404s for 10+, which is why most frames didn't show.)
export const TOTAL_FRAMES = 100;
export const frameUrl = (n) =>
  `/cham-miles/frames/frame-${String(n).padStart(3, "0")}.webp`; // n is 1-based
export const IMAGE_URLS = Array.from({ length: TOTAL_FRAMES }, (_, i) => frameUrl(i + 1));
export const LAST_FRAME = TOTAL_FRAMES - 1; // 0-based index of the final frame

// ── Welcome-intro exit thresholds (FRAME numbers, 0-based) ─────────────────
// Scene: content stays CENTERED, SCALES DOWN, then DISAPPEARS (fade) — same
// on every device. Scrub reverses when scrolling back up.
//   1) Scale 1 → SMALL_SCALE across the whole exit window (transform-origin center).
//   2) After SCALE_DOWN_END_FRAME, fade out in place (no vertical lift).
export const SCALE_DOWN_END_FRAME = 8; // shrink is clearly underway; fade begins
export const SLIDE_UP_END_FRAME = 22; // fully scaled + gone
export const SMALL_SCALE = 0.28; // how small before it vanishes
export const scaleDownEnd = SCALE_DOWN_END_FRAME / LAST_FRAME; // progress 0→1
export const slideUpEnd = SLIDE_UP_END_FRAME / LAST_FRAME; // progress 0→1
export const firstSlideEnd = slideUpEnd; // alias for older imports

// ── ScrollTrigger scrub lag (seconds of catch-up) ──────────────────────────
// Soft floaty lag behind scroll. Phone + portrait tablet use COMPACT;
// after tablet / landscape tablet / xl+ use DESKTOP (same big-screen feel).
export const HERO_SCRUB_DESKTOP = 1.25;
export const HERO_SCRUB_COMPACT = 1.5;

// ── Second layer ("Step into / Your Premium journey") ────────────────────
// Reveals over the late frame-sequence band. Copy starts at frame-066
// (0-based index 65), eases in through ~frame-078, then HOLDS to the end and
// rides out with the canvas during the swipe slide.
export const SECOND_IN_START_FRAME = 65; // frame-066.webp
export const SECOND_IN_END_FRAME = 77;
export const secondInStart = SECOND_IN_START_FRAME / LAST_FRAME;
export const secondInEnd = SECOND_IN_END_FRAME / LAST_FRAME;

// Brand gradient loading backdrop, matching the previous hero's safety gradient
// so there is never a blank flash before the frames decode.
export const BRAND_GRADIENT =
  "linear-gradient(180deg, var(--cm-hero-grad-top) 0%, var(--cm-hero-grad-bottom) 100%)";
