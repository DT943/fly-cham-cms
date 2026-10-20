/**
 * Non-PII booking funnel context merged into every GTM dataLayer push.
 * Updated as the user selects trip type, airports, dates, passengers, fare, etc.
 */

import { getLeg } from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/legsUtils';
import { resolveIataByAirportId, getStaticAirportItems } from '@/util/airports/staticAirportLookup';

/** @type {Record<string, string|number|boolean>} */
let bookingAnalyticsContext = {};

/** Replaced as a set on each new search so one-way cannot keep a previous return date. */
export const SEARCH_CONTEXT_KEYS = [
  'trip_type',
  'cabin_class',
  'origin_iata',
  'destination_iata',
  'departure_date',
  'return_date',
  'passengers_adult',
  'passengers_child',
  'passengers_infant',
  'passengers_infant_with_seat',
  'nearby_airports',
  'fare_tier',
  'fare_name',
  'selected_cabin',
  'search_attempt_id',
  'modify_search',
  'booking_step',
];

function getAirportItems(airPorts) {
  if (!airPorts) return [];
  if (Array.isArray(airPorts)) return airPorts;
  return airPorts.items ?? [];
}

function toIata(value) {
  if (value == null || value === '') return undefined;
  if (typeof value === 'string') {
    const code = value.trim().toUpperCase();
    return code || undefined;
  }
  if (typeof value === 'object') {
    const code = value.code ?? value.iata ?? value.airportCode ?? value.value;
    if (code == null || code === '') return undefined;
    return String(code).trim().toUpperCase();
  }
  return undefined;
}

/** @param {Date|string|number|null|undefined} value */
export function toAnalyticsDateKey(value) {
  if (value == null || value === '') return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const trimmed = String(value).trim();
  const prefix = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  return prefix ? prefix[1] : trimmed.slice(0, 10) || undefined;
}

function toCount(value) {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function compactContext(params = {}) {
  const out = {};
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue;
    if (typeof value === 'boolean') {
      out[key] = value;
      continue;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      out[key] = value;
      continue;
    }
    const str = String(value).trim();
    if (str) out[key] = str;
  }
  return out;
}

/**
 * Merge partial search / funnel fields into session context.
 * @param {Record<string, string|number|boolean|null|undefined>} partial
 */
export function setBookingAnalyticsContext(partial = {}) {
  if (!partial || typeof partial !== 'object') return;
  bookingAnalyticsContext = {
    ...bookingAnalyticsContext,
    ...compactContext(partial),
  };
}

/** @returns {Record<string, string|number|boolean>} */
export function getBookingAnalyticsContext() {
  return { ...bookingAnalyticsContext };
}

export function clearBookingAnalyticsContext() {
  bookingAnalyticsContext = {};
}

/**
 * Replace search/itinerary fields for a new attempt. Other keys are kept.
 * @param {Record<string, string|number|boolean|null|undefined>} partial
 */
export function replaceSearchAnalyticsContext(partial = {}) {
  const next = { ...bookingAnalyticsContext };
  for (const key of SEARCH_CONTEXT_KEYS) delete next[key];
  bookingAnalyticsContext = {
    ...next,
    ...compactContext(partial),
  };
}

function resolveAirportCode(value) {
  if (value == null || value === '') return undefined;
  const direct = toIata(value);
  if (direct && /^[A-Z]{3}$/.test(direct)) return direct;
  const fromId = resolveIataByAirportId(value, getStaticAirportItems());
  return fromId || undefined;
}

/**
 * Snapshot from booking-box Formik values (non-PII).
 * @param {Record<string, unknown>} values
 */
export function buildSearchContextFromFormValues(values = {}) {
  const leg0 = getLeg(values, 0);
  const returnDate = values.dateEnd ?? values.returnDate;

  return compactContext({
    trip_type: values.tripType,
    cabin_class: values.cabinClass,
    origin_iata: resolveAirportCode(leg0.source),
    destination_iata: resolveAirportCode(leg0.destination),
    departure_date: toAnalyticsDateKey(leg0.dateStart),
    return_date:
      values.tripType === 'OneWay' || values.tripType === 'MultiCity'
        ? undefined
        : toAnalyticsDateKey(returnDate),
    passengers_adult: toCount(values.adults),
    passengers_child: toCount(values.children),
    passengers_infant: toCount(values.infants),
    passengers_infant_with_seat: toCount(values.infantsWithSeat),
    nearby_airports: Boolean(values.nearby),
  });
}

/**
 * Snapshot from search-results URL / Redux keyParams.
 * @param {Record<string, unknown>} keyParams
 * @param {unknown} airPorts
 */
export function buildSearchContextFromKeyParams(keyParams = {}, airPorts) {
  const airportList = getAirportItems(airPorts);
  const cabinClass =
    keyParams.flightclass === 'C' || keyParams.flightclass === 'Business'
      ? 'Business'
      : keyParams.flightclass === 'Y' || keyParams.flightclass === 'Economy'
        ? 'Economy'
        : keyParams.cabinClass ?? keyParams.cabin_class;

  return compactContext({
    trip_type: keyParams.flighttype ?? keyParams.tripType,
    cabin_class: cabinClass,
    origin_iata:
      resolveIataByAirportId(keyParams.origin_id, airportList) ??
      toIata(keyParams.originCode ?? keyParams.origin),
    destination_iata:
      resolveIataByAirportId(keyParams.destination_id, airportList) ??
      toIata(keyParams.destinationCode ?? keyParams.destination),
    departure_date: toAnalyticsDateKey(keyParams.date),
    return_date:
      (keyParams.flighttype ?? keyParams.tripType) === 'OneWay' ||
      (keyParams.flighttype ?? keyParams.tripType) === 'MultiCity'
        ? undefined
        : toAnalyticsDateKey(keyParams.date_return),
    passengers_adult: toCount(keyParams.adults),
    passengers_child: toCount(keyParams.children),
    passengers_infant: toCount(keyParams.infants),
    passengers_infant_with_seat: toCount(keyParams.infantswithseat ?? keyParams.infantsWithSeat),
    nearby_airports: keyParams.nearby ? true : undefined,
  });
}

/**
 * Snapshot from Redux searchParams on search-results (uses static airport list).
 * @param {Record<string, unknown>} searchParams
 */
export function buildSearchContextFromSearchParams(searchParams = {}) {
  return buildSearchContextFromKeyParams(searchParams, getStaticAirportItems());
}

/**
 * Route + dates for flight-selection analytics (searchParams + optional selected flight).
 * @param {Record<string, unknown>} searchParams
 * @param {{ common_info?: { segments?: Array<{ departure_date?: string, departure_airport?: string, arrival_airport?: string, origin?: string, destination?: string }> } }} [flight]
 */
export function buildFlightSelectionAnalyticsMeta(searchParams = {}, flight) {
  const base = buildSearchContextFromSearchParams(searchParams);
  const segs = flight?.common_info?.segments;
  const seg = segs?.[0];
  const lastSeg = segs?.length ? segs[segs.length - 1] : null;

  return compactContext({
    ...base,
    departure_date: base.departure_date ?? toAnalyticsDateKey(seg?.departure_date),
    return_date: base.return_date ?? toAnalyticsDateKey(segs?.[1]?.departure_date),
    origin_iata:
      base.origin_iata ??
      toIata(seg?.departure_airport ?? seg?.origin),
    destination_iata:
      base.destination_iata ??
      toIata(lastSeg?.arrival_airport ?? lastSeg?.destination),
  });
}
