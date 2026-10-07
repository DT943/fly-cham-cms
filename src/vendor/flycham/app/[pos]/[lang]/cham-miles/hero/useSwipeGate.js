"use client";

/**
 * useSwipeGate
 * ------------
 * Swipe-gated slide to the next section. Frames scrub on scroll as usual, but
 * once the sequence is DONE (scroll reaches the hero's end), normal scroll is
 * NOT allowed to flow into the section below — the user must SWIPE UP, which
 * plays an eased slide: the canvas scrolls up and the next section slides into
 * view. Scrolling up from the tiers intro ("Tiers and Benefits") fires
 * `chamMilesSwipeBack` and plays the reverse slide back to the hero gate.
 * Refs (not state) so the scroll loop never triggers React re-renders.
 */

import { useEffect, useRef } from "react";
import { getChamHeroHandoffY } from "../shared/SafariViewportLock";
import { getScrollTop, getViewportHeight, scrollPortTo, snapChamMilesScrollScrub } from "../shared/chamScrollPort";
import { prefersDesktopChamMilesMotion } from "../shared/chamMilesMotion";

/**
 * Keep the sticky hero pinned while the gate is armed. `handoffY - vh` is the
 * exact unpin threshold — sitting ON that line makes sticky release/re-pin on
 * 1px jitter and flashes the brand gradient / next section behind the canvas.
 * Mobile needs a larger hold: touch momentum + URL-bar resize easily overshoots
 * a tiny buffer and starts sliding the header off-screen during second-layer.
 */
const STICKY_HOLD_DESKTOP_PX = 12;
const STICKY_HOLD_TABLET_PX = 48;
const STICKY_HOLD_MOBILE_PX = 56;

function stickyHoldPx() {
  if (typeof window === "undefined") return STICKY_HOLD_DESKTOP_PX;
  if (window.matchMedia("(max-width: 767px)").matches) return STICKY_HOLD_MOBILE_PX;
  // After tablet / landscape tablet: same tight hold as xl+ big screen.
  if (prefersDesktopChamMilesMotion()) return STICKY_HOLD_DESKTOP_PX;
  return STICKY_HOLD_TABLET_PX;
}

/** Matches forward handoff + TiersSection HERO_REVERSE_SNAP_MS lock. */
const SWIPE_DURATION_MS = 950;

export function useSwipeGate({ sectionRef }) {
  const gatePhaseRef = useRef("scrub"); // "scrub" | "gate" | "past"
  const transitioningRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Scroll offset where the frames finish (hero end) and where the next
    // section is fully in view (handoff). The slide animates between them.
    // Gate sits a few px ABOVE the sticky unpin line so the canvas stays pinned
    // (and the last frame stays painted) until the swipe starts.
    const gateY = () =>
      Math.max(0, getChamHeroHandoffY(section) - getViewportHeight() - stickyHoldPx());
    const handoffY = () => getChamHeroHandoffY(section);

    // Programmatic slide between gate ↔ handoff — never the user's raw scroll.
    const playSlide = (targetY, { onStartPhase, onDonePhase }) => {
      if (transitioningRef.current) return;
      const startY = getScrollTop();
      transitioningRef.current = true;
      if (onStartPhase) gatePhaseRef.current = onStartPhase;
      if (Math.abs(targetY - startY) <= 1) {
        scrollPortTo(targetY);
        gatePhaseRef.current = onDonePhase;
        transitioningRef.current = false;
        return;
      }
      const delta = targetY - startY;
      window.__scrollLockUntil = performance.now() + SWIPE_DURATION_MS + 400;
      const startT = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - startT) / SWIPE_DURATION_MS);
        scrollPortTo(startY + delta * easeInOutCubic(t));
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          scrollPortTo(targetY);
          gatePhaseRef.current = onDonePhase;
          window.__scrollLockUntil = performance.now();
          transitioningRef.current = false;
        }
      };
      requestAnimationFrame(step);
    };

    // Pinned canvas scrolls up; next section slides in.
    const slideToNext = () => {
      playSlide(handoffY(), { onStartPhase: "past", onDonePhase: "past" });
    };

    // Reverse of slideToNext — tiers intro → hero gate (same easing / duration).
    // Fired by TiersSection via `chamMilesSwipeBack` when scrolling up at step 0.
    const slideBackToHero = () => {
      playSlide(gateY(), { onDonePhase: "gate" });
    };

    // Gestures — capture phase on window fires BEFORE ScrollThrottle and catches
    // events from the iOS inner scroller too. Only act while the gate is armed.
    const onWheel = (e) => {
      if (transitioningRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (gatePhaseRef.current !== "gate") return;
      if (e.deltaY > 0) {
        // swipe up / scroll down → advance with the slide (not normal scroll)
        e.preventDefault();
        e.stopPropagation();
        slideToNext();
      }
      // deltaY < 0 (scroll up) passes through → the watch loop releases the gate
    };

    let lastTouchY = null;
    const onTouchStart = (e) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      if (transitioningRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (gatePhaseRef.current !== "gate" || lastTouchY == null) return;
      const y = e.touches[0]?.clientY ?? lastTouchY;
      const dy = lastTouchY - y; // finger up (clientY down) === swipe up
      lastTouchY = y;
      if (dy > 0) {
        e.preventDefault();
        e.stopPropagation();
        slideToNext();
      }
    };
    const onTouchEnd = () => {
      lastTouchY = null;
    };

    // Watch loop: arm the gate when the frames reach the end, hold there, and
    // release it when the user scrolls back up or has slid past.
    // Only snap scroll when we actually drift — repeated scrollPortTo every
    // frame fights ScrollThrottle / scrub and causes a last-frame flash.
    let rafId = requestAnimationFrame(function watch() {
      if (!transitioningRef.current) {
        const y = getScrollTop();
        const g = gateY();
        const phase = gatePhaseRef.current;
        if (phase === "scrub") {
          if (y >= g - 1) {
            gatePhaseRef.current = "gate";
            if (Math.abs(y - g) > 0.5) scrollPortTo(g);
            window.__scrollLockUntil = performance.now() + 80; // flush momentum
          }
        } else if (phase === "gate") {
          if (y < g - 4) {
            gatePhaseRef.current = "scrub"; // scrolled back up
          } else if (y > g + 0.5) {
            scrollPortTo(g); // block any downward drift past the hold
          }
        } else if (phase === "past") {
          if (y <= g + 2) gatePhaseRef.current = "scrub"; // scrolled back into hero
        }
      }
      rafId = requestAnimationFrame(watch);
    });

    // Header nav jumps past the hero — leave "gate" so the hold loop does not
    // yank scroll back to the last frame while TiersSection scrolls to the step.
    // Snap scrub so the canvas does not race through frames during the jump.
    const onGoTo = (e) => {
      const target = e.detail || {};
      transitioningRef.current = false;
      if (target.step === "welcome") {
        gatePhaseRef.current = "scrub";
        requestAnimationFrame(() => snapChamMilesScrollScrub());
        return;
      }
      if (target.progress != null || target.step) {
        gatePhaseRef.current = "past";
        requestAnimationFrame(() => snapChamMilesScrollScrub());
      }
    };

    const onSwipeBack = () => {
      slideBackToHero();
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    window.addEventListener("chamMilesGoTo", onGoTo);
    window.addEventListener("chamMilesSwipeBack", onSwipeBack);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("touchend", onTouchEnd, { capture: true });
      window.removeEventListener("chamMilesGoTo", onGoTo);
      window.removeEventListener("chamMilesSwipeBack", onSwipeBack);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
