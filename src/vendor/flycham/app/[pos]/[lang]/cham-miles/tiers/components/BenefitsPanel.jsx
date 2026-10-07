"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { readChamMilesTabletUi } from "../hooks/useTiersViewport";

/**
 * "Benefits that matter to you" step — the intro copy plus the staggered list of
 * benefit cards. Slides in from the right and exits upward via the passed-in
 * motion values; each card's own x-slide comes from `cardStyles`.
 *
 * `layout`: "mobile" | "tablet" | "desktop" — driven by JS breakpoints (same as
 * the floating blue card). Tablet UI uses readChamMilesTabletUi so iPads keep
 * tablet layout while mouse laptops keep the 2xl side panel.
 */
export default function BenefitsPanel({
  opacity,
  x,
  y,
  isAr,
  active,
  content,
  benefits,
  cardStyles,
  onCta,
  layout = "desktop",
}) {
  const [mqTablet, setMqTablet] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const sync = () => setMqTablet(readChamMilesTabletUi());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Live tablet UI only — never let layout="tablet" alone steal XL/laptop UI.
  const isTablet = mqTablet;
  const isDesktop = !mqTablet && layout !== "mobile";

  return (
    <motion.div
      style={{
        opacity,
        x,
        y,
        // Inactive: drop under Our Tiers and hide from hit-testing.
        // Parent `pointer-events: none` alone is NOT enough — children default
        // to `auto` and the tablet panel is full-bleed at z-22, so it ate
        // every Our Tiers card tap after Benefits had visually exited.
        zIndex: active ? 22 : 0,
        visibility: active ? "visible" : "hidden",
        pointerEvents: active ? "auto" : "none",
        // Inline pad so tablet clearance cannot be lost to media-query / Tailwind fights
        ...(isTablet
          ? {
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              maxWidth: "100vw",
            }
          : null),
      }}
      className={[
        "cham-benefits-panel absolute flex h-screen flex-col gap-3 overflow-x-hidden overflow-y-auto will-change-transform",
        isDesktop
          ? "inset-x-auto right-0 top-8 w-[50vw] max-w-none overflow-visible px-[6vw] py-0"
          : "inset-x-0 top-0 w-full max-w-[100vw] px-[5vw] pt-[min(22vh,9.5rem)] pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]",
        isTablet ? "cham-benefits-panel--tablet" : "",
        isDesktop ? "cham-benefits-panel--desktop" : "",
        isAr ? "cham-benefits-panel--ar" : "",
        active ? "pointer-events-auto" : "pointer-events-none",
      ]
        .filter(Boolean)
        .join(" ")}
      dir={isAr ? "rtl" : "ltr"}
      lang={isAr ? "ar" : undefined}
      aria-hidden={active ? undefined : true}
    >
      <div className="cham-benefits-panel__copy">
        <h3 className="cham-benefits-panel__title m-0 font-semibold text-(--cm-primary)">
          {content.benefitsPanel.title}
        </h3>
        <p className="cham-benefits-panel__intro m-0 text-(--cm-text)">
          {content.benefitsPanel.intro}
        </p>
      </div>

      <ul
        className="cham-benefits-panel__list list-none p-0"
        style={
          isTablet
            ? {
                marginTop: "0.5rem",
                marginBottom: "0.75rem",
                minHeight: 0,
              }
            : undefined
        }
      >
        {benefits.map((b, i) => (
          <motion.li
            key={b.title}
            style={{ position: "relative", ...cardStyles[i] }}
            className="cham-benefits-panel__item w-full rounded-xl bg-(--cm-surface) will-change-transform"
          >
            <img
              src={b.img}
              alt={b.title}
              draggable={false}
              className="cham-benefits-panel__thumb rounded-md object-cover "
            />
            <div className="cham-benefits-panel__item-body min-w-0">
              <h4 className="cham-benefits-panel__item-title m-0 font-semibold text-(--cm-primary)">
                {b.title}
              </h4>
              <p className="cham-benefits-panel__item-desc m-0 text-(--cm-text)">
                {b.desc}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Early Bird CTA — hidden on all screens for now
      {content.benefitsPanel.cta ? (
        <button
          type="button"
          onClick={onCta}
          className="cham-benefits-panel__cta w-fit shrink-0 cursor-pointer rounded-lg bg-(--cm-primary) font-semibold text-(--cm-button-text) transition-opacity hover:opacity-90"
        >
          {content.benefitsPanel.cta}
        </button>
      ) : null}
      */}
    </motion.div>
  );
}
