"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import {
  EASE,
  SLIDE_PCT,
  SLIDE_SPRING,
  SWIPE_THRESHOLD,
  SWIPE_VELOCITY,
  TIER_IMAGES,
  WHEEL_CARD_COOLDOWN_MS,
  clampIndex,
  slideTransition,
} from "./mobileSliderConfig";
import OurTiersBackButton from "./components/OurTiersBackButton";

export default function MobileTiersSlider({
  onJoin,
  onBack,
  firstCardRef,
  blueCardReveal,
  onCardLayout,
  blueOffsetMV,
  onActiveChange,
  onWheelNavigateRef,
  tiers = [],
  ourTiers,
  goToTierLabel = "Go to",
  isAr = false,
  backVisible = false,
}) {
  const tierSlides = tiers.map((tier, i) => ({ ...tier, img: TIER_IMAGES[i] }));
  const tierCount = tierSlides.length;

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const viewportRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const x = useMotionValue(0);
  const isDraggingRef = useRef(false);
  const didMountRef = useRef(false);
  // True for the render right after a drag-release, so the index-change effect
  // doesn't fire a second (competing) animation over the velocity spring.
  const fromDragRef = useRef(false);
  const activeRef = useRef(0);
  const wheelCooldownRef = useRef(0);
  const goToRef = useRef(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      setViewportWidth(el.clientWidth);
      // Tell the parent the slider's real width is known so it can (re)measure
      // where the floating blue card must land — the first layout pass happens
      // a frame after mount, and measuring before it lands the card a few px off.
      onCardLayout?.();
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onCardLayout]);

  const goTo = useCallback(
    (index) => {
      const nextIndex = clampIndex(index, tierCount);
      const prev = activeRef.current;
      if (nextIndex === prev) return;
      activeRef.current = nextIndex;
      setDirection(nextIndex > prev ? 1 : -1);
      setActive(nextIndex);
    },
    [tierCount],
  );
  goToRef.current = goTo;

  // Parent wheel capture: when the cursor is over this track, change the active
  // card (return true). At the first/last card, return false so the page can
  // still step up / advance to Join.
  useEffect(() => {
    if (!onWheelNavigateRef) return undefined;
    onWheelNavigateRef.current = (deltaY) => {
      if (isDraggingRef.current) return false;
      if (!deltaY) return false;
      const goingNext = deltaY > 0;
      const idx = activeRef.current;
      if (goingNext && idx >= tierCount - 1) return false;
      if (!goingNext && idx <= 0) return false;
      const now = performance.now();
      // Still over the track during cooldown — consume the event so trackpad
      // inertia does not leak into Join / prev-step navigation.
      if (now < wheelCooldownRef.current) return true;
      wheelCooldownRef.current = now + WHEEL_CARD_COOLDOWN_MS;
      goToRef.current?.(idx + (goingNext ? 1 : -1));
      return true;
    };
    return () => {
      onWheelNavigateRef.current = null;
    };
  }, [onWheelNavigateRef, tierCount]);

  const cardWidth = viewportWidth * SLIDE_PCT;
  const sidePad = (viewportWidth - cardWidth) / 2;
  const trackX = sidePad - active * cardWidth;
  const activeTier = tierSlides[active] ?? tierSlides[0];

  // Report the blue (index 0) slot's live horizontal offset from its resting
  // centre to the parent, so the parent's floating blue card can ride along with
  // the slider drag as if it were this slot. At rest x === sidePad → offset 0.
  const sidePadRef = useRef(0);
  sidePadRef.current = sidePad;
  useMotionValueEvent(x, "change", (v) => {
    if (blueOffsetMV) blueOffsetMV.set(v - sidePadRef.current);
  });
  useEffect(() => {
    if (blueOffsetMV) blueOffsetMV.set(x.get() - sidePad);
  }, [trackX, viewportWidth, sidePad, blueOffsetMV, x]);

  // Tell the parent which tier is active so the floating blue card can mirror
  // the slider's per-distance scale/opacity (it acts as the blue slide).
  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  useEffect(() => {
    if (!viewportWidth) return;
    if (isDraggingRef.current) return;
    if (!didMountRef.current) {
      didMountRef.current = true;
      x.set(trackX);
      return;
    }
    // A drag just settled this index with its own velocity spring — don't
    // restart the motion with the (slow-in) tween.
    if (fromDragRef.current) {
      fromDragRef.current = false;
      return;
    }
    // Dot taps / programmatic index changes use the SAME spring as a swipe
    // release (just without an initial velocity), so the motion is identical.
    const controls = animate(x, trackX, SLIDE_SPRING);
    return () => controls.stop();
  }, [trackX, viewportWidth, x]);

  const handleDragStart = () => { isDraggingRef.current = true; };

  const handleDragEnd = (_, info) => {
    isDraggingRef.current = false;
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    let nextIndex = active;
    if (offsetX < -SWIPE_THRESHOLD || velocityX < -SWIPE_VELOCITY) {
      nextIndex = clampIndex(active + 1, tierCount);
    } else if (offsetX > SWIPE_THRESHOLD || velocityX > SWIPE_VELOCITY) {
      nextIndex = clampIndex(active - 1, tierCount);
    }

    const targetX = sidePad - nextIndex * cardWidth;

    if (nextIndex !== active) {
      fromDragRef.current = true; // let this spring own the settle, not the effect
      setDirection(nextIndex > active ? 1 : -1);
      setActive(nextIndex);
    }

    // Continue from the finger's release velocity so the card flows smoothly
    // into place instead of stopping dead and easing back in. Same spring as
    // dot-tap navigation, plus the gesture velocity.
    animate(x, targetX, { ...SLIDE_SPRING, velocity: velocityX });
  };

  return (
    <div
      className={`cham-mobile-tiers flex h-full min-h-0 w-full flex-col items-center px-4 pt-[5vh] pb-[3vh]${isAr ? " cham-mobile-tiers--ar" : ""}`}
      lang={isAr ? "ar" : undefined}
    >
      <OurTiersBackButton
        onBack={onBack}
        label={ourTiers?.back ?? "Back"}
        visible={backVisible}
        isAr={isAr}
      />

      <div className="cham-mobile-tiers__copy flex w-full shrink-0 flex-col items-center">
        <h2
          className="cham-mobile-tiers__title m-0 text-center font-bold text-(--cm-primary)"
          style={{ fontSize: "clamp(34px, 9vw, 44px)", lineHeight: 1.05 }}
        >
          {ourTiers?.title ?? "Our Tiers"}
        </h2>

        <p
          className="cham-mobile-tiers__subtitle mx-auto max-w-[34ch] text-center text-(--cm-text)"
          style={{ fontSize: "13px", lineHeight: 1.5 }}
        >
          {ourTiers?.subtitle ?? ""}
        </p>
      </div>

      <div
        ref={viewportRef}
        data-cham-tiers-slider=""
        className="relative mt-4 w-full shrink-0 overflow-hidden select-none"
        style={{ touchAction: "none" }}
      >
        <motion.div
          className="flex cursor-grab will-change-transform active:cursor-grabbing"
          // touchAction: none prevents the browser from natively scrolling the
          // page vertically when the user swipes the card. Framer's drag="x"
          // would otherwise set touch-action: pan-y, letting a swipe scroll the
          // page down into the next step. With native panning off, vertical
          // swipes fall through to the page's own (button-only-down) handler.
          style={{ x, touchAction: "none" }}
          drag="x"
          dragElastic={0.18}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {tierSlides.map((tier, index) => {
            const distance = Math.abs(index - active);
            const isActive = distance === 0;
            const scale = isActive ? 1 : distance === 1 ? 0.82 : 0.74;

            return (
              <motion.div
                key={tier.label}
                ref={index === 0 ? firstCardRef : undefined}
                className="shrink-0 px-0"
                // The blue (first) card is hidden until `blueCardReveal` fades it
                // in, so the parent's floating blue card hands off onto it without
                // two blue cards showing at once during the move. Applied on this
                // outer wrapper so it multiplies with the inner active/inactive
                // opacity below instead of fighting it.
                style={{
                  width: cardWidth || `${SLIDE_PCT * 100}%`,
                  opacity: index === 0 && blueCardReveal ? blueCardReveal : undefined,
                }}
              >
                <motion.div
                  className="tier-card-frame overflow-visible will-change-transform"
                  animate={{ opacity: 1, scale }}
                  transition={slideTransition}
                  style={{ transformOrigin: "50% 50%" }}
                >
                  {/* Paint at 2× slot size then CSS-scale down — same crisp path
                      as the floating blue card (large bitmap → scale into slot). */}
                  <div className="cham-mobile-tiers__card-hires">
                    <img
                      src={tier.img}
                      alt={tier.label}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      className="pointer-events-none block w-full select-none drop-shadow-xl"
                      style={{ WebkitUserDrag: "none" }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="cham-mobile-tiers__chrome flex min-h-0 w-full flex-1 flex-col items-center">
        {/*
          Tier copy flex-grows; dots + CTA stay shrink-0 at the bottom of this
          chrome so swapping Blue ↔ Diamond (different text heights) does not
          move the controls. Long copy scrolls inside the copy slot.
        */}
        <div className="cham-mobile-tiers__tier-copy relative mt-3 w-full min-h-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeTier.label}
              custom={direction}
              className="w-full px-4 text-center"
              initial={{ opacity: 0, y: direction > 0 ? 28 : -28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -28 : 28 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div
                className="cham-mobile-tiers__tier-label font-medium uppercase tracking-[0.08em] text-(--cm-text)/70 whitespace-nowrap"
                style={{ fontSize: "12px" }}
              >
                {activeTier.label}
              </div>
              <div
                className="cham-mobile-tiers__tier-heading mt-1.5 font-bold text-(--cm-text) whitespace-nowrap"
                style={{ fontSize: "18px", letterSpacing: "-0.01em" }}
              >
                {activeTier.heading}
              </div>
              <p
                className="cham-mobile-tiers__tier-desc mt-3 w-full text-(--cm-text) whitespace-pre-line"
                style={{ fontSize: "12.5px", lineHeight: 1.55 }}
              >
                {activeTier.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="cham-mobile-tiers__actions mt-3 flex w-full max-w-[320px] mx-auto shrink-0 flex-col items-center">
          <div
            className="cham-mobile-tiers__dots flex items-center justify-center gap-4"
            role="tablist"
            aria-label={goToTierLabel}
          >
            {tierSlides.map((tier, index) => {
              const isActive = index === active;
              return (
                <button
                  key={tier.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${goToTierLabel} ${tier.label}`}
                  onClick={() => goTo(index)}
                  className="cham-mobile-tiers__dot flex items-center justify-center rounded-full"
                  style={{
                    border: isActive
                      ? `2px solid ${tier.dot}`
                      : "2px solid transparent",
                    backgroundColor: "transparent",
                    padding: 0,
                  }}
                >
                  <span
                    className="block rounded-full"
                    style={{
                      width: isActive ? 22 : 24,
                      height: isActive ? 22 : 24,
                      backgroundColor: tier.dot,
                    }}
                  />
                </button>
              );
            })}
          </div>
          <motion.button
            type="button"
            onClick={onJoin}
            className="cham-mobile-tiers__cta mt-4 mb-2 w-full rounded-lg bg-(--cm-primary) py-3 text-[15px] font-semibold text-(--cm-button-text)"
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {ourTiers?.cta ?? "Become a Member"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
