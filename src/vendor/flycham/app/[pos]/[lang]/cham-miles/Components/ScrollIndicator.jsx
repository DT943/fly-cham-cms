"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MouseSimpleIcon } from "@phosphor-icons/react";
import Lottie from "lottie-react";
import swipeUpAnim from "../assets/swipe-up.json";

/** White outline on dark hero — keep stroke lines, hide solid fills (avoids bold silhouette). */
function prepareSwipeUpOutline(data) {
  const clone = JSON.parse(JSON.stringify(data));
  const white = [1, 1, 1, 1];

  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (
      node.ty === "st" &&
      node.c?.k &&
      Array.isArray(node.c.k) &&
      typeof node.c.k[0] === "number"
    ) {
      node.c.k = white;
    }
    if (node.ty === "fl" && node.o && typeof node.o.k === "number") {
      node.o.k = 0;
    }
    Object.values(node).forEach(walk);
  };

  walk(clone);
  return clone;
}

/**
 * Scroll cue for the canvas hero.
 *
 * `compact` (≤1023px from parent matchMedia): Lottie only, bottom-center.
 * After tablet (≥1024): mouse + label at the bottom. Avoid Tailwind display toggles.
 */
export default function ScrollIndicator({
  label,
  scrollVariants,
  opacity,
  parallaxY,
  onEntranceComplete,
  compact = false,
}) {
  const [startMouseLoop, setStartMouseLoop] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const swipeUpOutline = useMemo(() => prepareSwipeUpOutline(swipeUpAnim), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  // Bottom-center for both modes. Compact skips scroll parallax (keeps y stable).
  const wrapperStyle = { x: "-50%" };
  if (opacity != null) wrapperStyle.opacity = opacity;
  if (!compact && parallaxY != null) wrapperStyle.y = parallaxY;

  return (
    <motion.div
      className={`cm-hero-scroll-cue pointer-events-none absolute left-1/2 z-[45]${
        compact ? " cm-hero-scroll-cue--compact" : ""
      }`}
      style={wrapperStyle}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
    >
      {compact ? (
        <motion.div
          aria-hidden="true"
          className="cm-hero-scroll-cue__lottie flex items-center justify-center"
          variants={scrollVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={(definition) => {
            if (definition === "visible") onEntranceComplete?.();
          }}
        >
          {reduceMotion ? (
            <span className="cm-hero-scroll-cue__lottie-fallback text-white/90 text-sm font-light">
              {label}
            </span>
          ) : (
            <Lottie
              animationData={swipeUpOutline}
              loop
              autoplay
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              className="cm-hero-scroll-cue__lottie-anim opacity-90"
            />
          )}
        </motion.div>
      ) : (
        <motion.div
          aria-hidden="true"
          className="cm-hero-scroll-cue__mouse flex items-center gap-2 text-white"
          variants={scrollVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={(definition) => {
            if (definition === "visible") {
              setStartMouseLoop(true);
              onEntranceComplete?.();
            }
          }}
        >
          <motion.span
            className="cm-hero-scroll-cue__mouse-icon inline-flex"
            animate={
              startMouseLoop && !reduceMotion ? { y: [-4, 4, -4] } : { y: 0 }
            }
            transition={
              startMouseLoop && !reduceMotion
                ? {
                    duration: 1.25,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }
                : { duration: 0 }
            }
          >
            <MouseSimpleIcon className="h-8 w-8 lg:h-9 lg:w-9" weight="regular" />
          </motion.span>

          <span className="cm-hero-scroll-cue__mouse-label text-[15px] lg:text-[17px] font-light leading-none">
            {label}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
