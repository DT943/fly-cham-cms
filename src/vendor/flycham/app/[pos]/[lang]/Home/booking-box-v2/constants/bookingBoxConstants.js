// Constants for BookingBox component

/** Stable no-op for default callbacks; used to detect "home page" vs "modal" context. */
export const NOOP = () => {};

// Tab names
export const TABS = ["book", "manage"];

// Step IDs for booking flow
export const STEP_IDS = {
  FLYING_FROM: 0,
  FLYING_TO: 1,
  GUESTS: 2,
  TRAVEL_WHEN: 3,
};

// Trip type options
export const TRIP_TYPES = {
  ONEWAY: 'OneWay',
  RETURN: 'Return',
  MULTICITY: 'MultiCity',
};

// Restricted airports for destination logic
export const RESTRICTED_AIRPORTS = {
  DAM: "DAM",
  ALP: "ALP",
};

/** Only airport shown in the "New" section for booking-box-v2 / search-results. */
export const SEARCH_V2_NEW_AIRPORT_IATA = 'DMM';

// Default guest values
export const DEFAULT_GUEST_VALUES = {
  adults: 1,
  children: 0,
  infants: 0,
  infantsWithSeat: 0,
};

/** Lap infant + infant with own seat share the adults cap (search-results). */
export const INFANT_GUEST_KEYS = ['infants', 'infantsWithSeat'];

// Icon sizes
export const ICON_SIZES = {
  STEP_ICON: 20,
};

// Placeholder texts
export const PLACEHOLDERS = {
  SEARCH_AIRPORT: "Search for airport or city",
  DESTINATION: "To",
  CHECK_DATE: "Check Date",
};

// Modal titles
export const MODAL_TITLES = {
  DEPARTURE: "Departure",
};

// Guest summary labels
export const GUEST_LABELS = {
  ADT: "ADT",
  CHD: "CHD",
  INF: "INF",
  ADD_GUEST: "Add Guest",
  NO_GUESTS: "No guests selected",
};

// Airport type identifiers
export const AIRPORT_TYPES = {
  SOURCE: "source",
  DESTINATION: "destination",
};

// Dropdown keys for top‑level booking box menus
export const DROPDOWNS = {
  DEPARTURE: 'departure',
  PASSENGERS: 'passengers',
};

// Active tab values
export const ACTIVE_TABS = {
  BOOK: "book",
  MANAGE: "manage",
  FLIGHT_STATUS: "flight status",
};

// Tab navigation configuration
export const TAB_NAVIGATION = {
  DISABLED_TABS: [ACTIVE_TABS.FLIGHT_STATUS], // Tabs that should not be clickable
  TRANSITION_DURATION: 400, // milliseconds
};

// Tab navigation styles
export const TAB_STYLES = {
  BORDER_COLOR: "#E5E5E3",
  ACTIVE_COLOR: "text-main border-main",
  INACTIVE_COLOR: "text-gray-400 border-transparent",
  HOVER_COLOR: "hover:text-[#054E72]",
};

// Airport selector configuration
export const AIRPORT_SELECTOR = {
  FROM: 'from',
  TO: 'to',
  FALLBACKS: {
    DEPARTURE_CITY: 'Departure city',
    ARRIVAL_CITY: 'Arrival city',
    SELECT_ORIGIN: 'Select your origin',
    SELECT_DESTINATION: 'Select your destination',
  },
  LABELS: {
    FROM: 'From',
    TO: 'To',
  },
};

// Timing / delays (in milliseconds)
export const TIMING = {
  CALENDAR_AUTO_OPEN_DELAY_MS: 200,
};

// Button configuration
export const BUTTON_CONFIG = {
  SEARCH_FLIGHTS: {
    LABEL: 'Search',
    ID: 'search-flight-button',
    STYLES: {
      BASE: 'w-full mt-4 flex justify-center items-center gap-[10px] h-[56px] p-[10px] flex-shrink-0 rounded-[8px] text-sm font-bold transition',
      DISABLED: 'bg-gray-300 text-gray-500 cursor-not-allowed',
      ENABLED: 'bg-[#BAA981] text-btn cursor-pointer hover:bg-[#a89773]',
    },
  },
};

// ——— Multi-city / legs ———
/** Minimum number of legs in multi-city flow. */
export const MIN_MULTI_CITY_LEGS = 2;

/** Maximum legs — product supports exactly two trips for multi-city. */
export const MAX_MULTI_CITY_LEGS = 2;

/** Leg configs: id is 1-based; legIndex = id - 1 for values.legs[legIndex]. */
export const LEG_CONFIGS = [
  { id: 1, fromDropdownKey: 'from', toDropdownKey: 'to' },
  { id: 2, fromDropdownKey: 'from2', toDropdownKey: 'to2' },
  { id: 3, fromDropdownKey: 'from3', toDropdownKey: 'to3' },
];

/** Get leg config for any leg id (1-based). For 4+ legs, returns a derived config. */
export const getConfigForLeg = (legId) =>
  LEG_CONFIGS[legId - 1] || {
    id: legId,
    fromDropdownKey: legId === 1 ? 'from' : `from${legId}`,
    toDropdownKey: legId === 1 ? 'to' : `to${legId}`,
  };

// ——— Trip type selector options ———
export const TRIP_TYPE_OPTIONS = [
  { label: 'Round-trip', value: TRIP_TYPES.RETURN },
  { label: 'One-way', value: TRIP_TYPES.ONEWAY },
  // Multi-city hidden until product is ready
  { label: 'Multi-city', value: TRIP_TYPES.MULTICITY },
];

// ——— Guests / passengers ———
/** Passenger type options for the Guests component. */
export const GUEST_OPTIONS = [
  { label: 'Adults', sub: '+12 Years', key: 'adults' },
  {
    label: 'Child',
    sub: '2 - 12 Years',
    key: 'children',
    note: 'Child between 2 and 12 Years old receives the same baggage allowance as adults.',
  },
  {
    label: 'Infant',
    sub: 'Under 2 Years',
    key: 'infants',
    note: 'Infant under 2 Years receives a maximum of 10kg handbag allowance.',
  },
];

/** Cabin class options. */
export const CABIN_CLASS_OPTIONS = ['Economy', 'Business'];

/** Guest form field names (for reducer / formik sync). */
export const GUEST_FORM_FIELDS = ['adults', 'children', 'infants', 'infantsWithSeat', 'cabinClass', 'promoCode'];

/** Max total passengers; used in guests reducer. */
export const MAX_TOTAL_GUESTS = 9;

/** Minimum adults per booking. */
export const MIN_ADULTS = 1;

/** Guest count keys (adults, children, infants, infantsWithSeat). */
export const GUEST_KEYS = ['adults', 'children', 'infants', 'infantsWithSeat'];

// ——— Multi-city / legs ———
/** Minimum number of legs in multi-city flow. */

/** Leg configs: id is 1-based; legIndex = id - 1 for values.legs[legIndex]. */
// export const LEG_CONFIGS = [
//   { id: 1, fromDropdownKey: 'from', toDropdownKey: 'to' },
//   { id: 2, fromDropdownKey: 'from2', toDropdownKey: 'to2' },
//   { id: 3, fromDropdownKey: 'from3', toDropdownKey: 'to3' },
// ];


