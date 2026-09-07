import { addDays, startOfDay, parseISO, isValid, format, differenceInCalendarDays } from 'date-fns';

/** Roundtrip: 3 days before and 3 days after search date (7 days total). */
export const CALENDAR_DAYS_BEFORE = 3;
export const CALENDAR_DAYS_AFTER = 3;
const DAYS_BEFORE = CALENDAR_DAYS_BEFORE;
const DAYS_AFTER = CALENDAR_DAYS_AFTER;

/** Whether `dateStr` is one of the seven days in the strip centered on `weekCenterStr`. */
export function isDateInCalendarWeek(dateStr, weekCenterStr) {
  const center = parseISO(String(weekCenterStr ?? '').trim().slice(0, 10));
  const d = parseISO(String(dateStr ?? '').trim().slice(0, 10));
  if (!isValid(center) || !isValid(d)) return false;
  const diff = differenceInCalendarDays(d, center);
  return diff >= -DAYS_BEFORE && diff <= DAYS_AFTER;
}

/**
 * Returns the departure date string (YYYY-MM-DD) from a DirectAirPort flight item.
 * @param {Object} flight - Flight item with common_info.departure_date
 * @returns {string|null} - e.g. "2026-03-20" or null
 */
export function getDepartureDateFromFlight(flight) {
  const dateStr = flight?.common_info?.departure_date;
  if (typeof dateStr !== 'string' || !dateStr) return null;
  return dateStr.trim();
}

/**
 * Returns the outbound (first segment) date for filtering Return flights by selected calendar date.
 * Uses first segment's departure_date when present, else common_info.departure_date.
 * @param {Object} flight - Flight item with common_info.segments and/or common_info.departure_date
 * @returns {string|null} - YYYY-MM-DD or null
 */
export function getOutboundDateFromFlight(flight) {
  const segs = flight?.common_info?.segments;
  if (Array.isArray(segs) && segs.length > 0) {
    const first = segs[0];
    const d = first?.departure_date ?? first?.DepartureDate ?? first?.date;
    if (d != null) {
      const s = typeof d === 'string' ? d.trim() : String(d);
      if (s) return s.slice(0, 10);
    }
  }
  return getDepartureDateFromFlight(flight);
}

/**
 * Returns the return (second segment) date for roundtrip flights.
 * @param {Object} flight - Flight with common_info.segments
 * @returns {string|null} - YYYY-MM-DD or null
 */
export function getReturnDateFromFlight(flight) {
  const segs = flight?.common_info?.segments;
  if (Array.isArray(segs) && segs.length > 1) {
    const second = segs[1];
    const d = second?.departure_date ?? second?.DepartureDate ?? second?.date;
    if (d != null) {
      const s = typeof d === 'string' ? d.trim() : String(d);
      if (s) return s.slice(0, 10);
    }
  }
  return null;
}

/**
 * Calendar / list date key for a flight.
 * Round-trip return phase: prefer second segment date; fall back to departure for
 * one-leg return entries (SHJ→DAM and DAM→SHJ as separate DirectAirPort rows).
 */
export function getCalendarDateFromFlight(flight, options = {}) {
  if (options.useReturnSegment) {
    return getReturnDateFromFlight(flight) || getDepartureDateFromFlight(flight);
  }
  // Match FlightList outbound view (segments[0]), not row-level common_info.departure_date.
  return getOutboundDateFromFlight(flight) || getDepartureDateFromFlight(flight);
}

/** Stable grouping key for a FlightWithPrice row (e.g. XH1997_2026-05-25_11:00:00). */
export function getFlightGroupingKey(flight) {
  return String(flight?.grouping_key ?? flight?.groupingKey ?? flight?.id ?? '').trim();
}

function pushTrimmedKeys(target, keys) {
  if (!Array.isArray(keys)) return;
  for (const key of keys) {
    const trimmed = String(key ?? '').trim();
    if (trimmed) target.add(trimmed);
  }
}

/**
 * Compatible next-leg / return keys from the selected outbound (or MC leg-1) flight.
 * Union every non-empty list — adapter always sets `compatible_return_keys` to []
 * for multi-city, so taking the first array would miss `compatible_next_leg_keys`.
 */
