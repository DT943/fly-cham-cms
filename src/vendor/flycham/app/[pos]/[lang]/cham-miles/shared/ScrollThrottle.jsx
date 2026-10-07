"use client";

import { useEffect } from "react";
import { isIosMobileSafari } from "./SafariViewportLock";
import {
  isTitleDropdownScrollLocked,
  isWheelOverTitleDropdownMenu,
  consumeWheelWhileTitleDropdownOpen,
} from "./titleDropdownScrollGuard";

export default function ScrollThrottle({
  maxPixelsPerFrame = 18,
  decay = 0.9,
} = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Hero + tiers use capture handlers; throttling document scroll on iOS Safari
    // fights step snaps and expands the bottom toolbar mid-gesture.
    if (isIosMobileSafari()) return;

    let pending = 0;
    let rafId = null;

    const tick = () => {
      const lockUntil = window.__scrollLockUntil ?? 0;
      if (performance.now() < lockUntil) {
        pending = 0;
        rafId = null;
        return;
      }
      if (isTitleDropdownScrollLocked()) {
        pending = 0;
        rafId = null;
        return;
      }
      if (Math.abs(pending) < 0.5) {
        pending = 0;
        rafId = null;
        return;
      }
      const step =
        Math.sign(pending) * Math.min(Math.abs(pending), maxPixelsPerFrame);
      window.scrollBy(0, step);
      pending -= step;
      pending *= decay;
      rafId = requestAnimationFrame(tick);
    };

    const enqueue = (delta) => {
      const lockUntil = window.__scrollLockUntil ?? 0;
      if (performance.now() < lockUntil) return;
      if (isTitleDropdownScrollLocked()) return;
      const clamped =
        Math.sign(delta) * Math.min(Math.abs(delta), maxPixelsPerFrame * 4);
      const maxQueue = maxPixelsPerFrame * 12;
      pending = Math.max(-maxQueue, Math.min(maxQueue, pending + clamped));
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      // Open dropdown: never scroll the page (menu list scrolls via helper).
      if (consumeWheelWhileTitleDropdownOpen(e)) {
        pending = 0;
        return;
      }
      e.preventDefault();
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= window.innerHeight;
      enqueue(dy);
    };

    let lastTouchY = null;
    let touchOnDropdown = false;
    let touchOnTiersSlider = false;
    const onTouchStart = (e) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
      touchOnDropdown = isTitleDropdownScrollLocked(e.target);
      touchOnTiersSlider = !!e.target?.closest?.("[data-cham-tiers-slider]");
    };
    const onTouchMove = (e) => {
      if (touchOnDropdown || isTitleDropdownScrollLocked(e.target)) {
        // Block page scrub; allow native overflow only inside the open menu.
        if (isWheelOverTitleDropdownMenu(e.target)) return;
        e.preventDefault();
        pending = 0;
        return;
      }
      // Our Tiers card slider owns the gesture — do not scroll the page.
      if (touchOnTiersSlider || window.__chamTiersSliderTouch) {
        e.preventDefault();
        return;
      }
      if (lastTouchY == null) return;
      const y = e.touches[0]?.clientY ?? lastTouchY;
      const dy = lastTouchY - y;
      lastTouchY = y;
      e.preventDefault();
      enqueue(dy);
    };
    const onTouchEnd = () => {
      lastTouchY = null;
      touchOnDropdown = false;
      touchOnTiersSlider = false;
    };

    const onKey = (e) => {
      const t = e.target;
      if (
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      ) {
        return;
      }
      if (isTitleDropdownScrollLocked(t)) {
        // Block PageUp / arrows from leaving Join while a menu is open.
        if (
          e.key === "PageUp" ||
          e.key === "PageDown" ||
          e.key === " " ||
          e.key === "ArrowUp" ||
          e.key === "ArrowDown"
        ) {
          e.preventDefault();
        }
        return;
      }
      const vh = window.innerHeight;
      const map = {
        PageDown: vh * 0.9,
        PageUp: -vh * 0.9,
        " ": vh * 0.9,
      };
      const delta = map[e.key];
      if (delta == null) return;
      e.preventDefault();
      enqueue(delta);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [maxPixelsPerFrame, decay]);

  return null;
}
