"use client";

/**
 * TierFlipCard
 * ------------
 * A single tier card that flips between its front artwork and its matching back.
 * Self-contained and presentational: when `interactive` is false it renders a
 * plain image; otherwise it builds the flip scene and picks the back image from
 * the card's `details.key`. Owns its own back-image lookup table.
 */

const blueCardBack = "/cham-miles/blue-card-back.png";
const silverCardBack = "/cham-miles/silver-card-back.png";
const goldCardBack = "/cham-miles/gold-card-back.png";
const blackCardBack = "/cham-miles/black-card-back.png";

const TIER_CARD_BACK_BY_KEY = {
  blue: blueCardBack,
  silver: silverCardBack,
  gold: goldCardBack,
  diamond: blackCardBack,
};

export default function TierFlipCard({
  imageSrc,
  imageAlt,
  details,
  interactive = true,
  flipEnabled,
  detailsLabel,
  onViewDetails,
  floating = false,
}) {
  const isBenefitsCard = imageSrc.includes("/benefits/");
  const nativeCorners = !isBenefitsCard;
  const canFlip = flipEnabled ?? interactive;

  if (!interactive) {
    return (
      <div
        className={`tier-card-frame relative w-full${nativeCorners ? " tier-card-frame--native-corners" : ""}${
          floating ? " tier-flip-scene--floating" : ""
        }`}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          draggable={false}
          className={[
            "block w-full select-none",
            floating
              ? "tier-flip-card-img tier-flip-card-img--floating"
              : "drop-shadow-xl",
            nativeCorners ? "tier-flip-card-img--native" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>
    );
  }

  const sceneClass = [
    "tier-flip-scene",
    "tier-card-frame",
    nativeCorners ? "tier-flip-scene--native-corners tier-card-frame--native-corners" : "",
    canFlip ? "tier-flip-scene--flip-enabled" : "",
    !canFlip && interactive ? "tier-flip-scene--reset-flip" : "",
    floating ? "tier-flip-scene--floating" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imgClass = [
    "tier-flip-card-img",
    "select-none",
    isBenefitsCard ? "tier-flip-card-img--benefits" : "tier-flip-card-img--native",
    floating ? "tier-flip-card-img--floating" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sceneClass}>
      <div className="tier-flip-inner">
        <div className="tier-flip-face tier-flip-front">
          <img src={imageSrc} alt={imageAlt} draggable={false} className={imgClass} />
        </div>
        <div className="tier-flip-face tier-flip-back">
          <img
            src={TIER_CARD_BACK_BY_KEY[details.key] ?? blueCardBack}
            alt=""
            draggable={false}
            className={imgClass}
          />
          {!isBenefitsCard && detailsLabel ? (
            <button
              type="button"
              className="tier-flip-view-details"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.();
              }}
              tabIndex={-1}
            >
              {detailsLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
