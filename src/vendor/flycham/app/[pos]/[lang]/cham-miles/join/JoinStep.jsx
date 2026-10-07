"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent } from "framer-motion";
import JoinForm from "./JoinForm";
import JoinSuccess from "./JoinSuccess";
import ChamMilesFormFooter from "../Components/ChamMilesFormFooter";
import useJoinForm from "./useJoinForm";
import { useChamMilesContent, useChamMilesLang } from "../shared/ChamMilesContent";
import { readChamMilesTabletUi } from "../tiers/hooks/useTiersViewport";

/**
 * Join step — two responsive shells sharing one phase5 swipe:
 * - title, form, and footer share ONE y transform (move as a single block)
 * - same duration/easing as the hero → second-section handoff
 *
 * Once the swipe SETTLES (`swipeSettle` → 1), the title writes on
 * (English: per character; Arabic: same timing via clip wipe so letters stay
 * joined); the subtitle fades up. Scroll stays free during these reveals so
 * the user can leave Join without waiting.
 *
 * Compact: xs/sm + 2xl (centered stack)
 * Split: md–xl (intro left, form right)
 */

const TITLE_PER_CHAR = 0.022;
const GROUP_GAP = 0.12;
const REVEAL_ON = 0.99;
const REVEAL_OFF = 0.6;
const FADE_UP_EASE = [0.22, 1, 0.36, 1];

const len = (s) => [...(s ?? "")].length;

/**
 * WriteOn — progressive title reveal with English typewriter timing.
 *
 * English: per-character opacity (safe for Latin).
 * Arabic (`joined`): same per-letter timing via stepped clip wipe on one
 * unbroken run (colour spans stay nested strings) so cursive joining holds.
 */
