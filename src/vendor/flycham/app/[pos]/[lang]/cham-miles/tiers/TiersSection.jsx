"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JoinStep from "../join/JoinStep";
import { isIosMobileSafari } from "../shared/SafariViewportLock";
import {
  getScrollTop,
  getViewportHeight,
  getChamScrollTarget,
  scrollPortTo,
  scrollPortBy,
  snapChamMilesScrollScrub,
  useChamScrollContainerRef,
  subscribeChamScrollContainer,
} from "../shared/chamScrollPort";
import { useChamMilesContent, useChamMilesLang } from "../shared/ChamMilesContent";
import {
  dispatchSyntheticWheel,
  isKeyboardScrollBlockedTarget,
  keyboardToWheelDelta,
} from "../shared/keyboardScroll";
import {
  isTitleDropdownScrollLocked,
  isWheelOverTitleDropdownMenu,
  consumeWheelWhileTitleDropdownOpen,
  consumeTouchWhileTitleDropdownOpen,
} from "../shared/titleDropdownScrollGuard";
import TierFlipCard from "./TierFlipCard";
import { introToBenefitsFramerRanges } from "./tiersIntroCardPose";
import {
  formatJoinEarlyCardPose,
  resolveTiersJoinEarlyCardPose,
} from "./tiersJoinEarlyCardPose";
import {
  BENEFIT_IMAGES,
  BENEFIT_TIMING,
  DESKTOP_SNAP_DURATION_MS,
  DURATION,
  EASE,
  HERO_REVERSE_SNAP_MS,
  JOIN_STEP_SCROLL_END,
  JOIN_SWIPE_DURATION_MS,
  TABLET_JOIN_SWIPE_DURATION_MS,
  TABLET_SNAP_DURATION_MS,
  MOBILE_CARD_FINAL_Y_OFFSET_VH,
  PENDING_STEP_FLUSH_RETRY_MS,
  STEP_TRANSITION_LOCK_MS,
  TIER_ENTRANCE_LOCK_MS,
  BENEFITS_ENTER_COMPLETE,
  JOIN_EARLY_ENTER_COMPLETE,
  TIERS_STEP_REST,
  WHEEL_COMMIT_SETTLE_MS,
  WHEEL_GESTURE_SETTLE_MS,
  WHEEL_GESTURE_THRESHOLD,
  card,
  tierBg,
} from "./tiersConfig";
import {
  animateCardMorphTo,
  applyMorphZIndex,
  clamp01,
  computeCardMorphTargets,
  mixUnit,
  phaseScrub,
  progressToStepIndex,
  resetCardMorph,
  stepIndexFromNavProgress,
} from "./tiersGeometry";
import { useTiersViewport } from "./hooks/useTiersViewport";
import { useTierTabIndicator } from "./hooks/useTierTabIndicator";
import BenefitsPanel from "./components/BenefitsPanel";
import JoinEarlyPanel from "./components/JoinEarlyPanel";
import TierMarquee from "./components/TierMarquee";
import OurTiersRow from "./components/OurTiersRow";
import TiersIntroCopy from "./components/TiersIntroCopy";
import TierDetailsOverlay from "./components/TierDetailsOverlay";
import MobileTiersPanel from "./components/MobileTiersPanel";

