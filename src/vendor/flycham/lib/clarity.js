/**
 * Legacy filename — booking funnel track* helpers only.
 * All events push to window.dataLayer via src/lib/analytics.js; GTM delivers to GA4 + Clarity.
 * Do not import @microsoft/clarity or call Clarity.event() here.
 */
import { pushAnalyticsEvent, pushBookingLegacyEvent } from '@/lib/analytics';
import {
  buildSearchContextFromFormValues,
  setBookingAnalyticsContext,
  toAnalyticsDateKey,
} from '@/lib/bookingAnalyticsContext';

/**
 * Legacy Clarity event names — kept for track* wrapper compatibility.
 * Events are routed through GTM dataLayer (see src/lib/analytics.js).
 */
export const CLARITY_EVENTS = {
  SEARCH_FLIGHTS_ONE_WAY_ECONOMY: 'search_flights_one_way_economy',
  SEARCH_FLIGHTS_ONE_WAY_BUSINESS: 'search_flights_one_way_business',
  SEARCH_FLIGHTS_ROUND_TRIP_ECONOMY: 'search_flights_round_trip_economy',
  SEARCH_FLIGHTS_ROUND_TRIP_BUSINESS: 'search_flights_round_trip_business',
  MODIFY_SEARCH: 'modify_search',
  TRIP_TYPE_ONE_WAY: 'booking_trip_type_one_way',
  TRIP_TYPE_ROUND_TRIP: 'booking_trip_type_round_trip',
  TRIP_TYPE_MULTI_CITY: 'booking_trip_type_multi_city',
  BOOKING_TAB_BOOK: 'booking_tab_book',
  BOOKING_TAB_MANAGE: 'booking_tab_manage',
  ORIGIN_AIRPORT_SELECTED: 'booking_origin_airport_selected',
  RETURN_AIRPORT_SELECTED: 'booking_return_airport_selected',
  CABIN_CLASS_ECONOMY: 'booking_cabin_class_economy',
  CABIN_CLASS_BUSINESS: 'booking_cabin_class_business',
  DEPARTURE_DATE_SELECTED: 'booking_departure_date_selected',
  RETURN_DATE_SELECTED: 'booking_return_date_selected',
  PASSENGER_ADULTS: 'booking_passenger_adults',
  PASSENGER_CHILDREN: 'booking_passenger_children',
  PASSENGER_INFANTS: 'booking_passenger_infants',
  PASSENGER_INFANTS_WITH_SEAT: 'booking_passenger_infants_with_seat',
  SEARCH_SUBMITTED: 'booking_search_submitted',
  FLIGHT_SELECTION_ACCEPTED: 'booking_flight_selection_accepted',
  FARE_LIGHT_SELECTED: 'booking_fare_light_selected',
  FARE_SMART_SELECTED: 'booking_fare_smart_selected',
  FARE_PREMIUM_SELECTED: 'booking_fare_premium_selected',
  FARE_ELITE_SELECTED: 'booking_fare_elite_selected',
  FARE_BUSINESS_SELECTED: 'booking_fare_business_selected',
  NEARBY_AIRPORTS_ENABLED: 'booking_nearby_airports_enabled',
  SELECTED_FLIGHT_SUCCESS: 'booking_selected_flight_success',
  PROCEED_PASSENGER_DETAILS: 'booking_proceed_passenger_details',
  PASSENGER_INFO_SUCCESS: 'booking_passenger_info_success',
  PAYMENT_SUBMIT: 'booking_payment_submit',
  BOOKING_CONFIRM_VIEWED: 'booking_confirm_viewed',
  PASSENGER_INFO_STARTED: 'booking_passenger_info_started',
  PASSENGER_INFO_TITLE: 'booking_passenger_info_title',
  PASSENGER_INFO_FIRST_NAME: 'booking_passenger_info_first_name',
  PASSENGER_INFO_LAST_NAME: 'booking_passenger_info_last_name',
  PASSENGER_INFO_DATE_OF_BIRTH: 'booking_passenger_info_date_of_birth',
  PASSENGER_INFO_NATIONALITY: 'booking_passenger_info_nationality',
  PASSENGER_INFO_CONTACT_ADULT: 'booking_passenger_info_contact_adult',
  PASSENGER_INFO_CONTACT_COUNTRY_CODE: 'booking_passenger_info_contact_country_code',
  PASSENGER_INFO_CONTACT_PHONE: 'booking_passenger_info_contact_phone',
  PASSENGER_INFO_CONTACT_EMAIL: 'booking_passenger_info_contact_email',
  PASSENGER_INFO_CONTACT_ALT_PHONE: 'booking_passenger_info_contact_alt_phone',
  SEAT_MAP_LOADED: 'booking_seat_map_loaded',
  BAGGAGE_OPTIONS_LOADED: 'booking_baggage_options_loaded',
  SEAT_CLICKED: 'booking_seat_clicked',
  SEAT_SELECTION_CONFIRMED: 'booking_seat_selection_confirmed',
  SEAT_SELECTION_SKIPPED: 'booking_seat_selection_skipped',
  BAGGAGE_OPTION_SELECTED: 'booking_baggage_option_selected',
  BAGGAGE_CONFIRM_SUBMITTED: 'booking_baggage_confirm_submitted',
  SEAT_REMOVED: 'booking_seat_removed',
  BAGGAGE_REMOVED: 'booking_baggage_removed',
  ANCILLARY_PAGE_RENDERED: 'booking_ancillary_page_rendered',
  WHEELCHAIR_OPENED: 'booking_wheelchair_opened',
  WHEELCHAIR_PASSENGER_ADDED: 'booking_wheelchair_passenger_added',
  WHEELCHAIR_PASSENGER_REMOVED: 'booking_wheelchair_passenger_removed',
  LOUNGE_OPENED: 'booking_lounge_opened',
  LOUNGE_PASSENGER_ADDED: 'booking_lounge_passenger_added',
  LOUNGE_PASSENGER_REMOVED: 'booking_lounge_passenger_removed',
  /** Availability API returned flights on search-results. */
  SEARCH_API_SUCCESS: 'booking_search_api_success',
  /** Availability API failed (HTTP or business error). */
  SEARCH_API_FAILED: 'booking_search_api_failed',
  /** Availability API succeeded with zero bookable flights. */
  SEARCH_API_EMPTY: 'booking_search_api_empty',
  /** Search-results step 0 UI rendered after availability settled. */
  SEARCH_RESULTS_VIEW: 'booking_search_results_view',
  /** CreatePassengerInfo API or validation failed on submit. */
  PASSENGER_INFO_FAILED: 'booking_passenger_info_failed',
  /** Payment step (step 3) rendered with payment options loaded. */
  PAYMENT_STEP_VIEW: 'booking_payment_step_view',
  /** User selected a payment gateway or Stripe sub-method. */
  PAYMENT_METHOD_SELECTED: 'booking_payment_method_selected',
  /** Required payment fee + terms checkboxes both accepted. */
  PAYMENT_TERMS_ACCEPTED: 'booking_payment_terms_accepted',
  /** Browser navigates to external gateway / 3DS flow. */
  PAYMENT_EXTERNAL_REDIRECT: 'booking_payment_external_redirect',
  /** User lands on booking-confirm return / callback URL. */
  PAYMENT_RETURN_CALLBACK: 'booking_payment_return_callback',
  /** BookingAudit confirms successful payment + booking. */
  PAYMENT_GATEWAY_SUCCESS: 'booking_payment_gateway_success',
  /** BookingAudit or gateway confirms payment/booking failure. */
  PAYMENT_GATEWAY_FAILED: 'booking_payment_gateway_failed',
  /** Payment explicitly cancelled by user or provider. */
  PAYMENT_CANCELLED: 'booking_payment_cancelled',
  /** Payment succeeded but booking audit could not create/confirm booking (404, audit failure). */
  POST_PAYMENT_CREATION_FAILED: 'booking_post_payment_creation_failed',
  /** App detected an expired booking or availability session. */
  SESSION_EXPIRED: 'booking_session_expired',
  /** User opened e-ticket view from booking confirm (View Ticket). */
  VIEW_TICKET_OPENED: 'booking_view_ticket_opened',
  /** E-ticket PDF download started or completed. */
  TICKET_DOWNLOAD: 'booking_ticket_download',
  /** User switched e-ticket page language (EN / AR). */
  TICKET_LANGUAGE_CHANGED: 'booking_ticket_language_changed',
};

