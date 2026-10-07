"use client";

/**
 * useHeroScrollTimeline
 * ---------------------
 * Scrubbed GSAP ScrollTrigger timeline for the hero:
 *   - frame index 0 → last (canvas sequence),
 *   - Welcome content SCALES DOWN then DISAPPEARS (fade + soft lift),
 *   - lagged progress mirrored into `contentProgressRef` for overlays.
 *
 * Exit is intentionally “shrink + vanish in place” — not a long fly-off — so
 * copy does not linger large over the cabin windows. Linear eases + scrub lag
 * keep motion soft with the finger on phone, tablet, and desktop.
 */

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isIosMobileSafari } from "../shared/SafariViewportLock";
import {
  chamScrollContainerRef,
  subscribeChamScrollContainer,
  usesInnerScroll,
} from "../shared/chamScrollPort";
import {
  HERO_SCRUB_COMPACT,
  HERO_SCRUB_DESKTOP,
  LAST_FRAME,
  SMALL_SCALE,
  scaleDownEnd,
  slideUpEnd,
} from "./heroConfig";
import {
  CHAM_MILES_DESKTOP_MOTION_MQ,
  prefersDesktopChamMilesMotion,
} from "../shared/chamMilesMotion";

function resolveHeroScrub() {
  if (typeof window === "undefined") return HERO_SCRUB_DESKTOP;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }
  // After tablet / landscape tablet → same lag as xl+ big screen.
  if (prefersDesktopChamMilesMotion()) return HERO_SCRUB_DESKTOP;
  return HERO_SCRUB_COMPACT;
}

export function useHeroScrollTimeline({
  sectionRef,
  frameStateRef,
  drawCurrentFrameRef,
  contentProgressRef,
  introScaleRef,
  introSlideRef,
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    let ctx = null;
    let refreshId = null;

    const build = () => {
      if (ctx) ctx.revert();

      const scroller =
        isIosMobileSafari() && usesInnerScroll()
          ? chamScrollContainerRef.current || undefined
          : undefined;

      const scrub = resolveHeroScrub();

      ctx = gsap.context(() => {
        const frameState = frameStateRef.current;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub,
            fastScrollEnd: scrub !== true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const mv = contentProgressRef.current;
              if (!mv) return;
              const anim = self.animation;
              const p =
                anim && typeof anim.progress === "function"
                  ? anim.progress()
                  : self.progress;
              mv.set(p);
            },
          },
        });

        // Frames 0 → last across the whole pinned scroll.
        tl.to(
          frameState,
          {
            frame: LAST_FRAME,
            duration: 1,
            ease: "none",
            onUpdate: () => {
              if (frameState.frame >= LAST_FRAME - 0.51) {
                frameState.frame = LAST_FRAME;
              }
              const draw = drawCurrentFrameRef.current;
              if (draw) draw(false);
            },
          },
          0
        );

        // ── Welcome exit: scale down + disappear (stays centered) ────────
        // Shrink + fade in place — no yPercent lift so the stack remains
        // viewport-centered from rest through exit on every device.
        if (introScaleRef.current) {
          gsap.set(introScaleRef.current, { transformOrigin: "50% 50%" });

          tl.fromTo(
            introScaleRef.current,
            { scale: 1 },
            { scale: SMALL_SCALE, duration: slideUpEnd, ease: "none" },
            0
          );

          // Fade after the shrink is readable — vanish while still small.
          tl.fromTo(
            introScaleRef.current,
            { autoAlpha: 1 },
            {
              autoAlpha: 0,
              duration: slideUpEnd - scaleDownEnd,
              ease: "none",
              immediateRender: false,
            },
            scaleDownEnd
          );
        }

        // Keep the slide host pinned at center (no vertical drift).
        if (introSlideRef.current) {
          gsap.set(introSlideRef.current, { yPercent: 0, xPercent: 0 });
        }
      }, sectionRef);

      ScrollTrigger.refresh();
    };

    build();
    refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    const unsub = subscribeChamScrollContainer(build);

    const mqDesktopMotion = window.matchMedia(CHAM_MILES_DESKTOP_MOTION_MQ);
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onViewportChange = () => build();
    mqDesktopMotion.addEventListener?.("change", onViewportChange);
    mqReduce.addEventListener?.("change", onViewportChange);

    return () => {
      unsub();
      mqDesktopMotion.removeEventListener?.("change", onViewportChange);
      mqReduce.removeEventListener?.("change", onViewportChange);
      if (refreshId != null) cancelAnimationFrame(refreshId);
      if (ctx) ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