function WriteOn({ segments, play, startDelay = 0, perChar = 0.03, joined = false }) {
  const full = segments.map((s) => s.text ?? "").join("");
  let running = 0;

  if (joined) {
    const charCount = Math.max([...full].length, 1);
    const duration = charCount * perChar;
    // Jump once per character (same cadence as English opacity stagger).
    const letterEase = (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return Math.ceil(t * charCount) / charCount;
    };
    return (
      <>
        <span className="sr-only">{full}</span>
        <motion.span
          aria-hidden="true"
          className="cham-join-writeon cham-join-writeon--joined"
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={
            play
              ? { clipPath: "inset(0 0 0 0%)" }
              : { clipPath: "inset(0 0 0 100%)" }
          }
          transition={{
            duration: play ? duration : 0.12,
            ease: play ? letterEase : "easeOut",
            delay: play ? startDelay : 0,
          }}
        >
          {segments.map((seg, si) => (
            <span
              key={si}
              className={`${seg.className ?? ""} cham-join-writeon__seg`.trim()}
            >
              {seg.text ?? ""}
            </span>
          ))}
        </motion.span>
      </>
    );
  }

  return (
    <>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true">
        {segments.map((seg, si) => {
          const chars = [...(seg.text ?? "")];
          return (
            <span key={si} className={seg.className}>
              {chars.map((ch, ci) => {
                const delay = startDelay + running * perChar;
                running += 1;
                return (
                  <motion.span
                    key={ci}
                    initial={{ opacity: 0 }}
                    animate={play ? { opacity: 1 } : { opacity: 0 }}
                    transition={{
                      duration: 0.06,
                      ease: "easeOut",
                      delay: play ? delay : 0,
                    }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </span>
    </>
  );
}

/** Subtitle reveal — fades in while rising slightly (no character typing). */
function FadeUp({ play, delay = 0, children }) {
  return (
    <motion.span
      className="block"
      initial={{ opacity: 0, y: 14 }}
      animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{
        duration: 0.55,
        ease: FADE_UP_EASE,
        delay: play ? delay : 0,
      }}
    >
      {children}
    </motion.span>
  );
}

export default function JoinStep({
  tierBg,
  swipeOpacity,
  swipeSettle,
  swipeVisibility,
  joinStepPointer,
  // swipeTitleY kept by callers for API parity; compact + split use one block Y.
  swipeTitleY: _swipeTitleY,
  swipeCardY,
  backdropOpacity,
}) {
  const formProps = useJoinForm();
  const { submitted, homeHref } = formProps;
  const { joinStep } = useChamMilesContent();
  const { isAr } = useChamMilesLang();
  const joinStepArClass = isAr ? " cham-join-step--ar" : "";

  // Tablet UI via shared reader (iPad desktop-site + maxTouchPoints).
  // Init synchronously so portrait tablets get `--tablet-compact` on first
  // paint — a false→true flip left the compact shell under the md–xl hide rule.
  const [isTablet, setIsTablet] = useState(() => readChamMilesTabletUi());
  const [isTabletPortrait, setIsTabletPortrait] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return readChamMilesTabletUi() && window.matchMedia("(orientation: portrait)").matches;
  });
  // Force 2xl-style centered Join stack across the whole split band
  // (1024–1535). Split was still showing at xl (1280–1535).
  const [isLgWideStack, setIsLgWideStack] = useState(() => {
    if (typeof window === "undefined") return false;
    const w = window.innerWidth;
    return w >= 1024 && w <= 1535;
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mqPortrait = window.matchMedia("(orientation: portrait)");
    const mqLgStack = window.matchMedia("(min-width: 1024px) and (max-width: 1535px)");
    const sync = () => {
      const tablet = readChamMilesTabletUi();
      setIsTablet(tablet);
      setIsTabletPortrait(tablet && mqPortrait.matches);
      setIsLgWideStack(mqLgStack.matches);
    };
    sync();
    mqPortrait.addEventListener("change", sync);
    mqLgStack.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mqPortrait.removeEventListener("change", sync);
      mqLgStack.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const settle = swipeSettle ?? swipeOpacity;
  const [play, setPlay] = useState(false);
  const [joinPointerOn, setJoinPointerOn] = useState(false);
  useMotionValueEvent(settle, "change", (v) => {
    if (v >= REVEAL_ON) setPlay(true);
    else if (v <= REVEAL_OFF) setPlay(false);
  });
  useMotionValueEvent(joinStepPointer, "change", (v) => {
    setJoinPointerOn(v === "auto");
  });
  useEffect(() => {
    if (settle.get() >= REVEAL_ON) setPlay(true);
    setJoinPointerOn(joinStepPointer.get() === "auto");
  }, [settle, joinStepPointer]);

  // Subtitle fade starts after the title finishes typing.
  const compactTitleLen =
    len(joinStep.titleJoin) + len(joinStep.titleAccent) + len(joinStep.titleToday);
  const splitLine1Len = len(joinStep.titleJoin) + len(joinStep.titleAccent);
  const splitTitleLen = splitLine1Len + len(joinStep.titleTodaySplit);
  const subDelayCompact = compactTitleLen * TITLE_PER_CHAR + GROUP_GAP;
  const subDelaySplit = splitTitleLen * TITLE_PER_CHAR + GROUP_GAP;
  const splitLine2Delay = splitLine1Len * TITLE_PER_CHAR;

  // Portrait tablet OR 1024–1535: compact centered stack (2xl-style).
  // Landscape tablet below 1024 keeps split; phone + 2xl unchanged.
  const useCompactStack = isTabletPortrait || isLgWideStack;
  const tabletCompactClass = useCompactStack
    ? isLgWideStack && !isTabletPortrait
      ? " cham-join-step--tablet-compact cham-join-step--lg-wide-stack"
      : " cham-join-step--tablet-compact"
    : isTablet
      ? " cham-join-step--tablet"
      : "";
  const tabletSplitClass = isTablet || isLgWideStack
    ? ` cham-join-step--tablet${
        isTabletPortrait || isLgWideStack
          ? " cham-join-step--tablet-portrait cham-join-step--tablet-hide"
          : ""
      }${isLgWideStack ? " cham-join-step--lg-wide-stack-hide" : ""}`
    : "";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden${
        joinPointerOn ? " z-40" : " z-0"
      }`}
      aria-hidden={joinPointerOn ? undefined : true}
    >
      {submitted ? (
        <motion.div
          className={`cham-join-step cham-join-step--success absolute inset-0 flex items-center justify-center${joinStepArClass}`}
          style={{
            opacity: swipeOpacity,
            visibility: swipeVisibility,
            pointerEvents: joinStepPointer,
          }}
        >
          <motion.div
            aria-hidden
            className="cham-join-step__backdrop pointer-events-none absolute inset-0"
            style={{
              opacity: backdropOpacity,
              backgroundImage: `url(${tierBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "var(--cm-panel-bg)",
            }}
          />
          <div className="relative z-10 flex w-full items-center justify-center">
            <JoinSuccess
              content={joinStep.successScreen}
              homeHref={homeHref}
              isAr={isAr}
            />
          </div>
        </motion.div>
      ) : (
        <>
      {/* Compact — xs/sm + 2xl (+ forced on tablet portrait) */}
      <motion.div
        className={`cham-join-step cham-join-step--compact absolute inset-0 flex min-h-0 flex-col will-change-transform${joinStepArClass}${tabletCompactClass}${
          joinPointerOn ? " cham-join-step--pointer" : ""
        }`}
        style={{
          opacity: swipeOpacity,
          // Always honor swipeVisibility — forcing "visible" on tablet left an
          // opacity-0 form over Our Tiers; children still ate taps.
          visibility: swipeVisibility,
          pointerEvents: joinStepPointer,
          ...(useCompactStack
            ? {
                display: "flex",
                zIndex: joinPointerOn ? 45 : 2,
              }
            : null),
        }}
      >
        <motion.div
          aria-hidden
          className="cham-join-step__backdrop pointer-events-none absolute inset-0"
          style={{
            opacity: backdropOpacity,
            backgroundImage: `url(${tierBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "var(--cm-panel-bg)",
          }}
        />
        <motion.div
          className={`cham-join-step__compact-body relative z-10 flex min-h-0 w-full flex-1 flex-col pt-3 px-0 will-change-transform${
            useCompactStack ? " cham-join-step__compact-body--tablet" : ""
          }`}
          style={{
            // One shared Y — title + form + footer swipe as a single block.
            y: swipeCardY,
            ...(useCompactStack
              ? {
                  height: "100%",
                  minHeight: "0",
                  overflow: "hidden",
                  paddingTop: "0.75rem",
                  paddingBottom: "0",
                }
              : null),
          }}
        >
          {useCompactStack ? (
            <>
              {/* Padded main band — title + form clustered (inline layout so
                  iPad CSS cache cannot keep the old margin:auto hole). */}
              <div
                className="cham-join-step__tablet-main flex min-h-0 w-full flex-1 flex-col px-6"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 0,
                  flex: "1 1 auto",
                  overflow: "hidden",
                }}
              >
                <div
                  className="cham-join-step__tablet-cluster"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "36rem",
                    // Edit this to tune title ↔ form spacing on tablet:
                    gap: "1.5rem",
                  }}
                >
                  <div className="cham-join-step__compact-intro w-full shrink-0 self-center text-center">
                    <h2
                      className="m-0 font-bold leading-[1.05]"
                      style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
                    >
                      <WriteOn
                        play={play}
                        perChar={TITLE_PER_CHAR}
                        joined={isAr}
                        segments={[
                          { text: joinStep.titleJoin, className: "text-(--cm-primary)" },
                          { text: joinStep.titleAccent, className: "text-(--cm-join-accent)" },
                          { text: joinStep.titleToday, className: "text-(--cm-primary)" },
                        ]}
                      />
                    </h2>
                    <p
                      className="cham-join-step__desc cham-join-step__desc--desktop mx-auto max-w-lg text-(--cm-text)"
                      style={{
                        display: "block",
                        fontSize: "0.9375rem",
                        lineHeight: 1.55,
                        whiteSpace: "normal",
                        overflow: "visible",
                        maxWidth: "36rem",
                      }}
                    >
                      <FadeUp play={play} delay={subDelayCompact}>
                        {joinStep.descriptionDesktop}
                      </FadeUp>
                    </p>
                    <p
                      className="cham-join-step__desc cham-join-step__desc--mobile mx-auto max-w-lg text-(--cm-text)"
                      style={{ display: "none" }}
                    >
                      <FadeUp play={play} delay={subDelayCompact}>
                        {joinStep.descriptionMobile}
                      </FadeUp>
                    </p>
                  </div>

                  <div
                    style={{
                      flex: "0 0 auto",
                      width: "100%",
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                    className="cham-join-step__swipe-panel cham-join-step__swipe-panel--tablet-stack w-full"
                  >
                    <div className="mx-auto w-full max-w-xl">
                      <JoinForm variant="compact" {...formProps} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Full-bleed footer — rides the same swipe block as title + form. */}
              <div className="cham-join-step__tablet-footer w-full shrink-0">
                <ChamMilesFormFooter />
              </div>
            </>
          ) : (
            <>
              {/* Phone: intro + form centered; footer pinned to bottom edge.
                  All three share the compact-body Y transform above. */}
              <div className="cham-join-step__mobile-main flex min-h-0 w-full flex-1 flex-col items-center justify-center px-6">
                <div className="cham-join-step__compact-intro mt-3 mb-0 max-w-xl shrink-0 self-center text-center">
                  <h2
                    className="m-0 font-bold leading-[1.05]"
                    style={{ fontSize: "clamp(26px, 7vw, 32px)" }}
                  >
                    <WriteOn
                      play={play}
                      perChar={TITLE_PER_CHAR}
                      joined={isAr}
                      segments={[
                        { text: joinStep.titleJoin, className: "text-(--cm-primary)" },
                        { text: joinStep.titleAccent, className: "text-(--cm-join-accent)" },
                        { text: joinStep.titleToday, className: "text-(--cm-primary)" },
                      ]}
                    />
                  </h2>
                  <p className="cham-join-step__desc cham-join-step__desc--desktop mx-auto max-w-lg text-(--cm-text)">
                    <FadeUp play={play} delay={subDelayCompact}>
                      {joinStep.descriptionDesktop}
                    </FadeUp>
                  </p>
                  <p className="cham-join-step__desc cham-join-step__desc--mobile mx-auto max-w-lg text-(--cm-text)">
                    <FadeUp play={play} delay={subDelayCompact}>
                      {joinStep.descriptionMobile}
                    </FadeUp>
                  </p>
                </div>
                <div className="cham-join-step__swipe-panel w-full">
                  <div className="mx-auto w-full max-w-xl">
                    <JoinForm variant="compact" {...formProps} />
                  </div>
                </div>
              </div>
              <div className="cham-join-step__mobile-footer w-full shrink-0">
                <ChamMilesFormFooter />
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Split — md/lg/xl (hidden on tablet portrait — compact is forced instead) */}
      <motion.div
        className={`cham-join-step cham-join-step--split absolute inset-0 overflow-hidden${joinStepArClass}${tabletSplitClass}`}
        style={{
          visibility: useCompactStack ? "hidden" : swipeVisibility,
          pointerEvents: useCompactStack ? "none" : joinStepPointer,
          ...(useCompactStack
            ? { display: "none", visibility: "hidden", pointerEvents: "none" }
            : null),
        }}
      >
        <motion.div
          aria-hidden
          className="cham-join-step__backdrop pointer-events-none absolute inset-0"
          style={{
            opacity: backdropOpacity,
            backgroundImage: `url(${tierBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "var(--cm-panel-bg)",
          }}
        />
        <motion.div
          style={{ opacity: swipeOpacity, y: swipeCardY }}
          className="cham-join-step__split-body absolute inset-0 flex h-full min-h-0 flex-col will-change-transform will-change-opacity"
        >
          <div
            className="cham-join-step__main flex min-h-0 flex-1 flex-col px-6 pt-3"
            style={
              isTablet
                ? {
                    justifyContent: "center",
                    overflow: "visible",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                  }
                : { overflow: "hidden" }
            }
          >
            <div
              className="cham-join-step__split min-h-0"
              style={
                isTablet
                  ? {
                      flex: "0 0 auto",
                      width: "100%",
                      marginTop: "auto",
                      marginBottom: "auto",
                      ...(isTabletPortrait
                        ? {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1.25rem",
                            maxWidth: "40rem",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }
                        : null),
                    }
                  : { flex: "1 1 auto" }
              }
            >
              <aside
                style={
                  isTabletPortrait
                    ? {
                        textAlign: "center",
                        borderRight: "none",
                        borderLeft: "none",
                        paddingRight: 0,
                        paddingLeft: 0,
                        maxWidth: "36rem",
                        width: "100%",
                        alignSelf: "center",
                      }
                    : undefined
                }
                className="cham-join-step__intro"
              >
                <h2 className="cham-join-step__title m-0 font-bold leading-[1.05]">
                  <span className="cham-join-step__title-line">
                    <WriteOn
                      play={play}
                      perChar={TITLE_PER_CHAR}
                      joined={isAr}
                      segments={[
                        { text: joinStep.titleJoin, className: "text-(--cm-primary)" },
                        { text: joinStep.titleAccent, className: "text-(--cm-join-accent)" },
                      ]}
                    />
                  </span>
                  <span className="cham-join-step__title-today text-(--cm-primary)">
                    <WriteOn
                      play={play}
                      perChar={TITLE_PER_CHAR}
                      startDelay={splitLine2Delay}
                      joined={isAr}
                      segments={[{ text: joinStep.titleTodaySplit }]}
                    />
                  </span>
                </h2>
                <p
                  className="cham-join-step__desc cham-join-step__desc--desktop m-0 text-(--cm-text)"
                  style={
                    isTablet
                      ? {
                          display: "block",
                          whiteSpace: "normal",
                          overflow: "visible",
                          maxWidth: isTabletPortrait ? "36rem" : "28rem",
                          marginInline: isTabletPortrait ? "auto" : 0,
                          fontSize: "0.9375rem",
                          lineHeight: 1.55,
                        }
                      : undefined
                  }
                >
                  <FadeUp play={play} delay={subDelaySplit}>
                    {joinStep.descriptionDesktop}
                  </FadeUp>
                </p>
                <p
                  className="cham-join-step__desc cham-join-step__desc--mobile m-0 text-(--cm-text)"
                  style={isTablet ? { display: "none" } : undefined}
                >
                  <FadeUp play={play} delay={subDelaySplit}>
                    {joinStep.descriptionMobile}
                  </FadeUp>
                </p>
              </aside>
              <div
                style={
                  isTablet
                    ? {
                        flex: "0 0 auto",
                        maxWidth: isTabletPortrait ? "36rem" : undefined,
                        width: isTabletPortrait ? "100%" : undefined,
                        alignSelf: isTabletPortrait ? "center" : undefined,
                      }
                    : undefined
                }
                className="cham-join-step__swipe-panel cham-join-step__form"
              >
                <div
                  className="cham-join-step__form-card w-full min-w-0"
                  style={isTablet ? { flex: "0 0 auto" } : undefined}
                >
                  <JoinForm variant="split" {...formProps} />
                </div>
              </div>
            </div>
          </div>
          <div className="cham-join-step__footer-bar w-full shrink-0">
            <ChamMilesFormFooter />
          </div>
        </motion.div>
      </motion.div>
        </>
      )}
    </div>
  );
}