const TRIP_KEY = {
  OneWay: 'one_way',
  Oneway: 'one_way',
  Return: 'round_trip',
  RoundTrip: 'round_trip',
};

const CABIN_KEY = {
  Economy: 'economy',
  Business: 'business',
};

/**
 * Map booking-box tripType + cabinClass to one of the 4 legacy search event names.
 * Returns null for unsupported combos (e.g. MultiCity).
 *
 * @param {{ tripType?: string, cabinClass?: string }} values
 * @returns {string|null}
 */
export function getSearchFlightsClarityEvent(values = {}) {
  const trip = TRIP_KEY[values.tripType];
  const cabin = CABIN_KEY[values.cabinClass];
  if (!trip || !cabin) return null;

  if (trip === 'one_way' && cabin === 'economy') {
    return CLARITY_EVENTS.SEARCH_FLIGHTS_ONE_WAY_ECONOMY;
  }
  if (trip === 'one_way' && cabin === 'business') {
    return CLARITY_EVENTS.SEARCH_FLIGHTS_ONE_WAY_BUSINESS;
  }
  if (trip === 'round_trip' && cabin === 'economy') {
    return CLARITY_EVENTS.SEARCH_FLIGHTS_ROUND_TRIP_ECONOMY;
  }
  if (trip === 'round_trip' && cabin === 'business') {
    return CLARITY_EVENTS.SEARCH_FLIGHTS_ROUND_TRIP_BUSINESS;
  }
  return null;
}

