// ./utils/bookingBoxUtils.js
import { NOOP, STEP_IDS } from "@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants";
import en from "@/app/[pos]/[lang]/Home/booking-box/content/en";



// Get "Country,IATA" string from airports list + selected id
export const getCityStringFromAirports = (airPortsItems, id) => {
  if (!airPortsItems || !id) return "";
  const city = airPortsItems.find((c) => c.id === id);
  return city
    ? `${city.airPortTranslations?.[0]?.country},${city.iataCode}`
    : "";
};

// Build guest summary label
export const buildGuestSummary = (
  { adults, children, infants, infantsWithSeat = 0, type },
  guestLabels = en.guestLabels,
) => {
  const parts = [];

  if (adults > 0) parts.push(`${adults}${guestLabels.adt}`);
  if (children > 0) parts.push(`${children}${guestLabels.chd}`);
  if (infants > 0) parts.push(`${infants}${guestLabels.inf}`);
  if (infantsWithSeat > 0) parts.push(`${infantsWithSeat}${guestLabels.ins ?? 'INS'}`);

  const isDetailStep = type === STEP_IDS.GUESTS || type === STEP_IDS.TRAVEL_WHEN;

  if (isDetailStep) {
    return parts.length > 0 ? parts.join(", ") : guestLabels.noGuests;
  }

  if (adults !== 1 || children !== 0 || infants !== 0 || infantsWithSeat !== 0) {
    return parts.join(", ");
  }

  return guestLabels.addGuest;
};

// Validate if moving from current step is allowed
export const isStepValid = (stepId, values) => {
  const { source, destination, adults, children, infants, infantsWithSeat = 0 } = values;

  switch (stepId) {
    case STEP_IDS.FLYING_FROM:
      return !!source;
    case STEP_IDS.FLYING_TO:
      return !!source && !!destination;
    case STEP_IDS.GUESTS:
      return (
        !!source &&
        !!destination &&
        (adults > 0 || children > 0 || infants > 0 || Number(infantsWithSeat) > 0)
      );
    default:
      return true;
  }
};

export const switchSourceDestinationValues = (values) => {
  const legs = Array.isArray(values.legs) ? values.legs : [];

  if (legs.length > 0) {
    const swappedLegs = legs.map((leg, index) => {
      if (index !== 0) return { ...leg };
      return {
        ...leg,
        source: leg?.destination ?? '',
        destination: leg?.source ?? '',
      };
    });
    const firstLeg = swappedLegs[0] || { source: '', destination: '' };

    return {
      ...values,
      legs: swappedLegs,
      // Keep flat keys in sync for legacy adapters (AirportList, mobile steps).
      source: firstLeg.source,
      destination: firstLeg.destination,
    };
  }

  // Legacy flat form (no legs array)
  return {
    ...values,
    source: values.destination,
    destination: values.source,
  };
};

/** True when the widget is embedded in modify-search (or similar) modal, not on the home page. */
export const isModalContext = (onCloseMidifySearch) =>
  Boolean(
    onCloseMidifySearch &&
      onCloseMidifySearch !== NOOP &&
      onCloseMidifySearch.toString() !== NOOP.toString(),
  );

export const MODIFY_SEARCH_SCROLL_ID = 'modify-search-modal-scroll';

/** Modal overlay (modify search) or page root for absolute dropdown overflow scroll. */
export const getBookingDropdownScrollContainer = () => {
  if (typeof document === 'undefined') return null;
  return (
    document.getElementById(MODIFY_SEARCH_SCROLL_ID) ?? document.documentElement
  );
};

/** Extra scroll padding so absolute dropdown panels can be reached by scrolling down. */
export const measureDropdownScrollPadding = (panelEl, viewportPad = 12) => {
  if (!panelEl || typeof window === 'undefined') return 0;
  const bottom = panelEl.getBoundingClientRect().bottom;
  return Math.max(0, Math.ceil(bottom - window.innerHeight + viewportPad));
};
