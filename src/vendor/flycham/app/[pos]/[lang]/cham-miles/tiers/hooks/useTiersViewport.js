"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DURATION } from "../tiersConfig";
import {
  AFTER_TABLET_PX,
  CHAM_MILES_DESKTOP_MOTION_MQ,
  prefersDesktopChamMilesMotion,
} from "../../shared/chamMilesMotion";

export const MOBILE_BREAKPOINT_PX = 768;
/** xl / "wide" floor — layout / UI wide breakpoint (side panel, etc.). */
export const WIDE_BREAKPOINT_PX = 1280;

/**
 * CSS matchMedia string for tablet UI.
 * - 768–1023: always tablet
 * - 1024–1279: hover:none / pointer:coarse (iPad Pro)
 *
 * Note: iPad "Request Desktop Website" often reports hover:hover + pointer:fine,
 * so JS also checks maxTouchPoints in `readChamMilesTabletUi`.
 */
export const CHAM_MILES_TABLET_UI_MQ = [
  "(min-width: 768px) and (max-width: 1023px)",
  "(min-width: 1024px) and (max-width: 1279px) and (hover: none)",
  "(min-width: 1024px) and (max-width: 1279px) and (pointer: coarse)",
].join(", ");

/** True when the device can use multi-touch (iPad desktop-site mode, etc.). */
function hasMultiTouch() {
  if (typeof navigator === "undefined") return false;
  return (navigator.maxTouchPoints || 0) > 1;
}

/**
 * Read whether this viewport should use tablet Cham Miles layouts.
 * Mouse laptops in 1024–1279 keep 2xl-style desktop UI; real tablets do not.
 */
export function readChamMilesTabletUi() {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth;
  if (w < MOBILE_BREAKPOINT_PX || w >= WIDE_BREAKPOINT_PX) return false;
  // Standard tablet / DevTools width — always tablet UI.
  if (w < AFTER_TABLET_PX) return true;
  // 1024–1279: matchMedia OR multi-touch (iPad desktop website spoofs hover).
  if (window.matchMedia?.(CHAM_MILES_TABLET_UI_MQ).matches) return true;
  return hasMultiTouch();
}

/** Read the current viewport into the {isMobile, bp} shape the section uses. */
export function readChamMilesViewport() {
  if (typeof window === "undefined") {
    return { isMobile: false, bp: "desktop", shouldStepSnap: true };
  }
  const w = window.innerWidth;
  return {
    isMobile: w < MOBILE_BREAKPOINT_PX,
    bp:
      w < MOBILE_BREAKPOINT_PX
        ? "mobile"
        : w < AFTER_TABLET_PX
          ? "tablet"
          : w < WIDE_BREAKPOINT_PX
            ? "desktop"
            : "wide",
    // Phone + portrait tablet: discrete step snaps.
    // After tablet / landscape tablet / xl+: free scrub like big screen.
    shouldStepSnap: !prefersDesktopChamMilesMotion(),
  };
}

/**
 * Viewport state for the tiers section. Tracks {isMobile, bp} across resizes and
 * mirrors them into refs the scroll-driver effect reads without re-binding:
 *   - isMobileRef: latest isMobile for the (empty-deps) gesture handlers.
 *   - shouldStepSnapRef: discrete snaps on phone + portrait tablet
 *     (false after tablet / landscape / xl+ free scrub).
 *   - transitionDurationRef: phase settle cadence after a step snap.
 *   - isTabletUi: real tablet layouts (not mouse laptop 1024–1279).
 */
export function useTiersViewport() {
  const [isMobile, setIsMobile] = useState(() => readChamMilesViewport().isMobile);
  const [bp, setBp] = useState(() => readChamMilesViewport().bp);
  const [isTabletUi, setIsTabletUi] = useState(() => readChamMilesTabletUi());
  const isMobileRef = useRef(isMobile);
  const isTabletUiRef = useRef(isTabletUi);
  const shouldStepSnapRef = useRef(readChamMilesViewport().shouldStepSnap);
  const transitionDurationRef = useRef(DURATION);
  useEffect(() => {
    isMobileRef.current = isMobile;
    // Same phase settle cadence as tablet — do not stretch the post-snap lock
    // on phone (that made steps feel stuck after a short cut).
    transitionDurationRef.current = DURATION;
  }, [isMobile]);
  useEffect(() => {
    isTabletUiRef.current = isTabletUi;
  }, [isTabletUi]);

  useLayoutEffect(() => {
    const check = () => {
      const next = readChamMilesViewport();
      setIsMobile(next.isMobile);
      setBp(next.bp);
      shouldStepSnapRef.current = next.shouldStepSnap;
      const tablet = readChamMilesTabletUi();
      isTabletUiRef.current = tablet;
      setIsTabletUi(tablet);
    };
    check();
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const mqWide = window.matchMedia(`(max-width: ${WIDE_BREAKPOINT_PX - 1}px)`);
    const mqTabletUi = window.matchMedia(CHAM_MILES_TABLET_UI_MQ);
    const mqDesktopMotion = window.matchMedia(CHAM_MILES_DESKTOP_MOTION_MQ);
    mq.addEventListener?.("change", check);
    mqWide.addEventListener?.("change", check);
    mqTabletUi.addEventListener?.("change", check);
    mqDesktopMotion.addEventListener?.("change", check);
    window.addEventListener("resize", check);
    return () => {
      mq.removeEventListener?.("change", check);
      mqWide.removeEventListener?.("change", check);
      mqTabletUi.removeEventListener?.("change", check);
      mqDesktopMotion.removeEventListener?.("change", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return {
    isMobile,
    bp,
    isTabletUi,
    isMobileRef,
    isTabletUiRef,
    shouldStepSnapRef,
    transitionDurationRef,
  };
}