/**
 * Track Search flights with trip type + cabin class.
 * When `modifySearch` is true, also sends the `modify_search` event.
 *
 * @param {{ tripType?: string, cabinClass?: string, modifySearch?: boolean }} values
 */
export function trackSearchFlightsClarityEvent(values = {}) {
  const searchContext = buildSearchContextFromFormValues(values);
  setBookingAnalyticsContext(searchContext);

  const eventName = getSearchFlightsClarityEvent(values);
  if (eventName) {
    pushBookingLegacyEvent(eventName, searchContext);
  }

  pushBookingLegacyEvent(CLARITY_EVENTS.SEARCH_SUBMITTED, {
    ...searchContext,
    modify_search: Boolean(values.modifySearch),
  });

  const isModify = Boolean(values.modifySearch);
  if (isModify) {
    pushBookingLegacyEvent(CLARITY_EVENTS.MODIFY_SEARCH, {
      modify_search: true,
      ...searchContext,
    });
  }
}

const TRIP_TYPE_CLARITY_EVENT = {
  OneWay: CLARITY_EVENTS.TRIP_TYPE_ONE_WAY,
  Return: CLARITY_EVENTS.TRIP_TYPE_ROUND_TRIP,
  MultiCity: CLARITY_EVENTS.TRIP_TYPE_MULTI_CITY,
};

/** @param {string} tripType — `OneWay` | `Return` | `MultiCity` */
export function trackTripTypeClarityEvent(tripType) {
  const key = String(tripType ?? '').trim();
  const eventName = TRIP_TYPE_CLARITY_EVENT[key];
  if (eventName) {
    setBookingAnalyticsContext({ trip_type: key });
    pushBookingLegacyEvent(eventName, {
      trip_type: key,
      selection_type: key,
    });
  }
}

const BOOKING_TAB_CLARITY_EVENT = {
  book: CLARITY_EVENTS.BOOKING_TAB_BOOK,
  manage: CLARITY_EVENTS.BOOKING_TAB_MANAGE,
};

/** @param {string} tab — `book` | `manage` */
export function trackBookingTabClarityEvent(tab) {
  const key = String(tab ?? '').trim().toLowerCase();
  const eventName = BOOKING_TAB_CLARITY_EVENT[key];
  if (eventName) {
    setBookingAnalyticsContext({ booking_box_tab: key });
    pushBookingLegacyEvent(eventName, {
      booking_box_tab: key,
      selection_type: key,
    });
  }
}

/** @param {string} cabinClass — `Economy` | `Business` */
export function trackCabinClassClarityEvent(cabinClass) {
  const key = String(cabinClass ?? '').trim();
  const eventName =
    key === 'Economy'
      ? CLARITY_EVENTS.CABIN_CLASS_ECONOMY
      : key === 'Business'
        ? CLARITY_EVENTS.CABIN_CLASS_BUSINESS
        : null;
  if (eventName) {
    setBookingAnalyticsContext({ cabin_class: key });
    pushBookingLegacyEvent(eventName, {
      cabin_class: key,
      selection_type: key,
    });
  }
}

/** @param {string} [iataCode] — e.g. `DAM` */
export function trackOriginAirportClarityEvent(iataCode) {
  const code = String(iataCode ?? '').trim().toUpperCase();
  if (code) setBookingAnalyticsContext({ origin_iata: code });
  pushBookingLegacyEvent(CLARITY_EVENTS.ORIGIN_AIRPORT_SELECTED, {
    airport_role: 'origin',
    origin_iata: code || undefined,
    selection_type: 'origin',
  });
}