export function getCompatibleReturnKeysFromOutboundFlight(outboundFlight) {
  const merged = new Set();
  pushTrimmedKeys(merged, outboundFlight?.compatibleKeys);
  pushTrimmedKeys(merged, outboundFlight?.compatible_return_keys);
  pushTrimmedKeys(merged, outboundFlight?.compatibleReturnKeys);
  pushTrimmedKeys(merged, outboundFlight?.compatible_next_leg_keys);
  pushTrimmedKeys(merged, outboundFlight?.compatibleNextLegKeys);
  return [...merged];
}

/** Alias for multi-city next-leg allow-list (same shape as return keys). */
export function getCompatibleNextLegKeysFromOutboundFlight(outboundFlight) {
  return getCompatibleReturnKeysFromOutboundFlight(outboundFlight);
}

/**
 * Allow-list for the selected first leg: snapshot keys, the stored flight, and
 * matching outbound rows in the live availability list.
 * Week ±7 can replace the list with a new window whose outbound row shares
 * route + date (and often flight number) but a different grouping key
 * (e.g. schedule time change) — exact key match alone would miss fresh
 * compatibleReturnKeys and leave the return calendar empty / snap back.
 */
export function findMatchingOutboundAvailabilityFlights(selection, availabilityFlights = []) {
  const selected = selection?.flight;
  if (!selected || !Array.isArray(availabilityFlights) || availabilityFlights.length === 0) {
    return [];
  }
  const selectedKey = getFlightGroupingKey(selected);
  const info = selected?.common_info ?? {};
  const origin = String(info.origin_code ?? info.originCode ?? '').toUpperCase();
  const dest = String(info.destination_code ?? info.destinationCode ?? '').toUpperCase();
  const date = String(
    getCalendarDateFromFlight(selected) ?? info.departure_date ?? info.departureDate ?? '',
  )
    .trim()
    .slice(0, 10);
  const flightNo = String(info.flight_number ?? info.flightNumber ?? '')
    .trim()
    .toUpperCase();

  const matches = [];
  for (const flight of availabilityFlights) {
    if (!flight) continue;
    if (selectedKey && getFlightGroupingKey(flight) === selectedKey) {
      matches.push(flight);
      continue;
    }
    if (!origin || !dest || !date) continue;
    const fi = flight?.common_info ?? {};
    const fo = String(fi.origin_code ?? fi.originCode ?? '').toUpperCase();
    const fd = String(fi.destination_code ?? fi.destinationCode ?? '').toUpperCase();
    const fdate = String(
      getCalendarDateFromFlight(flight) ?? fi.departure_date ?? fi.departureDate ?? '',
    )
      .trim()
      .slice(0, 10);
    if (fo !== origin || fd !== dest || fdate !== date) continue;
    if (flightNo) {
      const fn = String(fi.flight_number ?? fi.flightNumber ?? '')
        .trim()
        .toUpperCase();
      if (fn && fn !== flightNo) continue;
    }
    matches.push(flight);
  }
  return matches;
}

/**
 * Allow-list for the selected first leg: snapshot keys, the stored flight, and
 * the same grouping key in the live availability list (week refetch can keep
 * keys on the live row after the card snapshot dropped them).
 */
export function resolveCompatibleKeysForOutboundSelection(selection, availabilityFlights = []) {
  if (!selection) return [];
  const merged = new Set();
  pushTrimmedKeys(merged, selection.compatibleKeys);
  pushTrimmedKeys(merged, getCompatibleReturnKeysFromOutboundFlight(selection.flight));
  for (const fresh of findMatchingOutboundAvailabilityFlights(selection, availabilityFlights)) {
    if (fresh === selection.flight) continue;
    pushTrimmedKeys(merged, getCompatibleReturnKeysFromOutboundFlight(fresh));
  }
  return [...merged];
}

/** Keep next-leg / return keys on the stored first-leg flight so later selects can read them. */
export function withCompatibleKeysOnFlight(flight, keys) {
  if (!flight || !Array.isArray(keys) || keys.length === 0) return flight;
  const next = { ...flight };
  if (!Array.isArray(next.compatible_next_leg_keys) || next.compatible_next_leg_keys.length === 0) {
    next.compatible_next_leg_keys = keys;
  }
  if (!Array.isArray(next.compatibleNextLegKeys) || next.compatibleNextLegKeys.length === 0) {
    next.compatibleNextLegKeys = keys;
  }
  return next;
}

/** Departure date (YYYY-MM-DD) embedded in a grouping key, e.g. XH741_2026-06-05_09:45:00. */
export function getDateFromGroupingKey(groupingKey) {
  const parts = String(groupingKey ?? '').split('_');
  if (parts.length < 2) return null;
  const d = parts[1]?.trim().slice(0, 10);
  return d || null;
}

