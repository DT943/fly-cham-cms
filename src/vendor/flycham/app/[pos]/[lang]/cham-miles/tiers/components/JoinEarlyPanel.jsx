"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { resolveTiersJoinEarlyPose } from "../tiersJoinEarlyPose";

/**
 * "Join Early Earn More" step copy.
 *
 * Desktop / wide: left-stack — large stacked title + desc on the left,
 * card on the right (see tiersJoinEarlyCardPose.js). Matches the reference
 * screenshot. Tune sizes in tiersJoinEarlyPose.js.
 *
 * Composition stays LTR (left column + card right). Arabic keeps that dock
 * but sets in-column RTL typography (`dir="rtl"`, right-aligned lines).
 */
export default function JoinEarlyPanel({
  x,
  y,
  opacity,
  zIndex,
  visibility,
  isAr,
  isMobile,
  isTabletUi,
  bp,
  active,
  tiersStepActive,
  content,
}) {
  const pose = resolveTiersJoinEarlyPose({
    isMobile,
    isTabletUi: isTabletUi || bp === "tablet",
    bp,
    isAr,
  });
  const dockTopLeft = pose.dock === "top-left";
  const dockLeftStack = pose.dock === "left-stack";
  const showMobileTitle = isMobile;
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const textAlign = isAr ? "right" : "left";
  const textDir = isAr ? "rtl" : "ltr";

  const titleFont =
    pose.titleFontRem != null ? `${pose.titleFontRem}rem` : "4.25rem";
  const descFont =
    pose.descFontRem != null ? `${pose.descFontRem}rem` : "1.125rem";
  const remCap = pose.maxWidthRem != null ? pose.maxWidthRem : 36;

  useLayoutEffect(() => {
    titleRef.current?.style.setProperty("font-size", titleFont, "important");
    descRef.current?.style.setProperty("font-size", descFont, "important");
  }, [titleFont, descFont, showMobileTitle]);

  const colWidth =
    pose.maxWidthVw != null
      ? `min(${pose.maxWidthVw}vw, ${remCap}rem)`
      : `min(48vw, ${remCap}rem)`;

  const leftFlush = {
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    padding: 0,
    textAlign,
    direction: textDir,
    alignSelf: "stretch",
    boxSizing: "border-box",
  };

  // Stacked title lines: hug content width and stay on the LEFT of the column
  // so short RTL lines do not sit under the card.
  const titleLineStyle = {
    display: "block",
    width: isAr ? "fit-content" : "100%",
    maxWidth: "100%",
    textAlign,
    direction: textDir,
  };

  let dockStyle = {};
  if (dockTopLeft) {
    dockStyle = {
      ["--je-top"]: `${pose.y}vh`,
      ["--je-left"]: `${pose.x}vw`,
      ["--je-right"]: "auto",
      ["--je-width"]: colWidth,
      position: "absolute",
      top: `${pose.y}vh`,
      left: `${pose.x}vw`,
      right: "auto",
      bottom: "auto",
      width: colWidth,
      maxWidth: colWidth,
      height: "auto",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      textAlign,
      direction: textDir,
    };
  } else if (dockLeftStack) {
    // Desktop / wide — left column only (narrower on AR so card stays clear)
    dockStyle = {
      ["--je-width"]: colWidth,
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: "auto",
      height: "100%",
      width: isAr ? "38vw" : "52vw",
      paddingLeft: `${pose.x}vw`,
      paddingRight: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      textAlign,
      direction: textDir,
      boxSizing: "border-box",
    };
  } else {
    // Mobile flow — pin copy to the left; reserve the right side for the card
    dockStyle = {
      paddingTop: `${pose.y}vh`,
      paddingLeft: isMobile ? "4vw" : `${pose.x}vw`,
      paddingRight: isMobile && isAr ? "42vw" : isMobile ? undefined : 0,
      maxWidth: isMobile && isAr ? "100%" : undefined,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign,
      direction: textDir,
    };
  }

  const [t0, t1, t2] = content.joinEarly.titleDesktop;

  return (
    <motion.div
      style={{
        x,
        y,
        opacity,
        zIndex,
        visibility,
        ...dockStyle,
      }}
      className={[
        "cham-join-early absolute flex flex-col will-change-transform",
        dockTopLeft
          ? "cham-join-early--tablet cham-join-early--dock-tl cham-join-early--flush-v2"
          : dockLeftStack
            ? "cham-join-early--desktop-stack inset-y-0 left-0"
            : isMobile
              ? `inset-y-0 left-0 w-full justify-start items-stretch${isAr ? " cham-join-early--mobile-ar" : " px-4 text-left"}`
              : "inset-y-0 left-0 w-full md:w-[55vw] md:justify-center md:pt-0 md:px-0 items-stretch text-left",
        isAr ? "cham-join-early--ar" : "",
        active && !tiersStepActive
          ? "pointer-events-auto"
          : "pointer-events-none cham-join-early--inert",
      ]
        .filter(Boolean)
        .join(" ")}
      lang={isAr ? "ar" : undefined}
      dir={textDir}
      aria-hidden={active ? undefined : true}
      data-join-early-pose={pose.key}
    >
      <div
        className="cham-join-early__copy cham-join-early__copy--flush-v2"
        style={{
          display: "block",
          width:
            dockLeftStack || dockTopLeft || (isMobile && isAr)
              ? colWidth
              : "100%",
          maxWidth:
            dockLeftStack || dockTopLeft || (isMobile && isAr)
              ? colWidth
              : "100%",
          margin: 0,
          padding: 0,
          textAlign,
          direction: textDir,
        }}
      >
        {showMobileTitle ? (
          isAr ? (
            <div
              className="cham-join-early__title-stack"
              style={{
                ...leftFlush,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <h2
                ref={titleRef}
                className="cham-join-early__title cham-join-early__title--mobile m-0 font-bold leading-[1.05] text-(--cm-primary)"
                style={{ ...titleLineStyle, fontSize: titleFont }}
              >
                {content.joinEarly.titleMobile[0]}
              </h2>
              <h2
                className="cham-join-early__title cham-join-early__title--mobile cham-join-early__title--accent m-0 font-bold leading-[1.05] text-(--cm-accent)"
                style={{ ...titleLineStyle, fontSize: titleFont }}
              >
                {content.joinEarly.titleMobile[1]}
              </h2>
            </div>
          ) : (
            <h2
              ref={titleRef}
              className="cham-join-early__title cham-join-early__title--mobile m-0 font-bold leading-[1.05] text-(--cm-primary)"
              style={{ ...leftFlush, fontSize: titleFont }}
            >
              {content.joinEarly.titleMobile[0]}
              <span className="text-(--cm-accent)">{content.joinEarly.titleMobile[1]}</span>
              {content.joinEarly.titleMobile[2]}
            </h2>
          )
        ) : (
          <h2
            ref={titleRef}
            className="cham-join-early__title cham-join-early__title--stacked m-0 font-bold leading-[1.05] text-(--cm-primary)"
            style={{
              ...leftFlush,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              fontSize: titleFont,
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            <span style={titleLineStyle}>{t0}</span>
            <span
              className="cham-join-early__title--accent-inline"
              style={{ ...titleLineStyle, color: "var(--cm-accent)" }}
            >
              {t1}
            </span>
            <span style={titleLineStyle}>{t2}</span>
          </h2>
        )}

        <p
          ref={descRef}
          className="cham-join-early__desc m-0 text-(--cm-text)"
          style={{
            ...leftFlush,
            display: "block",
            marginTop: dockLeftStack ? "1.25rem" : "0.875rem",
            fontSize: descFont,
            lineHeight: 1.5,
            maxWidth:
              pose.descMaxRem != null ? `${pose.descMaxRem}rem` : "100%",
          }}
        >
          {content.joinEarly.description}
        </p>
      </div>
    </motion.div>
  );
}