export default function TiersSection() {
  const content = useChamMilesContent();
  const { isAr } = useChamMilesLang();
  const benefits = useMemo(
    () =>
      content.benefitsPanel.items.map((item, i) => ({
        ...item,
        img: BENEFIT_IMAGES[i],
        ...BENEFIT_TIMING[i],
      })),
    [content],
  );
  const detailTabs = content.detailTabs;
  const marqueeLabels = content.joinEarly.marquee;
  const ourTierCards = content.ourTiers.cards;
  const containerRef = useRef(null);
  const floatingCardRef = useRef(null);
  // Parallax backdrop layer — GSAP scrubs a slow camera push-in on it so the
  // whole section reads with cinematic depth behind the cards/content.
  const bgLayerRef = useRef(null);
  // Animation lock for scroll-driven step navigation. True from the moment a
  // step snap starts until scroll snap + phase animation finish. While true,
  // gestures queue at most ONE adjacent step and run only after this completes.
  const isAnimatingRef = useRef(false);
  /** True while the programmatic scroll snap RAF is running. */
  const scrollSnapAnimatingRef = useRef(false);
  /** In-flight phase motion values (t / exit / phase4 / phase5). */
  const phaseAnimCountRef = useRef(0);
  const tryCompleteStepTransitionRef = useRef(() => {});
  // Authoritative step index (0..4) for snap navigation. Updated on every
  // scroll-progress change and set explicitly before programmatic scrolls
  // (header links + snapNext) so gestures always move exactly one step.
  const stepIndexRef = useRef(0);
  const stepReleaseTimerRef = useRef(null);
  /** +1 / -1 queued while a step transition is locked; flushed when idle. */
  const pendingStepDirectionRef = useRef(0);
  const flushPendingStepSnapRef = useRef(null);
  /** Same one-step snap as wheel / touch — CTAs call this for identical motion. */
  const snapNextRef = useRef(null);
  /** Animated scroll to a step rest — used by Our Tiers → Join CTAs. */
  const snapToProgressRef = useRef(null);
  /** While true, scrollYProgress must not drive phase thresholds (programmatic scroll). */
  const suppressProgressPhaseSyncRef = useRef(false);
  /** Clears queued wheel/touch step snaps (set from the scroll-handler effect). */
  const clearPendingScrollGesturesRef = useRef(null);
  /** True only while "Become a Member" drives the Our Tiers → Join scroll animation. */
  const allowJoinScrollRef = useRef(false);
  /** True once the floating blue card has landed in its Our Tiers / slider slot. */
  const blueCardLandedRef = useRef(false);
  const releaseStepLock = useCallback(() => {
    if (stepReleaseTimerRef.current) {
      clearTimeout(stepReleaseTimerRef.current);
      stepReleaseTimerRef.current = null;
    }
    isAnimatingRef.current = false;
    if (typeof window !== "undefined") {
      const lockUntil = window.__scrollLockUntil ?? 0;
      if (performance.now() >= lockUntil) {
        window.__scrollLockUntil = performance.now();
      }
    }
    flushPendingStepSnapRef.current?.();
  }, []);
  const tryCompleteStepTransition = useCallback(() => {
    if (scrollSnapAnimatingRef.current || phaseAnimCountRef.current > 0) return;
    releaseStepLock();
  }, [releaseStepLock]);
  useEffect(() => {
    tryCompleteStepTransitionRef.current = tryCompleteStepTransition;
  }, [tryCompleteStepTransition]);
  const releaseStepLockRef = useRef(releaseStepLock);
  useEffect(() => {
    releaseStepLockRef.current = releaseStepLock;
  }, [releaseStepLock]);

  const engageStepLock = useCallback((lockMs = STEP_TRANSITION_LOCK_MS) => {
    isAnimatingRef.current = true;
    const until = performance.now() + lockMs;
    if (typeof window !== "undefined") {
      window.__scrollLockUntil = Math.max(window.__scrollLockUntil ?? 0, until);
    }
    if (stepReleaseTimerRef.current) clearTimeout(stepReleaseTimerRef.current);
    stepReleaseTimerRef.current = setTimeout(() => {
      scrollSnapAnimatingRef.current = false;
      suppressProgressPhaseSyncRef.current = false;
      phaseAnimCountRef.current = 0;
      releaseStepLockRef.current?.();
    }, lockMs);
  }, []);
  const engageStepLockRef = useRef(engageStepLock);
  useEffect(() => {
    engageStepLockRef.current = engageStepLock;
  }, [engageStepLock]);
  const tierSlotRef = useRef(null);
  const alignDesktopRef = useRef(null);
  const alignMobileRef = useRef(null);
  const alignDesktopRafRef = useRef(null);
  // Last slot measurement taken while the tier row is at REST (see the align
  // guards below). Locked into `tierSlotTargetRef` when the Our Tiers step is
  // entered so the floating blue card travels to — and swipes from — a fixed
  // target, immune to any re-measure that fires mid-transition (the cause of the
  // card snapping to the wrong place / dropping to the bottom).
  const measuredSlotRef = useRef(null);
  const tierSlotTargetRef = useRef(null);
  const [lockedTierSlot, setLockedTierSlot] = useState(null);
  // The blue (first) card slot inside the mobile tiers slider. Used to measure
  // where the floating blue card must land so it can travel from the "Join
  // Early Earn More" step and settle exactly onto the slider's active card.
  const mobileTierSlotRef = useRef(null);
  // Bumped by the slider once its real layout/width is known, so the mobile
  // measurement effect re-runs against the settled slider geometry. Declared
  // here (above that effect) since the effect's deps reference it. Stable
  // identity (useCallback) so it doesn't re-fire the slider's layout effect.
  const [sliderLayoutTick, setSliderLayoutTick] = useState(0);
  const handleSliderLayout = useCallback(() => setSliderLayoutTick((n) => n + 1), []);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Mirrors `detailsOpen` for the (empty-deps) scroll handler effect so it can
  // tell, on every gesture, whether the desktop card-detail overlay (the tier
  // "slider") is currently open without re-binding its listeners.
  const detailsOpenRef = useRef(false);
  useEffect(() => { detailsOpenRef.current = detailsOpen; }, [detailsOpen]);
  // True for the duration of the overlay's CLOSE animation (the carousel cards
  // flying back to the row). While true the floating blue card stays hidden, so
  // it doesn't appear next to the carousel's own blue card mid-reverse (the
  // duplicate-blue-card bug). It's revealed only once the carousel has flown
  // back and unmounted — a clean hand-off, mirroring how it hides on open.
  const [detailsClosing, setDetailsClosing] = useState(false);
  const detailsClosingRef = useRef(false);
  useEffect(() => { detailsClosingRef.current = detailsClosing; }, [detailsClosing]);
  const detailsActiveRef = useRef(false);
  useEffect(() => {
    detailsActiveRef.current = detailsOpen || detailsClosing;
    if (typeof window !== "undefined") {
      window.__detailsOverlayActive = detailsOpen || detailsClosing;
    }
  }, [detailsOpen, detailsClosing]);
  const detailsCloseAnimRef = useRef(null);
  // Tablet pose (bp tablet|desktop). Declared early so details open/close can
  // skip the desktop carousel morph before `bp` is first read below.
  const useTabletCardPoseRef = useRef(false);
  // Single 0→1 progress for the Our Tiers ↔ slider transition. Title, cards,
  // subtitle, and panel all derive from this so forward and backward share one
  // timeline (backward is the exact reverse).
  const detailsT = useMotionValue(0);
  const carouselAnchorRef = useRef(null);
  const rowBaselineRef = useRef(null);
  const tierCardRef0 = useRef(null);
  const tierCardRef1 = useRef(null);
  const tierCardRef2 = useRef(null);
  const tierCardRef3 = useRef(null);
  const tierCardRefs = [tierCardRef0, tierCardRef1, tierCardRef2, tierCardRef3];
  // Desktop "Our Tiers" reveal: the silver/gold/diamond slots (indices 1..3) rise
  // up from below into place, one by one L→R, via GSAP — driven from the outer
  // slot element (which framer never transforms, so the two never fight). Played
  // once the blue card has landed; see the reveal effect further down.
  const tierRiseRefs = useRef([]);
  const tierRiseTlRef = useRef(null);
  const tierLeaveTlRef = useRef(null);
  const tierRevealedRef = useRef(false);
  const tierLeavePlayedRef = useRef(false);
  /** True while a header-nav jump is settling — suppresses the tier rise/spin
   *  entrance AND blocks the scrubbed timeline's onUpdate from writing phases,
   *  so the target step is replaced instantly (no glide, no lingering copy). */
  const headerJumpRef = useRef(false);
  const headerJumpTimerRef = useRef(null);
  /** True while Silver/Gold/Diamond entrance or leave spin is playing — scroll is held. */
  const tierSpinBusyRef = useRef(false);
  const tierSpinHoldYRef = useRef(null);
  /**
   * Latest computed scroll Y for the Our Tiers rest (STEP_REST[3]). Kept fresh by
   * the wheel/hold loop so the entrance spin can pin there instead of freezing a
   * mid-snap Y (which caused a tiny reverse scroll after Join Early → Our Tiers).
   */
  const ourTiersRestYRef = useRef(null);
  /**
   * Timestamp (performance.now) until which scroll stays HARD-blocked after the
   * Our Tiers cards begin their entrance. Set synchronously when the reveal fires
   * so the step can't be scrolled past before the cards have taken their places
   * and rotated — even if the entrance tween's onComplete/onInterrupt clears
   * `tierSpinBusyRef` early during the arrival snap.
   */
  const tierEntranceLockUntilRef = useRef(0);
  const advanceToJoinRef = useRef(null);
  const tm0x = useMotionValue(0);
  const tm0y = useMotionValue(0);
  const tm0s = useMotionValue(1);
  const tm0o = useMotionValue(1);
  const tm0z = useMotionValue(1);
  const tm1x = useMotionValue(0);
  const tm1y = useMotionValue(0);
  const tm1s = useMotionValue(1);
  const tm1o = useMotionValue(1);
  const tm1z = useMotionValue(1);
  const tm2x = useMotionValue(0);
  const tm2y = useMotionValue(0);
  const tm2s = useMotionValue(1);
  const tm2o = useMotionValue(1);
  const tm2z = useMotionValue(1);
  const tm3x = useMotionValue(0);
  const tm3y = useMotionValue(0);
  const tm3s = useMotionValue(1);
  const tm3o = useMotionValue(1);
  const tm3z = useMotionValue(1);
  const tierMorph = useMemo(
    () => [
      { x: tm0x, y: tm0y, scale: tm0s, opacity: tm0o, zIndex: tm0z },
      { x: tm1x, y: tm1y, scale: tm1s, opacity: tm1o, zIndex: tm1z },
      { x: tm2x, y: tm2y, scale: tm2s, opacity: tm2o, zIndex: tm2z },
      { x: tm3x, y: tm3y, scale: tm3s, opacity: tm3o, zIndex: tm3z },
    ],
    [tm0x, tm0y, tm0s, tm0o, tm0z, tm1x, tm1y, tm1s, tm1o, tm1z, tm2x, tm2y, tm2s, tm2o, tm2z, tm3x, tm3y, tm3s, tm3o, tm3z],
  );
  const tierCardX0 = useTransform(tm0x, (v) => `${v}vw`);
  const tierCardY0 = useTransform(tm0y, (v) => `${v}vh`);
  const tierCardX1 = useTransform(tm1x, (v) => `${v}vw`);
  const tierCardY1 = useTransform(tm1y, (v) => `${v}vh`);
  const tierCardX2 = useTransform(tm2x, (v) => `${v}vw`);
  const tierCardY2 = useTransform(tm2y, (v) => `${v}vh`);
  const tierCardX3 = useTransform(tm3x, (v) => `${v}vw`);
  const tierCardY3 = useTransform(tm3y, (v) => `${v}vh`);
  const tierCardStyles = [
    { x: tierCardX0, y: tierCardY0, scale: tm0s, opacity: tm0o, zIndex: tm0z },
    { x: tierCardX1, y: tierCardY1, scale: tm1s, opacity: tm1o, zIndex: tm1z },
    { x: tierCardX2, y: tierCardY2, scale: tm2s, opacity: tm2o, zIndex: tm2z },
    { x: tierCardX3, y: tierCardY3, scale: tm3s, opacity: tm3o, zIndex: tm3z },
  ];
  const detailsTitleLeft = useTransform(detailsT, [0, 1], ["50%", "6vw"]);
  const detailsTitleX = useTransform(detailsT, [0, 1], ["-50%", "0%"]);
  const detailsSubtitleOpacity = useTransform(detailsT, [0, 1], [1, 0]);
  const detailsButtonOpacity = useTransform(detailsT, [0, 1], [1, 0]);
  const [activeTab, setActiveTab] = useState(0);
  const activeTabRef = useRef(0);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  /** Drives floating-blue opacity when the carousel tab changes (detailsT alone is sticky). */
  const detailsActiveTabMV = useMotionValue(0);
  useEffect(() => {
    detailsActiveTabMV.set(activeTab);
  }, [activeTab, detailsActiveTabMV]);
  /**
   * Frozen finalCard x/y/scale while the details carousel is open. Prevents a
   * one-frame "blue card in the corner" flash when scroll-up briefly dips phase4
   * before the hold-RAF re-pins scroll (finalCard* would otherwise scrub toward
   * the Join Early fly-back pose).
   */
  const detailsFloatingPoseLockRef = useRef(null);
  const { tierTabBarRef, tierTabButtonRefs, tierTabActiveLine } =
    useTierTabIndicator({ activeTab, detailsOpen, isAr });
  // The floating card is "covered" by the overlay whenever the overlay is open
  // OR still animating closed.
  const detailsActive = detailsOpen || detailsClosing;
  const measureCardMorphTargets = useCallback(
    (tabIndex) => {
      const cardEls = tierCardRefs.map((r) => r.current);
      return computeCardMorphTargets(
        cardEls,
        carouselAnchorRef.current,
        tabIndex,
        rowBaselineRef.current,
        { tablet: useTabletCardPoseRef.current },
      );
    },
    // tierCardRefs is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const captureRowBaseline = useCallback(() => {
    rowBaselineRef.current = tierCardRefs.map((r, i) => {
      // Blue uses the floating card while it is the active slider tab
      // (desktop + tablet). Same continuous element — never measure a grid
      // Blue image that was swapped in after land (that caused tablet flicker).
      const useFloatingBlue =
        i === 0 &&
        activeTabRef.current === 0 &&
        floatingCardRef.current;
      const el = useFloatingBlue ? floatingCardRef.current : r.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        w: rect.width,
      };
    });
  }, []);
  const runDetailsTransition = useCallback(
    (toOpen, tabIndex, onDone) => {
      if (detailsCloseAnimRef.current) {
        detailsCloseAnimRef.current.stop();
        detailsCloseAnimRef.current = null;
      }
      const targets = toOpen ? measureCardMorphTargets(tabIndex) : null;
      if (toOpen && targets) applyMorphZIndex(tierMorph, targets);
      if (!toOpen) tierMorph.forEach((m) => m.zIndex.set(1));
      const progressAnim = animate(detailsT, toOpen ? 1 : 0, { duration: DURATION, ease: EASE });
      const morphAnims = toOpen
        ? animateCardMorphTo(tierMorph, targets, DURATION, EASE)
        : tierMorph.flatMap((m) => [
            animate(m.x, 0, { duration: DURATION, ease: EASE }),
            animate(m.y, 0, { duration: DURATION, ease: EASE }),
            animate(m.scale, 1, { duration: DURATION, ease: EASE }),
            animate(m.opacity, 1, { duration: DURATION, ease: EASE }),
          ]);
      const all = [progressAnim, ...morphAnims];
      detailsCloseAnimRef.current = progressAnim;
      Promise.all(all).then(() => {
        detailsCloseAnimRef.current = null;
        onDone?.();
      });
    },
    [detailsT, measureCardMorphTargets, tierMorph],
  );
  const openDetails = useCallback(
    (tabIndex) => {
      if (typeof window !== "undefined" && window.innerWidth < 768) return;
      // Wait until the blue card has settled in its slot.
      if (!blueCardLandedRef.current) return;
      if (detailsOpenRef.current || detailsClosingRef.current) return;
      clearPendingScrollGesturesRef.current?.();
      engageStepLockRef.current(DURATION * 1000 + 400);
      activeTabRef.current = tabIndex;
      detailsActiveTabMV.set(tabIndex);
      detailsOpenRef.current = true;
      detailsActiveRef.current = true;
      if (typeof window !== "undefined") window.__detailsOverlayActive = true;
      setActiveTab(tabIndex);
      setDetailsOpen(true);
      setDetailsClosing(false);
      detailsT.set(0);
      resetCardMorph(tierMorph);
      // Double-rAF: tablet 2×2 must finish layout (no parent x:-50%) before
      // measuring baselines for the desktop vertical carousel morph.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          captureRowBaseline();
          runDetailsTransition(true, tabIndex, () => {
            if (typeof window !== "undefined") {
              window.__scrollLockUntil = performance.now() + DURATION * 1000;
            }
          });
        });
      });
    },
    [detailsT, runDetailsTransition, tierMorph, captureRowBaseline],
  );
  const beginDetailsClose = useCallback(() => {
    if (detailsClosingRef.current || !detailsOpenRef.current) return;
    clearPendingScrollGesturesRef.current?.();
    engageStepLockRef.current(DURATION * 1000 + 400);
    detailsClosingRef.current = true;
    detailsActiveRef.current = true;
    if (typeof window !== "undefined") window.__detailsOverlayActive = true;
    setDetailsClosing(true);
    runDetailsTransition(false, activeTabRef.current, () => {
      rowBaselineRef.current = null;
      detailsFloatingPoseLockRef.current = null;
      detailsOpenRef.current = false;
      detailsClosingRef.current = false;
      detailsActiveRef.current = false;
      if (typeof window !== "undefined") {
        window.__detailsOverlayActive = false;
        engageStepLockRef.current(DURATION * 1000 + 400);
      }
      setDetailsOpen(false);
      setDetailsClosing(false);
    });
  }, [runDetailsTransition]);
  const beginDetailsCloseRef = useRef(beginDetailsClose);
  useEffect(() => { beginDetailsCloseRef.current = beginDetailsClose; }, [beginDetailsClose]);
  const forceCloseDetails = useCallback(() => {
    if (!detailsOpenRef.current && !detailsClosingRef.current) return;
    if (detailsCloseAnimRef.current) {
      detailsCloseAnimRef.current.stop();
      detailsCloseAnimRef.current = null;
    }
    resetCardMorph(tierMorph);
    detailsT.set(0);
    detailsOpenRef.current = false;
    detailsClosingRef.current = false;
    detailsActiveRef.current = false;
    rowBaselineRef.current = null;
    detailsFloatingPoseLockRef.current = null;
    if (typeof window !== "undefined") window.__detailsOverlayActive = false;
    setDetailsOpen(false);
    setDetailsClosing(false);
  }, [detailsT, tierMorph]);
  const forceCloseDetailsRef = useRef(forceCloseDetails);
  useEffect(() => { forceCloseDetailsRef.current = forceCloseDetails; }, [forceCloseDetails]);
  useEffect(
    () => () => {
      if (detailsCloseAnimRef.current) detailsCloseAnimRef.current.stop();
    },
    [],
  );
  const { isMobile, bp, isTabletUi, isMobileRef, isTabletUiRef, shouldStepSnapRef, transitionDurationRef } =
    useTiersViewport();
  // Mirrors the phase 4 / phase 5 motion values as render-driving state so we
  // can fully gate the tier-row's clickability. Without these, the tier-row
  // cards remain in the DOM with opacity 0 during the "Join Early Earn More"
  // step (phase 3) and the JoinForm step (phase 5), and the user can still
  // click the invisible Blue/Silver/Gold/Diamond slots — which re-opens the
  // details overlay or otherwise misroutes the click.
  const [tiersStepActive, setTiersStepActive] = useState(false);
  // True only after the floating blue card has finished travelling into its
  // Our Tiers / slider slot (phase4 ≥ 0.9). Until then, tier cards + slider
  // stay non-interactive so clicks can't open details mid-flight.
  const [blueCardLanded, setBlueCardLanded] = useState(false);
  const [joinStepActive, setJoinStepActive] = useState(false);
  // Mobile: which slider tier is currently active (0 = blue). The floating blue
  // card IS the slider's blue item — it shrinks/fades like a side card when the
  // user swipes to another tier (mirrored from this index), so there is no
  // separate blue card to hide/reveal. Reset key remounts the slider back to
  // blue when the tiers step is left, so re-entering starts on blue again.
  const [sliderActive, setSliderActive] = useState(0);
  const [sliderResetKey, setSliderResetKey] = useState(0);
  const sliderActiveRef = useRef(0);
  /** Mobile slider: wheel-over-cards → change active tier (registered by MobileTiersSlider). */
  const sliderWheelRef = useRef(null);
  useEffect(() => {
    sliderActiveRef.current = sliderActive;
  }, [sliderActive]);
  /**
   * Mobile only: when leaving Our Tiers with a non-blue slider card active,
   * swipe the whole Our Tiers panel (+ floating card) DOWN — same motion as
   * Join → Our Tiers on scroll-up — instead of flying the blue card back along
   * the phase4 path from a side-card pose.
   */
  const ourTiersSwipeDownLeave = useMotionValue(0);
  const ourTiersSwipeDownLeaveRef = useRef(false);
  const leaveCardYLockRef = useRef(null);
  const leaveCardXLockRef = useRef(null);
  const leaveSlotOffLockRef = useRef(null);
  const leaveScaleLockRef = useRef(null);
  const beginOurTiersSwipeDownLeaveRef = useRef(() => false);
  const endOurTiersSwipeDownLeaveRef = useRef(() => {});
  // True while the "Tiers and Benefits" intro step (step 0) is on screen (before
  // the phase-1 threshold at 0.08). Like the other step flags, it lets the
  // floating blue card act as a "next step" trigger during this step. Starts
  // true since the intro is the section's first rest.
  const [introStepActive, setIntroStepActive] = useState(true);
  // True while the "Benefits that matter to you" step is on screen (after the
  // phase-1 threshold at 0.08, before the phase-2 threshold at 0.40). Lets the
  // floating blue card act as a "next step" trigger during this step.
  const [benefitsStepActive, setBenefitsStepActive] = useState(false);
  // "Join Early Earn More" step (phase 2: after 0.40, before Our Tiers at 0.72).
  const [joinEarlyStepActive, setJoinEarlyStepActive] = useState(false);
  const goToTab = useCallback(
    (next) => {
      const nextIndex = Math.max(0, Math.min(3, next));
      if (nextIndex === activeTabRef.current) return;
      activeTabRef.current = nextIndex;
      detailsActiveTabMV.set(nextIndex);
      // Morph immediately (targets use frozen row baselines + slot math — no
      // layout wait). Deferring a frame left Blue at the wrong pose/opacity
      // for one paint → white flash over the card on scroll-down.
      if (detailsOpenRef.current && !detailsClosingRef.current) {
        const targets = measureCardMorphTargets(nextIndex);
        if (targets) {
          applyMorphZIndex(tierMorph, targets);
          animateCardMorphTo(tierMorph, targets, DURATION, EASE);
        }
      }
      setActiveTab(nextIndex);
    },
    [measureCardMorphTargets, tierMorph, detailsActiveTabMV],
  );
  const goToTabRef = useRef(goToTab);
  useEffect(() => {
    goToTabRef.current = goToTab;
  }, [goToTab]);
  /** Cooldown between wheel-driven carousel tab hops (ms). */
  const detailsWheelCooldownRef = useRef(0);
  // Desktop Our Tiers slot targets (measured). Join Early card rest lives in
  // `tiersJoinEarlyCardPose.js`.
  const [finalEndX, setFinalEndX] = useState(-57);
  const [finalEndScale, setFinalEndScale] = useState(0.35);
  // iOS Safari: read scroll from the fixed-height `#cham-scroll-root` container
  // (see chamScrollPort.js) so the toolbar never toggles the viewport during the
  // step animations. Other platforms keep window-based scroll. Used by the GSAP
  // ScrollTrigger below (which owns the scroll → phase driving).
  const scrollContainerRef = useChamScrollContainerRef();

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobile) return;
    const offsetIn = (el, ancestor) => {
      let cur = el;
      let left = 0;
      let top = 0;
      while (cur && cur !== ancestor) {
        left += cur.offsetLeft;
        top += cur.offsetTop;
        cur = cur.offsetParent;
      }
      return { left, top };
    };
    const align = () => {
      const cardEl = floatingCardRef.current;
      const slot = tierSlotRef.current;
      if (!cardEl || !slot) return;
      // Never re-measure while the tier-detail overlay is open OR closing: the
      // carousel morph displaces the blue slot / floating card, so a measure here
      // bakes the carousel pose into the slot target. On close the floating blue
      // card would then resolve to that (right-side, oversized) target instead of
      // returning to its real Blue slot — the reverse-from-slider misplacement.
      if (detailsActiveRef.current) return;
      // Only measure when the tier row is at REST (phase4 fully 0 or 1, and not
      // mid Join-swipe) — never mid-transition. A measurement taken while the row
      // is partway through its +20vh reveal or the phase5 Join swipe bakes that
      // transient transform into the slot target, which yanks the card off-mark.
      const p4 = phase4.get();
      if ((p4 > 0.001 && p4 < 0.999) || phase5.get() > 0.001) return;
      const section = cardEl.offsetParent;
      if (!section) return;
      const cardW = cardEl.offsetWidth;
      const cardH = cardEl.offsetHeight;
      if (cardW === 0 || cardH === 0) return;
      // Slot position must use getBoundingClientRect so parent motion transforms
      // (Our Tiers row reveal Y, details morph) are included — offsetTop alone
      // leaves the floating blue card parked near the title instead of the slot.
      const sectionRect = section.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      if (!slotRect.width || !slotRect.height) return;
      const cardPos = offsetIn(cardEl, section);
      const cardCenterX = cardPos.left + cardW / 2;
      const cardCenterY = cardPos.top + cardH / 2;
      const slotCenterX = slotRect.left - sectionRect.left + slotRect.width / 2;
      const scale = slotRect.width / cardW;
      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;
      // The tier row sits at +20vh while phase4 = 0 (collapsed) and 0 at rest.
      // Compensate so the measured target is always the row's RESTED slot
      // position, whether we measured at p4 = 0 or p4 = 1.
      const rowLiftPx = 20 * (1 - clamp01(p4)) * vh;
      const slotBottom = slotRect.top - sectionRect.top + slotRect.height - rowLiftPx;
      const tyPx = slotBottom - cardCenterY - (cardH * scale) / 2;
      const txPx = slotCenterX - cardCenterX;
      measuredSlotRef.current = { x: `${txPx / vw}vw`, y: `${tyPx / vh}vh`, scale, rotate: 0 };
      setMeasuredEndScale(scale);
      setMeasuredEndX(txPx / vw);
      setMeasuredEndY(`${tyPx / vh}vh`);
    };
    alignDesktopRef.current = align;
    align();
    // The tier row's slot position depends on the Silver/Gold/Diamond images in
    // the row settling their height. They load a frame or more after mount, so a
    // single measure can capture a too-short (and therefore too-high) row, which
    // lands the floating blue card above the row instead of on the slot. Re-measure
    // across a few frames + a short delay, on resize, and whenever any tier image
    // finishes loading — so the card always settles exactly onto the slot.
    const raf1 = requestAnimationFrame(align);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(align));
    const timer = setTimeout(align, 250);
    window.addEventListener("resize", align);
    const img = floatingCardRef.current?.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", align);
    const rowImgs = [
      document.querySelector('img[alt="Silver Tier"]'),
      document.querySelector('img[alt="Gold Tier"]'),
      document.querySelector('img[alt="Diamond Tier"]'),
    ].filter(Boolean);
    rowImgs.forEach((im) => { if (!im.complete) im.addEventListener("load", align); });
    const slotEl = tierSlotRef.current;
    let slotRo;
    if (slotEl && typeof ResizeObserver !== "undefined") {
      slotRo = new ResizeObserver(align);
      slotRo.observe(slotEl);
    }
    return () => {
      alignDesktopRef.current = null;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
      window.removeEventListener("resize", align);
      if (img) img.removeEventListener("load", align);
      rowImgs.forEach((im) => im.removeEventListener("load", align));
      slotRo?.disconnect();
    };
  }, [isMobile, bp]);

  // Mobile counterpart of the desktop `align` effect. Measures where the
  // slider's active (blue) card sits and computes the translate + scale that
  // moves the floating blue card's center onto that slot's center — so the
  // SAME card travels from "Join Early Earn More" and lands on the slider,
  // instead of the floating card vanishing and the slider popping in.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobile) return;
    const offsetIn = (el, ancestor) => {
      let cur = el;
      let left = 0;
      let top = 0;
      while (cur && cur !== ancestor) {
        left += cur.offsetLeft;
        top += cur.offsetTop;
        cur = cur.offsetParent;
      }
      return { left, top };
    };
    const alignMobile = () => {
      const cardEl = floatingCardRef.current;
      const slot = mobileTierSlotRef.current;
      if (!cardEl || !slot) return;
      // Only measure when the slider/tiers step is at REST (phase4 fully 0 or 1,
      // and not mid Join-swipe). Measuring mid-transition bakes the transient
      // transform into the landing slot, which yanks the floating blue card to
      // the wrong place on the slider.
      const p4 = phase4.get();
      if ((p4 > 0.001 && p4 < 0.999) || phase5.get() > 0.001) return;
      const section = cardEl.offsetParent;
      if (!section) return;
      const cardW = cardEl.offsetWidth;
      const cardH = cardEl.offsetHeight;
      if (!cardW || !cardH) return;
      // Use the slot's REAL rendered box (getBoundingClientRect) as the target:
      // it captures the slider card's true on-screen position (centered X, real
      // width/height after the slider's width settles) without relying on the
      // "active card is centered" assumption — which is what left a few px of
      // vertical error. The floating card's base box is taken from offset math
      // (transform-independent) so the animating transform doesn't skew it. Both
      // are expressed in the section's local space (subtracting sectionRect),
      // which cancels the section's scroll position, so this is scroll-safe.
      const sectionRect = section.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      if (!slotRect.width || !slotRect.height) return;
      const cardPos = offsetIn(cardEl, section);
      const cardCenterX = cardPos.left + cardW / 2;
      const cardCenterY = cardPos.top + cardH / 2;
      const targetCenterX = slotRect.left - sectionRect.left + slotRect.width / 2;
      const targetCenterY = slotRect.top - sectionRect.top + slotRect.height / 2;
      const scale = slotRect.width / cardW;
      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;
      const endX = (targetCenterX - cardCenterX) / vw;
      const endY = `${(targetCenterY - cardCenterY) / vh + MOBILE_CARD_FINAL_Y_OFFSET_VH}vh`;
      measuredSlotRef.current = { x: `${endX}vw`, y: endY, scale, rotate: 0 };
      setMeasuredMobileEndScale(scale);
      setMeasuredMobileEndX(endX);
      setMeasuredMobileEndY(endY);
    };
    alignMobileRef.current = alignMobile;
    alignMobile();
    // The slider's card width settles a frame after mount (ResizeObserver) and
    // the card image may load late — re-measure across a few frames + a short
    // delay to catch late layout shifts (fonts, image decode, width settle).
    const raf1 = requestAnimationFrame(alignMobile);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(alignMobile));
    const timer = setTimeout(alignMobile, 250);
    window.addEventListener("resize", alignMobile);
    const slotImg = mobileTierSlotRef.current?.querySelector("img");
    if (slotImg && !slotImg.complete) slotImg.addEventListener("load", alignMobile);
    return () => {
      alignMobileRef.current = null;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
      window.removeEventListener("resize", alignMobile);
      if (slotImg) slotImg.removeEventListener("load", alignMobile);
    };
  }, [isMobile, bp, sliderLayoutTick]);

  const t = useMotionValue(0);
  const exit = useMotionValue(0);
  const phase4 = useMotionValue(0);
  const tStateRef = useRef(0);
  const exitStateRef = useRef(0);
  const phase4StateRef = useRef(0);
  const phase5 = useMotionValue(0);
  const phase5StateRef = useRef(0);

  // Our Tiers row uses a motion Y reveal — re-measure the blue slot once that
  // transform settles so the floating card lands on the tier row, not near the title.
  useMotionValueEvent(phase4, "change", (p) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    if (p > 0.001 && p < 0.999) return;
    if (p < 0.92) return;
    if (alignDesktopRafRef.current) cancelAnimationFrame(alignDesktopRafRef.current);
    alignDesktopRafRef.current = requestAnimationFrame(() => {
      alignDesktopRafRef.current = null;
      alignDesktopRef.current?.();
      // The entry lock can be measured before the tier images / row layout have
      // settled, which lands the blue card low-left. Now that the row is fully
      // settled at the Our Tiers rest (phase4 ≈ 1, not mid Join swipe), refresh
      // the LOCKED landing slot with the accurate measurement so the card
      // corrects onto the row instead of staying at the stale target.
      if (
        inOurTiersRef.current &&
        phase5.get() < 0.001 &&
        measuredSlotRef.current
      ) {
        tierSlotTargetRef.current = measuredSlotRef.current;
        setLockedTierSlot(measuredSlotRef.current);
      }
    });
  });

  // ── Our Tiers card reveal (desktop, GSAP) ─────────────────────────────────
  // Silver/Gold/Diamond rise from below one-by-one L→R. Each card spins on Y
  // (same axis as the hover flip) as it arrives, then settles front-facing.
  // Leaving Our Tiers → Join plays the same Y-spin on the way out.
  // Played (not scrubbed) so the cadence stays consistent on entry/exit.
  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return undefined;
    const els = [1, 2, 3]
      .map((idx) => tierRiseRefs.current[idx])
      .filter(Boolean);
    if (els.length < 3) return undefined;

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // Spin only Silver/Gold/Diamond — the active blue card stays put once landed.
    const collectSpinTargets = () => {
      const riseEls = [1, 2, 3]
        .map((idx) => tierRiseRefs.current[idx])
        .filter(Boolean);
      const inners = riseEls
        .map((slot) => slot.querySelector(".tier-flip-inner"))
        .filter(Boolean);
      return { riseEls, inners, spinTargets: inners };
    };

    const { inners, spinTargets } = collectSpinTargets();

    const setSpinningClass = (on, nodes = spinTargets) => {
      nodes.forEach((node) => {
        node.classList.toggle("tier-flip-inner--spinning", on);
      });
    };

    const clearSpinTransforms = (nodes = spinTargets) => {
      if (nodes.length) gsap.set(nodes, { clearProps: "transform" });
      setSpinningClass(false, nodes);
    };

    gsap.set(els, { yPercent: 220 });
    if (!reduced) {
      setSpinningClass(true);
      gsap.set(inners, { rotationY: -360, transformOrigin: "50% 50%" });
    }

    // Match hover flip curve (styles.css tier-flip-inner transition).
    const spinEase = "power2.inOut";
    const riseEase = "back.out(1.35)";
    const duration = reduced ? 0.7 : 0.95;
    const stagger = reduced ? 0.1 : 0.16;
    const joinSwipeMs = () =>
      isTabletUiRef.current || isMobileRef.current
        ? TABLET_JOIN_SWIPE_DURATION_MS
        : JOIN_SWIPE_DURATION_MS;
    const leaveDuration = () =>
      reduced ? 0.7 : joinSwipeMs() / 1000;

    const spinLockMs = () =>
      Math.round((duration + stagger * 2) * 1000) + 280;
    const leaveSpinLockMs = () =>
      Math.round((leaveDuration() + stagger * 2) * 1000) + 280;

    const beginSpinScrollLock = (ms, holdY = null) => {
      tierSpinBusyRef.current = true;
      // Prefer an explicit rest Y (entrance). Capturing getScrollTop() while the
      // Join Early → Our Tiers snap is still in flight freezes a mid-snap offset;
      // the hold loop then yanks scroll back after the snap lands (tiny reverse).
      tierSpinHoldYRef.current =
        holdY != null && Number.isFinite(holdY) ? holdY : getScrollTop();
      // Extend the scroll lock without engageStepLock — that path can flush a
      // queued step when its timer fires mid-spin.
      if (typeof window !== "undefined") {
        window.__scrollLockUntil = Math.max(
          window.__scrollLockUntil ?? 0,
          performance.now() + ms,
        );
      }
    };

    const endSpinScrollLock = () => {
      tierSpinBusyRef.current = false;
      tierSpinHoldYRef.current = null;
      if (typeof window !== "undefined") {
        window.__scrollLockUntil = performance.now();
      }
    };

    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        if (!reduced) setSpinningClass(true);
        beginSpinScrollLock(
          spinLockMs(),
          ourTiersRestYRef.current ?? undefined,
        );
      },
      onComplete: () => {
        clearSpinTransforms();
        endSpinScrollLock();
      },
      onReverseComplete: () => {
        clearSpinTransforms();
        endSpinScrollLock();
      },
      onInterrupt: () => {
        endSpinScrollLock();
      },
    });

    tl.fromTo(
      els,
      { yPercent: 220 },
      { yPercent: 0, duration, ease: riseEase, stagger },
      0,
    );

    if (!reduced && inners.length) {
      // One full Y-spin while rising — same motion language as hover flip.
      tl.fromTo(
        inners,
        { rotationY: -360 },
        {
          rotationY: 0,
          duration,
          ease: spinEase,
          stagger,
        },
        0,
      );
    }

    // Leave spin: same Y-rotation for Silver/Gold/Diamond. Scroll stays locked
    // until the spin finishes, then the Join handoff may proceed.
    const leaveTl = gsap.timeline({ paused: true });

    const playLeaveSpin = (onDone) => {
      if (reduced) {
        onDone?.();
        return;
      }
      const { inners: leaveInnerNodes, spinTargets: leaveNodes } =
        collectSpinTargets();
      if (!leaveInnerNodes.length) {
        onDone?.();
        return;
      }
      leaveTl.clear();
      setSpinningClass(true, leaveNodes);
      beginSpinScrollLock(leaveSpinLockMs());
      leaveTl.fromTo(
        leaveInnerNodes,
        { rotationY: 0 },
        {
          rotationY: 360,
          duration: leaveDuration(),
          ease: spinEase,
          stagger,
        },
        0,
      );
      leaveTl.eventCallback("onComplete", () => {
        clearSpinTransforms(leaveNodes);
        endSpinScrollLock();
        onDone?.();
      });
      leaveTl.restart();
    };

    tierRiseTlRef.current = tl;
    tierLeaveTlRef.current = { play: playLeaveSpin, kill: () => leaveTl.kill() };

    if (phase4.get() >= 0.9) {
      // Already settled — show final pose, no entrance lock.
      tl.progress(1);
      clearSpinTransforms();
      tierRevealedRef.current = true;
    }
    return () => {
      endSpinScrollLock();
      tl.kill();
      leaveTl.kill();
      tierRiseTlRef.current = null;
      tierLeaveTlRef.current = null;
    };
  }, [isMobile, phase4]);

  // Play the reveal once the blue card has landed (phase4 ≥ 0.9); reset it when
  // the user scrolls back out so re-entering Our Tiers re-deals the cards.
  // Also unlocks tier-card / slider clicks (blueCardLanded).
  useMotionValueEvent(phase4, "change", (p) => {
    const landed = p >= 0.9;
    blueCardLandedRef.current = landed;
    setBlueCardLanded((prev) => (prev === landed ? prev : landed));

    if (isMobileRef.current) return;
    const tl = tierRiseTlRef.current;
    if (!tl) return;
    if (p >= 0.9 && !tierRevealedRef.current) {
      tierRevealedRef.current = true;
      tierLeavePlayedRef.current = false;
      if (headerJumpRef.current) {
        // Header nav = instant replace: land the tier row in its final pose with
        // no rise/spin entrance (and no entrance scroll-lock). suppressEvents so
        // the timeline's onStart/onComplete scroll-lock callbacks never fire.
        tl.progress(1, true);
        document
          .querySelectorAll(".cham-our-tiers .tier-flip-inner--spinning")
          .forEach((node) => {
            node.classList.remove("tier-flip-inner--spinning");
            gsap.set(node, { clearProps: "transform" });
          });
      } else {
        // Mark the entrance busy SYNCHRONOUSLY, before the first frame. The
        // timeline's onStart (which also sets this) only fires next tick, and a
        // wheel/touch commit landing in that gap would let advanceToJoin() slip
        // into the Join section before the cards have rotated into place. Setting
        // it here blocks scroll-to-Join from the instant the reveal begins until
        // the rise+rotate onComplete clears it. Also arm a time-based entrance
        // lock so scroll stays blocked for the full rise+rotate even if the tween
        // is interrupted mid-arrival (which would clear tierSpinBusyRef early).
        tierSpinBusyRef.current = true;
        // Pin to Our Tiers rest immediately — do not freeze live scroll (often
        // still mid-snap from Join Early).
        if (ourTiersRestYRef.current != null) {
          tierSpinHoldYRef.current = ourTiersRestYRef.current;
        }
        tierEntranceLockUntilRef.current =
          performance.now() + TIER_ENTRANCE_LOCK_MS;
        tl.restart();
      }
    } else if (p < 0.82 && tierRevealedRef.current) {
      tierRevealedRef.current = false;
      tierLeavePlayedRef.current = false;
      tierSpinBusyRef.current = false;
      tierEntranceLockUntilRef.current = 0;
      tierSpinHoldYRef.current = null;
      tl.pause(0);
      // Reset entrance spin so the next reveal starts clean (and hover works).
      const spinNodes = document.querySelectorAll(
        ".cham-our-tiers .tier-flip-inner--spinning",
      );
      spinNodes.forEach((node) => {
        node.classList.remove("tier-flip-inner--spinning");
        gsap.set(node, { clearProps: "transform" });
      });
    }
  });

  // Leave spin is started from advanceToJoin (gated) — not from phase5 scrub —
  // so scroll cannot race ahead of the rotate-out. Reset the leave flag when
  // returning from Join so the next exit can spin again.
  useMotionValueEvent(phase5, "change", (p) => {
    if (p < 0.02) tierLeavePlayedRef.current = false;
  });

  // Sync landing gate on mount / when phase4 is already settled (change events
  // alone can miss a jump-to-progress that never crosses 0.9 from below).
  useEffect(() => {
    const landed = phase4.get() >= 0.9;
    blueCardLandedRef.current = landed;
    setBlueCardLanded(landed);
  }, [phase4]);

  // Tier-row combined transforms can go stale across the details overlay mount.
  // Re-emit phase4/t/exit only — skip while join step is active so phase5 is
  // not nudged (that flashes the form layer on overlay close).
  useEffect(() => {
    if (phase5StateRef.current > 0.02) return;
    const mvs = [phase4, t, exit];
    const originals = mvs.map((mv) => mv.get());
    mvs.forEach((mv, i) => mv.set(originals[i] >= 0.5 ? originals[i] - 1e-3 : originals[i] + 1e-3));
    const raf = requestAnimationFrame(() => mvs.forEach((mv, i) => mv.set(originals[i])));
    return () => cancelAnimationFrame(raf);
  }, [detailsOpen, detailsClosing, t, exit, phase4]);

  const lockScroll = () => {
    if (typeof window === "undefined") return;
    const next = performance.now() + transitionDurationRef.current * 1000 + 400;
    const cur = window.__scrollLockUntil ?? 0;
    if (next > cur) window.__scrollLockUntil = next;
  };

  const inOurTiersRef = useRef(false);
  const inJoinRef = useRef(false);
  // Scrub every phase straight from the master GSAP progress (0→1). Each phase
  // spans the gap between two adjacent step rests, so the poses/timing are
  // unchanged from before — only the *driver* changed: scroll position now owns
  // the whole story continuously, instead of a one-shot tween per gesture. All
  // downstream motion (linear content, floating card, detail overlay, mobile
  // slider) reads these values, so it all stays perfectly in sync with scroll.
  const applyPhaseFromProgress = useCallback(
    (v) => {
      const R = TIERS_STEP_REST;
      // Finish Benefits entrance (t→1) before the Benefits rest so the last
      // part of that scroll is a settle hold — exit must not start yet.
      const benefitsEnterEnd = R[0] + (R[1] - R[0]) * BENEFITS_ENTER_COMPLETE;
      const tv = phaseScrub(v, R[0], benefitsEnterEnd);
      // Finish Join Early entrance (exit→1) before the Join Early rest so the
      // last part settles — Our Tiers (phase4) must not start yet.
      const joinEarlyEnterEnd = R[1] + (R[2] - R[1]) * JOIN_EARLY_ENTER_COMPLETE;
      const ev = phaseScrub(v, R[1], joinEarlyEnterEnd);
      // Our Tiers only after the Join Early rest (next scroll / past R[2]).
      const p4 = phaseScrub(v, R[2], R[3]);
      const p5 = phaseScrub(v, R[3], R[4]);
      t.set(tv);
      exit.set(ev);
      phase4.set(p4);
      phase5.set(p5);
      tStateRef.current = tv >= 0.5 ? 1 : 0;
      exitStateRef.current = ev >= 0.5 ? 1 : 0;
      phase4StateRef.current = p4 >= 0.5 ? 1 : 0;
      phase5StateRef.current = p5 >= 0.5 ? 1 : 0;
      stepIndexRef.current = progressToStepIndex(v);

      // Our Tiers enter/leave (hysteresis around the step-2 rest, where the
      // floating card starts travelling to the tier row). On enter, LOCK the
      // card's landing slot so its target stays fixed for the whole Our Tiers ↔
      // Join stay; on leave, release the lock and reset the mobile slider.
      const inOurTiersNow = inOurTiersRef.current ? v >= R[2] - 0.03 : v >= R[2];
      if (inOurTiersNow !== inOurTiersRef.current) {
        inOurTiersRef.current = inOurTiersNow;
        setTiersStepActive(inOurTiersNow);
        if (inOurTiersNow) {
          const onMobile =
            typeof window !== "undefined" && window.innerWidth < 768;
          if (onMobile) alignMobileRef.current?.();
          else alignDesktopRef.current?.();
          if (measuredSlotRef.current) {
            tierSlotTargetRef.current = measuredSlotRef.current;
            setLockedTierSlot(measuredSlotRef.current);
          }
        } else {
          tierSlotTargetRef.current = null;
          setLockedTierSlot(null);
          // Mid swipe-down leave: do not remount the slider onto Blue (that
          // flashes Blue while the panel is still sliding). Reset after leave.
          if (!ourTiersSwipeDownLeaveRef.current) {
            setSliderActive(0);
            setSliderResetKey((k) => k + 1);
          }
        }
      }

      // Join enter/leave (hysteresis near the phase-5 midpoint). Close any open
      // details overlay on enter so it doesn't ride into the form.
      const inJoinNow = inJoinRef.current ? v >= 0.84 : v >= 0.86;
      if (inJoinNow !== inJoinRef.current) {
        inJoinRef.current = inJoinNow;
        setJoinStepActive(inJoinNow);
        if (inJoinNow && (detailsOpenRef.current || detailsClosingRef.current)) {
          requestAnimationFrame(() => forceCloseDetailsRef.current?.());
        }
      }

      const nextIntro = v < 0.08;
      setIntroStepActive((cur) => (cur !== nextIntro ? nextIntro : cur));
      const nextBenefits = v > 0.08 && v < 0.40;
      setBenefitsStepActive((cur) => (cur !== nextBenefits ? nextBenefits : cur));
      const nextJoinEarly = v > 0.40 && v < 0.72;
      setJoinEarlyStepActive((cur) =>
        cur !== nextJoinEarly ? nextJoinEarly : cur,
      );

      // Scrolling back up out of Our Tiers dismisses an open details overlay.
      if (v < 0.70 && detailsOpenRef.current && !detailsClosingRef.current) {
        beginDetailsCloseRef.current();
      }
    },
    [t, exit, phase4, phase5],
  );
  const applyPhaseFromProgressRef = useRef(applyPhaseFromProgress);
  useEffect(() => {
    applyPhaseFromProgressRef.current = applyPhaseFromProgress;
  }, [applyPhaseFromProgress]);

  // ── GSAP ScrollTrigger — the single, scrubbed scroll driver ───────────────
  // One master timeline, scrubbed to scroll. The section is already pinned by
  // its CSS `sticky` layout, so no GSAP pin is needed → native scroll stays
  // fully in control (no scroll-jacking). `scrub: 1` gives the same ~1s
  // cinematic glide as the canvas hero, so both sections feel like one
  // continuous, frame-driven sequence.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    let ctx = null;
    let raf = null;
    let settleTimer = null;

    const build = () => {
      if (ctx) ctx.revert();
      // iOS / iPad Safari scrolls an inner element (see chamScrollPort); point
      // ScrollTrigger at it there, else the window drives progress. Rebuild when
      // the lock class / container bind lands after first paint.
      const scroller =
        isIosMobileSafari() && scrollContainerRef.current
          ? scrollContainerRef.current
          : undefined;

      const proxy = { p: 0 };

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: container,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: reduced ? true : 1,
            invalidateOnRefresh: true,
          },
        });

        // Phase driver — one continuous value scrubbed across the whole section.
        // Its onUpdate maps scroll → every phase, so the story advances gradually
        // with the scroll and never completes after a tiny move (ease: "none" on
        // the scroll-driven part, per cinematic-scrub best practice).
        tl.to(
          proxy,
          {
            p: 1,
            duration: 1,
            onUpdate: () => {
              // During a header-nav jump the phases are set directly to the target
              // step. Ignore the scrub tween's easing writes so it can't drag the
              // previous step's content back across the screen while it settles.
              //
              // Same for discrete step snaps: animateScrollTo already drives
              // phases from its RAF. Letting scrub:1 also call applyPhaseFromProgress
              // (lagging behind scrollPortTo) double-writes t/exit every frame and
              // flickers the floating blue card on mobile — especially Benefits →
              // Join Early.
              if (headerJumpRef.current) return;
              if (scrollSnapAnimatingRef.current) return;
              if (suppressProgressPhaseSyncRef.current) return;
              applyPhaseFromProgressRef.current?.(proxy.p);
            },
          },
          0,
        );

        // Cinematic depth — a slow camera push-in + subtle vertical parallax on
        // the backdrop across the full scroll. Non-conflicting (Framer never
        // touches this layer). Skipped for reduced-motion users.
        if (!reduced && bgLayerRef.current) {
          tl.fromTo(
            bgLayerRef.current,
            { scale: 1.06, yPercent: -2.5, transformOrigin: "50% 50%" },
            { scale: 1.16, yPercent: 2.5, duration: 1 },
            0,
          );
        }
      }, container);

      ScrollTrigger.refresh();
    };

    build();
    // Recompute start/end once late layout (fonts, tier images) settles, so the
    // scrub range is accurate and nothing jumps at the section boundaries.
    raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    settleTimer = setTimeout(() => ScrollTrigger.refresh(), 400);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const unsub = subscribeChamScrollContainer(build);

    return () => {
      unsub();
      if (raf != null) cancelAnimationFrame(raf);
      clearTimeout(settleTimer);
      window.removeEventListener("load", onLoad);
      if (ctx) ctx.revert();
    };
  }, [isMobile]);

  const textX = useTransform(t, [0, 1], ["0vw", "-80vw"]);
  const textOpacity = useTransform(t, [0, 0.6], [1, 0]);

  // Blue-card intro → Benefits scrub — edit `tiersIntroCardPose.js` (start)
  // and `tiersBenefitsCardPose.js` (Benefits rest).
  const desktopCardRange = introToBenefitsFramerRanges("desktop");
  const tabletCardRange = introToBenefitsFramerRanges("tablet");
  const mobileCardRange = introToBenefitsFramerRanges("mobile");
  const wideCardRange = introToBenefitsFramerRanges("wide");
  const cardXDesktop = useTransform(t, [0, 1], desktopCardRange.x);
  const cardYDesktop = useTransform(t, [0, 1], desktopCardRange.y);
  const cardScaleDesktop = useTransform(t, [0, 1], desktopCardRange.scale);
  const cardRotateDesktop = useTransform(t, [0, 1], desktopCardRange.rotate);
  const cardXWide = useTransform(t, [0, 1], wideCardRange.x);
  const cardYWide = useTransform(t, [0, 1], wideCardRange.y);
  const cardScaleWide = useTransform(t, [0, 1], wideCardRange.scale);
  const cardRotateWide = useTransform(t, [0, 1], wideCardRange.rotate);
  const cardXMobile = useTransform(t, [0, 1], mobileCardRange.x);
  const cardYMobile = useTransform(t, [0, 1], mobileCardRange.y);
  const cardScaleMobile = useTransform(t, [0, 1], mobileCardRange.scale);
  const cardRotateMobile = useTransform(t, [0, 1], mobileCardRange.rotate);
  const cardXTablet = useTransform(t, [0, 1], tabletCardRange.x);
  const cardYTablet = useTransform(t, [0, 1], tabletCardRange.y);
  const cardScaleTablet = useTransform(t, [0, 1], tabletCardRange.scale);
  const cardRotateTablet = useTransform(t, [0, 1], tabletCardRange.rotate);
  // Real tablets only (768–1023, or 1024–1279 touch/iPad). Mouse laptops in
  // the 1024–1279 band keep the 2xl-style desktop card / benefits / tiers UI.
  const useTabletCardPose = isTabletUi;
  useTabletCardPoseRef.current = useTabletCardPose;
  // Ref so Framer mappers always read the latest branch (inputs don't always
  // re-fire when React bp/isMobile changes).
  const cardPoseModeRef = useRef("desktop");
  cardPoseModeRef.current = isMobile
    ? "mobile"
    : useTabletCardPose
      ? "tablet"
      : bp === "wide"
        ? "wide"
        : "desktop";
  const cardX = useTransform(
    [cardXDesktop, cardXMobile, cardXTablet, cardXWide],
    ([d, m, tab, w]) => {
      const mode = cardPoseModeRef.current;
      return mode === "mobile"
        ? m
        : mode === "tablet"
          ? tab
          : mode === "wide"
            ? w
            : d;
    },
  );
  const cardY = useTransform(
    [cardYDesktop, cardYMobile, cardYTablet, cardYWide],
    ([d, m, tab, w]) => {
      const mode = cardPoseModeRef.current;
      return mode === "mobile"
        ? m
        : mode === "tablet"
          ? tab
          : mode === "wide"
            ? w
            : d;
    },
  );
  const cardScale = useTransform(
    [cardScaleDesktop, cardScaleMobile, cardScaleTablet, cardScaleWide],
    ([d, m, tab, w]) => {
      const mode = cardPoseModeRef.current;
      return mode === "mobile"
        ? m
        : mode === "tablet"
          ? tab
          : mode === "wide"
            ? w
            : d;
    },
  );
  const cardRotate = useTransform(
    [cardRotateDesktop, cardRotateMobile, cardRotateTablet, cardRotateWide],
    ([d, m, tab, w]) => {
      const mode = cardPoseModeRef.current;
      return mode === "mobile"
        ? m
        : mode === "tablet"
          ? tab
          : mode === "wide"
            ? w
            : d;
    },
  );

  const benefitsXDesktop = useTransform(t, [0, 1], ["55vw", "0vw"]);
  // Mobile + tablet: keep the slide small so the full-width panel never clips
  // against the sticky section's overflow:hidden while scrolling into the step.
  const benefitsXMobile = useTransform(t, [0, 1], ["12vw", "0vw"]);
  const benefitsX = useTransform(
    [benefitsXDesktop, benefitsXMobile],
    ([d, m]) => {
      const mode = cardPoseModeRef.current;
      return mode === "desktop" || mode === "wide" ? d : m;
    },
  );
  const benefitsOpacity = useTransform(t, [0.25, 0.7], [0, 1]);

  // Benefits → Join Early handoff is driven directly by the exit progress.
  // Cards now enter with a scroll-linked staggered slide (see below), so there
  // is no deck-deal dwell to reserve — exitT tracks exit 1:1.
  const exitT = exit;
  const benefitsExitY = useTransform(exitT, [0, 1], ["0vh", "-60vh"]);
  // Mobile: fade Benefits out earlier so Join can enter into a clear stage.
  // Desktop: fade Benefits out over the FIRST half of the exit so it has cleared
  // before Join Early fades in (below), instead of lingering at full opacity the
  // whole way — the two 54vw/55vw panels overlap in the middle otherwise. Mirrors
  // the mobile cross-fade (benefits gone by ~0.48, join in from ~0.5).
  const benefitsExitOpacityDesktop = useTransform(exitT, [0, 0.5], [1, 0]);
  const benefitsExitOpacityMobile = useTransform(exitT, [0, 0.48], [1, 0]);
  const benefitsExitOpacity = useTransform(
    [benefitsExitOpacityDesktop, benefitsExitOpacityMobile],
    ([d, m]) => (isMobile ? m : d),
  );
  const benefitsCombinedOpacity = useTransform(
    [benefitsOpacity, benefitsExitOpacity],
    ([a, b]) => a * b,
  );

  // Phase-3 "Join Early Earn More" resting pose — edit `tiersJoinEarlyCardPose.js`.
  const joinEarlyCardPose = resolveTiersJoinEarlyCardPose({
    isMobile,
    isTabletUi: useTabletCardPose,
    bp,
  });
  const CARD_FINAL = formatJoinEarlyCardPose(joinEarlyCardPose, { isAr });
  const cardFinalRef = useRef(CARD_FINAL);
  cardFinalRef.current = CARD_FINAL;
  // Latch the LIVE on-screen pose on the first Benefits → Join Early exit frame.
  // Mixing from config `benefits` numbers can jump if `t` was not exactly 1 at
  // snap start; latching keeps the path continuous with no first-frame flicker.
  const exitCardLatchRef = useRef(null);
  const latchExitCardPose = (cx, cy, cs, cr) => {
    if (!exitCardLatchRef.current) {
      exitCardLatchRef.current = { x: cx, y: cy, scale: cs, rotate: cr };
    }
    return exitCardLatchRef.current;
  };
  const tierSlotY = bp === "tablet" ? "-16vh" : bp === "desktop" ? "-13vh" : "-9vh";
  const [measuredEndX, setMeasuredEndX] = useState(null);
  const [measuredEndY, setMeasuredEndY] = useState(null);
  const [measuredEndScale, setMeasuredEndScale] = useState(null);
  // Mobile-specific tier slot: measured to sit exactly on the slider's active
  // (blue) card so the same floating card flows out of "Join Early Earn More"
  // and lands on the slider. Falls back to a centered guess before measurement.
  const [measuredMobileEndX, setMeasuredMobileEndX] = useState(null);
  const [measuredMobileEndY, setMeasuredMobileEndY] = useState(null);
  const [measuredMobileEndScale, setMeasuredMobileEndScale] = useState(null);
  const CARD_TIER_SLOT_MOBILE = {
    x: measuredMobileEndX != null ? `${measuredMobileEndX}vw` : "25vw",
    y: measuredMobileEndY ?? "12vh",
    scale: measuredMobileEndScale ?? 1.4,
    rotate: 0,
  };
  // The card's slot target: the LOCKED measurement taken on Our Tiers entry
  // (stable for the whole stay) when present, else the latest live measurement,
  // else a tuned fallback. Reading the lock first is what keeps the card from
  // jumping/dropping when a stray re-measure fires during the Join transition.
  const resolveCardTierSlot = () =>
    tierSlotTargetRef.current ??
    lockedTierSlot ??
    (isMobile
      ? CARD_TIER_SLOT_MOBILE
      : {
          x: `${measuredEndX ?? finalEndX}vw`,
          y: measuredEndY ?? tierSlotY,
          scale: measuredEndScale ?? finalEndScale,
          rotate: 0,
        });
  const phase3CardX = useTransform(
    [cardX, cardY, cardScale, cardRotate, exitT],
    ([cx, cy, cs, cr, e]) => {
      if (e <= 0.001) {
        exitCardLatchRef.current = null;
        return mixUnit(cx, cardFinalRef.current.x, e);
      }
      const latch = latchExitCardPose(cx, cy, cs, cr);
      return mixUnit(latch.x, cardFinalRef.current.x, e);
    },
  );
  const phase3CardY = useTransform(
    [cardX, cardY, cardScale, cardRotate, exitT],
    ([cx, cy, cs, cr, e]) => {
      if (e <= 0.001) {
        exitCardLatchRef.current = null;
        return mixUnit(cy, cardFinalRef.current.y, e);
      }
      const latch = latchExitCardPose(cx, cy, cs, cr);
      return mixUnit(latch.y, cardFinalRef.current.y, e);
    },
  );
  const phase3CardScale = useTransform(
    [cardX, cardY, cardScale, cardRotate, exitT],
    ([cx, cy, cs, cr, e]) => {
      if (e <= 0.001) {
        exitCardLatchRef.current = null;
        return cs + (cardFinalRef.current.scale - cs) * e;
      }
      const latch = latchExitCardPose(cx, cy, cs, cr);
      return latch.scale + (cardFinalRef.current.scale - latch.scale) * e;
    },
  );
  const phase3CardRotate = useTransform(
    [cardX, cardY, cardScale, cardRotate, exitT],
    ([cx, cy, cs, cr, e]) => {
      if (e <= 0.001) {
        exitCardLatchRef.current = null;
        return cr + (cardFinalRef.current.rotate - cr) * e;
      }
      const latch = latchExitCardPose(cx, cy, cs, cr);
      return latch.rotate + (cardFinalRef.current.rotate - latch.rotate) * e;
    },
  );
  // On mobile, finish the card's TRAVEL to the slider slot before the opacity
  // cross-fade (0.92 → 1) so the card is already sitting still on the slider
  // when it hands off — no position jump at the swap. Desktop keeps the full
  // [0, 1] mapping (its tier row settles at phase4 = 1).
  // Blue card finishes its travel to the slot by phase4 ≈ 0.85 (both platforms),
  // so it has clearly "taken its place" before the other cards start dealing in.
  const phase4Pos = useTransform(phase4, (p) => Math.min(1, p / 0.85));
  const finalCardX = useTransform(
    [phase3CardX, phase4Pos],
    ([cx, p]) => mixUnit(cx, resolveCardTierSlot().x, p),
  );
  const finalCardY = useTransform(
    [phase3CardY, phase4Pos],
    ([cy, p]) => mixUnit(cy, resolveCardTierSlot().y, p),
  );
  const finalCardScale = useTransform(
    [phase3CardScale, phase4Pos],
    ([cs, p]) => cs + (resolveCardTierSlot().scale - cs) * p,
  );
  const finalCardRotate = useTransform(
    [phase3CardRotate, phase4Pos],
    ([cr, p]) => cr + (resolveCardTierSlot().rotate - cr) * p,
  );

  // Capture / clear the floating-Blue pose lock as the details overlay opens.
  // Must live AFTER finalCard* exist. Prevents scroll-up phase4 dips from
  // yanking Blue toward the Join Early corner for a frame.
  useMotionValueEvent(detailsT, "change", (dt) => {
    if (dt > 0.02 && !detailsFloatingPoseLockRef.current) {
      detailsFloatingPoseLockRef.current = {
        x: finalCardX.get(),
        y: finalCardY.get(),
        scale: finalCardScale.get(),
      };
    }
    if (dt < 0.001) {
      detailsFloatingPoseLockRef.current = null;
    }
  });

  const joinXDesktop = useTransform(exitT, [0, 1], ["-30vw", "0vw"]);
  // Mobile: park the panel fully off-canvas. -30vw still leaves most of the
  // full-width copy overlapping Benefits during the handoff.
  const joinXMobile = useTransform(exitT, [0, 1], ["-105vw", "0vw"]);
  const joinX = useTransform(
    [joinXDesktop, joinXMobile],
    ([d, m]) => (isMobile ? m : d),
  );
  const joinOutY = useTransform(phase4, [0, 1], ["0vh", "-40vh"]);
  // Join Early opacity:
  // - Desktop: hard gate (no enter fade) — slides in at full opacity.
  // - Mobile: stay invisible until Benefits has mostly exited, then fade in so
  //   the two full-width panels never stack as readable copy on top of each other.
  // Leave fade (phase4) is shared.
  // Desktop: fade Join Early in over the SECOND half of the exit, after Benefits
  // has cleared (above), so the two panels never sit at full opacity together.
  // It still slides in from the left over the whole exit (joinX); only the fade
  // is delayed. (Was a hard gate to full opacity the instant the exit began.)
  const joinOpacityEnterDesktop = useTransform(exitT, [0.5, 0.85], [0, 1]);
  const joinOpacityEnterMobile = useTransform(exitT, [0.42, 0.78], [0, 1]);
  // Leave-fade for "Join Early Earn More" during phase4 (→ Our Tiers).
  // Desktop: keep Join Early visible until the blue card nearly lands, then
  // hand off at tierGroupVisibility (phase4 ≥ 0.9).
  // Mobile: hide Join Early copy immediately so it never stacks with Our Tiers.
  const JOIN_EARLY_LEAVE_START = 0.75;
  const JOIN_EARLY_LEAVE_END = 0.9;
  const JOIN_EARLY_LEAVE_END_MOBILE = 0.1;
  // Opacity = enter gate × leave fade × overlay fade. `(1 - detailsT)` also
  // hides it if "View Details" is opened (same driver as the Our Tiers subtitle
  // fade above).
  const joinOpacity = useTransform(
    [joinOpacityEnterDesktop, joinOpacityEnterMobile, phase4, detailsT],
    ([desktopEnter, mobileEnter, p, d]) => {
      const enter = isMobileRef.current ? mobileEnter : desktopEnter;
      const leave = isMobileRef.current
        ? clamp01(1 - p / JOIN_EARLY_LEAVE_END_MOBILE)
        : clamp01(
            (JOIN_EARLY_LEAVE_END - p) /
              (JOIN_EARLY_LEAVE_END - JOIN_EARLY_LEAVE_START),
          );
      return enter * leave * (1 - d);
    },
  );
  // Mobile: keep Join under Benefits (z-20) until the handoff midpoint so
  // Benefits' opaque panel masks any residual Join glyphs.
  const joinPanelZIndex = useTransform([phase4, exitT], ([p, e]) => {
    if (isMobileRef.current) {
      if (e < 0.5) return 15;
      // Drop under Our Tiers as soon as leave starts.
      return p > 0.05 ? 10 : 28;
    }
    return p > 0.75 ? 10 : 25;
  });
  const joinVisibility = useTransform(joinOpacity, (o) =>
    o < 0.02 ? "hidden" : "visible",
  );
  const marqueeY = useTransform(exitT, [0, 1], ["20vh", "0vh"]);
  const marqueeOpacityIn = useTransform(exitT, [0.5, 1], [0, 1]);
  const marqueeOutY = useTransform(phase4, [0, 1], ["0vh", "30vh"]);
  const marqueeY2 = useTransform(
    [marqueeY, marqueeOutY],
    ([a, b]) => `${parseFloat(a) + parseFloat(b)}vh`,
  );
  const marqueeOpacity = useTransform(
    [marqueeOpacityIn, phase4],
    ([o, p]) => {
      // Mobile: kill marquee with Join Early text (no dual-step chrome).
      if (isMobileRef.current) {
        return o * clamp01(1 - p / JOIN_EARLY_LEAVE_END_MOBILE);
      }
      return o * (1 - p);
    },
  );

  // ── Benefits cards: staggered slide-in from the right (scroll-linked) ──────
  // Each item starts translated a little past the right edge, then slides left
  // to its resting x:0 as `t` advances. Windows step down top→bottom for a
  // small stagger. Opacity stays at 100% — motion only, no fade.
  // Linear mapping keeps the motion smooth — no bounce, no overshoot, no scale.
  const BENEFIT_ENTER_X = 80; // px start offset — "slightly outside" the right
  const c0x = useTransform(t, [0.28, 0.5], [BENEFIT_ENTER_X, 0]);
  const c1x = useTransform(t, [0.36, 0.58], [BENEFIT_ENTER_X, 0]);
  const c2x = useTransform(t, [0.44, 0.66], [BENEFIT_ENTER_X, 0]);
  const c3x = useTransform(t, [0.52, 0.74], [BENEFIT_ENTER_X, 0]);
  const benefitCardStyles = [
    { x: c0x, opacity: 1 },
    { x: c1x, opacity: 1 },
    { x: c2x, opacity: 1 },
    { x: c3x, opacity: 1 },
  ];

  // Mobile: the ENTIRE "Our Tiers" step (slider panel + the blue card) swipes up
  // as one unit into the join step, mirroring the join form sliding up from
  // below — a single cohesive swipe rather than the card moving on its own.
  // Exit is Y-only: do NOT fade opacity on early phase5 — ScrollTrigger scrub
  // noise / diagonal slider drags used to zero text at phase5≈0.08 and look like
  // the step "disappeared" while still on Our Tiers.
  // Non-blue leave (scroll-up → Join Early): also swipe DOWN via phase4, same
  // panel motion as Join → Our Tiers on scroll-up (`joinSwipeOpts`).
  const mobileTiersSwipeY = useTransform(
    [phase5, phase4, ourTiersSwipeDownLeave],
    ([p5, p4, leave]) => {
      const joinUp = -100 * clamp01(p5);
      if (leave > 0.5) return `${joinUp + (1 - p4) * 100}vh`;
      return `${joinUp}vh`;
    },
  );

  // Join step swipe — phase5 clock (synced with tier-row / mobile tiers exit).
  // Full-panel swap like the hero → second-section handoff: Our Tiers exits
  // upward, Join enters from below as one opaque block (title + form together).
  const joinFormTitleY = useTransform(phase5, [0, 1], ["100vh", "0vh"]);
  const joinFormCardY = useTransform(phase5, [0, 1], ["100vh", "0vh"]);
  const joinFormOpacity = useTransform(phase5, (v) => (v > 0.001 ? 1 : 0));
  const joinFormVisibility = useTransform(phase5, (v) =>
    v > 0.001 ? "visible" : "hidden",
  );
  const joinStepPointer = useTransform(phase5, (v) => (v > 0.5 ? "auto" : "none"));
  const joinBackdropOpacity = useTransform(phase5, [0, 0.35, 1], [0, 1, 1]);
  // Write-on settles only once the swipe finishes (phase5 ≈ 1).
  const joinSwipeSettle = phase5;

  // ── Floating blue card AS the slider's blue item (mobile) ──────────────────
  // Instead of cross-fading the floating card into a separate slider card, the
  // floating card stays the blue visual and behaves like the slider's blue
  // slide: it follows the slider's horizontal drag and scales/fades like a side
  // card when another tier is active. `blueSlotOffset` is the live px offset of
  // the slider's blue slot from centre (written by the slider); the scale/
  // opacity factors mirror the slider's per-distance styling, animated on the
  // active-index change to match the slider's own tween.
  const blueSlotOffset = useMotionValue(0);
  const blueScaleFactor = useMotionValue(1);
  const blueOpacityFactor = useMotionValue(1);
  useEffect(() => {
    // Match the slider's own side-card tween so the floating blue card doesn't
    // lag / desync when the active index changes.
    const sf = sliderActive === 0 ? 1 : sliderActive === 1 ? 0.82 : 0.74;
    // Keep side-card opacity at 1 — matches the horizontal slider (no fade).
    const of = 1;
    const tween = { duration: 0.6, ease: EASE };
    const c1 = animate(blueScaleFactor, sf, tween);
    const c2 = animate(blueOpacityFactor, of, tween);
    return () => { c1.stop(); c2.stop(); };
  }, [sliderActive, blueScaleFactor, blueOpacityFactor]);

  // Floating card's mobile transform = its phase pose PLUS the live slider-slot
  // offset (gated by phase4 so it only follows once landed on the slider), and
  // its scale/opacity multiplied by the slider side-card factors.
  const mobileFollowX = useTransform(
    [finalCardX, blueSlotOffset, phase4, ourTiersSwipeDownLeave],
    ([fx, off, p4, leave]) => {
      const vw = (typeof window !== "undefined" ? window.innerWidth : 375) / 100;
      if (leave > 0.5) {
        const lockFx = leaveCardXLockRef.current ?? parseFloat(fx);
        const lockOff = leaveSlotOffLockRef.current ?? off;
        return `${lockFx + lockOff / vw}vw`;
      }
      return `${parseFloat(fx) + (off * p4) / vw}vw`;
    },
  );
  // Slider side-card scale/opacity only after the blue card has landed on Our
  // Tiers. Applying them during Benefits → Join Early lets slider mount/active
  // callbacks animate the floating card and reads as flicker on mobile.
  const mobileFollowScale = useTransform(
    [finalCardScale, blueScaleFactor, phase4, ourTiersSwipeDownLeave],
    ([s, f, p4, leave]) => {
      if (leave > 0.5) return leaveScaleLockRef.current ?? s * f;
      return p4 < 0.85 ? s : s * f;
    },
  );
  // The slider's own blue card is a transparent placeholder (the floating card
  // is the visual), so its reveal is permanently 0.
  const mobileFirstCardReveal = useMotionValue(0);

  const mobileTiersOpacity = useTransform(
    [phase4, ourTiersSwipeDownLeave],
    ([p4, leave]) => (leave > 0.5 ? 1 : clamp01(p4)),
  );
  const blueCardOpacityMobile = useTransform(
    [blueOpacityFactor, detailsT, phase4, ourTiersSwipeDownLeave],
    ([e, dt, p4, leave]) => {
      // Swipe-down leave: keep the side-card visible until it's off-screen, then
      // hide so clearing the leave lock can land on Join Early without a Y jump.
      if (leave > 0.5) return p4 > 0.2 ? 1 : 0;
      if (dt > 0.001 && activeTabRef.current !== 0) return 0;
      // Keep slider side-card opacity; Join exit is the shared phase5 Y swipe.
      if (p4 < 0.85) return 1;
      return e;
    },
  );
  // Slider + floating blue card stay non-interactive until the blue card has
  // finished travelling into its slot (phase4 ≥ 0.9 — same as the row reveal).
  // Keep pointers live until Join is clearly underway (not tiny scrub noise).
  const mobileTiersPointer = useTransform(
    [phase4, phase5],
    ([p4, p5]) => (p4 >= 0.9 && p5 < 0.5 ? "auto" : "none"),
  );
  const blueCardPointer = useTransform(
    [phase4, phase5],
    ([p4, p5]) => (p4 >= 0.9 && p5 < 0.5 ? "auto" : "none"),
  );
  // These combine the phase-4 (Our Tiers reveal) and phase-5 (Join fade) curves.
  // They are computed DIRECTLY from the phase4/phase5 motion values rather than
  // from the intermediate `tierRowOpacity`/`tiersFadeOut`/… transforms. Chaining
  // a useTransform off another derived useTransform can go stale across the
  // details overlay's mount/unmount — leaving the tier row + title stuck visible
  // on the wrong step (e.g. bleeding onto the "Tiers and Benefits" intro). Direct
  // subscriptions to the source motion values stay live.
  const clamp01Local = clamp01;
  // Title/subtitle/button reach full opacity BEFORE the group is revealed
  // (visibility flips at phase4 ≥ 0.9), so nothing is ever seen mid-fade — the
  // group simply appears in place once the blue card has landed.
  const tiersTitleCombinedOpacity = useTransform(
    phase4,
    (p4) => clamp01Local((p4 - 0.2) / 0.65),
  );
  const tiersSubtitleCombinedOpacity = tiersTitleCombinedOpacity;
  // Our Tiers ↔ Join: swipe up as one block (phase5 Y only — no fade-out on exit).
  const tiersDesktopRevealOpacity = useTransform(
    phase4,
    (p4) => clamp01Local((p4 - 0.3) / 0.55),
  );
  // The group rises into place from +20vh, but stays hidden
  // (`tierGroupVisibility`) until phase4 ≥ 0.9. Finish that rise by 0.85 — the
  // same point the blue card lands (`phase4Pos`) — so the whole slide happens
  // WHILE HIDDEN and the group (with the blue card's landing slot) is already
  // STATIONARY when the cards are revealed. Nothing, including the blue card
  // that hands off into this row, keeps moving after the cards are on screen.
  const tiersDesktopSwipeY = useTransform(
    [phase4, phase5],
    ([p4, p5]) =>
      `${20 * (1 - clamp01Local(p4 / 0.85)) + -100 * clamp01Local(p5)}vh`,
  );
  const tierRowCombinedOpacity = tiersDesktopRevealOpacity;
  const tierRowCombinedY = tiersDesktopSwipeY;
  // The Our Tiers group (title + cards + subtitle + CTA) stays fully HIDDEN — via
  // visibility, NOT opacity — until the blue card has taken its place, then it
  // appears with no fade. Cards then rise in individually (GSAP). Kept visible
  // through the whole Our Tiers ↔ Join stay (phase4 pinned at 1 across phase5).
  const tierGroupVisibility = useTransform(phase4, (p4) =>
    p4 >= 0.9 ? "visible" : "hidden",
  );
  const ourTiersTitleOpacity = useTransform(
    [detailsT, tiersTitleCombinedOpacity, phase5],
    ([dt, phaseOp, p5]) => (p5 > 0.001 ? phaseOp : dt > 0.001 ? 1 : phaseOp),
  );
  const ourTiersSubtitleOpacity = useTransform(
    [detailsT, tiersSubtitleCombinedOpacity],
    ([dt, phaseOp]) => (dt > 0.001 ? Math.max(0, 1 - dt) : phaseOp),
  );
  const detailsPanelOpacity = useTransform(detailsT, (dt) => {
    if (dt <= 0.15) return 0;
    if (dt >= 1) return 1;
    return (dt - 0.15) / 0.85;
  });
  const detailsPanelVisibility = useTransform(
    [detailsT, phase5],
    ([dt, p5]) => (dt > 0.04 && p5 < 0.12 ? "visible" : "hidden"),
  );
  const detailsGroupZCombined = useTransform(
    [detailsT, phase5, phase4],
    ([t, p5, p4]) => {
      if (p5 > 0.05) return 10;
      // Above TierDetailsOverlay (z-36) so carousel cards receive taps; the
      // row root stays pointer-events-none so tab/label clicks still pass
      // through to the overlay on the left.
      if (t > 0.001) return 38;
      // Our Tiers rest: sit above Benefits (22) / Join Early so card slots
      // win hit-testing on tablet (Benefits is full-bleed there).
      if (p4 >= 0.9) return 40;
      return 10;
    },
  );
  const tierLabelOpacity = useTransform(detailsT, [0, 0.12], [1, 0]);
  const memberButtonOpacity = useTransform(
    [tierRowCombinedOpacity, detailsButtonOpacity],
    ([row, det]) => row * det,
  );
  // Floating Blue stays visible for the whole details stay (center or peek).
  // Hiding it on non-Blue tabs left a one-frame hole at center (white flash)
  // before Silver/Gold finished morphing in.
  const floatingDesktopOpacity = useMotionValue(1);
  // Follow Blue morph z-index while details are open so a peek Blue sits under
  // the active center card (was hard-coded z-60 and covered the active tier).
  const floatingDesktopZ = useTransform(
    [detailsT, tm0z],
    ([dt, z]) => (dt > 0.15 ? z : 60),
  );
  // The tier-detail carousel morph (tm0*) is measured RELATIVE to the card's
  // landed slot, so it may only be composed onto the floating card while the card
  // is actually sitting in that slot — i.e. once it has fully landed
  // (phase4 ≥ 0.85, where phase4Pos saturates). Without this gate, scrolling back
  // up with Blue active lets a still-closing carousel morph (large tm0s / tm0x)
  // multiply/offset the card's fly-back pose (finalCard*, which grows as phase4
  // drops) into a giant, mis-placed card on the right — the reverse-transition
  // bug. Below 0.85 the card is in flight and uses its clean pose only.
  //
  // While the overlay is open (detailsT high), ALWAYS keep morph handoff on —
  // Blue is the continuous floating element for center AND peek poses. A
  // one-frame phase4 dip from scroll-up must not scrub toward Join Early.
  const morphBlueHandoffActive = useTransform(
    [detailsT, tm0x, tm0y, tm0s, phase4],
    ([dt, mx, my, ms, p4]) =>
      dt > 0.15 ||
      (p4 >= 0.85 &&
        (dt > 0.001 ||
          Math.abs(mx) > 0.0001 ||
          Math.abs(my) > 0.0001 ||
          Math.abs(ms - 1) > 0.0001)),
  );
  const floatingDesktopXCombined = useTransform(
    [finalCardX, tierCardX0, morphBlueHandoffActive, detailsT],
    ([fx, mx, handoff, dt]) => {
      const base =
        dt > 0.15 && detailsFloatingPoseLockRef.current
          ? detailsFloatingPoseLockRef.current.x
          : fx;
      if (dt > 0.15 || handoff) {
        return `${parseFloat(base) + parseFloat(mx)}vw`;
      }
      return fx;
    },
  );
  const floatingDesktopYCombined = useTransform(
    [finalCardY, tierCardY0, morphBlueHandoffActive, detailsT],
    ([fy, my, handoff, dt]) => {
      const base =
        dt > 0.15 && detailsFloatingPoseLockRef.current
          ? detailsFloatingPoseLockRef.current.y
          : fy;
      if (dt > 0.15 || handoff) {
        return `${parseFloat(base) + parseFloat(my)}vh`;
      }
      return fy;
    },
  );
  const floatingDesktopYFinal = useTransform(
    [floatingDesktopYCombined, finalCardY, morphBlueHandoffActive, detailsT],
    ([combined, fy, handoff, dt]) =>
      dt > 0.15 || handoff ? combined : fy,
  );
  // Match tier-row phase5 swipe without reparenting the card (avoids mid-morph flash).
  const floatingDesktopSwipeOffsetY = useTransform(
    phase5,
    (p5) => -100 * clamp01Local(p5),
  );
  const floatingDesktopYWithSwipe = useTransform(
    [floatingDesktopYFinal, floatingDesktopSwipeOffsetY],
    ([y, offsetVh]) => `${parseFloat(y) + offsetVh}vh`,
  );
  // Mobile join swipe: keep the floating card on the same phase5 Y track as the
  // slider panel so Our Tiers ↔ Join is one upward/downward swipe (no remount jump).
  // Non-blue Our Tiers leave: freeze Y at leave-start and add the same downward
  // panel travel Join uses when scrolling back to Our Tiers.
  const blueCardMobileSwipeY = useTransform(
    phase5,
    (p5) => -100 * clamp01Local(p5),
  );
  const blueCardExitYMobile = useTransform(
    [finalCardY, blueCardMobileSwipeY, phase4, ourTiersSwipeDownLeave],
    ([fy, swipeY, p4, leave]) => {
      if (leave > 0.5) {
        const lock = leaveCardYLockRef.current ?? parseFloat(fy);
        return `${lock + (1 - p4) * 100 + swipeY}vh`;
      }
      return `${parseFloat(fy) + swipeY}vh`;
    },
  );

  beginOurTiersSwipeDownLeaveRef.current = () => {
    if (!isMobileRef.current || sliderActiveRef.current === 0) return false;
    if (ourTiersSwipeDownLeaveRef.current) return true;
    leaveCardYLockRef.current = parseFloat(finalCardY.get());
    leaveCardXLockRef.current = parseFloat(finalCardX.get());
    leaveSlotOffLockRef.current = blueSlotOffset.get();
    leaveScaleLockRef.current =
      parseFloat(finalCardScale.get()) * blueScaleFactor.get();
    ourTiersSwipeDownLeaveRef.current = true;
    ourTiersSwipeDownLeave.set(1);
    return true;
  };
  endOurTiersSwipeDownLeaveRef.current = () => {
    if (!ourTiersSwipeDownLeaveRef.current) return;
    ourTiersSwipeDownLeaveRef.current = false;
    ourTiersSwipeDownLeave.set(0);
    leaveCardYLockRef.current = null;
    leaveCardXLockRef.current = null;
    leaveSlotOffLockRef.current = null;
    leaveScaleLockRef.current = null;
    sliderActiveRef.current = 0;
    setSliderActive(0);
    setSliderResetKey((k) => k + 1);
  };
  const floatingDesktopScaleCombined = useTransform(
    [finalCardScale, tm0s, morphBlueHandoffActive, detailsT],
    ([fs, ms, handoff, dt]) => {
      const base =
        dt > 0.15 && detailsFloatingPoseLockRef.current
          ? detailsFloatingPoseLockRef.current.scale
          : fs;
      if (dt > 0.15 || handoff) return base * ms;
      return fs;
    },
  );
  const [floatingBlueScale, setFloatingBlueScale] = useState(1);
  useMotionValueEvent(floatingDesktopScaleCombined, "change", (v) => {
    if (isMobile) return;
    setFloatingBlueScale(typeof v === "number" && v > 0 ? v : 1);
  });
  useMotionValueEvent(mobileFollowScale, "change", (v) => {
    if (!isMobile) return;
    setFloatingBlueScale(typeof v === "number" && v > 0 ? v : 1);
  });
  useEffect(() => {
    const mv = isMobile ? mobileFollowScale : floatingDesktopScaleCombined;
    const v = mv.get();
    setFloatingBlueScale(typeof v === "number" && v > 0 ? v : 1);
  }, [isMobile, mobileFollowScale, floatingDesktopScaleCombined]);
  const detailsPanelPointer = useTransform(
    [detailsT, phase5],
    ([t, p5]) => (t > 0.85 && p5 < 0.1 ? "auto" : "none"),
  );

  useEffect(() => () => { t.stop(); exit.stop(); phase4.stop(); phase5.stop(); }, [t, exit, phase4, phase5]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;

    // ── Step model ───────────────────────────────────────────────────────────
    // The section is a 5-step flow. Each step has ONE canonical rest position
    // (scroll-progress 0..1). The index IS the step number, so navigation is a
    // simple `step ± 1` — never a threshold search — which makes forward and
    // backward scroll perfectly symmetric and impossible to skip.
    //   0: "Tiers and Benefits" intro
    //   1: "Benefits that matter to you"
    //   2: "Join Early Earn More"
    //   3: "Our Tiers" (desktop tier row / mobile horizontal-card slider)
    //   4: "Join" form
    // These rests match the NAV_LINKS progress values so header links, the snap
    // handler and the phase animations all agree on where each step sits.
    const STEP_REST = TIERS_STEP_REST;
    // Default step snaps use ease-out; Join uses the hero handoff curve.
    const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3);
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let rafId = null;
    let wheelAccum = 0;
    let wheelSettleTimer = null;
    let touchAccumDy = 0;
    let pendingFlushTimer = null;
    let touchOnInteractive = false;
    const isInteractiveTouchTarget = (target) =>
      Boolean(
        target?.closest?.(
          'button, a[href], input, textarea, select, label, [role="button"], .cham-marquee, [data-title-dropdown], [data-title-dropdown-menu]',
        ),
      );

    const isLocked = () => performance.now() < (window.__scrollLockUntil ?? 0);
    const isBusy = () =>
      isAnimatingRef.current || isLocked() || tierSpinBusyRef.current;
    window.__chamMilesStepBusy = isBusy;

    const lockStep = (lockMs = STEP_TRANSITION_LOCK_MS) => engageStepLockRef.current(lockMs);

    // Residual settle locks (hero handoff, CTA arrival) used to leave isBusy()
    // true while xs–lg wheel/touch preventDefault — so the page froze. Clear
    // soft locks before a new step gesture, but never interrupt a live snap/spin.
    const clearSoftBusyForStepGesture = () => {
      if (scrollSnapAnimatingRef.current || tierSpinBusyRef.current) return;
      if (performance.now() < (tierEntranceLockUntilRef.current ?? 0)) return;
      isAnimatingRef.current = false;
      if (typeof window !== "undefined") {
        window.__scrollLockUntil = performance.now();
      }
      if (stepReleaseTimerRef.current) {
        clearTimeout(stepReleaseTimerRef.current);
        stepReleaseTimerRef.current = null;
      }
    };

    const progressToY = (p) => {
      const rect = el.getBoundingClientRect();
      const containerTop = getScrollTop() + rect.top;
      const scrollable = el.offsetHeight - getViewportHeight();
      return containerTop + Math.max(0, Math.min(1, p)) * scrollable;
    };

    const currentProgress = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - getViewportHeight();
      if (scrollable <= 0) return 0;
      return Math.max(0, Math.min(1, -rect.top / scrollable));
    };

    const snapDurationMs = () => {
      // xl+ free scrub uses desktop CTA snap pace when a programmatic snap runs.
      if (!shouldStepSnapRef.current) return DESKTOP_SNAP_DURATION_MS;
      // Phone + tablet / iPad: shared deliberate glide (blue card + step copy).
      if (isTabletUiRef.current || isMobileRef.current) {
        return TABLET_SNAP_DURATION_MS;
      }
      // lg mouse under 1280: keep the shorter CTA-paced snap.
      return Math.min(DESKTOP_SNAP_DURATION_MS, 720);
    };

    const scrollStepLockMs = () => snapDurationMs() + transitionDurationRef.current * 1000 + 120;

    const stepLockMs = () => scrollStepLockMs();

    const syncStepIndexFromProgress = () => {
      const idx = progressToStepIndex(currentProgress());
      stepIndexRef.current = idx;
      return idx;
    };

    // Gate freewheel into Join until cards have landed and a discrete swipe
    // (or CTA) starts the handoff — same idea as the hero swipe gate.
    const OUR_TIERS_HOLD = STEP_REST[3];
    const shouldBlockScrollDownToJoin = () => {
      if (allowJoinScrollRef.current) return false;
      // Wait until the blue card / tier row has finished settling.
      if (!blueCardLandedRef.current) return false;
      const p = currentProgress();
      if (p < OUR_TIERS_HOLD - 0.012) return false;
      if (p >= JOIN_STEP_SCROLL_END - 0.02) return false;
      return true;
    };

    const atJoinRest = () => currentProgress() >= JOIN_STEP_SCROLL_END - 0.02;

    const animateScrollTo = (
      targetY,
      onComplete,
      { targetProgress, syncPhases, durationMs, easeFn, lockMs: lockMsOpt } = {},
    ) => {
      // Scroll-driven phases during the snap (mobile + desktop CTAs / wheel).
      const resolvedSync = syncPhases ?? "scroll";
      // Phone + tablet: ease-in-out so card + panels accelerate/decelerate with
      // the scroll. xl+ / lg mouse CTAs keep ease-out (snappier settle).
      const ease =
        easeFn ??
        (isTabletUiRef.current || isMobileRef.current
          ? easeInOutCubic
          : easeOutCubic);

      const finishPhaseSync = (animated, progress = targetProgress) => {
        if (progress == null) return;
        applyPhaseFromProgressRef.current?.(progress, {
          animated,
          syncStepIndex: true,
        });
      };

      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      const startY = getScrollTop();
      const delta = targetY - startY;
      if (Math.abs(delta) < 2) {
        if (targetProgress != null) {
          finishPhaseSync(true, targetProgress);
        } else if (resolvedSync !== "scroll") {
          finishPhaseSync(resolvedSync !== "start");
        }
        suppressProgressPhaseSyncRef.current = false;
        scrollSnapAnimatingRef.current = false;
        onComplete?.();
        tryCompleteStepTransitionRef.current?.();
        return true;
      }

      const resolvedDuration = durationMs ?? snapDurationMs();
      // Join swipe uses a short lock (swipe only) so title write-on does not
      // keep isBusy()/__scrollLockUntil blocking scroll afterward.
      // xs–lg step snaps: lock only for the scroll animation (+small settle), not
      // the full phase DURATION — a 2.6s lock made the page feel frozen.
      const defaultLockMs = shouldStepSnapRef.current
        ? resolvedDuration + 180
        : Math.max(stepLockMs(), resolvedDuration + 400);
      const lockMs =
        (typeof lockMsOpt === "number" ? lockMsOpt : defaultLockMs) +
        (isIosMobileSafari() && delta < 0 ? 420 : 0);
      lockStep(lockMs);
      scrollSnapAnimatingRef.current = true;

      if (resolvedSync === "scroll") {
        // Drive phases directly from the snap. On iPad the document is locked and
        // scroll lives on `#cham-scroll-root`; if ScrollTrigger is still bound to
        // `window`, scrub never fires and step snaps look frozen (e.g. stuck on
        // "Tiers and Benefits"). Always write phases here as the source of truth.
        // Also suppress ScrollTrigger scrub onUpdate for this window — otherwise
        // it double-writes phases a frame behind and the blue card flickers.
        suppressProgressPhaseSyncRef.current = true;
        const startP = currentProgress();
        const endP =
          typeof targetProgress === "number" ? targetProgress : startP;
        const startT = performance.now();
        const step = (now) => {
          const k = Math.min(1, (now - startT) / resolvedDuration);
          const eased = ease(k);
          scrollPortTo(startY + delta * eased);
          if (typeof targetProgress === "number") {
            applyPhaseFromProgressRef.current?.(startP + (endP - startP) * eased, {
              animated: false,
              syncStepIndex: false,
            });
          }
          if (k < 1) rafId = requestAnimationFrame(step);
          else {
            rafId = null;
            // Land exactly — do NOT reopen ScrollTrigger phase writes yet.
            // scrub:1 is still catching up; clearing suppress here lets it
            // overwrite the rest pose for a frame → blue card end-flicker.
            scrollPortTo(startY + delta);
            if (typeof targetProgress === "number") {
              finishPhaseSync(false, targetProgress);
            }
            snapChamMilesScrollScrub();
            if (typeof targetProgress === "number") {
              finishPhaseSync(false, targetProgress);
            }
            onComplete?.();
            requestAnimationFrame(() => {
              if (typeof targetProgress === "number") {
                finishPhaseSync(false, targetProgress);
              }
              snapChamMilesScrollScrub();
              scrollSnapAnimatingRef.current = false;
              suppressProgressPhaseSyncRef.current = false;
              tryCompleteStepTransitionRef.current?.();
            });
          }
        };
        rafId = requestAnimationFrame(step);
        return true;
      }

      suppressProgressPhaseSyncRef.current = true;

      if (resolvedSync === "start" && targetProgress != null) {
        finishPhaseSync(true);
      }

      scrollSnapAnimatingRef.current = true;
      const startT = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - startT) / resolvedDuration);
        scrollPortTo(startY + delta * ease(k));
        if (k < 1) rafId = requestAnimationFrame(step);
        else {
          rafId = null;
          scrollSnapAnimatingRef.current = false;
          if (resolvedSync === "end") {
            finishPhaseSync(true, currentProgress());
          }
          suppressProgressPhaseSyncRef.current = false;
          onComplete?.();
          tryCompleteStepTransitionRef.current?.();
        }
      };
      rafId = requestAnimationFrame(step);
      return true;
    };

    const joinSwipeOpts = () => {
      const ms =
        isTabletUiRef.current || isMobileRef.current
          ? TABLET_JOIN_SWIPE_DURATION_MS
          : JOIN_SWIPE_DURATION_MS;
      return {
        durationMs: ms,
        easeFn: easeInOutCubic,
        // Lock only for the panel swipe — do not also wait out DURATION (1.4s)
        // from stepLockMs, or Join title typing feels like a scroll freeze.
        lockMs: ms + 120,
      };
    };

    const clearJoinArrivalBusy = () => {
      // Title write-on / subtitle fade may still be playing; scroll must work.
      isAnimatingRef.current = false;
      scrollSnapAnimatingRef.current = false;
      if (typeof window !== "undefined") {
        window.__scrollLockUntil = performance.now();
      }
      if (stepReleaseTimerRef.current) {
        clearTimeout(stepReleaseTimerRef.current);
        stepReleaseTimerRef.current = null;
      }
    };

    const snapToProgress = (targetProgress, { force = false, syncPhases = "scroll" } = {}) => {
      if (isBusy()) {
        if (force) queuePendingStep(targetProgress > currentProgress() ? 1 : -1);
        return false;
      }
      const goingToJoin =
        Math.abs(targetProgress - JOIN_STEP_SCROLL_END) < 0.006;
      const leavingJoin =
        !goingToJoin &&
        atJoinRest() &&
        targetProgress <= OUR_TIERS_HOLD + 0.01;
      if (detailsActiveRef.current && !goingToJoin) return false;
      if (goingToJoin) {
        const p = currentProgress();
        const cur = syncStepIndexFromProgress();
        const canLeaveOurTiers =
          cur === 3 ||
          (blueCardLandedRef.current &&
            p >= OUR_TIERS_HOLD - 0.02 &&
            p < JOIN_STEP_SCROLL_END - 0.02);
        if (!canLeaveOurTiers) return false;
      }
      clearPendingScrollGesturesRef.current?.();
      const targetIdx = stepIndexFromNavProgress(targetProgress);
      const arrivingOurTiers =
        !goingToJoin && Math.abs(targetProgress - OUR_TIERS_HOLD) < 0.006;
      animateScrollTo(
        progressToY(targetProgress),
        () => {
          stepIndexRef.current = targetIdx;
          if (goingToJoin) {
            allowJoinScrollRef.current = false;
            clearJoinArrivalBusy();
          }
          if (arrivingOurTiers) {
            const restY = progressToY(OUR_TIERS_HOLD);
            ourTiersRestYRef.current = restY;
            if (tierSpinBusyRef.current) tierSpinHoldYRef.current = restY;
            scrollPortTo(restY);
            snapChamMilesScrollScrub();
            applyPhaseFromProgressRef.current?.(OUR_TIERS_HOLD);
          }
        },
        {
          targetProgress,
          syncPhases,
          ...(goingToJoin || leavingJoin ? joinSwipeOpts() : null),
        },
      );
      return true;
    };
    snapToProgressRef.current = snapToProgress;

    // Swipe into Join — scroll straight to the panel handoff. The tier cards do
    // NOT flip/rotate-out on the way (the leave spin is intentionally skipped).
    const advanceToJoin = () => {
      // Hold until the Our Tiers cards have taken their places + rotated (covers
      // the "Become a Member" CTA click, not just wheel/touch).
      if (
        tierSpinBusyRef.current ||
        performance.now() < tierEntranceLockUntilRef.current
      )
        return;
      // Let an in-flight programmatic snap finish, but otherwise clear the
      // lingering arrival settle-lock (isAnimatingRef + __scrollLockUntil stay set
      // ~2.6s after landing on Our Tiers) so the FIRST tiny scroll-down swipes to
      // Join immediately instead of being queued behind isBusy() until it lapses.
      if (scrollSnapAnimatingRef.current) return;
      isAnimatingRef.current = false;
      if (typeof window !== "undefined") {
        window.__scrollLockUntil = performance.now();
      }
      allowJoinScrollRef.current = true;
      snapToProgressRef.current?.(JOIN_STEP_SCROLL_END, { force: true });
    };
    advanceToJoinRef.current = advanceToJoin;

    // Move exactly ONE step in `direction` (+1 = down/next, -1 = up/prev).
    // `force` queues one adjacent step if a transition is still running
    // (desktop / CTA only — step-snap scroll never queues; see commit*Gesture).
    const snapNext = (direction, { force = false } = {}) => {
      if (isBusy()) {
        if (force) queuePendingStep(direction);
        return false;
      }
      if (detailsActiveRef.current) return false;
      const cur = syncStepIndexFromProgress();
      const target = Math.max(0, Math.min(STEP_REST.length - 1, cur + direction));
      if (target === cur) return false;
      // Our Tiers → Join: scroll down swipes into the Join section (same movement
      // as the "Become a Member" CTA) rather than snapping a plain step.
      if (cur === 3 && direction > 0) {
        advanceToJoin();
        return false;
      }
      if (cur === 3 && direction < 0) {
        forceCloseDetailsRef.current?.();
      }
      if (target === 3) {
        allowJoinScrollRef.current = false;
      }
      clearPendingScrollGesturesRef.current?.();
      // Drop any stale queued step so a prior flick cannot chain after this snap.
      pendingStepDirectionRef.current = 0;
      const targetProgress = STEP_REST[target];
      const leavingJoin = cur === 4 && direction < 0;
      // Our Tiers → Join Early with a non-blue slider card: same swipe-down
      // timing/ease as Join → Our Tiers (scroll-up), plus panel Y leave.
      const leavingOurTiersNonBlue =
        cur === 3 &&
        direction < 0 &&
        beginOurTiersSwipeDownLeaveRef.current?.();
      const arrivingOurTiers = target === 3;
      // Publish the target index immediately so a second gesture mid-snap
      // queues against the destination step, not the departure rest.
      stepIndexRef.current = target;
      // Kill trackpad inertia so one flick cannot chain Our Tiers → … → hero.
      wheelAccum = 0;
      touchAccumDy = 0;
      if (wheelSettleTimer) {
        clearTimeout(wheelSettleTimer);
        wheelSettleTimer = null;
      }
      animateScrollTo(
        progressToY(targetProgress),
        () => {
          stepIndexRef.current = target;
          if (leavingOurTiersNonBlue) {
            endOurTiersSwipeDownLeaveRef.current?.();
          }
          if (arrivingOurTiers) {
            // Land exactly on the rest and kill scrub catch-up so the entrance
            // spin never freezes a mid-snap Y or creeps scroll by a few px.
            const restY = progressToY(OUR_TIERS_HOLD);
            ourTiersRestYRef.current = restY;
            if (tierSpinBusyRef.current) tierSpinHoldYRef.current = restY;
            scrollPortTo(restY);
            snapChamMilesScrollScrub();
            applyPhaseFromProgressRef.current?.(OUR_TIERS_HOLD);
          }
        },
        {
          targetProgress,
          syncPhases: "scroll",
          ...(leavingJoin || leavingOurTiersNonBlue ? joinSwipeOpts() : null),
        },
      );
      return true;
    };
    snapNextRef.current = snapNext;

    const commitWheelGesture = () => {
      wheelSettleTimer = null;
      const net = wheelAccum;
      wheelAccum = 0;
      if (Math.abs(net) < WHEEL_GESTURE_THRESHOLD) return;
      // Never step-snap away from Join (esp. scroll-up) while a form dropdown
      // is open — even if a prior tick slipped into the accumulator.
      if (isTitleDropdownScrollLocked()) return;

      // Phone / tablet / lg step-snap: one gesture → one step. While a snap is
      // in flight, ignore further wheel ticks (do NOT queue) so multi-scroll
      // cannot chain Benefits → Join Early → Our Tiers in one flick.
      if (shouldStepSnapRef.current) {
        if (isBusy()) {
          pendingStepDirectionRef.current = 0;
          return;
        }
        if (shouldBlockScrollDownToJoin() && net > 0) {
          advanceToJoin();
          return;
        }
        if (net < 0 && atTiersIntroStep()) {
          swipeBackToHero();
          return;
        }
        const started = snapNext(net > 0 ? 1 : -1);
        if (!started) scrollPortBy(Math.sign(net) * Math.min(Math.abs(net), 80));
        return;
      }

      clearSoftBusyForStepGesture();

      if (isBusy()) {
        // Do not queue an upward step while already at intro — that used to
        // flush into swipeBackToHero after the in-flight snap finished.
        if (net < 0 && atTiersIntroStep()) return;
        if (!shouldBlockScrollDownToJoin() || net < 0) {
          queuePendingStep(net > 0 ? 1 : -1);
          scheduleFlushPendingStep();
        }
        return;
      }
      if (shouldBlockScrollDownToJoin() && net > 0) {
        advanceToJoin();
        return;
      }
      if (net < 0 && atTiersIntroStep()) {
        swipeBackToHero();
        return;
      }
      const started = snapNext(net > 0 ? 1 : -1);
      // Never leave the gesture swallowed: if snap refused, nudge scroll so
      // Continuous scrub can still move the section.
      if (!started) scrollPortBy(Math.sign(net) * Math.min(Math.abs(net), 80));
    };

    // At most ONE step is queued while a transition runs — latest intent wins.
    const queuePendingStep = (direction) => {
      if (direction === 0) return;
      pendingStepDirectionRef.current = direction;
    };

    const flushPendingStepSnap = () => {
      if (tierSpinBusyRef.current) return;
      const dir = pendingStepDirectionRef.current;
      if (dir === 0) return;
      clearSoftBusyForStepGesture();
      if (isBusy()) return;
      pendingStepDirectionRef.current = 0;
      // Queued trackpad/touch inertia must NEVER leave the tiers section.
      // Only a live upward gesture at the intro rest may swipe back to the hero
      // (see commitWheelGesture / commitTouchGesture / consumeHeroReverseScroll).
      if (dir < 0 && atTiersIntroStep()) {
        return;
      }
      if (shouldBlockScrollDownToJoin() && dir > 0) {
        advanceToJoin();
        return;
      }
      snapNext(dir, { force: true });
    };

    const scheduleFlushPendingStep = () => {
      if (pendingFlushTimer) clearTimeout(pendingFlushTimer);
      const attempt = () => {
        pendingFlushTimer = null;
        if (pendingStepDirectionRef.current === 0) return;
        clearSoftBusyForStepGesture();
        if (isBusy()) {
          pendingFlushTimer = setTimeout(attempt, PENDING_STEP_FLUSH_RETRY_MS);
          return;
        }
        flushPendingStepSnap();
      };
      attempt();
    };
    flushPendingStepSnapRef.current = scheduleFlushPendingStep;

    const scheduleWheelCommit = () => {
      if (wheelSettleTimer) clearTimeout(wheelSettleTimer);
      const delay =
        Math.abs(wheelAccum) >= WHEEL_GESTURE_THRESHOLD
          ? WHEEL_COMMIT_SETTLE_MS
          : WHEEL_GESTURE_SETTLE_MS;
      wheelSettleTimer = setTimeout(commitWheelGesture, delay);
    };

    const inSection = () => {
      const rect = el.getBoundingClientRect();
      const vh = getViewportHeight();
      if (vh <= 0) return false;
      // Allow a few px of slack at the hero handoff; the outer track can sit
      // slightly below the scroll-port top before the sticky panel pins.
      return rect.top <= 8 && rect.bottom > vh * 0.5;
    };

    // Step 0 is the tiers intro ("Tiers and Benefits"). Scrolling up from there
    // exits to the hero above via a discrete reverse swipe (same duration/easing
    // as hero → tiers).
    //
    // NEVER trust stepIndex alone — trackpad inertia can queue several -1 snaps
    // (Our Tiers → Join Early → Benefits → Intro) and leave stepIndex at 0 while
    // phase/progress catches up, or a noisy currentProgress() can report ~0
    // while still on Our Tiers. Either case used to fire chamMilesSwipeBack and
    // jump straight to the hero.
    const atTiersIntroStep = () => {
      if (inOurTiersRef.current) return false;
      if (phase4StateRef.current > 0.15) return false;
      if (inJoinRef.current) return false;
      if (stepIndexRef.current > 0) return false;
      return currentProgress() <= STEP_REST[1] - 0.02;
    };
    const swipeBackToHero = () => {
      if (isBusy()) return;
      if (!atTiersIntroStep()) return;
      // Drop any queued step so inertia cannot chain another snap after reverse.
      pendingStepDirectionRef.current = 0;
      lockStep(HERO_REVERSE_SNAP_MS + 400);
      window.dispatchEvent(new Event("chamMilesSwipeBack"));
    };

    // While the desktop tier-detail overlay is open OR closing, consume vertical
    // scroll so it never falls through to `snapNext`. Wheel from ANYWHERE on
    // screen cycles the active carousel card. Closing / going back one step is
    // ONLY via the back arrow (not scroll-up).
    const DETAILS_WHEEL_COOLDOWN_MS = 420;
    const consumeDetailsScroll = (e, scrollUp) => {
      if (!detailsActiveRef.current) return false;
      e.preventDefault();
      e.stopPropagation();

      // Closing / mid-snap: swallow the event but do not navigate.
      if (
        !detailsOpenRef.current ||
        detailsClosingRef.current ||
        scrollSnapAnimatingRef.current
      ) {
        return true;
      }

      const now = performance.now();
      if (now < detailsWheelCooldownRef.current) return true;

      const tab = activeTabRef.current;
      if (scrollUp) {
        if (tab > 0) {
          goToTabRef.current?.(tab - 1);
          detailsWheelCooldownRef.current = now + DETAILS_WHEEL_COOLDOWN_MS;
        }
        // tab === 0: stay on Blue — back arrow closes the overlay.
        return true;
      }

      // Scroll down → next peek becomes active (clamp at Diamond).
      if (tab < 3) {
        goToTabRef.current?.(tab + 1);
        detailsWheelCooldownRef.current = now + DETAILS_WHEEL_COOLDOWN_MS;
      }
      return true;
    };

    // Our Tiers → Join: gate freewheel and play the discrete panel swipe
    // (hero-style). Scroll-up from Join mirrors the reverse swipe.
    // Any tiny downward tick while gated starts the full Join handoff.
    const consumeOurTiersScroll = (e, scrollUp) => {
      if (scrollUp) {
        if (!atJoinRest()) return false;
        e.preventDefault();
        e.stopPropagation();
        if (!isBusy()) snapNext(-1, { force: true });
        return true;
      }
      if (!shouldBlockScrollDownToJoin()) return false;
      e.preventDefault();
      e.stopPropagation();
      // First tiny down-tick advances — advanceToJoin self-gates (entrance lock +
      // in-flight snap) and clears the residual settle-lock, so we don't wait out
      // isBusy() here (which lingers ~2.6s after landing on Our Tiers).
      advanceToJoin();
      return true;
    };

    // Tiers intro → hero: one upward gesture = reverse of the hero handoff swipe
    // (useSwipeGate slideBackToHero via chamMilesSwipeBack). Do not free-scrub
    // through the hero gap.
    const atTiersIntroRest = () => atTiersIntroStep();
    const consumeHeroReverseScroll = (e, scrollUp) => {
      if (!scrollUp || !atTiersIntroRest()) return false;
      e.preventDefault();
      e.stopPropagation();
      if (!isBusy()) swipeBackToHero();
      return true;
    };

    // Hold scroll while cards spin, and on the Our Tiers rest once cards have
    // landed so trackpad momentum cannot leak into Join. Also pin the tiers
    // intro rest so scroll-up cannot free-scrub into the hero — only the
    // discrete reverse swipe may leave.
    let joinHoldRaf = requestAnimationFrame(function watchJoinHold() {
      // Keep the entrance-spin pin target fresh (layout / sticky can shift Y).
      ourTiersRestYRef.current = progressToY(OUR_TIERS_HOLD);

      // While any TitleDropdown is focused / open (Join form DOB etc.), pin the
      // current rest so scrub / trackpad momentum cannot leave the step mid-pick.
      if (isTitleDropdownScrollLocked() && !scrollSnapAnimatingRef.current) {
        const p = currentProgress();
        let pinProgress = null;
        if (inJoinRef.current || p >= JOIN_STEP_SCROLL_END - 0.02) {
          pinProgress = JOIN_STEP_SCROLL_END;
        } else if (p >= OUR_TIERS_HOLD - 0.02) {
          pinProgress = OUR_TIERS_HOLD;
        }
        if (pinProgress != null) {
          const targetY = progressToY(pinProgress);
          if (Math.abs(getScrollTop() - targetY) > 1) scrollPortTo(targetY);
        }
        joinHoldRaf = requestAnimationFrame(watchJoinHold);
        return;
      }

      // While the tier-detail carousel is open OR closing, HARD-pin the scroll to
      // the Our Tiers rest so phase4 stays exactly at 1. Otherwise a scroll-up
      // gesture (the one that starts the close) can dip phase4 mid-close: the
      // floating blue card's fly-back pose (finalCardX) then swings toward its
      // bottom-right base while the close morph (tm0x) is still unwinding, so the
      // card visibly detours OFF TO THE RIGHT before settling back into its slot —
      // the non-smooth reverse motion. Pinning keeps the close a single, smooth,
      // morph-only movement. Skipped during a programmatic snap (e.g. the "Join
      // now" CTA scroll) so it never fights an intentional scroll.
      if (detailsActiveRef.current && !scrollSnapAnimatingRef.current) {
        const targetY = ourTiersRestYRef.current;
        if (Math.abs(getScrollTop() - targetY) > 1) {
          scrollPortTo(targetY);
        }
        joinHoldRaf = requestAnimationFrame(watchJoinHold);
        return;
      }
      if (tierSpinBusyRef.current && !scrollSnapAnimatingRef.current) {
        // Entrance: always pin to Our Tiers rest (never a mid-snap freeze).
        // Leave spin: pin to the Y captured when the leave rotation began.
        const entrancing =
          performance.now() < tierEntranceLockUntilRef.current;
        if (entrancing && ourTiersRestYRef.current != null) {
          tierSpinHoldYRef.current = ourTiersRestYRef.current;
        }
        const targetY = entrancing
          ? ourTiersRestYRef.current
          : tierSpinHoldYRef.current;
        if (targetY != null && Math.abs(getScrollTop() - targetY) > 1) {
          scrollPortTo(targetY);
        }
      } else if (
        !allowJoinScrollRef.current &&
        blueCardLandedRef.current &&
        !scrollSnapAnimatingRef.current &&
        !isAnimatingRef.current &&
        !tierSpinBusyRef.current
      ) {
        const p = currentProgress();
        if (p >= OUR_TIERS_HOLD - 0.005 && p < JOIN_STEP_SCROLL_END - 0.02) {
          const targetY = ourTiersRestYRef.current;
          if (getScrollTop() > targetY + 2) {
            scrollPortTo(targetY);
          }
        }
      }

      // Only pin while the tiers panel is actually in view. When the section is
      // still below the fold, progress clamps to 0 and would otherwise yank the
      // hero scrub down to the handoff every frame.
      if (
        inSection() &&
        !scrollSnapAnimatingRef.current &&
        !isAnimatingRef.current &&
        !tierSpinBusyRef.current &&
        !isBusy() &&
        atTiersIntroRest()
      ) {
        const targetY = progressToY(STEP_REST[0]);
        if (getScrollTop() < targetY - 2) {
          scrollPortTo(targetY);
        }
      }
      joinHoldRaf = requestAnimationFrame(watchJoinHold);
    });

    clearPendingScrollGesturesRef.current = () => {
      wheelAccum = 0;
      touchAccumDy = 0;
      if (wheelSettleTimer) {
        clearTimeout(wheelSettleTimer);
        wheelSettleTimer = null;
      }
    };

    const onWheel = (e) => {
      if (!inSection()) return;
      // Join (and other) form dropdowns: freeze section scrub while any menu is
      // open — including scroll-up that would leave Join. Menu list still scrolls.
      if (consumeWheelWhileTitleDropdownOpen(e)) return;
      // Block all scroll while the Our Tiers cards take their places + rotate
      // (spin flag OR the time-based entrance lock, whichever is still active).
      // Skip while the detail overlay is active so its own handler can close it on
      // the first scroll-up even if the entrance lock is still counting down.
      if (
        !detailsActiveRef.current &&
        (tierSpinBusyRef.current ||
          performance.now() < tierEntranceLockUntilRef.current)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (consumeDetailsScroll(e, e.deltaY < 0)) return;
      // Mobile Our Tiers: wheel from ANYWHERE on screen changes the active
      // slider card. Scroll-up on the first card / scroll-down on the last
      // fall through to step snap (→ Join Early / → Join form).
      if (
        isMobileRef.current &&
        inOurTiersRef.current &&
        blueCardLandedRef.current
      ) {
        const handled = sliderWheelRef.current?.(e.deltaY);
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
      if (consumeOurTiersScroll(e, e.deltaY < 0)) return;
      if (consumeHeroReverseScroll(e, e.deltaY < 0)) return;

      // Phone + tablet / lg (<1280): discrete one-step snap on first wheel tick.
      // xl+: continuous scrub (do not preventDefault here).
      if (!shouldStepSnapRef.current) {
        // Only hard-block freewheel while a Join/Our-Tiers gate is armed — never
        // at the tiers intro, or residual locks freeze the whole section.
        if (isBusy() && (shouldBlockScrollDownToJoin() || atJoinRest())) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      // Ignore wheel while a step snap is running — do not accumulate or queue.
      if (isBusy()) {
        wheelAccum = 0;
        pendingStepDirectionRef.current = 0;
        if (wheelSettleTimer) {
          clearTimeout(wheelSettleTimer);
          wheelSettleTimer = null;
        }
        return;
      }
      if (e.deltaY === 0) return;
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= getViewportHeight();
      wheelAccum += dy;
      // Commit as soon as the tiny threshold is met (first notch / flick).
      if (Math.abs(wheelAccum) >= WHEEL_GESTURE_THRESHOLD) {
        if (wheelSettleTimer) {
          clearTimeout(wheelSettleTimer);
          wheelSettleTimer = null;
        }
        commitWheelGesture();
      } else {
        scheduleWheelCommit();
      }
    };

    let lastTouchX = null;
    let lastTouchY = null;
    let startTouchX = null;
    let startTouchY = null;
    // Axis lock for the whole gesture: once a swipe is committed to horizontal
    // (the tiers card slider) or vertical (page step), it stays that way until
    // the finger lifts — so a mostly-sideways slider swipe with a little vertical
    // wobble can NEVER be re-read mid-gesture as a scroll to the next section.
    let gestureAxis = null; // null | "h" | "v" | "v-done"
    const AXIS_LOCK_PX = 8;
    // Touches that begin on the card track must not steal into Join / step snap
    // from a slightly diagonal drag — bias heavily toward horizontal.
    let touchStartedOnSlider = false;
    // Freeze scroll position for the whole slider gesture (scrub is scroll-driven).
    let sliderScrollPin = null;

    const commitTouchGesture = () => {
      if (gestureAxis !== "v") {
        touchAccumDy = 0;
        return;
      }
      const net = touchAccumDy;
      touchAccumDy = 0;
      if (Math.abs(net) < WHEEL_GESTURE_THRESHOLD) return;
      if (isTitleDropdownScrollLocked()) return;

      // Phone / tablet / lg: same as wheel — never queue a second step while
      // the current snap is still running.
      if (shouldStepSnapRef.current) {
        if (isBusy()) {
          pendingStepDirectionRef.current = 0;
          return;
        }
        if (shouldBlockScrollDownToJoin() && net > 0) {
          advanceToJoin();
          return;
        }
        if (net < 0 && atTiersIntroStep()) {
          swipeBackToHero();
          return;
        }
        const started = snapNext(net > 0 ? 1 : -1);
        if (!started) scrollPortBy(Math.sign(net) * Math.min(Math.abs(net), 80));
        return;
      }

      clearSoftBusyForStepGesture();

      if (isBusy()) {
        if (net < 0 && atTiersIntroStep()) return;
        if (!shouldBlockScrollDownToJoin() || net < 0) {
          queuePendingStep(net > 0 ? 1 : -1);
          scheduleFlushPendingStep();
        }
        return;
      }
      if (shouldBlockScrollDownToJoin() && net > 0) {
        advanceToJoin();
        return;
      }
      if (net < 0 && atTiersIntroStep()) {
        swipeBackToHero();
        return;
      }
      const started = snapNext(net > 0 ? 1 : -1);
      if (!started) scrollPortBy(Math.sign(net) * Math.min(Math.abs(net), 80));
    };

    const onTouchStart = (e) => {
      // Multi-touch on step-snap surfaces: ignore — never start a step gesture
      // from a second finger while another is down.
      if (shouldStepSnapRef.current && e.touches.length > 1) {
        touchOnInteractive = true;
        gestureAxis = "v-done";
        touchAccumDy = 0;
        pendingStepDirectionRef.current = 0;
        return;
      }
      touchOnInteractive = isInteractiveTouchTarget(e.target);
      lastTouchX = startTouchX = e.touches[0]?.clientX ?? null;
      lastTouchY = startTouchY = e.touches[0]?.clientY ?? null;
      gestureAxis = null;
      touchAccumDy = 0;
      touchStartedOnSlider = !!e.target?.closest?.("[data-cham-tiers-slider]");
      sliderScrollPin = touchStartedOnSlider ? getScrollTop() : null;
      if (typeof window !== "undefined") {
        window.__chamTiersSliderTouch = touchStartedOnSlider;
      }
    };
    const onTouchMove = (e) => {
      // Open dropdown list owns the gesture — never preventDefault (native overflow).
      if (isWheelOverTitleDropdownMenu(e.target)) return;
      if (shouldStepSnapRef.current && e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        touchAccumDy = 0;
        pendingStepDirectionRef.current = 0;
        gestureAxis = "v-done";
        return;
      }
      // Step-snap: while a section snap is running, swallow vertical scroll so
      // a second flick cannot queue or free-scrub mid-animation.
      if (
        shouldStepSnapRef.current &&
        isBusy() &&
        inSection() &&
        !touchOnInteractive &&
        !isTitleDropdownScrollLocked(e.target)
      ) {
        e.preventDefault();
        e.stopPropagation();
        touchAccumDy = 0;
        pendingStepDirectionRef.current = 0;
        return;
      }
      if (consumeTouchWhileTitleDropdownOpen(e)) return;
      if (isTitleDropdownScrollLocked(e.target) || touchOnInteractive) {
        // Freeze section scrub while a dropdown is focused / open. Allow native
        // scrolling only inside the open menu panel itself.
        if (
          isTitleDropdownScrollLocked(e.target) &&
          !isWheelOverTitleDropdownMenu(e.target)
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      if (!inSection()) return;
      if (
        !detailsActiveRef.current &&
        (tierSpinBusyRef.current ||
          performance.now() < tierEntranceLockUntilRef.current)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const xNow = e.touches[0]?.clientX ?? lastTouchX;
      const yNow = e.touches[0]?.clientY ?? lastTouchY;
      // Decide the axis from the TOTAL movement since touchstart (stable), then
      // lock it for the rest of the gesture.
      const totalDx = startTouchX == null ? 0 : startTouchX - xNow;
      const totalDy = startTouchY == null ? 0 : startTouchY - yNow;
      if (gestureAxis == null && (Math.abs(totalDx) > AXIS_LOCK_PX || Math.abs(totalDy) > AXIS_LOCK_PX)) {
        if (touchStartedOnSlider) {
          // Card-track: bias horizontal so diagonal tier flips don't leave the
          // step. On Our Tiers rest, loosen the bias so a clear vertical swipe
          // can leave to Join Early (scroll-up) or Join (scroll-down).
          const p = currentProgress();
          const atOurTiersRest =
            blueCardLandedRef.current &&
            p >= OUR_TIERS_HOLD - 0.02 &&
            p < JOIN_STEP_SCROLL_END - 0.02;
          const verticalBias = atOurTiersRest ? 1.15 : 2.5;
          gestureAxis =
            Math.abs(totalDy) > Math.abs(totalDx) * verticalBias ? "v" : "h";
        } else {
          gestureAxis = Math.abs(totalDx) > Math.abs(totalDy) ? "h" : "v";
        }
      }
      const horizontal = gestureAxis === "h";
      const dy = lastTouchY == null ? 0 : lastTouchY - yNow;
      lastTouchX = xNow;
      lastTouchY = yNow;

      // Horizontal (or still-deciding) touches on the card track must NOT move
      // page scroll — ScrollThrottle / iOS `#cham-scroll-root` would otherwise
      // scrub phases mid-swipe. preventDefault only (no stopPropagation) so
      // Framer's drag="x" still receives the event.
      if (touchStartedOnSlider && gestureAxis !== "v") {
        e.preventDefault();
        if (sliderScrollPin != null) {
          const cur = getScrollTop();
          if (Math.abs(cur - sliderScrollPin) > 0.5) scrollPortTo(sliderScrollPin);
        }
        if (horizontal || gestureAxis == null) return;
      }
      if (horizontal) {
        e.preventDefault();
        return;
      }
      // Already committed a step snap for this finger — keep blocking native
      // scrub so inertia does not double-advance.
      if (gestureAxis === "v-done") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // A vertical swipe while the card-detail overlay is open/closing dismisses
      // it first (revealing the Our Tiers cards), consuming the gesture.
      if (gestureAxis === "v" && consumeDetailsScroll(e, dy < 0)) return;

      // Our Tiers ↔ Join: one vertical swipe = discrete panel handoff (hero-style).
      if (gestureAxis === "v" && consumeOurTiersScroll(e, dy < 0)) return;

      // Tiers intro ↔ hero: reverse of the hero handoff swipe.
      if (gestureAxis === "v" && consumeHeroReverseScroll(e, dy < 0)) return;

      // Phone + tablet / lg: snap one step as soon as the vertical swipe clears
      // the threshold. xl+ free-scrubs (shouldStepSnap false).
      if (!shouldStepSnapRef.current) return;
      if (gestureAxis !== "v") return;
      e.preventDefault();
      e.stopPropagation();
      touchAccumDy += dy;
      if (Math.abs(touchAccumDy) >= WHEEL_GESTURE_THRESHOLD) {
        commitTouchGesture();
        gestureAxis = "v-done";
      }
    };
    const onTouchEnd = () => {
      if (
        shouldStepSnapRef.current &&
        inSection() &&
        gestureAxis === "v"
      ) {
        commitTouchGesture();
      }
      touchOnInteractive = false;
      touchStartedOnSlider = false;
      sliderScrollPin = null;
      if (typeof window !== "undefined") {
        window.__chamTiersSliderTouch = false;
      }
      lastTouchX = lastTouchY = startTouchX = startTouchY = null;
      gestureAxis = null;
      touchAccumDy = 0;
    };

    const scrollTarget = getChamScrollTarget();
    if (!scrollTarget) return;
    // iOS Safari: match useSwipeGate — capture on window so the first post-hero
    // swipe is never missed when the inner `#cham-scroll-root` is the scroller.
    // scrollPortTo / getScrollTop still drive the inner container.
    const gestureTarget = isIosMobileSafari() ? window : scrollTarget;

    gestureTarget.addEventListener("wheel", onWheel, { passive: false, capture: true });
    gestureTarget.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    gestureTarget.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    gestureTarget.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    // Keyboard scrolling (arrows / PageUp / PageDown / Space) is left to the
    // browser + ScrollThrottle. On xs–lg, wheel/touch already step-snap.

    return () => {
      clearPendingScrollGesturesRef.current = null;
      snapNextRef.current = null;
      snapToProgressRef.current = null;
      flushPendingStepSnapRef.current = null;
      if (pendingFlushTimer) clearTimeout(pendingFlushTimer);
      pendingFlushTimer = null;
      if (rafId != null) cancelAnimationFrame(rafId);
      if (joinHoldRaf != null) cancelAnimationFrame(joinHoldRaf);
      if (wheelSettleTimer) clearTimeout(wheelSettleTimer);
      isAnimatingRef.current = false;
      scrollSnapAnimatingRef.current = false;
      phaseAnimCountRef.current = 0;
      delete window.__chamMilesStepBusy;
      gestureTarget.removeEventListener("wheel", onWheel, { capture: true });
      gestureTarget.removeEventListener("touchstart", onTouchStart, { capture: true });
      gestureTarget.removeEventListener("touchmove", onTouchMove, { capture: true });
      gestureTarget.removeEventListener("touchend", onTouchEnd, { capture: true });
    };
  }, []);

  // Header-link navigation: jump directly to the requested step (no scroll or
  // phase animation across intermediate steps).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onGoTo = (e) => {
      const target = e.detail || {};
      forceCloseDetailsRef.current?.();
      clearPendingScrollGesturesRef.current?.();

      const el = containerRef.current;
      let targetY;
      let targetProgress = null;

      if (target.step === "welcome") {
        targetY = 0;
        allowJoinScrollRef.current = false;
      } else if (target.progress != null && el) {
        const rect = el.getBoundingClientRect();
        const containerTop = getScrollTop() + rect.top;
        targetProgress = Math.max(0, Math.min(1, target.progress));
        targetY = Math.round(
          containerTop + targetProgress * (el.offsetHeight - getViewportHeight()),
        );
        // Join hold RAF yanks anything past Our Tiers unless this is armed —
        // same path as the "Become a Member" CTA.
        allowJoinScrollRef.current =
          target.step === "join" ||
          Math.abs(targetProgress - JOIN_STEP_SCROLL_END) < 0.02;
      } else {
        return;
      }

      // Clear any leftover step lock so a mid-transition header click still works.
      window.__scrollLockUntil = performance.now();
      isAnimatingRef.current = false;
      scrollSnapAnimatingRef.current = false;
      phaseAnimCountRef.current = 0;
      suppressProgressPhaseSyncRef.current = true;
      headerJumpRef.current = true;
      if (headerJumpTimerRef.current) clearTimeout(headerJumpTimerRef.current);

      engageStepLockRef.current(450);

      // Instant cut: jump scroll + snap scrubbed GSAP timelines (hero + tiers)
      // so intermediate frames/phases never race across the screen.
      scrollPortTo(targetY);
      snapChamMilesScrollScrub();

      if (targetProgress != null) {
        applyPhaseFromProgressRef.current?.(targetProgress);
        stepIndexRef.current = progressToStepIndex(targetProgress);
      } else {
        applyPhaseFromProgressRef.current?.(0);
        stepIndexRef.current = 0;
      }

      // Re-measure after layout settles (hero unpinned → tiers sticky), still
      // as an instant replace — never a scrubbed glide.
      requestAnimationFrame(() => {
        const node = containerRef.current;
        if (node && targetProgress != null) {
          const rect = node.getBoundingClientRect();
          const containerTop = getScrollTop() + rect.top;
          const scrollable = node.offsetHeight - getViewportHeight();
          const y = Math.round(containerTop + targetProgress * scrollable);
          if (Math.abs(getScrollTop() - y) > 2) {
            scrollPortTo(y);
            snapChamMilesScrollScrub();
          }
          applyPhaseFromProgressRef.current?.(targetProgress);
        } else if (target.step === "welcome") {
          scrollPortTo(0);
          snapChamMilesScrollScrub();
          applyPhaseFromProgressRef.current?.(0);
        }
        suppressProgressPhaseSyncRef.current = false;
        tryCompleteStepTransitionRef.current?.();
        // Hold the header-jump gate across the step lock so the scrubbed timeline
        // can't drift phases back in while the hero unpins and layout settles.
        // Re-snap at release so the timeline is synced to the (now stable) scroll
        // with no visible catch-up.
        if (headerJumpTimerRef.current) clearTimeout(headerJumpTimerRef.current);
        headerJumpTimerRef.current = setTimeout(() => {
          headerJumpTimerRef.current = null;
          headerJumpRef.current = false;
          snapChamMilesScrollScrub();
        }, 480);
      });
    };
    window.addEventListener("chamMilesGoTo", onGoTo);
    return () => {
      window.removeEventListener("chamMilesGoTo", onGoTo);
      if (headerJumpTimerRef.current) clearTimeout(headerJumpTimerRef.current);
    };
  }, []);

  // Our Tiers → Join: rotate-out finishes first (same gate as wheel), then swipe.
  const scrollToJoinForm = useCallback(() => {
    if (tierSpinBusyRef.current) return;
    clearPendingScrollGesturesRef.current?.();
    advanceToJoinRef.current?.();
  }, []);
  // Advance exactly ONE step using the SAME scroll-snap animation as a
  // wheel/touch scroll down. Used by the intro "Discover more" CTA and by
  // clicking the floating blue card on the intro / Benefits / Join-Early steps.
  // Routing every step CTA through `snapNext` keeps the motion identical for
  // every matched step; jumping between non-adjacent steps is the header's job.
  const scrollToNextStep = () => snapNextRef.current?.(1, { force: true });
  // Same path as scroll-up: close open tier details first, otherwise one step back.
  const scrollToPrevStep = useCallback(() => {
    if (detailsOpenRef.current && !detailsClosingRef.current) {
      beginDetailsCloseRef.current?.();
      return;
    }
    clearPendingScrollGesturesRef.current?.();
    snapNextRef.current?.(-1, { force: true });
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative cm-tiers-scroll">
        <section
          className="sticky top-0 flex h-screen cm-vh-screen w-full overflow-hidden bg-(--cm-panel-bg)"
          style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}
        >
          {/* Parallax backdrop — GSAP scrubs a slow camera push-in on this layer
              (see the ScrollTrigger effect). Kept as its own element so scaling
              it never disturbs the content transforms above it. `scale ≥ 1.06`
              guarantees it always overfills, so the push-in leaves no edge gap. */}
          <div
            ref={bgLayerRef}
            aria-hidden="true"
            className="cham-tiers-bg pointer-events-none absolute inset-0 z-0 will-change-transform"
            style={{
              backgroundImage: `url(${tierBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <TiersIntroCopy
            content={content}
            isAr={isAr}
            isMobile={isMobile}
            isTabletUi={isTabletUi}
            bp={bp}
            textX={textX}
            textOpacity={textOpacity}
          />

          <div
            ref={carouselAnchorRef}
            className={`pointer-events-none absolute top-1/2 h-0 -translate-y-1/2${
              isMobile
                ? " hidden"
                : useTabletCardPose
                  ? " right-[3vw] w-[min(44vw,22rem)] block"
                  : " right-[6vw] w-[30vw] block"
            }`}
            aria-hidden="true"
          />

          <BenefitsPanel
            opacity={benefitsCombinedOpacity}
            x={benefitsX}
            y={benefitsExitY}
            isAr={isAr}
            active={benefitsStepActive}
            content={content}
            benefits={benefits}
            cardStyles={benefitCardStyles}
            onCta={scrollToNextStep}
            layout={
              isMobile ? "mobile" : useTabletCardPose ? "tablet" : "desktop"
            }
          />

          {/* After Benefits so the card paints on top (mobile/tablet overlap). */}
          {(!isMobile || tiersStepActive || !joinStepActive) && (
            <motion.div
              ref={floatingCardRef}
              className={`tier-flip-host tier-flip-host--benefits-card absolute select-none overflow-visible will-change-transform z-[60]${
                !isMobile && !detailsActive
                  ? " group drop-shadow-2xl"
                  : " tier-flip-host--mobile-stable"
              }${useTabletCardPose ? " tier-flip-host--tablet-mobile-park" : ""} ${
                detailsOpen
                  ? "pointer-events-none"
                  : "cursor-pointer"
              }`}
              style={{
                // Tablet: always use the scroll-linked pipeline so Benefits →
                // Join Early mixes across the screen into the centered CARD_FINAL,
                // then continues into the measured Our Tiers grid slot — same
                // floating Blue element the whole way (no image swap / flicker).
                x: isMobile ? mobileFollowX : floatingDesktopXCombined,
                y: isMobile ? blueCardExitYMobile : floatingDesktopYWithSwipe,
                scale: isMobile ? mobileFollowScale : floatingDesktopScaleCombined,
                rotate: finalCardRotate,
                transformOrigin: "center center",
                // Mobile + details carousel: flat layer — preserve-3d flip faces
                // flash a white sheet under scroll/morph transforms (esp. Safari).
                transformStyle:
                  isMobile || detailsActive ? "flat" : "preserve-3d",
                backfaceVisibility:
                  isMobile || detailsActive ? "hidden" : undefined,
                WebkitBackfaceVisibility:
                  isMobile || detailsActive ? "hidden" : undefined,
                zIndex: isMobile ? 60 : floatingDesktopZ,
                opacity: isMobile
                  ? blueCardOpacityMobile
                  : floatingDesktopOpacity,
                pointerEvents: detailsOpen
                  ? "none"
                  : introStepActive || benefitsStepActive || joinEarlyStepActive
                    ? "auto"
                    : isMobile
                      ? "none"
                      : blueCardPointer,
              }}
              onClick={() => {
                if (detailsOpen || detailsClosing) return;
                // Intro / Benefits / Join-Early steps: clicking the card fires
                // that step's forward transition — the same one-step snap as
                // scrolling down once (mirrors the Benefits behaviour). On the
                // Our Tiers step (below) the card opens the tier detail overlay.
                if (introStepActive || benefitsStepActive || joinEarlyStepActive) {
                  scrollToNextStep();
                  return;
                }
                if (isMobile || !blueCardLandedRef.current) return;
                openDetails(0);
              }}
            >
              <TierFlipCard
                imageSrc={card}
                imageAlt={content.tierDetails.cardAlt}
                details={detailTabs[0]}
                // Plain <img> on mobile and while the details carousel is open —
                // 3D flip faces flash a white layer during morph/scale hops.
                interactive={!isMobile && !detailsActive}
                flipEnabled={
                  !isMobile &&
                  tiersStepActive &&
                  blueCardLanded &&
                  !joinStepActive &&
                  !detailsActive &&
                  !benefitsStepActive
                }
                detailsLabel={content.ourTiers.viewDetails}
                onViewDetails={() => openDetails(0)}
                floating
              />
            </motion.div>
          )}

          <JoinEarlyPanel
            x={joinX}
            y={joinOutY}
            opacity={joinOpacity}
            zIndex={joinPanelZIndex}
            visibility={joinVisibility}
            isAr={isAr}
            isMobile={isMobile}
            isTabletUi={useTabletCardPose}
            bp={bp}
            active={joinEarlyStepActive}
            tiersStepActive={tiersStepActive}
            content={content}
          />

          <TierMarquee
            opacity={marqueeOpacity}
            y={marqueeY2}
            active={joinEarlyStepActive}
            labels={marqueeLabels}
            tablet={useTabletCardPose}
          />

          {/*
            Our Tiers + Join: title, tier row, floating blue card, and member CTA
            share one swipe transform (phase5 Y) — no fade-out on exit.
            Tablet+ uses the desktop row (same as 2xl), never the phone slider.
          */}
          {!isMobile && (
            <OurTiersRow
              tiersStepActive={tiersStepActive}
              blueCardLanded={blueCardLanded}
              joinStepActive={joinStepActive}
              detailsActive={detailsActive}
              detailsOpen={detailsOpen}
              detailsClosing={detailsClosing}
              tierGroupVisibility={tierGroupVisibility}
              tierRowCombinedY={tierRowCombinedY}
              detailsGroupZCombined={detailsGroupZCombined}
              isAr={isAr}
              ourTiersTitleOpacity={ourTiersTitleOpacity}
              detailsTitleLeft={detailsTitleLeft}
              detailsTitleX={detailsTitleX}
              ourTiersSubtitleOpacity={ourTiersSubtitleOpacity}
              content={content}
              ourTierCards={ourTierCards}
              tierCardStyles={tierCardStyles}
              tierRiseRefs={tierRiseRefs}
              activeTab={activeTab}
              tierCardRefs={tierCardRefs}
              tierSlotRef={tierSlotRef}
              detailTabs={detailTabs}
              isMobile={isMobile}
              goToTab={goToTab}
              openDetails={openDetails}
              tierLabelOpacity={tierLabelOpacity}
              memberButtonOpacity={memberButtonOpacity}
              scrollToJoinForm={scrollToJoinForm}
              scrollToPrevStep={scrollToPrevStep}
              tabletLayout={useTabletCardPose}
            />
          )}

          {/* Detail panel (tabs + copy). Cards stay in the tier row above — same
              DOM elements morph via `detailsT`; this layer only holds the text UI. */}
          {!isMobile && (
            <TierDetailsOverlay
              panelOpacity={detailsPanelOpacity}
              panelVisibility={detailsPanelVisibility}
              swipeY={tiersDesktopSwipeY}
              panelPointer={detailsPanelPointer}
              isAr={isAr}
              tierTabBarRef={tierTabBarRef}
              tierTabButtonRefs={tierTabButtonRefs}
              detailTabs={detailTabs}
              activeTab={activeTab}
              goToTab={goToTab}
              tierTabActiveLine={tierTabActiveLine}
              content={content}
              scrollToJoinForm={scrollToJoinForm}
              tabletLayout={useTabletCardPose}
              carouselAnchorRef={carouselAnchorRef}
              detailsOpen={detailsOpen}
            />
          )}

          {isMobile && (
            <MobileTiersPanel
              opacity={mobileTiersOpacity}
              y={mobileTiersSwipeY}
              pointerEvents={mobileTiersPointer}
              tiersStepActive={tiersStepActive}
              sliderResetKey={sliderResetKey}
              isAr={isAr}
              onJoin={scrollToJoinForm}
              onBack={scrollToPrevStep}
              firstCardRef={mobileTierSlotRef}
              blueCardReveal={mobileFirstCardReveal}
              onCardLayout={handleSliderLayout}
              blueOffsetMV={blueSlotOffset}
              onActiveChange={setSliderActive}
              onWheelNavigateRef={sliderWheelRef}
              content={content}
            />
          )}

          <JoinStep
            tierBg={tierBg}
            swipeOpacity={joinFormOpacity}
            swipeSettle={joinSwipeSettle}
            swipeVisibility={joinFormVisibility}
            joinStepPointer={joinStepPointer}
            swipeTitleY={joinFormTitleY}
            swipeCardY={joinFormCardY}
            backdropOpacity={joinBackdropOpacity}
          />
        </section>
      </div>
    </>
  );
}
