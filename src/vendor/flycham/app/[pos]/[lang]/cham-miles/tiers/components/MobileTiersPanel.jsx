"use client";

import { motion } from "framer-motion";
import MobileTiersSlider from "../MobileTiersSlider";

/**
 * Mobile-only "Our Tiers" layer: an opaque panel that swipes up with the step
 * and hosts the horizontal tier-card slider. The floating blue card lands onto
 * the slider's blue slot (`firstCardRef` / `blueOffsetMV`) for a seamless handoff.
 */
export default function MobileTiersPanel({
  opacity,
  y,
  pointerEvents,
  tiersStepActive,
  sliderResetKey,
  isAr,
  onJoin,
  onBack,
  firstCardRef,
  blueCardReveal,
  onCardLayout,
  blueOffsetMV,
  onActiveChange,
  onWheelNavigateRef,
  content,
}) {
  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      className="cham-mobile-tiers-panel absolute inset-0 z-30 flex min-h-0 flex-col bg-(--cm-panel-bg) will-change-transform"
      aria-hidden={tiersStepActive ? undefined : true}
    >
      <MobileTiersSlider
        key={sliderResetKey}
        isAr={isAr}
        onJoin={onJoin}
        onBack={onBack}
        backVisible={tiersStepActive}
        firstCardRef={firstCardRef}
        blueCardReveal={blueCardReveal}
        onCardLayout={onCardLayout}
        blueOffsetMV={blueOffsetMV}
        onActiveChange={onActiveChange}
        onWheelNavigateRef={onWheelNavigateRef}
        tiers={content.mobileTiers}
        ourTiers={content.ourTiers}
        goToTierLabel={content.tierDetails.goToTier}
      />
    </motion.div>
  );
}