/** @param {string} [iataCode] — e.g. `DXB` */
export function trackReturnAirportClarityEvent(iataCode) {
  const code = String(iataCode ?? '').trim().toUpperCase();
  if (code) setBookingAnalyticsContext({ destination_iata: code });
  pushBookingLegacyEvent(CLARITY_EVENTS.RETURN_AIRPORT_SELECTED, {
    airport_role: 'destination',
    destination_iata: code || undefined,
    selection_type: 'destination',
  });
}

/** @param {Date|string} date */
export function trackDepartureDateClarityEvent(date) {
  const key = toAnalyticsDateKey(date);
  if (!key) return;
  setBookingAnalyticsContext({ departure_date: key });
  pushBookingLegacyEvent(CLARITY_EVENTS.DEPARTURE_DATE_SELECTED, {
    date_role: 'departure',
    departure_date: key,
    selection_type: 'departure',
  });
}

/** @param {Date|string} date */
export function trackReturnDateClarityEvent(date) {
  const key = toAnalyticsDateKey(date);
  if (!key) return;
  setBookingAnalyticsContext({ return_date: key });
  pushBookingLegacyEvent(CLARITY_EVENTS.RETURN_DATE_SELECTED, {
    date_role: 'return',
    return_date: key,
    selection_type: 'return',
  });
}

const PASSENGER_COUNT_CONTEXT_KEY = {
  adults: 'passengers_adult',
  children: 'passengers_child',
  infants: 'passengers_infant',
  infantsWithSeat: 'passengers_infant_with_seat',
};

const PASSENGER_CLARITY_EVENT = {
  adults: CLARITY_EVENTS.PASSENGER_ADULTS,
  children: CLARITY_EVENTS.PASSENGER_CHILDREN,
  infants: CLARITY_EVENTS.PASSENGER_INFANTS,
  infantsWithSeat: CLARITY_EVENTS.PASSENGER_INFANTS_WITH_SEAT,
};

/** @param {'adults'|'children'|'infants'|'infantsWithSeat'} guestKey @param {number} count */
export function trackPassengerCountClarityEvent(guestKey, count) {
  const key = String(guestKey ?? '').trim();
  const eventName = PASSENGER_CLARITY_EVENT[key];
  if (!eventName) return;
  const contextKey = PASSENGER_COUNT_CONTEXT_KEY[key];
  setBookingAnalyticsContext({
    ...(contextKey ? { [contextKey]: count } : {}),
    passenger_type: key,
    passenger_count: count,
  });
  pushBookingLegacyEvent(eventName, {
    passenger_type: key,
    passenger_count: count,
  });
}

/** @param {{ cabinType?: string, fareTier?: string }} [meta] */
export function trackFlightSelectionAcceptedClarityEvent(meta = {}) {
  const cabin = String(meta.cabinType ?? '').trim();
  const tier = String(meta.fareTier ?? '').trim().toLowerCase();
  const payload = {
    selected_cabin: cabin || undefined,
    fare_tier: tier || undefined,
    origin_iata: meta.originIata,
    destination_iata: meta.destinationIata,
    departure_date: meta.departureDate,
    return_date: meta.returnDate,
  };
  setBookingAnalyticsContext({
    selected_cabin: cabin || undefined,
    fare_tier: tier || undefined,
  });
  pushBookingLegacyEvent(CLARITY_EVENTS.FLIGHT_SELECTION_ACCEPTED, payload);
  pushBookingLegacyEvent(CLARITY_EVENTS.SELECTED_FLIGHT_SUCCESS, payload);
}

const FARE_TIER_CLARITY_EVENT = {
  light: CLARITY_EVENTS.FARE_LIGHT_SELECTED,
  smart: CLARITY_EVENTS.FARE_SMART_SELECTED,
  premium: CLARITY_EVENTS.FARE_PREMIUM_SELECTED,
  elite: CLARITY_EVENTS.FARE_ELITE_SELECTED,
  business: CLARITY_EVENTS.FARE_BUSINESS_SELECTED,
};

/** @param {string} tier @param {string} [fareName] */
export function trackFareTierClarityEvent(tier, fareName) {
  const key = String(tier ?? '').trim().toLowerCase();
  const eventName = FARE_TIER_CLARITY_EVENT[key];
  const name = String(fareName ?? '').trim();
  if (eventName) {
    setBookingAnalyticsContext({
      fare_tier: key,
      fare_name: name || undefined,
    });
    pushBookingLegacyEvent(eventName, {
      fare_tier: key,
      fare_name: name || undefined,
      selection_type: key,
    });
  }
}

