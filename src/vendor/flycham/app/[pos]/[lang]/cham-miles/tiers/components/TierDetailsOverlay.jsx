"use client";

import { motion } from "framer-motion";
import {
  TierDetailsCopy,
  TierDetailsCta,
  TierDetailsTabs,
} from "./TierDetailsParts";
import TabletTierDetailsColumn from "./TabletTierDetailsColumn";

/**
 * Tier-detail overlay: tab bar + heading/bullets + Join CTA.
 *
 * Desktop / wide: left panel (tabs above body).
 * Tablet: delegates to TabletTierDetailsColumn (title → tabs → copy → CTA).
 */
export default function TierDetailsOverlay({
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
  tabletLayout = false,
  carouselAnchorRef = null,
  detailsOpen = false,
}) {
  const active = detailTabs[activeTab] ?? detailTabs[0];

  if (tabletLayout) {
    return (
      <TabletTierDetailsColumn
        panelOpacity={panelOpacity}
        panelVisibility={panelVisibility}
        swipeY={swipeY}
        panelPointer={panelPointer}
        isAr={isAr}
        tierTabBarRef={tierTabBarRef}
        tierTabButtonRefs={tierTabButtonRefs}
        detailTabs={detailTabs}
        activeTab={activeTab}
        goToTab={goToTab}
        tierTabActiveLine={tierTabActiveLine}
        content={content}
        scrollToJoinForm={scrollToJoinForm}
        carouselAnchorRef={carouselAnchorRef}
        detailsOpen={detailsOpen}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 z-[36] block pointer-events-none will-change-transform"
      style={{
        opacity: panelOpacity,
        visibility: panelVisibility,
        y: swipeY,
      }}
    >
      <motion.div
        style={{ pointerEvents: panelPointer }}
        className={`cham-tier-details absolute flex w-auto flex-col left-[6vw] right-[6vw] md:left-[6vw] md:right-auto md:w-[40vw]${isAr ? " cham-tier-details--ar" : ""}`}
        lang={isAr ? "ar" : undefined}
      >
        <TierDetailsTabs
          tierTabBarRef={tierTabBarRef}
          tierTabButtonRefs={tierTabButtonRefs}
          detailTabs={detailTabs}
          activeTab={activeTab}
          goToTab={goToTab}
          tierTabActiveLine={tierTabActiveLine}
          isAr={isAr}
        />
        <div className="cham-tier-details__body">
          <TierDetailsCopy
            active={active}
            activeTab={activeTab}
            isAr={isAr}
          />
          <TierDetailsCta
            content={content}
            scrollToJoinForm={scrollToJoinForm}
            isAr={isAr}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
