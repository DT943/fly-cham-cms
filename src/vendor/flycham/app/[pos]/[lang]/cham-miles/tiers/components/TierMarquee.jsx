"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { blockMarqueePointer } from "../tiersGeometry";
import { readChamMilesTabletUi } from "../hooks/useTiersViewport";

/**
 * Scrolling "Bonus Miles / Special Prices / Early News" marquee shown on the
 * "Join Early Earn More" step. Pointer events are blocked so a tap/drag on it
 * never hijacks the section scroll.
 *
 * Seamless loop: two identical halves; CSS translates the track by exactly -50%.
 * Tablet sizing follows readChamMilesTabletUi (not mouse laptop 1024–1279).
 */
export default function TierMarquee({ opacity, y, active, labels, tablet = false }) {
  const [mqTablet, setMqTablet] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setMqTablet(readChamMilesTabletUi());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Live mq only — parent `tablet` must not force laptop UI into tablet sizing.
  const isTablet = mqTablet;

  // One half of the loop (repeated so the strip is always wider than the viewport).
  const half = useMemo(() => {
    const base = Array.isArray(labels) ? labels.filter(Boolean) : [];
    if (base.length === 0) return [];
    return Array.from({ length: 4 }, () => base).flat();
  }, [labels]);

  const renderGroup = (copyKey) =>
    half.map((label, index) => (
      <span
        key={`${copyKey}-${index}-${label}`}
        className={`cham-join-early__marquee-item font-semibold text-(--cm-primary) pointer-events-none${
          isTablet ? " cham-join-early__marquee-item--tablet" : ""
        }`}
        style={isTablet ? { fontSize: "2rem" } : undefined}
      >
        {label}
      </span>
    ));

  return (
    <motion.div
      style={{ opacity, y, pointerEvents: "none", visibility: active ? "visible" : "hidden" }}
      className={`cham-marquee select-none absolute left-0 z-10 w-full overflow-hidden touch-none pointer-events-none${
        isTablet ? " cham-marquee--tablet" : ""
      }`}
      aria-hidden="true"
      dir="ltr"
      onClick={blockMarqueePointer}
      onPointerDown={blockMarqueePointer}
      onMouseDown={blockMarqueePointer}
      onTouchStart={blockMarqueePointer}
    >
      <div
        className={`cham-marquee__track pointer-events-none${
          isTablet ? " cham-marquee__track--tablet" : ""
        }`}
      >
        <div className="cham-marquee__group">{renderGroup("a")}</div>
        <div className="cham-marquee__group" aria-hidden="true">
          {renderGroup("b")}
        </div>
      </div>
    </motion.div>
  );
}
