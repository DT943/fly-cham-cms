"use client";

import { motion } from "framer-motion";
import { DURATION, EASE } from "../tiersConfig";

/**
 * Shared Our Tiers detail pieces — used by desktop TierDetailsOverlay and the
 * tablet column layout. Presentation only; parents own placement.
 */

export function TierDetailsTabs({
  tierTabBarRef,
  tierTabButtonRefs,
  detailTabs,
  activeTab,
  goToTab,
  tierTabActiveLine,
  isAr,
  compact = false,
}) {
  const active = detailTabs[activeTab] ?? detailTabs[0];

  return (
    <div
      ref={tierTabBarRef}
      className={`cham-tier-details__tabs relative w-full${
        compact
          ? " cham-tabs-onerow"
          : ` flex flex-col md:flex-row${isAr ? " justify-end" : " items-start md:items-center"}`
      }`}
      data-tabs-layout={compact ? "onerow" : "desktop"}
      style={
        compact
          ? {
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.35rem",
              width: "100%",
              borderBottom: "none",
              position: "relative",
              zIndex: 2,
              flexShrink: 0,
            }
          : undefined
      }
    >
      {detailTabs.map((tab, i) => {
        const isActive = i === activeTab;
        return (
          <button
            type="button"
            key={tab.key}
            ref={(el) => {
              tierTabButtonRefs.current[i] = el;
            }}
            data-tier-tab={i}
            data-tier-tab-active={isActive ? "true" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              goToTab(i);
            }}
            aria-current={isActive ? "true" : undefined}
            className={`cham-tier-details__tab relative flex items-center cursor-pointer ${
              isActive
                ? "font-semibold text-(--cm-text)"
                : "cham-tier-details__tab--inactive text-(--cm-form-text)"
            }`}
            style={
              compact
                ? {
                    display: "inline-flex",
                    flex: "0 0 auto",
                    width: "fit-content",
                    maxWidth: "none",
                    background: "transparent",
                    borderRadius: 0,
                    border: "none",
                    borderBottom: "none",
                    boxShadow: "none",
                    padding: "0.25rem 0 0.4rem",
                    gap: "0.35rem",
                  }
                : undefined
            }
          >
            <span
              className="cham-tier-details__tab-dot inline-block rounded-full"
              style={{ background: tab.color, flexShrink: 0 }}
            />
            <span
              className="cham-tier-details__tab-label"
              style={
                compact
                  ? {
                      fontSize: "clamp(0.875rem, 1.9vw, 1.125rem)",
                      whiteSpace: "nowrap",
                    }
                  : undefined
              }
            >
              {tab.label}
            </span>
          </button>
        );
      })}
      <span
        aria-hidden
        className="cham-tier-details__tab-track pointer-events-none absolute"
        style={{
          left: tierTabActiveLine.trackLeft,
          width: tierTabActiveLine.trackWidth,
          top: "auto",
          bottom: 0,
        }}
      />
      <motion.span
        aria-hidden
        className="cham-tier-details__tab-indicator pointer-events-none absolute"
        initial={false}
        animate={{
          left: tierTabActiveLine.left,
          width: tierTabActiveLine.width,
          backgroundColor: active?.color ?? "#006080",
        }}
        transition={{ duration: DURATION, ease: EASE }}
        style={{
          top: "auto",
          bottom: 0,
        }}
      />
    </div>
  );
}

export function TierDetailsCopy({
  active,
  activeTab,
  isAr,
  compact = false,
  headingRef = null,
}) {
  const titleMotion = compact
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.35, ease: EASE },
      }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: EASE },
      };

  const listItemVariants = compact
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.35, ease: EASE },
        },
      }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE },
        },
      };

  return (
    <div
      className="cham-tier-details__copy"
      style={
        compact
          ? {
              flex: "0 1 auto",
              minHeight: 0,
              maxHeight: "36vh",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }
          : undefined
      }
    >
      <motion.h3
        key={`h-${activeTab}`}
        ref={headingRef}
        initial={titleMotion.initial}
        animate={titleMotion.animate}
        transition={titleMotion.transition}
        className={`cham-tier-details__heading m-0 font-semibold tracking-tight text-(--cm-text)${isAr ? " text-right" : ""}`}
        style={
          compact
            ? { fontSize: "1.5rem", lineHeight: 1.2 }
            : undefined
        }
      >
        {active.heading}
      </motion.h3>
      <motion.ul
        key={`l-${activeTab}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: compact ? 0.05 : 0.08,
              delayChildren: compact ? 0.05 : 0.1,
            },
          },
        }}
        className="cham-tier-details__list m-0 flex w-full max-w-md list-none flex-col break-words p-0 text-(--cm-text)"
        style={
          compact
            ? { fontSize: "1.0625rem", lineHeight: 1.45, gap: "0.4rem" }
            : undefined
        }
      >
        {active.bullets.map((b, idx) => (
          <motion.li key={idx} variants={listItemVariants}>
            {b}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export function TierDetailsCta({ content, scrollToJoinForm, isAr, compact = false }) {
  return (
    <button
      type="button"
      onClick={() => scrollToJoinForm()}
      style={
        compact
          ? {
              flexShrink: 0,
              marginTop: 0,
              alignSelf: isAr ? "flex-end" : "flex-start",
              fontSize: "1.125rem",
              padding: "0.75rem 2.5rem",
            }
          : undefined
      }
      className="cham-tier-details__cta pointer-events-auto w-fit shrink-0 cursor-pointer rounded-lg bg-(--cm-primary) font-semibold text-(--cm-button-text) transition-opacity hover:opacity-90"
    >
      {content.tierDetails.joinNow}
    </button>
  );
}

export function OurTiersSectionTitle({ title, className = "" }) {
  return (
    <h2
      className={`cham-our-tiers__title cham-our-tiers__title--in-details m-0 font-bold tracking-tight text-(--cm-primary)${className ? ` ${className}` : ""}`}
    >
      <span>{title}</span>
    </h2>
  );
}
