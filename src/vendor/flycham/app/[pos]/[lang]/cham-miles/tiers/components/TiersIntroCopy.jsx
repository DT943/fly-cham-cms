"use client";

import { motion } from "framer-motion";
import { resolveTiersIntroPose } from "../tiersIntroPose";

/**
 * "Tiers and Benefits" intro copy.
 *
 * Position knobs live in `../tiersIntroPose.js` (TIERS_INTRO_POSE).
 * Scroll exit (x + opacity) still comes from the parent motion values.
 *
 * Layout stays LTR (same as English): left column + card on the right.
 * Arabic only swaps the strings (`lang="ar"`) and in-column RTL typography
 * via `.cham-tiers-intro--ar` — it does not mirror the composition.
 *
 * On tablet+, `pose.y` is the vertical CENTER of the text block (vh).
 * Framer `y: "-50%"` keeps the block centered on that point.
 */
export default function TiersIntroCopy({
  content,
  isAr,
  isMobile,
  isTabletUi,
  bp,
  textX,
  textOpacity,
}) {
  const pose = resolveTiersIntroPose({ isMobile, isTabletUi, bp });
  const absolute = !isMobile;

  return (
    <motion.div
      style={{
        x: textX,
        // Own-height centering so `pose.y` = vertical midpoint of the copy.
        y: absolute ? "-50%" : 0,
        opacity: textOpacity,
        ...(absolute
          ? {
              position: "absolute",
              top: `${pose.y}vh`,
              left: `${pose.x}vw`,
              right: "auto",
              width:
                pose.maxWidthVw != null
                  ? `min(${pose.maxWidthVw}vw, 36rem)`
                  : undefined,
              maxWidth:
                pose.maxWidthVw != null
                  ? `min(${pose.maxWidthVw}vw, 36rem)`
                  : undefined,
              pointerEvents: "none",
            }
          : pose.maxWidthVw != null
            ? {
                maxWidth: `min(${pose.maxWidthVw}vw, 36rem)`,
              }
            : null),
      }}
      className={[
        "cham-tiers-intro z-20 flex flex-col will-change-transform items-start",
        isMobile
          ? "relative flex-1 px-[7vw] pt-[10vh]"
          : "cham-tiers-intro--parked",
        isTabletUi ? "cham-tiers-intro--tablet" : "",
        isAr ? "cham-tiers-intro--ar" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      lang={isAr ? "ar" : undefined}
      data-intro-pose={pose.key}
    >
      <div
        className="cham-tiers-intro__copy flex flex-col"
        style={
          absolute
            ? {
                // Tablet+ alignment: intro description width follows title width.
                display: "inline-flex",
                flexDirection: "column",
                width: "fit-content",
                maxWidth: "100%",
              }
            : undefined
        }
      >
        <h2
          className="cham-tiers-intro__title m-0 font-semibold text-(--cm-primary) text-start"
          style={{
            whiteSpace: pose.titleNowrap ? "nowrap" : "normal",
            maxWidth: pose.titleNowrap
              ? "none"
              : pose.titleMaxCh != null
                ? `${pose.titleMaxCh}ch`
                : "none",
          }}
        >
          {content.tiersIntro.title}
        </h2>
        <p
          className="cham-tiers-intro__desc m-0 text-(--cm-text)"
          style={
            absolute
              ? {
                  // Fill the title-driven copy box width.
                  width: 0,
                  minWidth: "100%",
                  maxWidth: "none",
                }
              : undefined
          }
        >
          {content.tiersIntro.description}
        </p>
      </div>
    </motion.div>
  );
}