export function trackNearbyAirportsClarityEvent(enabled = true) {
  setBookingAnalyticsContext({ nearby_airports: Boolean(enabled) });
  pushBookingLegacyEvent(CLARITY_EVENTS.NEARBY_AIRPORTS_ENABLED, {
    nearby_airports: Boolean(enabled),
  });
}

export function trackProceedPassengerDetailsClarityEvent() {
  setBookingAnalyticsContext({ booking_step: '1' });
  pushBookingLegacyEvent(CLARITY_EVENTS.PROCEED_PASSENGER_DETAILS, {
    booking_step: '1',
  });
}

export function trackPassengerInfoSuccessClarityEvent() {
  setBookingAnalyticsContext({ booking_step: '2' });
  pushBookingLegacyEvent(CLARITY_EVENTS.PASSENGER_INFO_SUCCESS, {
    booking_step: '2',
  });
}

/** @param {{ method?: string }} [meta] */
export function trackPaymentSubmitClarityEvent(meta = {}) {
  const method = String(meta.method ?? '').trim().toLowerCase();
  setBookingAnalyticsContext({ booking_step: '3', payment_method: method || undefined });
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_SUBMIT, {
    event_action: 'request_started',
    payment_method: method || undefined,
    booking_step: '3',
  });
}

/** @param {{ pnr?: string, bookingReference?: string }} [meta] */
export function trackBookingConfirmViewedClarityEvent(meta = {}) {
  const pnr = String(meta.pnr ?? meta.bookingReference ?? '').trim();
  setBookingAnalyticsContext({
    booking_step: '4',
    booking_reference: pnr || undefined,
  });
  pushBookingLegacyEvent(CLARITY_EVENTS.BOOKING_CONFIRM_VIEWED, {
    booking_reference: pnr || undefined,
    booking_step: '4',
  });
}

const PASSENGER_INFO_FIELD_EVENT = {
  title: CLARITY_EVENTS.PASSENGER_INFO_TITLE,
  first_name: CLARITY_EVENTS.PASSENGER_INFO_FIRST_NAME,
  last_name: CLARITY_EVENTS.PASSENGER_INFO_LAST_NAME,
  date_of_birth: CLARITY_EVENTS.PASSENGER_INFO_DATE_OF_BIRTH,
  nationality: CLARITY_EVENTS.PASSENGER_INFO_NATIONALITY,
  contact_adult: CLARITY_EVENTS.PASSENGER_INFO_CONTACT_ADULT,
  contact_country_code: CLARITY_EVENTS.PASSENGER_INFO_CONTACT_COUNTRY_CODE,
  contact_phone: CLARITY_EVENTS.PASSENGER_INFO_CONTACT_PHONE,
  contact_email: CLARITY_EVENTS.PASSENGER_INFO_CONTACT_EMAIL,
  contact_alt_country_code: CLARITY_EVENTS.PASSENGER_INFO_CONTACT_ALT_PHONE,
  contact_alt_phone: CLARITY_EVENTS.PASSENGER_INFO_CONTACT_ALT_PHONE,
};

let passengerInfoSessionStarted = false;

/** @param {string} fieldKey @param {{ passengerIndex?: number, section?: string }} [meta] */
export function trackPassengerInfoFieldClarityEvent(fieldKey, meta = {}) {
  const key = String(fieldKey ?? '').trim().toLowerCase();
  if (!key) return;

  if (!passengerInfoSessionStarted) {
    passengerInfoSessionStarted = true;
    setBookingAnalyticsContext({ booking_step: '1' });
    pushBookingLegacyEvent(CLARITY_EVENTS.PASSENGER_INFO_STARTED, {
      booking_step: '1',
    });
  }

  const eventName = PASSENGER_INFO_FIELD_EVENT[key];
  if (eventName) {
    pushBookingLegacyEvent(eventName, {
      field_name: key,
      passenger_index: meta.passengerIndex != null ? meta.passengerIndex : undefined,
      passenger_form_section: meta.section ? String(meta.section) : undefined,
    });
  }
}

/** @param {{ segmentCount?: number|string }} [meta] */
export function trackSeatMapLoadedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.SEAT_MAP_LOADED, {
    segment_count: meta.segmentCount != null ? meta.segmentCount : undefined,
  });
}

/** @param {{ segmentCount?: number|string }} [meta] */
export function trackBaggageOptionsLoadedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.BAGGAGE_OPTIONS_LOADED, {
    segment_count: meta.segmentCount != null ? meta.segmentCount : undefined,
  });
}

/** @param {{ seatNumber?: string, legIndex?: number }} [meta] */
export function trackSeatClickedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.SEAT_CLICKED, {
    seat_number: meta.seatNumber ? String(meta.seatNumber).trim() : undefined,
    leg_index: meta.legIndex != null ? meta.legIndex : undefined,
  });
}

