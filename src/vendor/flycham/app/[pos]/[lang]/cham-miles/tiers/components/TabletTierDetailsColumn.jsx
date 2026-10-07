"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DURATION } from "../tiersConfig";
import {
  OurTiersSectionTitle,
  TierDetailsCopy,
  TierDetailsCta,
  TierDetailsTabs,
} from "./TierDetailsParts";

/**
 * Force one-line tab bar styles with `!important` via the DOM API.
 * Needed on iPad Safari: a cached stylesheet can keep grid rules.
 */
function forceTabletTabsRow(el) {
  if (!el) return;
  const set = (prop, val) => el.style.setProperty(prop, val, "important");
  set("display", "flex");
  set("flex-direction", "row");
  set("flex-wrap", "nowrap");
  set("align-items", "center");
  set("justify-content", "space-between");
  set("align-content", "center");
  set("column-gap", "0.35rem");
  set("row-gap", "0");
  set("width", "100%");
  set("max-width", "100%");
  set("border-bottom", "none");
  set("margin-bottom", "0");
  set("padding-bottom", "0");
  set("grid-template-columns", "none");
  set("grid-template-rows", "none");
}

/**
 * Place the column so the TABS row top aligns with the active carousel card
 * top (not the card center). Title stays above the tabs; description + CTA
 * flow below.
 */
function computeColumnTopPx({ overlay, column, tabs, anchor }) {
  if (!overlay || !column || !tabs || !anchor) return null;

  const overlayRect = overlay.getBoundingClientRect();
  const a = anchor.getBoundingClientRect();
  // Carousel anchor midY ≈ active card center; derive card top from aspect.
  const cardMidY = a.height > 1 ? a.top + a.height / 2 : a.top;
  const cardH = Math.max(a.width, 1) * (816 / 1256);
  const cardTop = cardMidY - cardH / 2;

  const columnRect = column.getBoundingClientRect();
  const tabsRect = tabs.getBoundingClientRect();
  const tabsTopOffsetInColumn = tabsRect.top - columnRect.top;

  return Math.round(cardTop - overlayRect.top - tabsTopOffsetInColumn);
}

/**
 * Tablet-only Our Tiers details column.
 *
 * Order (top → bottom):
 *   1. “Our Tiers” title
 *   2. Tabs — top edge aligned with the active card top
 *   3. Description (heading + bullets)
 *   4. Join now button
 */
export default function TabletTierDetailsColumn({
  panelOpacity,
  panelVisibility,
  swipeY,
  panelPointer,
  isAr,
  tierTabBarRef,
  tierTabButtonRefs,
  detailTabs,
  activeTab,
  goToTab,
  tierTabActiveLine,
  content,
  scrollToJoinForm,
  carouselAnchorRef = null,
  detailsOpen = false,
}) {
  const active = detailTabs[activeTab] ?? detailTabs[0];
  const overlayRef = useRef(null);
  const columnRef = useRef(null);
  const [columnTopPx, setColumnTopPx] = useState(null);

  useLayoutEffect(() => {
    if (!detailsOpen) {
      setColumnTopPx(null);
      return undefined;
    }

    const place = () => {
      forceTabletTabsRow(tierTabBarRef.current);
      const top = computeColumnTopPx({
        overlay: overlayRef.current,
        column: columnRef.current,
        tabs: tierTabBarRef.current,
        anchor: carouselAnchorRef?.current ?? null,
      });
      if (top != null) setColumnTopPx(top);
    };

    place();
    const raf = requestAnimationFrame(() => {
      place();
      requestAnimationFrame(place);
    });
    // Re-measure after card morph settles (tab switch / open).
    const tMorph = window.setTimeout(place, DURATION * 1000 + 40);

    const onViewport = () => place();
    window.addEventListener("resize", onViewport);
    window.addEventListener("orientationchange", onViewport);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(tMorph);
      window.removeEventListener("resize", onViewport);
      window.removeEventListener("orientationchange", onViewport);
    };
  }, [detailsOpen, activeTab, tierTabBarRef, carouselAnchorRef]);

  useLayoutEffect(() => {
    forceTabletTabsRow(tierTabBarRef.current);
  }, [activeTab, tierTabBarRef]);

  return (
    <motion.div
      ref={overlayRef}
      // Above Our Tiers row (z≈38) so tab/CTA hits aren’t stolen by morphing
      // peek cards. Overlay stays pointer-events:none; only the left column
      // enables hits — card taps on the right still pass through to the row.
      className="cham-tablet-tier-details absolute inset-0 z-[42] block pointer-events-none will-change-transform"
      style={{
        opacity: panelOpacity,
        visibility: panelVisibility,
        y: swipeY,
      }}
    >
      <div
        ref={columnRef}
        className={`cham-tablet-tier-details__column cham-tier-details--tablet${isAr ? " cham-tier-details--ar" : ""}`}
        style={{
          pointerEvents: panelPointer,
          // Always set top — CSS used to force `top:auto !important` and pin
          // the column to the page top. Fallback keeps it mid-viewport until
          // the card anchor is measured.
          top: columnTopPx != null ? `${columnTopPx}px` : "28vh",
        }}
        lang={isAr ? "ar" : undefined}
        data-active-tier={activeTab}
      >
        <OurTiersSectionTitle title={content.ourTiers.title} />
        <TierDetailsTabs
          tierTabBarRef={tierTabBarRef}
          tierTabButtonRefs={tierTabButtonRefs}
          detailTabs={detailTabs}
          activeTab={activeTab}
          goToTab={goToTab}
          tierTabActiveLine={tierTabActiveLine}
          isAr={isAr}
          compact
        />
        <TierDetailsCopy
          active={active}
          activeTab={activeTab}
          isAr={isAr}
          compact
        />
        <TierDetailsCta
          content={content}
          scrollToJoinForm={scrollToJoinForm}
          isAr={isAr}
          compact
        />
      </div>
    </motion.div>
  );
}
