"use client";

import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isIosMobileSafari } from "./SafariViewportLock";

/**
 * Shared reference to the iOS inner scroll container (`#cham-scroll-root`).
 *
 * On iOS Safari the cham-miles experience scrolls an inner element with a fixed
 * height instead of the document, so Safari's bottom toolbar never toggles and
 * `window.innerHeight` stays constant during the scroll-jacked animations.
 * Desktop and Android keep scrolling the window unchanged.
 *
 * This is a plain object (not a React ref) so it can be imported by the
 * imperative scroll helpers. For Framer Motion `useScroll`, use
 * `useChamScrollContainerRef()` so the hook re-subscribes once the node mounts.
 */
export const chamScrollContainerRef = { current: null };

let chamScrollContainerVersion = 0;
const containerListeners = new Set();

function notifyChamScrollContainerChange() {
  chamScrollContainerVersion += 1;
  containerListeners.forEach((listener) => listener(chamScrollContainerVersion));
}

/** Called from page.js when `#cham-scroll-root` mounts or unmounts. */
export function bindChamScrollContainer(node) {
  chamScrollContainerRef.current = node;
  notifyChamScrollContainerChange();
}

/**
 * Subscribe to scroll-root bind / layout-lock changes. Used so GSAP
 * ScrollTrigger can reattach when the iOS/iPad inner scroller becomes active
 * (class applied in SafariViewportLock after first paint).
 */
export function subscribeChamScrollContainer(listener) {
  containerListeners.add(listener);
  return () => containerListeners.delete(listener);
}

/** Bump subscribers without changing the node (e.g. after viewport lock CSS). */
export function notifyChamScrollContainerReady() {
  notifyChamScrollContainerChange();
}

/**
 * Ref object for Framer Motion `useScroll({ container })`. Returns a new object
 * whenever the scroll root mounts so `useScroll` re-binds to the inner scroller
 * instead of staying on the locked document.
 */
export function useChamScrollContainerRef() {
  const [version, setVersion] = useState(() => chamScrollContainerVersion);

  useEffect(() => {
    const onChange = (next) => setVersion(next);
    containerListeners.add(onChange);
    // The scroll root's callback ref fires during commit — BEFORE this passive
    // effect subscribes — so the bind notification is missed. Catch up here, on
    // every render, so `useScroll` re-binds once the container actually exists.
    if (version !== chamScrollContainerVersion) {
      setVersion(chamScrollContainerVersion);
    }
    return () => containerListeners.delete(onChange);
  }, [version]);

  return useMemo(
    () => ({ current: chamScrollContainerRef.current }),
    [version],
  );
}

/** True when the inner scroll container is active (iOS Safari + mounted). */
export function usesInnerScroll() {
  return isIosMobileSafari() && !!chamScrollContainerRef.current;
}

/** Current scroll offset of the active scroller (container on iOS, else window). */
export function getScrollTop() {
  const el = chamScrollContainerRef.current;
  if (isIosMobileSafari() && el) return el.scrollTop;
  return typeof window === "undefined" ? 0 : window.scrollY;
}

/** Scroll the active scroller to an absolute offset (always instant).
 *  Must override `html { scroll-behavior: smooth }` from globals.css — otherwise
 *  programmatic jumps (header nav) animate through the whole page and scrub
 *  every GSAP / canvas timeline along the way. */
export function scrollPortTo(y) {
  const el = chamScrollContainerRef.current;
  if (isIosMobileSafari() && el) {
    el.scrollTop = y;
    return;
  }
  if (typeof window === "undefined") return;
  const top = Math.max(0, y);
  // `instant` is the modern keyword; `auto` is the fallback for older engines.
  try {
    window.scrollTo({ top, left: 0, behavior: "instant" });
  } catch {
    window.scrollTo({ top, left: 0, behavior: "auto" });
  }
  if (Math.abs(window.scrollY - top) > 1) {
    window.scrollTo(0, top);
  }
}

/** Scroll the active scroller by a delta (always instant — see scrollPortTo). */
export function scrollPortBy(dy) {
  const el = chamScrollContainerRef.current;
  if (isIosMobileSafari() && el) {
    el.scrollTop += dy;
    return;
  }
  if (typeof window === "undefined") return;
  try {
    window.scrollBy({ top: dy, left: 0, behavior: "instant" });
  } catch {
    window.scrollBy({ top: dy, left: 0, behavior: "auto" });
  }
}

/**
 * Force every scrubbed ScrollTrigger timeline to match the current scroll
 * position immediately (no scrub: N catch-up). Used after header-nav jumps so
 * the page replaces the section instead of racing through intermediate frames.
 */
export function snapChamMilesScrollScrub() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.update();
  ScrollTrigger.getAll().forEach((st) => {
    const anim = st.animation;
    if (!anim) return;
    // `scrub: 1` drives the timeline through an internal easing tween. Setting
    // `anim.progress()` alone is not enough — that tween is still live and, on
    // the next tick, keeps interpolating from the old progress to the target,
    // gliding the timeline (and its onUpdate → phases) through every
    // intermediate step. Complete the scrub tween so the timeline lands on the
    // scroll target instantly, then hold it there.
    const scrubTween = typeof st.getTween === "function" ? st.getTween() : null;
    if (scrubTween) scrubTween.progress(1);
    anim.progress(st.progress);
  });
}

/**
 * Height of the active viewport. On iOS this is the inner container's
 * clientHeight, which is fixed (the document is locked, so the toolbar can't
 * change it). Off iOS it is `window.innerHeight`.
 */
export function getViewportHeight() {
  const el = chamScrollContainerRef.current;
  if (isIosMobileSafari() && el) return el.clientHeight;
  return typeof window === "undefined" ? 0 : window.innerHeight;
}

/** Active scroll element for attaching non-passive gesture listeners on iOS. */
export function getChamScrollTarget() {
  if (isIosMobileSafari() && chamScrollContainerRef.current) {
    return chamScrollContainerRef.current;
  }
  return typeof window !== "undefined" ? window : null;
}