/** Whether the searched return date appears in the outbound's compatibleReturnKeys list. */
export function isReturnDateInCompatibleKeys(returnDateStr, compatibleReturnKeys) {
  if (!returnDateStr || !compatibleReturnKeys?.length) return false;
  const want = String(returnDateStr).trim().slice(0, 10);
  return compatibleReturnKeys.some((k) => getDateFromGroupingKey(k) === want);
}

/** Return-leg rows whose grouping key is allowed for the selected outbound. */
export function filterFlightsByCompatibleReturnKeys(flights, compatibleReturnKeys) {
  if (!Array.isArray(flights) || flights.length === 0) return [];
  const keySet = new Set(
    (compatibleReturnKeys ?? []).map((k) => String(k).trim()).filter(Boolean),
  );
  if (keySet.size === 0) return [];
  return flights.filter((f) => keySet.has(getFlightGroupingKey(f)));
}

/** Earliest calendar date that has at least one compatible return flight. */
export function findEarliestCompatibleReturnDate(flights, compatibleReturnKeys, options = {}) {
  const compatible = filterFlightsByCompatibleReturnKeys(flights, compatibleReturnKeys);
  const useReturn = options.useReturnSegment === true;
  const dates = compatible
    .map((f) => getCalendarDateFromFlight(f, { useReturnSegment: useReturn }))
    .filter(Boolean)
    .map((d) => String(d).trim().slice(0, 10))
    .sort();
  if (dates[0]) return dates[0];
  // Keys alone (e.g. multi-city next leg) still define bookable days before rows load.
  const fromKeys = (compatibleReturnKeys ?? [])
    .map((k) => getDateFromGroupingKey(k))
    .filter(Boolean)
    .sort();
  return fromKeys[0] ?? null;
}

/** Whether any compatible return flight departs on this date (YYYY-MM-DD). */
export function isReturnDateCompatible(returnDateStr, flights, compatibleReturnKeys, options = {}) {
  if (!returnDateStr || !compatibleReturnKeys?.length) return false;
  const want = String(returnDateStr).trim().slice(0, 10);
  const useReturn = options.useReturnSegment === true;
  const compatible = filterFlightsByCompatibleReturnKeys(flights, compatibleReturnKeys);
  return compatible.some((f) => {
    const d = getCalendarDateFromFlight(f, { useReturnSegment: useReturn });
    return d && String(d).trim().slice(0, 10) === want;
  });
}

/** Return calendar day is selectable when listed on the outbound's compatibleReturnKeys
 * or a loaded row’s grouping key matches that allow-list. */
export function isReturnCalendarDateSelectable(
  returnDateStr,
  flights,
  compatibleReturnKeys,
  options = {},
) {
  if (!compatibleReturnKeys?.length) return true;
  if (!returnDateStr) return false;
  if (isReturnDateInCompatibleKeys(returnDateStr, compatibleReturnKeys)) return true;
  return isReturnDateCompatible(returnDateStr, flights, compatibleReturnKeys, options);
}

/** Calendar day is blocked when it is not a compatible return day for the selected outbound. */
export function isReturnCalendarDateBlockedByCompatibleKeys(
  returnDateStr,
  flights,
  compatibleReturnKeys,
  options = {},
) {
  if (!compatibleReturnKeys?.length) return true;
  if (!returnDateStr) return false;
  return !isReturnCalendarDateSelectable(
    returnDateStr,
    flights,
    compatibleReturnKeys,
    options,
  );
}

/** @deprecated Use compatibleReturnKeys from outbound; kept for legacy callers. */
export function isReturnCalendarDateBlocked(returnDateStr, outboundDateStr) {
  if (!returnDateStr || !outboundDateStr) return false;
  const outbound = parseISO(String(outboundDateStr).trim().slice(0, 10));
  const ret = parseISO(String(returnDateStr).trim().slice(0, 10));
  if (!isValid(outbound) || !isValid(ret)) return false;
  return ret.getTime() <= outbound.getTime();
}

/** Return-leg flights whose departure is strictly after the selected outbound date. */
export function filterFlightsAfterOutboundDate(flights, outboundDateStr, options = {}) {
  if (!outboundDateStr || !Array.isArray(flights)) return flights ?? [];
  return flights.filter((f) => {
    const d = getCalendarDateFromFlight(f, { useReturnSegment: options.useReturnSegment === true });
    if (!d) return false;
    return !isReturnCalendarDateBlocked(d, outboundDateStr);
  });
}

