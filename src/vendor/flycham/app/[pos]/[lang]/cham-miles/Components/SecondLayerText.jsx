"use client";

/**
 * SecondLayerText
 * ---------------
 * The "Step into / Your Premium journey" copy that reveals over the late
 * canvas frame sequence (frame-066 → last). The windows sit in the
 * middle band; the title lands top-left and the description in the dark strip
 * BELOW the windows (the canvas windows are tall, and their shutters close to
 * white mid-phase, so the copy must stay clear of the glass).
 *
 * Everything is scroll-linked to the same `progress` motion value that scrubs the
 * frames: the copy reveals as you scroll into the phase (staggered rise + sharpen,
 * eyebrow → title → description), holds while you rest on it, then clears before
 * the hero hands off below. The accent word keeps its gold colour for emphasis.
 */

import { useState } from "react";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useParams } from "next/navigation";

// Smooth ease-out settle — content rises up and decelerates into place.
const REVEAL_EASE = cubicBezier(0.16, 1, 0.3, 1);

export default function SecondLayerText({
  content,
  progress,
  inStart,
  inEnd,
}) {
  const params = useParams();
  const langParam = params?.lang;
  const isAr = (Array.isArray(langParam) ? langParam[0] : langParam) === "ar";

  // Staggered reveal sub-windows within [inStart, inEnd]: eyebrow first, then the
  // title, then the description — each rises + fades (title also sharpens from a
  // soft blur). All fade out together over [outStart, outEnd].
  const span = inEnd - inStart;
  const eStart = inStart;
  const eEnd = inStart + span * 0.55;
  const tStart = inStart + span * 0.2;
  const tEnd = inStart + span * 0.85;
  const dStart = inStart + span * 0.45;
  const dEnd = inEnd;

  // Title (eyebrow + heading) reveals then STAYS — it never fades over the
  // frames. It rides up with the canvas as one block during the swipe slide
  // (it lives inside the same sticky container as the canvas).
  const eyebrowOpacity = useTransform(progress, [eStart, eEnd], [0, 1]);
  const eyebrowY = useTransform(progress, [eStart, eEnd], [18, 0], { ease: REVEAL_EASE });

  const titleOpacity = useTransform(progress, [tStart, tEnd], [0, 1]);
  const titleY = useTransform(progress, [tStart, tEnd], [28, 0], { ease: REVEAL_EASE });
  const titleBlur = useTransform(progress, [tStart, tEnd], [10, 0], { ease: REVEAL_EASE });
  const titleFilter = useTransform(titleBlur, (b) => `blur(${b.toFixed(2)}px)`);

  // Description reveals then STAYS too — like the title, it rides out with the
  // canvas as one block during the swipe slide (no fade-out).
  const descOpacity = useTransform(progress, [dStart, dEnd], [0, 1]);
  const descY = useTransform(progress, [dStart, dEnd], [18, 0], { ease: REVEAL_EASE });

  // Mount from the lead-in onward and KEEP it mounted through the end (progress
  // 1) and the slide, so the title travels out with the canvas. Unmounts only
  // if the user scrolls back up out of the phase. Guarded boolean flip.
  const [active, setActive] = useState(false);
  useMotionValueEvent(progress, "change", (p) => {
    const next = p >= inStart - 0.03;
    setActive((prev) => (prev === next ? prev : next));
  });

  if (!active) return null;

  return (
    <div
      className={`cm-second-layer pointer-events-none absolute inset-0 z-20${isAr ? " cm-second-layer--ar" : ""}`}
    >
      {/* Title block — top-left, padded down so it clears the fixed header.
          Horizontal inset matches HeroHeader (`5.7vw` with a 1.5rem floor) so
          "Step into" aligns with the logo and the left window's left edge. */}
      <div className="cm-second-layer__pad w-full px-[max(1.5rem,5.7vw)] pt-24 md:pt-28">
        <div
          className={`cm-second-layer__title-wrap max-w-[560px] md:max-w-[640px] xl:max-w-[720px]${isAr ? " ml-auto text-right" : ""}`}
          dir={isAr ? "rtl" : "ltr"}
          lang={isAr ? "ar" : undefined}
        >
          <motion.p
            className="cm-second-layer__eyebrow text-(--cm-second-text) text-[14px] md:text-[17px] lg:text-[18px] leading-none font-medium"
            style={{ opacity: eyebrowOpacity, y: eyebrowY, willChange: "transform, opacity" }}
          >
            {content.eyebrow}
          </motion.p>

          <motion.h2
            className="cm-second-layer__title mt-2.5 text-(--cm-second-text) text-[30px] md:text-[40px] lg:text-[44px] xl:text-[48px] 2xl:text-[52px] font-bold leading-[1.12] md:leading-[1.08] tracking-tight"
            style={{
              opacity: titleOpacity,
              y: titleY,
              filter: titleFilter,
              WebkitFilter: titleFilter,
              willChange: "transform, opacity, filter",
            }}
          >
            {/*
             * English: force "Your Premium" / "journey" onto two lines below 2xl
             * so "journey" shares the left edge with "Your" (centered as a block
             * on phone via CSS). Arabic: keep "رحلتك المميزة" on one line.
             */}
            {isAr ? (
              <>
                <span className="cm-second-layer__accent text-(--cm-accent)">
                  {content.titleAccent}
                </span>
                <span className="cm-second-layer__end">{content.titleEnd}</span>
              </>
            ) : (
              <>
                <span>{content.titleStart}</span>
                <span className="text-(--cm-accent)">{content.titleAccent}</span>
                <br className="2xl:hidden" aria-hidden="true" />
                <span>{content.titleEnd}</span>
              </>
            )}
          </motion.h2>
        </div>
      </div>

      {/* Bottom scrim — the canvas windows are drawn to COVER the section, so on
          short/wide viewports their (white-shutter) bottoms dip into the copy
          strip. This gradient darkens that strip so the windows never show
          through behind the text — it restores the intended "dark strip below the
          windows". Fades to transparent upward so there is no visible band edge,
          and reveals in step with the copy (same descOpacity) so it never shows
          on its own. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          opacity: descOpacity,
          background:
            "linear-gradient(to top, rgba(9,24,32,0.97) 0%, rgba(9,24,32,0.9) 30%, rgba(9,24,32,0.5) 62%, rgba(9,24,32,0) 100%)",
        }}
      />

      {/* Description — anchored to the bottom strip, well below the (tall,
          white-shutter) windows so the copy never lands on the glass.
          Text-shadow keeps it crisp over the gradient. */}
      <motion.p
        className={`cm-second-layer__desc absolute inset-x-0 bottom-[8%] lg:bottom-[4%] mx-auto max-w-[720px] md:max-w-[780px] px-6 text-(--cm-second-text)/90 text-[13px] md:text-[17px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] leading-[1.55] [text-shadow:0_1px_16px_rgba(0,0,0,0.5)]${isAr ? " text-right" : " text-center"}`}
        dir={isAr ? "rtl" : "ltr"}
        lang={isAr ? "ar" : undefined}
        style={{ opacity: descOpacity, y: descY, willChange: "transform, opacity" }}
      >
        {content.description}
      </motion.p>
    </div>
  );
}
