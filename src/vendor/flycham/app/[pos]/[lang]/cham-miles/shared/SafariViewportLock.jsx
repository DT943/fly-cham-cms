"use client";

import { useLayoutEffect } from "react";
import { notifyChamScrollContainerReady } from "./chamScrollPort";

const IOS_MOBILE_UA = /iPhone|iPad|iPod/i;
const NON_SAFARI_IOS = /CriOS|FxiOS|EdgiOS|OPiOS/i;

/**
 * iPadOS 13+ Safari reports as Macintosh with touch. Without detecting that,
 * the document stays the scroller, the toolbar toggles on scroll, and sticky
 * hero content jumps/flickers at the bottom of the viewport on tablets.
 */
function isIpadOsTouchDesktopUa(ua) {
  return (
    /Macintosh/i.test(ua) &&
    typeof navigator !== "undefined" &&
    Number(navigator.maxTouchPoints || 0) > 1
  );
}

/** True for Mobile / iPad Safari (not other browsers, not home-screen PWA). */
export function isIosMobileSafari() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  if (NON_SAFARI_IOS.test(ua)) return false;

  const classicIos = IOS_MOBILE_UA.test(ua);
  const ipadDesktopUa = isIpadOsTouchDesktopUa(ua);
  if (!classicIos && !ipadDesktopUa) return false;

  // Chromium / Firefox desktop UAs on iPad still include the "Safari" token.
  if (ipadDesktopUa && /Chrome|Chromium|Edg|Firefox|OPR/i.test(ua)) return false;

  if (window.navigator.standalone) return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return false;
  return /Safari/i.test(ua);
}

/** Layout-viewport unit in px (CSS `1vh`). */
function readLargeViewportUnitPx() {
  return window.innerHeight * 0.01;
}

/** Currently visible viewport unit in px — drives the inner scroll container. */
function readVisibleViewportUnitPx() {
  const vv = window.visualViewport;
  return (vv?.height ?? window.innerHeight) * 0.01;
}

/**
 * Scroll offset at the bottom of the 300-unit hero scroll container, i.e. the
 * top of TiersSection. Equals the hero element's own height (its CSS height
 * resolves to the container-relative unit on iOS), so it works for both the
 * inner-scroll (iOS) and window-scroll (desktop) paths.
 */
export function getChamHeroHandoffY(scrollEl) {
  if (!scrollEl) return 0;
  return Math.round((scrollEl.offsetTop || 0) + scrollEl.offsetHeight);
}

/**
 * iOS / iPad Safari toggles its toolbar on ROOT-document scroll, which resizes
 * the viewport mid-animation (hero Welcome + scroll hint jump at the bottom on
 * tablets). The cham-miles route locks the document and scrolls an inner
 * container instead (see styles.css + chamScrollPort.js), so the toolbar
 * settles into one stable state. This component only:
 *   - tags <html> so the lock + container CSS applies, and
 *   - publishes the stable viewport units as CSS variables.
 * It does NOT patch window scroll or pin scrollY — the inner container owns
 * scrolling now.
 *
 * On first paint, freeze `--cham-visible-vh-px` from the *current* viewport and
 * do not chase visualViewport resize while scrolling — that chase itself caused
 * sticky stage height flicker on iPad.
 */
export default function SafariViewportLock() {
  // useLayoutEffect so the lock class is on <html> before paint / before
  // ScrollTrigger measures — useEffect was too late and left ST on `window`
  // while touch gestures drove `#cham-scroll-root` (tiers intro couldn't step).
  useLayoutEffect(() => {
    if (!isIosMobileSafari()) return;

    const html = document.documentElement;
    html.classList.add("cham-miles-ios-safari");

    const applyUnits = () => {
      // Prefer the small (stable) viewport once the document is locked so we do
      // not resize sticky stages when the browser briefly reports a larger vv.
      const unitPx =
        Math.min(readVisibleViewportUnitPx(), readLargeViewportUnitPx()) ||
        readVisibleViewportUnitPx();
      html.style.setProperty("--cham-vh-px", `${readLargeViewportUnitPx()}px`);
      html.style.setProperty("--cham-visible-vh-px", `${unitPx}px`);
    };

    applyUnits();
    // Tell GSAP / Framer consumers the inner scroller is now a real scrollport.
    notifyChamScrollContainerReady();

    // Orientation only — do not chase visualViewport resize on scroll (that
    // resize is exactly what made hero content flicker at the bottom on iPad).
    const onOrientationChange = () => {
      requestAnimationFrame(() => {
        applyUnits();
        notifyChamScrollContainerReady();
      });
    };
    window.addEventListener("orientationchange", onOrientationChange, { passive: true });

    return () => {
      html.classList.remove("cham-miles-ios-safari");
      html.style.removeProperty("--cham-vh-px");
      html.style.removeProperty("--cham-visible-vh-px");
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, []);

  return null;
}