/** Earliest return date with flights after outbound (for auto-selecting return calendar). */
export function findEarliestReturnDateAfterOutbound(flights, outboundDateStr, options = {}) {
  if (!outboundDateStr || !Array.isArray(flights)) return null;
  const useReturn = options.useReturnSegment === true;
  const validDates = flights
    .map((f) => getCalendarDateFromFlight(f, { useReturnSegment: useReturn }))
    .filter((d) => d && !isReturnCalendarDateBlocked(d, outboundDateStr))
    .sort();
  return validDates[0] ?? null;
}

/** Keep only flights matching origin → destination (e.g. SHJ→DAM or DAM→SHJ). */
export function filterFlightsByRoute(flights, originCode, destinationCode) {
  if (!Array.isArray(flights)) return [];
  const origin = String(originCode || '').toUpperCase();
  const destination = String(destinationCode || '').toUpperCase();
  if (!origin || !destination) return flights;
  return flights.filter((f) => {
    const info = f?.common_info ?? f?.commonInfo ?? {};
    const o = String(
      info.origin_code ?? info.originCode ?? '',
    ).toUpperCase();
    const d = String(
      info.destination_code ?? info.destinationCode ?? '',
    ).toUpperCase();
    return o === origin && d === destination;
  });
}

const toFareNumber = (value) => {
  if (value == null || value === '') return null;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(num) ? num : null;
};

const economyFareTotal = (fare) =>
  toFareNumber(fare?.totalFare ?? fare?.total_fare ?? fare?.total ?? fare?.TotalFare);

const toCalendarDisplayPrice = (_currency, rawPrice) => rawPrice;

const isFareSelectable = (fare) =>
  (fare?.inventory_status === 'AV' || fare?.inventoryStatus === 'AV') &&
  Number(fare?.seats_remaining ?? fare?.seatsRemaining ?? 0) > 0;

/**
 * Lowest fare for one flight + cabin from that trip's bundle list (`Economy.fares` / `Business.fares`).
 * Falls back to cabin `total_fare` only when there is no fares array.
 * @param {Object} flight
 * @param {'Economy'|'Business'} cabin
 * @returns {{ price: number, currency: string, raw: number }|null}
 */
export function getCheapestCabinDisplayFareForFlight(flight, cabin = 'Economy', options = {}) {
  if (!flight || typeof flight !== 'object') return null;
  const block = flight[cabin];
  if (!block || typeof block !== 'object') return null;

  const { selectableOnly = false } = options;
  const currency = block.currency || flight?.common_info?.currency || 'USD';
  const fares = Array.isArray(block.fares) ? block.fares : [];
  let min = null;

  if (fares.length > 0) {
    const selectable = fares.filter(isFareSelectable);
    let candidates;
    if (selectableOnly) {
      candidates = selectable;
    } else {
      candidates = selectable.length > 0 ? selectable : fares;
    }
    for (const fare of candidates) {
      const total = economyFareTotal(fare);
      if (total == null) continue;
      if (min === null || total < min) min = total;
    }
  }

  if (min == null && !selectableOnly) {
    min = toFareNumber(block.total_fare ?? block.total_fare_USD);
  }
  if (min == null) return null;

  return {
    price: toCalendarDisplayPrice(currency, min),
    currency,
    raw: min,
  };
}

/**
 * Cabin header / calendar price from API `economyFarePricing.totalFare` / `businessFarePricing.totalFare`
 * (adapter maps to `flight.Economy.total_fare`). Falls back to cheapest bundle fare when absent.
 */
export function getCabinPlanDisplayFareForFlight(flight, cabin = 'Economy', options = {}) {
  if (!flight || typeof flight !== 'object') return null;
  const block = flight[cabin];
  if (!block || typeof block !== 'object') return null;

  const currency = block.currency || flight?.common_info?.currency || 'USD';
  const planTotal = toFareNumber(block.total_fare ?? block.total_fare_USD);
  if (planTotal != null && options.preferPlanTotal !== false) {
    return {
      price: toCalendarDisplayPrice(currency, planTotal),
      currency,
      raw: planTotal,
    };
  }
  return getCheapestCabinDisplayFareForFlight(flight, cabin, options);
}

/**
 * Cheapest selectable economy fare for one flight (calendar + flight list Economy box).
 * @returns {{ price: number, currency: string, raw?: number }|null}
 */
