/**
 * One accepted search attempt shared by booking_search_submitted, flight_search,
 * and outbound_search. Desktop and mobile buttons must call this once; they must
 * not also emit flight_search.
 */
import { ANALYTICS_EVENTS, createSubmitAttemptId, pushAnalyticsEvent, pushBookingLegacyEvent } from '@/lib/analytics';
import {
  buildSearchContextFromFormValues,
  replaceSearchAnalyticsContext,
  setBookingAnalyticsContext,
} from '@/lib/bookingAnalyticsContext';

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

const SEARCH_FLIGHTS_EVENT = {
  one_way: {
    economy: 'search_flights_one_way_economy',
    business: 'search_flights_one_way_business',
  },
  round_trip: {
    economy: 'search_flights_round_trip_economy',
    business: 'search_flights_round_trip_business',
  },
};

/** Multi-city has no booking_search_flights name. That exclusion stays. */
export function legacySearchFlightsEventName(values = {}) {
  const trip = TRIP_KEY[values.tripType];
  const cabin = CABIN_KEY[values.cabinClass];
  if (!trip || !cabin) return null;
  return SEARCH_FLIGHTS_EVENT[trip]?.[cabin] ?? null;
}

let locked = false;
/** @type {{ id: string, submitted: boolean, flights: boolean, modify: boolean, validated: boolean, outbound: boolean } | null} */
let attempt = null;

export function isSearchSubmissionLocked() {
  return locked;
}

export function getSearchAttemptId() {
  return attempt?.id;
}

export function releaseSearchSubmissionLock() {
  locked = false;
}

export function resetSearchSubmissionForTests() {
  locked = false;
  attempt = null;
}

/**
 * Accepted, enabled submission attempt. Returns accepted:false for a repeated
 * click while the attempt is still in flight. A later retry must release the lock first.
 * @param {Record<string, unknown>} values
 */
export function beginAcceptedSearchSubmission(values = {}) {
  if (locked) return { accepted: false, attemptId: attempt?.id };

  locked = true;
  const attemptId = createSubmitAttemptId();
  attempt = {
    id: attemptId,
    submitted: false,
    flights: false,
    modify: false,
    validated: false,
    outbound: false,
  };

  const searchContext = {
    ...buildSearchContextFromFormValues(values),
    search_attempt_id: attemptId,
    modify_search: Boolean(values.modifySearch),
  };
  replaceSearchAnalyticsContext(searchContext);

  if (pushBookingLegacyEvent('booking_search_submitted', searchContext)) {
    attempt.submitted = true;
  }

  const flightsEvent = legacySearchFlightsEventName(values);
  if (flightsEvent && pushBookingLegacyEvent(flightsEvent, searchContext)) {
    attempt.flights = true;
  }

  if (values.modifySearch && pushBookingLegacyEvent('modify_search', {
    modify_search: true,
    ...searchContext,
  })) {
    attempt.modify = true;
  }

  return {
    accepted: true,
    emitted: Boolean(attempt.submitted || attempt.flights || attempt.modify),
    attemptId,
  };
}

export function outboundTargetFromHref(href) {
  try {
    const url = new URL(String(href), 'https://flycham.com');
    return {
      destination_host: url.host,
      results_path: url.pathname,
    };
  } catch {
    return {};
  }
}

/**
 * Validated search proceeding toward navigation, then the external handoff.
 * Does not navigate. Call immediately before the real navigation.
 * @param {{ href?: string, external?: boolean }} input
 */
export function emitValidatedSearchNavigation(input = {}) {
  const attemptId = attempt?.id || createSubmitAttemptId();
  if (!attempt) {
    attempt = {
      id: attemptId,
      submitted: false,
      flights: false,
      modify: false,
      validated: false,
      outbound: false,
    };
    setBookingAnalyticsContext({ search_attempt_id: attemptId });
  }

  let validated = false;
  if (!attempt.validated) {
    validated = pushAnalyticsEvent(ANALYTICS_EVENTS.FLIGHT_SEARCH, {
      event_action: 'search',
      search_attempt_id: attempt.id,
    });
    if (validated) attempt.validated = true;
  }

  let outbound = false;
  if (input.external && !attempt.outbound) {
    const target = outboundTargetFromHref(input.href);
    outbound = pushAnalyticsEvent(ANALYTICS_EVENTS.OUTBOUND_SEARCH, {
      event_action: 'handoff',
      search_attempt_id: attempt.id,
      destination_host: target.destination_host,
      results_path: target.results_path,
    });
    if (outbound) attempt.outbound = true;
  }

  return { attemptId: attempt.id, validated, outbound };
}