/** @param {{ seatNumber?: string, passengerIndex?: number, legIndex?: number }} [meta] */
export function trackSeatSelectionConfirmedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.SEAT_SELECTION_CONFIRMED, {
    seat_number: meta.seatNumber ? String(meta.seatNumber).trim() : undefined,
    passenger_index: meta.passengerIndex != null ? meta.passengerIndex : undefined,
    leg_index: meta.legIndex != null ? meta.legIndex : undefined,
  });
}

export function trackSeatSelectionSkippedClarityEvent() {
  setBookingAnalyticsContext({ booking_step: '2' });
  pushBookingLegacyEvent(CLARITY_EVENTS.SEAT_SELECTION_SKIPPED, {
    booking_step: '2',
  });
}

/** @param {{ optionId?: string|number, legIndex?: number, passengerId?: string|number }} [meta] */
export function trackBaggageOptionSelectedClarityEvent(meta = {}) {
  setBookingAnalyticsContext({ booking_step: '2' });
  pushBookingLegacyEvent(CLARITY_EVENTS.BAGGAGE_OPTION_SELECTED, {
    baggage_option_id: meta.optionId != null ? meta.optionId : undefined,
    leg_index: meta.legIndex != null ? meta.legIndex : undefined,
    baggage_passenger_id: meta.passengerId != null ? meta.passengerId : undefined,
    booking_step: '2',
  });
}

export function trackBaggageConfirmSubmittedClarityEvent() {
  setBookingAnalyticsContext({ booking_step: '2' });
  pushBookingLegacyEvent(CLARITY_EVENTS.BAGGAGE_CONFIRM_SUBMITTED, {
    booking_step: '2',
  });
}

/** @param {{ seatNumber?: string, legIndex?: number, passengerIndex?: number, guestId?: string, source?: 'single'|'bulk' }} [meta] */
export function trackSeatRemovedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.SEAT_REMOVED, {
    seat_number: meta.seatNumber ? String(meta.seatNumber).trim() : undefined,
    leg_index: meta.legIndex != null ? meta.legIndex : undefined,
    passenger_index: meta.passengerIndex != null ? meta.passengerIndex : undefined,
    guest_id: meta.guestId ? String(meta.guestId).trim() : undefined,
    remove_source: meta.source ? String(meta.source).trim() : undefined,
  });
}

/** @param {{ optionId?: string|number, legIndex?: number, passengerId?: string|number, guestId?: string, source?: 'single'|'leg'|'bulk' }} [meta] */
export function trackBaggageRemovedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.BAGGAGE_REMOVED, {
    baggage_option_id: meta.optionId != null ? meta.optionId : undefined,
    leg_index: meta.legIndex != null ? meta.legIndex : undefined,
    baggage_passenger_id: meta.passengerId != null ? meta.passengerId : undefined,
    guest_id: meta.guestId ? String(meta.guestId).trim() : undefined,
    remove_source: meta.source ? String(meta.source).trim() : undefined,
  });
}

/** @param {{ hasSeat?: boolean, hasBaggage?: boolean, hasWheelchair?: boolean, hasLounge?: boolean }} [meta] */
export function trackAncillaryPageRenderedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.ANCILLARY_PAGE_RENDERED, {
    has_seat: meta.hasSeat != null ? Boolean(meta.hasSeat) : undefined,
    has_baggage: meta.hasBaggage != null ? Boolean(meta.hasBaggage) : undefined,
    has_wheelchair: meta.hasWheelchair != null ? Boolean(meta.hasWheelchair) : undefined,
    has_lounge: meta.hasLounge != null ? Boolean(meta.hasLounge) : undefined,
  });
}

export function trackWheelchairOpenedClarityEvent() {
  pushBookingLegacyEvent(CLARITY_EVENTS.WHEELCHAIR_OPENED, { booking_step: '2' });
}

/** @param {{ segmentId?: string, guestId?: string }} [meta] */
export function trackWheelchairPassengerAddedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.WHEELCHAIR_PASSENGER_ADDED, {
    segment_id: meta.segmentId ? String(meta.segmentId).trim() : undefined,
    guest_id: meta.guestId ? String(meta.guestId).trim() : undefined,
  });
}

/** @param {{ segmentId?: string, guestId?: string }} [meta] */
export function trackWheelchairPassengerRemovedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.WHEELCHAIR_PASSENGER_REMOVED, {
    segment_id: meta.segmentId ? String(meta.segmentId).trim() : undefined,
    guest_id: meta.guestId ? String(meta.guestId).trim() : undefined,
  });
}