export function getCheapestEconomyDisplayFareForCalendar(flight) {
  return getCheapestCabinDisplayFareForFlight(flight, 'Economy');
}

/** Cheapest business fare for one flight (flight list Business box). */
export function getCheapestBusinessDisplayFareForFlight(flight) {
  return getCheapestCabinDisplayFareForFlight(flight, 'Business');
}

/**
 * Returns the cheapest fare (USD) for a single flight across all fare-class keys
 * (Economy, Business, or any other key that has total_fare_USD or total_fare).
 * @param {Object} flight - Flight item with common_info, Economy, Business, etc.
 * @returns {number|null} - Cheapest price or null if none found
 */
export function getCheapestFareForFlight(flight) {
  if (!flight || typeof flight !== 'object') return null;
  let min = null;
  for (const key of Object.keys(flight)) {
    if (key === 'common_info') continue;
    const fareBlock = flight[key];
    if (!fareBlock || typeof fareBlock !== 'object') continue;
    const value = fareBlock.total_fare_USD ?? fareBlock.total_fare;
    if (value == null) continue;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (!Number.isFinite(num)) continue;
    if (min === null || num < min) min = num;
  }
  return min;
}

/**
 * Returns the cheapest display fare and currency for a flight (matches flight list display).
 * Uses total_fare and common_info.currency so calendar prices match the list after POS/currency change.
 * @param {Object} flight - Flight item with common_info, Economy, Business, etc.
 * @returns {{ price: number, currency: string }|null}
 */
export function getCheapestDisplayFareAndCurrency(flight) {
  if (!flight || typeof flight !== 'object') return null;
  const currency = flight?.common_info?.currency ?? 'USD';
  let min = null;
  for (const key of Object.keys(flight)) {
    if (key === 'common_info') continue;
    const fareBlock = flight[key];
    if (!fareBlock || typeof fareBlock !== 'object') continue;
    const value = fareBlock.total_fare ?? fareBlock.total_fare_USD;
    if (value == null) continue;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (!Number.isFinite(num)) continue;
    if (min === null || num < min) min = num;
  }
  return min != null ? { price: min, currency } : null;
}

/**
 * Business cabin display fare for calendar (ALP–SAW and similar routes where Economy is hidden).
 */
export function getBusinessDisplayFareAndCurrency(flight) {
  if (!flight || typeof flight !== 'object') return null;
  const fareBlock = flight.Business;
  if (!fareBlock || typeof fareBlock !== 'object') return null;
  const currency = flight?.common_info?.currency ?? 'USD';
  const value = fareBlock.total_fare ?? fareBlock.total_fare_USD;
  const num = toFareNumber(value);
  if (num == null) return null;
  return { price: toCalendarDisplayPrice(currency, num), currency };
}

/**
 * Calendar price: prefer Economy; when user searched Business, prefer Business first.
 * If preferred cabin has no selectable fare, fall back to the other cabin so the day
 * is not shown as "Not available" when only Business (or only Economy) exists.
 * @param {{ preferBusiness?: boolean }} options
 */
export function getDisplayFareForCalendarWithCabin(flight, options = {}) {
  const calendarOpts = { selectableOnly: true };
  const economy = getCabinPlanDisplayFareForFlight(flight, 'Economy', calendarOpts);
  const business = getCabinPlanDisplayFareForFlight(flight, 'Business', calendarOpts);

  if (options.preferBusiness) {
    if (business) return { price: business.price, currency: business.currency, cabin: 'Business' };
    if (economy) return { price: economy.price, currency: economy.currency, cabin: 'Economy' };
    return null;
  }
  if (economy) return { price: economy.price, currency: economy.currency, cabin: 'Economy' };
  if (business) return { price: business.price, currency: business.currency, cabin: 'Business' };
  return null;
}

export function getDisplayFareForCalendar(flight, options = {}) {
  const result = getDisplayFareForCalendarWithCabin(flight, options);
  if (!result) return null;
  return { price: result.price, currency: result.currency };
}

/**
 * Builds a map of date string (YYYY-MM-DD) -> cheapest price from DirectAirPort flights.
 * @param {Array} directFlights - DirectAirPort array from API response
 * @param {{ useReturnSegment?: boolean }} options - If useReturnSegment true, use second segment date (for return-phase calendar)
 * @returns {Map<string, number>} - Map of "YYYY-MM-DD" -> price
 */
