/**
 * tiersGeometry
 * -------------
 * Pure helpers for TiersSection: scroll-phase math, the desktop tier-detail
 * carousel slot geometry, and the card-morph animation drivers. No React state,
 * no DOM ownership — just functions over values / DOM measurements, so they can
 * live outside the (very large) component and be reasoned about in isolation.
 */

import { animate } from "framer-motion";
import { TIERS_STEP_REST } from "./tiersConfig";

export const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Map a scroll-progress value onto a 0→1 phase over the [a, b] sub-range. This
// is what makes each step *scrub*: the phase is a pure, continuous function of
// scroll position, so GSAP replays the movement frame-by-frame with the scroll
// (like the canvas image-sequence hero) instead of firing once per gesture.
export const phaseScrub = (v, a, b) => clamp01((v - a) / (b - a));

export const blockMarqueePointer = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

export const mixUnit = (from, to, m) => {
  const f = parseFloat(from);
  const t = parseFloat(to);
  const unit = from.replace(/[-0-9.]/g, "") || to.replace(/[-0-9.]/g, "") || "";
  return `${f + (t - f) * m}${unit}`;
};

// Carousel slot offsets (vw / vh) relative to the anchor centre used by the
// desktop tier-detail "slider". Shared by open, close, and in-overlay tab hops.
// Tablet peeks are larger so inactive cards stay readable beside the active one.
const detailsSlotFor = (offset, { tablet = false } = {}) => {
  const peekScale = tablet ? 0.58 : 0.32;
  // Tablet: keep peeks closer to the active card (desktop stays at ±34vh).
  const peekY = tablet ? 28 : 34;
  if (offset === 0) return { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 30 };
  if (offset === 1) return { x: tablet ? 5 : 8, y: -peekY, scale: peekScale, opacity: 1, zIndex: 20 };
  if (offset === -1) return { x: tablet ? 5 : 8, y: peekY, scale: peekScale, opacity: 1, zIndex: 20 };
  if (offset >= 2) return { x: 60, y: -peekY, scale: peekScale, opacity: 0, zIndex: 10 };
  return { x: 60, y: peekY, scale: peekScale, opacity: 0, zIndex: 10 };
};

export const progressToStepIndex = (p) => {
  // Bound steps by midpoints between canonical rests so the index matches
  // STEP_REST / snapNext — not the older phase-enter thresholds (0.08/0.40/…).
  // Those thresholds sat between rests and could report step 0 while the user
  // was still visually mid-tiers after a noisy progress read.
  const R = TIERS_STEP_REST;
  for (let i = 0; i < R.length - 1; i++) {
    const mid = (R[i] + R[i + 1]) / 2;
    if (p < mid) return i;
  }
  return R.length - 1;
};

export const stepIndexFromNavProgress = (progress) => {
  const idx = TIERS_STEP_REST.findIndex((r) => Math.abs(r - progress) < 0.006);
  return idx >= 0 ? idx : progressToStepIndex(progress);
};

export const computeCardMorphTargets = (
  cardEls,
  anchorEl,
  activeTab,
  rowBaseline,
  { tablet = false } = {},
) => {
  if (!anchorEl) return null;
  const anchorRect = anchorEl.getBoundingClientRect();
  const anchorCx = anchorRect.left + anchorRect.width / 2;
  const anchorCy = anchorRect.top;
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;

  return cardEls.map((el, i) => {
    const slot = detailsSlotFor(i - activeTab, { tablet });
    const carCx = anchorCx + slot.x * vw;
    const carCy = anchorCy + slot.y * vh;
    let rowCx;
    let rowCy;
    let rowW = 0;
    if (rowBaseline?.[i]) {
      rowCx = rowBaseline[i].cx;
      rowCy = rowBaseline[i].cy;
      rowW = rowBaseline[i].w ?? 0;
    } else if (el) {
      const rowRect = el.getBoundingClientRect();
      rowCx = rowRect.left + rowRect.width / 2;
      rowCy = rowRect.top + rowRect.height / 2;
      rowW = rowRect.width;
    } else {
      return { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 1 };
    }
    // Original slider cards lived in a 30vw anchor (`w-[30vw]`) with scale 1 on
    // the active card. Tier-row slots are ~14vw — scale from the card's current
    // on-screen width (getBoundingClientRect) so the floating blue card, which
    // already renders at finalCardScale, is not double-scaled.
    const carouselScaleFactor = rowW > 0 ? anchorRect.width / rowW : 1;
    return {
      x: (carCx - rowCx) / vw,
      y: (carCy - rowCy) / vh,
      scale: carouselScaleFactor * slot.scale,
      opacity: slot.opacity,
      zIndex: slot.zIndex,
    };
  });
};

export const animateCardMorphTo = (morph, targets, duration, ease) => {
  if (!targets) return [];
  return morph.flatMap((m, i) => {
    const t = targets[i];
    if (!t) return [];
    return [
      animate(m.x, t.x, { duration, ease }),
      animate(m.y, t.y, { duration, ease }),
      animate(m.scale, t.scale, { duration, ease }),
      animate(m.opacity, t.opacity, { duration, ease }),
    ];
  });
};

export const applyMorphZIndex = (morph, targets) => {
  if (!targets) return;
  morph.forEach((m, i) => {
    m.zIndex.set(targets[i]?.zIndex ?? 1);
  });
};

export const resetCardMorph = (morph) => {
  morph.forEach((m) => {
    m.x.set(0);
    m.y.set(0);
    m.scale.set(1);
    m.opacity.set(1);
    m.zIndex.set(1);
  });
};