export function trackLoungeOpenedClarityEvent() {
  pushBookingLegacyEvent(CLARITY_EVENTS.LOUNGE_OPENED, { booking_step: '2' });
}

/** @param {{ segmentId?: string, guestId?: string }} [meta] */
export function trackLoungePassengerAddedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.LOUNGE_PASSENGER_ADDED, {
    segment_id: meta.segmentId ? String(meta.segmentId).trim() : undefined,
    guest_id: meta.guestId ? String(meta.guestId).trim() : undefined,
  });
}

/** @param {{ segmentId?: string, guestId?: string }} [meta] */
export function trackLoungePassengerRemovedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.LOUNGE_PASSENGER_REMOVED, {
    segment_id: meta.segmentId ? String(meta.segmentId).trim() : undefined,
    guest_id: meta.guestId ? String(meta.guestId).trim() : undefined,
  });
}

/** Availability API returned bookable flights. */
export function trackSearchApiSuccessClarityEvent(meta = {}) {
  setBookingAnalyticsContext({ booking_step: '0' });
  pushBookingLegacyEvent(CLARITY_EVENTS.SEARCH_API_SUCCESS, {
    direct_flight_count: meta.directCount,
    indirect_flight_count: meta.indirectCount,
    flight_count: meta.flightCount,
    origin_iata: meta.originIata,
    destination_iata: meta.destinationIata,
    trip_type: meta.tripType,
    departure_date: meta.departureDate,
    return_date: meta.returnDate,
    cabin_class: meta.cabinClass,
    booking_step: '0',
  });
}

/** Availability API failed (network, HTTP, or business error). */
export function trackSearchApiFailedClarityEvent(meta = {}) {
  setBookingAnalyticsContext({ booking_step: '0' });
  pushBookingLegacyEvent(CLARITY_EVENTS.SEARCH_API_FAILED, {
    status_code: meta.statusCode,
    error_kind: meta.errorKind,
    origin_iata: meta.originIata,
    destination_iata: meta.destinationIata,
    trip_type: meta.tripType,
    departure_date: meta.departureDate,
    return_date: meta.returnDate,
    cabin_class: meta.cabinClass,
    booking_step: '0',
  });
}

/** Availability API succeeded but returned zero valid flights. */
export function trackSearchApiEmptyClarityEvent(meta = {}) {
  setBookingAnalyticsContext({ booking_step: '0' });
  pushBookingLegacyEvent(CLARITY_EVENTS.SEARCH_API_EMPTY, {
    origin_iata: meta.originIata,
    destination_iata: meta.destinationIata,
    trip_type: meta.tripType,
    departure_date: meta.departureDate,
    return_date: meta.returnDate,
    cabin_class: meta.cabinClass,
    booking_step: '0',
  });
}

/** Search-results screen rendered after availability query settled. */
export function trackSearchResultsPageRenderedClarityEvent(meta = {}) {
  setBookingAnalyticsContext({ booking_step: '0' });
  pushBookingLegacyEvent(CLARITY_EVENTS.SEARCH_RESULTS_VIEW, {
    has_flights: meta.hasFlights != null ? Boolean(meta.hasFlights) : undefined,
    origin_iata: meta.originIata,
    destination_iata: meta.destinationIata,
    trip_type: meta.tripType,
    departure_date: meta.departureDate,
    return_date: meta.returnDate,
    cabin_class: meta.cabinClass,
    booking_step: '0',
  });
}

/** CreatePassengerInfo submit failed (API or server validation). */
export function trackPassengerInfoFailedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.PASSENGER_INFO_FAILED, {
    error_kind: meta.errorKind,
    status_code: meta.statusCode,
    error_source: meta.errorSource,
    validation_field_count: meta.validationFieldCount,
  });
}

/** Payment step rendered (payment options fetch settled). */
export function trackPaymentStepRenderedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_STEP_VIEW, {
    payment_options_count: meta.paymentOptionsCount,
    has_payment_options_error: meta.hasPaymentOptionsError != null
      ? Boolean(meta.hasPaymentOptionsError)
      : undefined,
  });
}

/** User selected a payment gateway or Stripe wallet/card sub-method. */
export function trackPaymentMethodSelectedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_METHOD_SELECTED, {
    payment_method: meta.paymentMethod,
    payment_option_code: meta.paymentOptionCode,
    stripe_method: meta.stripeMethod,
  });
}