export function buildDateToPriceMap(directFlights, options = {}) {
  const map = new Map();
  if (!Array.isArray(directFlights)) return map;
  const useReturn = options.useReturnSegment === true;
  for (const flight of directFlights) {
    const dateKey = getCalendarDateFromFlight(flight, { useReturnSegment: useReturn });
    if (!dateKey) continue;
    const price = getCheapestFareForFlight(flight);
    if (price == null) continue;
    const existing = map.get(dateKey);
    if (existing === undefined || price < existing) {
      map.set(dateKey, price);
    }
  }
  return map;
}

/**
 * Builds a map of date string (YYYY-MM-DD) -> { price, currency } for the calendar.
 * Per flight: cheapest economy bundle; per day: minimum across all flights that day.
 * @param {Array} directFlights - DirectAirPort array from API response
 * @param {{ useReturnSegment?: boolean, preferBusiness?: boolean }} options - If useReturnSegment true, use second segment date; preferBusiness uses Business total_fare for each flight
 * @returns {Map<string, { price: number, currency: string }>}
 */
export function buildDateToDisplayFareMap(directFlights, options = {}) {
  const map = new Map();
  if (!Array.isArray(directFlights)) return map;
  const useReturn = options.useReturnSegment === true;
  for (const flight of directFlights) {
    const dateKey = getCalendarDateFromFlight(flight, { useReturnSegment: useReturn });
    if (!dateKey) continue;
    const result = getDisplayFareForCalendarWithCabin(flight, options);
    if (!result) continue;
    const existing = map.get(dateKey);
    if (existing === undefined || result.price < existing.price) {
      map.set(dateKey, {
        price: result.price,
        currency: result.currency,
        cabin: result.cabin,
      });
    }
  }
  return map;
}

/**
 * Formats a date to YYYY-MM-DD for comparison with API departure_date.
 * @param {Date} date
 * @returns {string}
 */
function toDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Builds the slider date list (3 days before, search date, 3 days after) with prices from
 * DirectAirPort. When a day has no Direct fare, falls back to IndirectAirPort (nearby) and
 * marks `isNearbyPrice` so the UI can use secondary-1.
 * On return, only days allowed by compatibleReturnKeys show fares — harvested cache rows
 * outside that allow-list must not paint prices (e.g. 29–31 Jul before a 1 Aug outbound).
 * Week/day nav persistence comes from unioning keys in the parent, not from skipping this filter.
 * Returns empty dates when search date is missing or invalid.
 * @param {string|Date} searchDateParam - User search date (e.g. "2026-03-16") or return date when useReturnSegment
 * @param {Array} directFlights - DirectAirPort from API response (can be empty)
 * @param {{ useReturnSegment?: boolean, halvePriceForRoundTrip?: boolean, preferBusiness?: boolean, compatibleReturnKeys?: string[], compatibleReturnFlights?: Array, indirectFlights?: Array }} options
 * @returns {{ dates: Array<{ date: Date, price: number|null, isNearbyPrice?: boolean }>, searchDateIndex: number }} - searchDateIndex -1 when no dates
 */
