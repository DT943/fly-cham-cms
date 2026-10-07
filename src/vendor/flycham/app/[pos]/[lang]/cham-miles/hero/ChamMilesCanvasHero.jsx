"use client";

/**
 * ChamMilesCanvasHero
 * -------------------
 * A cinematic, scroll-driven hero for the /cham-miles page.
 *
 * The hero paints an image sequence (frame-001 … frame-0017) into a
 * full-viewport <canvas>. A pinned (sticky) section is scrubbed by GSAP
 * ScrollTrigger so native scrolling drives the frame index — no wheel
 * hijacking, no custom scroll listeners. The WHOLE pinned scroll plays the
 * frame sequence from the first frame to the last; once the section ends,
 * normal page scrolling resumes into the sections below (TiersSection).
 *
 * The heavy lifting lives in three co-located hooks and one config module under
 * ./hero, so this file stays a thin composition of markup + overlay state:
 *   - hero/heroConfig            static frame/threshold/gradient data
 *   - hero/useCanvasFrames       preload + paint the image sequence
 *   - hero/useHeroScrollTimeline the scrubbed GSAP timeline (frames + intro exit)
 *   - hero/useSwipeGate          the swipe-gated handoff to the next section
 *
 * This component is fully self-contained: the page only imports and renders it.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useChamMilesContent } from "../shared/ChamMilesContent";
import { ANIMATION_CONFIG } from "../shared/constants";
import { getHeroContainerVariants } from "../shared/animations";
import HeroHeader from "../Components/HeroHeader";
import HeroContent from "../Components/HeroContent";
import ScrollIndicator from "../Components/ScrollIndicator";
import SecondLayerText from "../Components/SecondLayerText";
import { BRAND_GRADIENT, secondInEnd, secondInStart, slideUpEnd } from "./heroConfig";
import { useCanvasFrames } from "./useCanvasFrames";
import { useHeroScrollTimeline } from "./useHeroScrollTimeline";
import { useSwipeGate } from "./useSwipeGate";

export default function ChamMilesCanvasHero() {
  const content = useChamMilesContent();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  // Mobile: keep the header fixed to the visual viewport while the hero is
  // on-screen. Sticky + overflow-hidden + Android URL-bar 100vh can otherwise
  // clip the logo/burger so only a sliver remains above "Step into".
  const [heroHeaderVisible, setHeroHeaderVisible] = useState(true);

  // ── Overlay UI (header / hero content / scroll indicator) ────────────────
  // The same entrance the previous hero used: everything fades/transforms in
  // after the brand gradient settles, then the stacked reveal auto-advances
  // (logo → title → typed description). `contentProgress` mirrors the GSAP
  // scrub (0 → 1) so the hero content drifts up + scales exactly like it did
  // when scroll drove the old scene.
  const { smoothEase, gradientDelay, gradientDuration } = ANIMATION_CONFIG;
  const gradientEndDelay = gradientDelay + gradientDuration;
  const heroContainerVariants = getHeroContainerVariants(gradientEndDelay);
  // Scroll indicator fades in on the SAME delay as the header + hero group so
  // the whole hero reveals in one synchronized beat.
  const heroScrollIndicatorVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: gradientEndDelay + 0.1, duration: 0.8, ease: smoothEase },
    },
  };

  const contentProgress = useMotionValue(0);
  const contentProgressRef = useRef(contentProgress);
  contentProgressRef.current = contentProgress;

  // ── Welcome intro exit ───────────────────────────────────────────────────
  // Scale down + fade in place — content stays viewport-centered (no Y drift).
  // GSAP owns scale on introScaleRef; introSlideRef stays at yPercent 0.
  const introSlideRef = useRef(null); // GSAP animates yPercent (phases 2–3: lift)
  const introScaleRef = useRef(null); // GSAP animates scale (phase 1: shrink)

  // Scroll-down hint: stay mounted (no remount / entrance delay). Opacity
  // tracks scroll so it vanishes while away and reappears instantly at start.
  const scrollHintOpacity = useTransform(
    contentProgress,
    [0, 0.008, 0.02],
    [1, 0.25, 0],
  );
  // Fully hidden once the content has slid off the top — drops it from a11y.
  const [introHidden, setIntroHidden] = useState(false);
  // Phone + small tablet (≤1023): Lottie + one-shot dim.
  // After tablet (≥1024): desktop mouse + label scroll cue (no dim).
  // Default compact=true so phone/tablet get the dim on first paint; desktop
  // clears it in useLayoutEffect before paint when possible.
  const [scrollFocusDim, setScrollFocusDim] = useState(true);
  const scrollFocusDimLatchedRef = useRef(false);
  const [isCompactHero, setIsCompactHero] = useState(true);
  const isCompactHeroRef = useRef(true);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => {
      const compact = mq.matches;
      isCompactHeroRef.current = compact;
      setIsCompactHero(compact);
      if (compact && !scrollFocusDimLatchedRef.current) {
        setScrollFocusDim(true);
      } else if (!compact) {
        setScrollFocusDim(false);
      }
    };
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);
  useMotionValueEvent(contentProgress, "change", (p) => {
    if (
      isCompactHeroRef.current &&
      p > 0.01 &&
      !scrollFocusDimLatchedRef.current
    ) {
      scrollFocusDimLatchedRef.current = true;
      setScrollFocusDim(false);
    }
    setIntroHidden((prev) => {
      const next = p >= slideUpEnd;
      return prev === next ? prev : next;
    });
  });

  // Parallax for the (decorative, non-clickable) scroll indicator: it drifts
  // down as the user scrolls into the frames, lagging the content for depth.
  // Phone + small tablet: keep y locked — combining scroll-linked y with the
  // exit fade made the hint jump at the bottom edge while the sticky stage settled.
  const [allowHintParallax, setAllowHintParallax] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setAllowHintParallax(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);
  const scrollHintParallaxWide = useTransform(contentProgress, [0, slideUpEnd], [0, 64]);
  const scrollHintParallax = allowHintParallax ? scrollHintParallaxWide : undefined;

  // Shared refs the canvas + timeline hooks both touch: GSAP tweens
  // `frameStateRef.frame`, and the canvas hook exposes its paint closure on
  // `drawCurrentFrameRef` for the timeline to call.
  const frameStateRef = useRef({ frame: 0 });
  const drawCurrentFrameRef = useRef(null);

  // ── Behaviour hooks (order preserved: canvas → timeline → swipe gate) ─────
  const { ready } = useCanvasFrames({ canvasRef, frameStateRef, drawCurrentFrameRef });
  useHeroScrollTimeline({
    sectionRef,
    frameStateRef,
    drawCurrentFrameRef,
    contentProgressRef,
    introScaleRef,
    introSlideRef,
  });
  useSwipeGate({ sectionRef });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Hide once the sticky hero has mostly slid away (tiers in view) so the
        // white logo does not sit over the light Benefits stage.
        const stillHero =
          entry.isIntersecting && entry.boundingClientRect.bottom > 96;
        setHeroHeaderVisible((prev) => (prev === stillHero ? prev : stillHero));
      },
      { threshold: [0, 0.05, 0.2, 0.5, 1] },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full cm-vh-300">
      {/* Mobile header lives OUTSIDE the sticky `overflow-hidden` stage.
          A fixed descendant of overflow-hidden is still clipped when the sticky
          panel drifts — which is what hid the logo on Android second-layer. */}
      {heroHeaderVisible && (
        <div className="cm-hero-header pointer-events-auto fixed inset-x-0 top-0 z-[60] w-full px-[max(1.5rem,5.7vw)] md:hidden">
          <HeroHeader navLinks={content.navLinks} />
        </div>
      )}

      <div
        className="sticky top-0 h-screen cm-vh-screen w-full overflow-hidden"
        style={{ background: BRAND_GRADIENT }}
      >
        {/* Full-viewport canvas for the image sequence (object-fit: cover). */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Lightweight loading indicator over the brand backdrop until the
            frames have preloaded. Removed once ready. */}
        {!ready && (
          <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white/80" />
          </div>
        )}

        {/* Dim on welcome rest was moved into the intro stack (below) so it
            can sit above hero copy and under the scroll Lottie. */}

        {/* ── Overlay UI, painted over the canvas frames ─────────────────── */}
        {/* `pointer-events-none` group (inherited by children); each interactive
            child re-enables its own hit area. */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Desktop / tablet: header stays inside the sticky stage so it pins
              with the canvas. Mobile uses the fixed sibling above. */}
          <div className="pointer-events-auto absolute inset-x-0 top-0 z-50 hidden w-full px-[max(1.5rem,5.7vw)] md:block">
            <HeroHeader navLinks={content.navLinks} />
          </div>

          {/* Welcome intro copy only — GSAP scales/slides this host.
              Dim + scroll cue stay OUTSIDE so they are not dragged off with
              the intro and remain visible on mobile/tablet welcome rest. */}
          <div
            ref={introSlideRef}
            className="absolute inset-0 z-10 will-change-transform"
            aria-hidden={introHidden ? "true" : undefined}
          >
            <div className="cm-hero-intro-center pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                ref={introScaleRef}
                className="cm-hero-intro-scale flex w-full items-center justify-center will-change-transform"
                style={{ transformOrigin: "50% 50%" }}
              >
                <HeroContent
                  title={content.hero.title}
                  description={content.hero.description}
                  heroContainerVariants={heroContainerVariants}
                />
              </div>
            </div>
          </div>

          {/* Phone / small tablet: dim over hero so centered Lottie is the focus.
              One-shot — dismissed on first scroll. Color in styles.css. */}
          <AnimatePresence>
            {isCompactHero && scrollFocusDim && (
              <motion.div
                key="hero-scroll-focus-dim"
                className="cm-hero-scroll-focus-dim pointer-events-none absolute inset-0 z-[20]"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: gradientEndDelay + 0.15,
                }}
              />
            )}
          </AnimatePresence>

          {/* ≤1023: Lottie. ≥1024 (after tablet): mouse + label. */}
          <ScrollIndicator
            label={content.hero.scrollLabel}
            scrollVariants={heroScrollIndicatorVariants}
            opacity={scrollHintOpacity}
            parallaxY={scrollHintParallax}
            compact={isCompactHero}
          />

          {/* Second layer — "Step into / Your Premium journey" over the
              frame-066+. Scroll-linked reveal; mounts only in-phase. */}
          <SecondLayerText
            content={content.secondLayer}
            progress={contentProgress}
            inStart={secondInStart}
            inEnd={secondInEnd}
          />
        </div>
      </div>
    </section>
  );
}
