"use client";

import { ArrowLeft } from "@phosphor-icons/react";

/**
 * Our Tiers back control — Phosphor arrow that fires the same previous-step
 * path as a scroll-up gesture (`snapNext(-1)` / close details first).
 */
export default function OurTiersBackButton({
  onBack,
  label = "Back",
  visible = false,
  isAr = false,
}) {
  if (!visible) return null;

  return (
    <button
      type="button"
      className={`cham-our-tiers__back pointer-events-auto${isAr ? " cham-our-tiers__back--ar" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onBack?.();
      }}
      aria-label={label}
      title={label}
    >
      <ArrowLeft
        className="cham-our-tiers__back-icon"
        weight="bold"
        aria-hidden
      />
    </button>
  );
}