export function buildDatePriceSlots(searchDateParam, directFlights, options = {}) {
  let centerDate;
  if (searchDateParam != null && searchDateParam !== '') {
    centerDate = typeof searchDateParam === 'string' ? parseISO(searchDateParam.trim().slice(0, 10)) : searchDateParam;
    if (!isValid(centerDate)) centerDate = null;
  } else {
    centerDate = null;
  }

  if (!centerDate) {
    return { dates: [], searchDateIndex: -1 };
  }

  const {
    halvePriceForRoundTrip = false,
    compatibleReturnKeys = null,
    compatibleReturnFlights = null,
    useReturnSegment = false,
    indirectFlights = null,
  } = options;
  const useCompatibleKeys =
    Array.isArray(compatibleReturnKeys) && compatibleReturnKeys.length > 0;

  const resolveFareFlights = (pool) => {
    const list = Array.isArray(pool) ? pool : [];
    return useCompatibleKeys
      ? filterFlightsByCompatibleReturnKeys(list, compatibleReturnKeys)
      : list;
  };

  // Direct fares: only rows whose grouping key is in the (parent-unioned) allow-list.
  const flightsForFareMap = resolveFareFlights(directFlights);
  // Nearby list is parent-curated by route/country; still hide any day blocked by keys below.
  const indirectForFareMap = Array.isArray(indirectFlights) ? indirectFlights : [];
  const returnFlightsForCompat =
    compatibleReturnFlights ??
    [...flightsForFareMap, ...indirectForFareMap];

  const center = startOfDay(centerDate);
  const dateToDirectFare = buildDateToDisplayFareMap(flightsForFareMap, options);
  const dateToIndirectFare = buildDateToDisplayFareMap(indirectForFareMap, options);
  const dates = [];
  for (let i = -DAYS_BEFORE; i <= DAYS_AFTER; i++) {
    const date = addDays(center, i);
    const dateKey = toDateKey(date);
    const directEntry = dateToDirectFare.get(dateKey);
    const indirectEntry = dateToIndirectFare.get(dateKey);
    const blockedByCompatibleKeys =
      useCompatibleKeys &&
      isReturnCalendarDateBlockedByCompatibleKeys(
        dateKey,
        returnFlightsForCompat,
        compatibleReturnKeys,
        { useReturnSegment },
      );
    const entry = blockedByCompatibleKeys
      ? null
      : directEntry ?? indirectEntry ?? null;
    const isNearbyPrice = Boolean(
      !blockedByCompatibleKeys && !directEntry && indirectEntry,
    );
    let price = entry ? entry.price : null;
    if (price != null && halvePriceForRoundTrip && Number.isFinite(Number(price))) {
      price = Number(price) / 2;
    }
    const currency = entry ? entry.currency : 'USD';
    const cabin = entry?.cabin ?? 'Economy';
    dates.push({ date, price, currency, cabin, isNearbyPrice });
  }
  return { dates, searchDateIndex: DAYS_BEFORE };
}

/** Shift calendar week center ±7 days (same weekday). */
export function shiftCalendarWeekCenter(centerDateStr, direction) {
  if (!centerDateStr || typeof centerDateStr !== 'string') return null;
  const trimmed = centerDateStr.trim().slice(0, 10);
  const center = parseISO(trimmed);
  if (!isValid(center)) return null;
  const delta = direction === 'next' ? 7 : -7;
  return format(addDays(center, delta), 'yyyy-MM-dd');
}

/** Shift calendar view center by one day (Air Arabia–style day navigation). */
export function shiftCalendarDayCenter(centerDateStr, direction) {
  if (!centerDateStr || typeof centerDateStr !== 'string') return null;
  const trimmed = centerDateStr.trim().slice(0, 10);
  const center = parseISO(trimmed);
  if (!isValid(center)) return null;
  const delta = direction === 'next' ? 1 : -1;
  return format(addDays(center, delta), 'yyyy-MM-dd');
}

/**
 * Edge date of a 7-day strip centered on viewCenter (first or last visible day).
 * @param {string} viewCenterStr
 * @param {'next' | 'prev'} direction
 */
export function getCalendarViewEdgeDate(viewCenterStr, direction) {
  const center = parseISO(String(viewCenterStr ?? '').trim().slice(0, 10));
  if (!isValid(center)) return null;
  const offset = direction === 'next' ? CALENDAR_DAYS_AFTER : -CALENDAR_DAYS_BEFORE;
  return format(addDays(startOfDay(center), offset), 'yyyy-MM-dd');
}

/**
 * Whether the date strip may shift one day earlier.
 * Return leg: block when the previous view would start before the day after outbound.
 * Outbound: allow sliding toward today as long as the new strip’s first day is still
 * today or later (e.g. center 31 → 30 → 29 → 28 when today is 25). Do not require
 * the next week-fetch center to be ≥ today — that incorrectly disabled day-prev
 * when the new edge sat outside the loaded ±7 week (e.g. 27 when week is 28…3).
 */
export function canShiftCalendarDayPrev(centerDateStr, options = {}) {
  const {
    outboundDepartureDate = null,
    isReturnLeg = false,
  } = options;
  const prevCenterStr = shiftCalendarDayCenter(centerDateStr, 'prev');
  const prevCenter = parseISO(String(prevCenterStr ?? '').trim().slice(0, 10));
  if (!isValid(prevCenter)) return false;

  const firstDayOfPrevView = addDays(startOfDay(prevCenter), -CALENDAR_DAYS_BEFORE);

  if (isReturnLeg && outboundDepartureDate) {
    const dep = parseISO(String(outboundDepartureDate).trim().slice(0, 10));
    if (isValid(dep)) {
      const minReturn = addDays(startOfDay(dep), 1);
      if (firstDayOfPrevView < minReturn) return false;
    }
    return true;
  }

  // Outbound: never slide so the leftmost visible day falls before today.
  const today = startOfDay(new Date());
  return firstDayOfPrevView.getTime() >= today.getTime();
}

