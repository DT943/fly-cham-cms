"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TierFlipCard from "../TierFlipCard";
import { blackCard, card, goldCard, silverCard } from "../tiersConfig";
import { readChamMilesTabletUi } from "../hooks/useTiersViewport";
import OurTiersBackButton from "./OurTiersBackButton";

/**
 * Desktop "Our Tiers" group: title, subtitle, the Blue/Silver/Gold/Diamond card
 * row, and the "Become a Member" CTA.
 *
 * Tablet (touch / ≤1023, or multi-touch iPad): centered 2×2 grid. Mouse laptops
 * keep the horizontal 2xl-style row even between 1024–1279.
 */
export default function OurTiersRow({
  tiersStepActive,
  blueCardLanded,
  joinStepActive,
  detailsActive,
  detailsOpen,
  detailsClosing,
  tierGroupVisibility,
  tierRowCombinedY,
  detailsGroupZCombined,
  isAr,
  ourTiersTitleOpacity,
  detailsTitleLeft,
  detailsTitleX,
  ourTiersSubtitleOpacity,
  content,
  ourTierCards,
  tierCardStyles,
  tierRiseRefs,
  activeTab,
  tierCardRefs,
  tierSlotRef,
  detailTabs,
  isMobile,
  goToTab,
  openDetails,
  tierLabelOpacity,
  memberButtonOpacity,
  scrollToJoinForm,
  scrollToPrevStep,
  tabletLayout = false,
}) {
  const [mqTablet, setMqTablet] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setMqTablet(readChamMilesTabletUi());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // 2×2 only on real tablet UI — never from tabletLayout alone on XL/laptop.
  const isTabletGrid = Boolean(mqTablet) && !isMobile;

  const tierRowInteractive =
    tiersStepActive && blueCardLanded && !joinStepActive && !detailsActive;
  const tierCarouselInteractive = detailsOpen && !detailsClosing;
  // Back only on the vertical details carousel — not on the grid / card-row rest.
  const backVisible =
    tiersStepActive &&
    blueCardLanded &&
    !joinStepActive &&
    detailsOpen &&
    !detailsClosing;

  // Inline — must not depend solely on stylesheet (real iPad was stacking
  // as `display:block` + `width:17vw` when grid CSS missed).
  const tabletGridStyle = isTabletGrid
    ? {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gridTemplateRows: "repeat(2, auto)",
        justifyItems: "center",
        alignItems: "start",
        columnGap: "1.75rem",
        rowGap: "1.5rem",
        // Below title + 2-line subtitle so copy never overlaps cards.
        // Use left calc (not Framer `x: -50%`) so parent transform does not
        // compose with carousel morph `x`/`y` on the cards.
        // CSS `--tablet-2xl` rule wins with !important; keep this in sync.
        top: "34vh",
        bottom: "auto",
        left: "max(0px, calc(50% - min(36rem, 86vw) / 2))",
        right: "auto",
        width: "min(36rem, 86vw)",
        paddingLeft: 0,
        paddingRight: 0,
      }
    : undefined;

  const tiers = [
    // Blue is always the floating card (desktop + tablet) — empty slot is the
    // land / measure target. Painting a second Blue in the tablet grid caused
    // a flicker when the floater hid and the grid image popped in.
    { ...ourTierCards[0], img: null, clickable: true },
    { ...ourTierCards[1], img: silverCard, clickable: true },
    { ...ourTierCards[2], img: goldCard, clickable: true },
    { ...ourTierCards[3], img: blackCard, clickable: true },
  ];

  return (
    <motion.div
      style={{ opacity: 1, visibility: tierGroupVisibility, y: tierRowCombinedY, zIndex: detailsGroupZCombined }}
      className={`cham-our-tiers pointer-events-none absolute inset-0 block will-change-transform${isAr ? " cham-our-tiers--ar" : ""}${isTabletGrid ? " cham-our-tiers--tablet-2xl" : ""}`}
      lang={isAr ? "ar" : undefined}
      aria-hidden={
        tierRowInteractive || tierCarouselInteractive || backVisible
          ? undefined
          : true
      }
    >
      <OurTiersBackButton
        onBack={scrollToPrevStep}
        label={content.ourTiers.back}
        visible={backVisible}
        isAr={isAr}
      />

      <motion.h2
        style={{
          opacity: ourTiersTitleOpacity,
          left: detailsTitleLeft,
          x: detailsTitleX,
          // Tablet details column owns the title — hide the row title to avoid
          // a duplicate floating above the tabs.
          ...(isTabletGrid && detailsActive
            ? { visibility: "hidden", pointerEvents: "none" }
            : null),
        }}
        className="cham-our-tiers__title pointer-events-none absolute m-0 inline-block whitespace-nowrap font-bold tracking-tight text-(--cm-primary)"
        aria-hidden={isTabletGrid && detailsActive ? true : undefined}
      >
        <span>{content.ourTiers.title}</span>
      </motion.h2>

      <motion.p
        style={{ opacity: ourTiersSubtitleOpacity }}
        className="cham-our-tiers__subtitle pointer-events-none absolute left-0 right-0 z-10 m-0 mx-auto px-6 text-center text-(--cm-text)"
      >
        {content.ourTiers.subtitle}
      </motion.p>

      <motion.div
        style={tabletGridStyle}
        className={`cham-our-tiers__cards-row pointer-events-none absolute overflow-visible${
          isTabletGrid
            ? " cham-our-tiers__cards-row--tablet-grid"
            : " inset-x-0 flex items-end justify-center px-[6vw]"
        }`}
      >
        {tiers.map((tier, i) => {
          const cardStyle = tierCardStyles[i];
          const interactive = tier.clickable && tierRowInteractive;
          const carouselInteractive = tierCarouselInteractive;
          // Desktop / tablet: floating Blue is the continuous Blue card for the
          // whole details carousel (center OR peek). Never reveal the grid Blue
          // slot mid-hop — that caused a white flash when leaving Blue.
          const hideBlueSlot = i === 0 && detailsActive;
          const hasCardImage = Boolean(tier.img);
          // Carousel: only adjacent peeks take hits. The active (center) card
          // is larger + higher z-index and would otherwise swallow taps on the
          // Gold/Silver peeks that sit partly under it.
          const isCarouselPeek =
            carouselInteractive && Math.abs(i - activeTab) === 1;
          // Grid open: whole slot is the hit target. Carousel: ONLY the
          // transformed peek card — empty 2×2 slots (e.g. Diamond’s cell)
          // still sit under the visual Silver peek and would steal the click.
          const slotHitTarget = interactive;
          const cardHitTarget = interactive || isCarouselPeek;
          const onCardActivate = () => {
            // Vertical carousel open: same as tapping a tab label.
            if (carouselInteractive) {
              if (i !== activeTab) goToTab(i);
              return;
            }
            if (!interactive) return;
            openDetails(i);
          };
          return (
            <div
              key={tier.title}
              ref={(el) => {
                tierRiseRefs.current[i] = el;
              }}
              className={`cham-our-tiers__card-slot relative flex flex-col items-center ${slotHitTarget ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
              style={
                isTabletGrid
                  ? { width: "100%", maxWidth: "none" }
                  : undefined
              }
              data-tier-index={i}
              data-tier-active={carouselInteractive && i === activeTab ? "true" : undefined}
              data-tier-peek={isCarouselPeek ? "true" : undefined}
              onClick={slotHitTarget ? onCardActivate : undefined}
              onKeyDown={
                cardHitTarget
                  ? (e) => {
                      if (e.key !== "Enter" && e.key !== " ") return;
                      e.preventDefault();
                      onCardActivate();
                    }
                  : undefined
              }
              role={cardHitTarget ? "button" : undefined}
              tabIndex={cardHitTarget ? 0 : -1}
              aria-label={
                cardHitTarget
                  ? detailTabs[i]?.label ?? tier.title
                  : undefined
              }
              aria-pressed={carouselInteractive ? i === activeTab : undefined}
            >
              <motion.div
                ref={tierCardRefs[i]}
                style={{
                  x: cardStyle.x,
                  y: cardStyle.y,
                  scale: cardStyle.scale,
                  opacity: hideBlueSlot ? 0 : cardStyle.opacity,
                  zIndex: cardStyle.zIndex,
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                  // Hit target follows the morph (peek cards sit outside the
                  // grid slot box — without this, taps miss on the slider).
                  // Active center card: none so peeks underneath stay tappable.
                  pointerEvents: cardHitTarget ? "auto" : "none",
                  cursor: cardHitTarget ? "pointer" : "default",
                }}
                className="relative w-full will-change-transform"
                onClick={
                  cardHitTarget
                    ? (e) => {
                        // Fire on the transformed card itself (not only the slot).
                        e.stopPropagation();
                        onCardActivate();
                      }
                    : undefined
                }
              >
                {hasCardImage ? (
                  <div className="tier-flip-host group w-full">
                    {/* Keep flip scene mounted when details open so a back-face
                        card animates to front (`--reset-flip`) like blue — do
                        not swap to a plain <img> (that snapped with no flip). */}
                    {isTabletGrid ? (
                      <TierFlipCard
                        imageSrc={i === 0 ? card : tier.img}
                        imageAlt={tier.title}
                        details={detailTabs[i]}
                        interactive={hasCardImage}
                        flipEnabled={tierRowInteractive && hasCardImage}
                        detailsLabel={content.ourTiers.viewDetails}
                        onViewDetails={onCardActivate}
                      />
                    ) : (
                      <div className="cham-our-tiers__card-hires">
                        <TierFlipCard
                          imageSrc={i === 0 ? card : tier.img}
                          imageAlt={tier.title}
                          details={detailTabs[i]}
                          interactive={hasCardImage}
                          flipEnabled={!isMobile && tierRowInteractive && hasCardImage}
                          detailsLabel={content.ourTiers.viewDetails}
                          onViewDetails={onCardActivate}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    ref={tierSlotRef}
                    className="relative w-full"
                    style={{ aspectRatio: "1.6 / 1" }}
                  />
                )}
              </motion.div>
              <motion.div
                className="cham-our-tiers__card-labels text-center"
                style={{
                  opacity: tierLabelOpacity,
                  ...(isTabletGrid
                    ? { fontSize: undefined }
                    : null),
                }}
              >
                <div
                  className="cham-our-tiers__card-name font-semibold tracking-wide text-(--cm-text)"
                  style={isTabletGrid ? { fontSize: "1.25rem" } : undefined}
                >
                  {tier.title}
                </div>
                <div
                  className="cham-our-tiers__card-sub mt-1 text-(--cm-text)/80"
                  style={isTabletGrid ? { fontSize: "1rem" } : undefined}
                >
                  {tier.sub}
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
      <motion.div
        style={{
          opacity: memberButtonOpacity,
          ...(isTabletGrid && detailsActive
            ? { visibility: "hidden", pointerEvents: "none" }
            : null),
        }}
        className="cham-our-tiers__cta-wrap pointer-events-none absolute inset-x-0 z-10 flex justify-center"
      >
        <button
          type="button"
          onClick={scrollToJoinForm}
          className={`cham-our-tiers__cta ${tiersStepActive && blueCardLanded && !joinStepActive && !detailsActive ? "pointer-events-auto" : "pointer-events-none"} cursor-pointer rounded-lg bg-(--cm-primary) font-semibold text-(--cm-button-text) transition-opacity hover:opacity-90`}
          tabIndex={tiersStepActive && blueCardLanded && !joinStepActive && !detailsActive ? 0 : -1}
          aria-hidden={tiersStepActive && blueCardLanded && !joinStepActive && !detailsActive ? undefined : true}
        >
          {content.ourTiers.cta}
        </button>
      </motion.div>
    </motion.div>
  );
}
