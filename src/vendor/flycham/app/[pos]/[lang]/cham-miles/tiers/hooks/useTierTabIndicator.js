"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Measures the sliding underline under the active tier-detail tab, plus the
 * shared base track that spans from the first tab to the last tab.
 *
 * Base track and active indicator share the same end points at both edges of
 * the tab group — the track is never wider than the tabs themselves.
 */
export function useTierTabIndicator({ activeTab, detailsOpen, isAr }) {
  const tierTabBarRef = useRef(null);
  const tierTabButtonRefs = useRef([]);
  const [tierTabActiveLine, setTierTabActiveLine] = useState({
    left: 0,
    width: 0,
    trackLeft: 0,
    trackWidth: 0,
  });

  const measureTierTabActiveLine = useCallback(() => {
    const bar = tierTabBarRef.current;
    const btn = tierTabButtonRefs.current[activeTab];
    if (!bar || !btn) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const buttons = tierTabButtonRefs.current.filter(Boolean);
    if (!buttons.length) return;

    let leftMin = Infinity;
    let rightMax = -Infinity;
    for (const b of buttons) {
      const r = b.getBoundingClientRect();
      if (r.left < leftMin) leftMin = r.left;
      if (r.right > rightMax) rightMax = r.right;
    }

    const trackLeft = Math.max(0, leftMin - barRect.left);
    const trackRight = Math.max(trackLeft, rightMax - barRect.left);
    const trackWidth = Math.max(0, trackRight - trackLeft);

    let left = Math.max(0, btnRect.left - barRect.left);
    let right = Math.max(left, btnRect.right - barRect.left);

    // Pin active ends to the shared track when this tab owns an edge.
    if (Math.abs(btnRect.left - leftMin) < 2) left = trackLeft;
    if (Math.abs(btnRect.right - rightMax) < 2) right = trackRight;

    setTierTabActiveLine({
      left,
      width: Math.max(0, right - left),
      trackLeft,
      trackWidth,
    });
  }, [activeTab]);

  useLayoutEffect(() => {
    measureTierTabActiveLine();
    const bar = tierTabBarRef.current;
    const btn = tierTabButtonRefs.current[activeTab];
    if (!bar) return undefined;
    const ro = new ResizeObserver(measureTierTabActiveLine);
    ro.observe(bar);
    if (btn) ro.observe(btn);
    window.addEventListener("resize", measureTierTabActiveLine);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureTierTabActiveLine);
    };
  }, [measureTierTabActiveLine, detailsOpen, activeTab, isAr]);

  return { tierTabBarRef, tierTabButtonRefs, tierTabActiveLine };
}