/** Required payment fee + terms checkboxes both accepted. */
export function trackPaymentTermsAcceptedClarityEvent() {
  setBookingAnalyticsContext({ booking_step: '3' });
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_TERMS_ACCEPTED, {
    booking_step: '3',
  });
}

/** Browser leaves Fly Cham for external payment / 3DS (Tabby, wallet, bank ACS, etc.). */
export function trackPaymentExternalRedirectClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_EXTERNAL_REDIRECT, {
    payment_method: meta.paymentMethod,
    redirect_mode: meta.redirectMode,
    stripe_method: meta.stripeMethod,
    redirect_host: meta.redirectHost,
  });
}

/** User returned to Fly Cham booking-confirm callback URL after external payment. */
export function trackPaymentReturnCallbackClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_RETURN_CALLBACK, {
    redirect_status: meta.redirectStatus,
    payment_method: meta.paymentMethod,
    has_stripe_redirect_params: meta.hasStripeRedirectParams != null
      ? Boolean(meta.hasStripeRedirectParams)
      : undefined,
  });
}

/** Backend BookingAudit confirms successful payment and booking. */
export function trackPaymentGatewaySuccessClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_GATEWAY_SUCCESS, {
    booking_reference: meta.pnr ? String(meta.pnr).trim() : undefined,
    payment_session_id: meta.paymentSessionId
      ? String(meta.paymentSessionId).trim()
      : undefined,
  });
}

/** Backend BookingAudit or gateway confirms payment / booking failure. */
export function trackPaymentGatewayFailedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_GATEWAY_FAILED, {
    error_kind: meta.errorKind,
    redirect_status: meta.redirectStatus,
    payment_session_id: meta.paymentSessionId
      ? String(meta.paymentSessionId).trim()
      : undefined,
  });
}

/** Payment explicitly cancelled by user or provider (e.g. Stripe redirect_status=canceled). */
export function trackPaymentCancelledClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.PAYMENT_CANCELLED, {
    cancel_source: meta.source,
    redirect_status: meta.redirectStatus,
    payment_method: meta.paymentMethod,
  });
}

/**
 * Payment was taken but booking could not be created or confirmed after return from gateway.
 * @param {{ failureKind?: string, paymentSessionId?: string }} [meta]
 */
export function trackBookingPostPaymentCreationFailedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.POST_PAYMENT_CREATION_FAILED, {
    failure_kind: meta.failureKind,
    payment_session_id: meta.paymentSessionId
      ? String(meta.paymentSessionId).trim()
      : undefined,
  });
}

/**
 * Booking or availability session expired (confirm audit or in-flow guard).
 * @param {{ source?: string }} [meta] — `confirm_audit` | `booking_flow`
 */
export function trackBookingSessionExpiredClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.SESSION_EXPIRED, {
    expiry_source: meta.source,
  });
}

/** User clicked View Ticket on booking-confirm (opens e-ticket in new tab). */
export function trackBookingViewTicketOpenedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.VIEW_TICKET_OPENED, {
    ticket_source: meta.source ?? 'booking_confirm',
    booking_reference: meta.pnr ? String(meta.pnr).trim() : undefined,
  });
}

/**
 * E-ticket PDF export lifecycle.
 * @param {{ phase?: 'started'|'success', withPrice?: boolean }} [meta]
 */
export function trackBookingTicketDownloadClarityEvent(meta = {}) {
  const phase = meta.phase === 'success' ? 'success' : 'started';
  pushBookingLegacyEvent(CLARITY_EVENTS.TICKET_DOWNLOAD, {
    event_action: phase,
    with_price: Boolean(meta.withPrice),
  });
}

/** User changed e-ticket page language. */
export function trackBookingTicketLanguageChangedClarityEvent(meta = {}) {
  pushBookingLegacyEvent(CLARITY_EVENTS.TICKET_LANGUAGE_CHANGED, {
    from_lang: meta.fromLang,
    to_lang: meta.toLang,
  });
}

/**
 * Push a raw event name to GTM (prefer track* helpers or pushAnalyticsEvent).
 * @param {string} eventName
 * @param {Record<string, unknown>} [params]
 */
export function trackClarityEvent(eventName, params = {}) {
  pushBookingLegacyEvent(eventName, params);
}

/**
 * @deprecated Pass dimensions as params on track* helpers or pushAnalyticsEvent.
 */
export function setClarityTag(key, value) {
  if (!key || value == null || value === '') return;
  pushAnalyticsEvent('booking_session_tag', {
    event_action: 'tag',
    tag_key: String(key),
    tag_value: Array.isArray(value) ? value.join(',') : String(value),
  });
}