/**
 * One-shot fetch center when day-prev would otherwise request a week before today.
 * Centers on (minDate + 3) so the strip is minDate … minDate+6 — e.g. today=25 →
 * center 28 covers 25…31 in a single availability call; further day-prev slides
 * reuse that loaded week (no extra API).
 *
 * @param {{ minDateStr?: string|null }} [options]
 * @returns {string|null} YYYY-MM-DD
 */
export function getDayNavFetchCenterForMinDate(options = {}) {
  const { minDateStr = null } = options;
  const minParsed = minDateStr
    ? parseISO(String(minDateStr).trim().slice(0, 10))
    : startOfDay(new Date());
  const minDay = isValid(minParsed) ? startOfDay(minParsed) : startOfDay(new Date());
  return format(addDays(minDay, CALENDAR_DAYS_BEFORE), 'yyyy-MM-dd');
}

/**
 * Whether `edgeDateStr` is covered by any loaded week center (±3 window).
 * @param {string} edgeDateStr
 * @param {Iterable<string>} loadedWeekCenters
 */
export function isCalendarEdgeCoveredByLoadedWeeks(edgeDateStr, loadedWeekCenters) {
  const edge = String(edgeDateStr ?? '').trim().slice(0, 10);
  if (!edge) return false;
  for (const center of loadedWeekCenters || []) {
    if (isDateInCalendarWeek(edge, center)) return true;
  }
  return false;
}

/**
 * Whether the date strip may shift one week earlier.
 * Return leg: block when the previous week would end before the day after outbound.
 */
export function canShiftCalendarWeekPrev(centerDateStr, options = {}) {
  const { outboundDepartureDate = null, isReturnLeg = false } = options;
  const prevCenterStr = shiftCalendarWeekCenter(centerDateStr, 'prev');
  const prevCenter = parseISO(String(prevCenterStr ?? '').trim().slice(0, 10));
  if (!isValid(prevCenter)) return false;

  if (isReturnLeg && outboundDepartureDate) {
    const dep = parseISO(String(outboundDepartureDate).trim().slice(0, 10));
    if (isValid(dep)) {
      const minReturn = addDays(startOfDay(dep), 1);
      const lastDayOfPrevWeek = addDays(startOfDay(prevCenter), CALENDAR_DAYS_BEFORE);
      if (lastDayOfPrevWeek < minReturn) return false;
    }
  }

  return startOfDay(prevCenter).getTime() >= startOfDay(new Date()).getTime();
}

/** Calendar days between outbound and return (round-trip). */
export function getReturnGapDays(dateStr, dateReturnStr) {
  const dep =
    typeof dateStr === 'string' ? parseISO(String(dateStr).trim().slice(0, 10)) : null;
  const ret =
    typeof dateReturnStr === 'string'
      ? parseISO(String(dateReturnStr).trim().slice(0, 10))
      : null;
  if (!dep || !ret || !isValid(dep) || !isValid(ret)) return 0;
  const diff = Math.round((ret.getTime() - dep.getTime()) / (24 * 60 * 60 * 1000));
  return Number.isFinite(diff) ? diff : 0;
}

/** Whether the calendar shows a price for this date in its ±3 day window. */
export function isCalendarDateAvailableInWeek(centerDateStr, directFlights, options = {}) {
  if (!centerDateStr) return false;
  const { dates } = buildDatePriceSlots(centerDateStr, directFlights, options);
  const key = String(centerDateStr).trim().slice(0, 10);
  const slot = dates.find((s) => format(s.date, 'yyyy-MM-dd') === key);
  return slot?.price != null;
}

/**
 * After week navigation (+7 / -7), prefer the shifted date; if it has no fare,
 * activate the first day in that calendar week (center −3 … center +3) that has a price.
 */
export function findFirstAvailableDateInCalendarWeek(centerDateStr, directFlights, options = {}) {
  if (!centerDateStr) return null;
  const idealKey = String(centerDateStr).trim().slice(0, 10);
  const { dates } = buildDatePriceSlots(centerDateStr, directFlights, options);
  if (dates.length === 0) return idealKey;

  const idealSlot = dates.find((s) => format(s.date, 'yyyy-MM-dd') === idealKey);
  if (idealSlot?.price != null) return idealKey;

  for (const slot of dates) {
    if (slot.price != null) return format(slot.date, 'yyyy-MM-dd');
  }
  return idealKey;
}
