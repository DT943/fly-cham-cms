import { format, parseISO, addDays, differenceInCalendarDays, isValid } from 'date-fns';
import { getLeg, MAX_LEGS } from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/legsUtils';
import { isDateInCalendarWeek } from '@/app/[pos]/[lang]/search-results/components/FlightResults/steps/SelectFlight/DatePriceSlider/datePriceSliderData';

const toDateOnly = (value) => String(value || '').trim().slice(0, 10);

export const MULTI_CITY_FLIGHT_TYPE = 'MultiCity';

export function isMultiCityFlightType(flighttype) {
  const v = String(flighttype ?? '').trim();
  return v === MULTI_CITY_FLIGHT_TYPE || v === 'MC' || v.toLowerCase() === 'multicity';
}

/** Parse `legs` from URL / search params (JSON string or array). */
export function parseLegsSearchParam(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Build search URL params for multi-city from form values.
 * Returns leg objects with origin_id, destination_id, date (ISO date string).
 */
export function buildMultiCityLegsFromFormValues(values, formatDate) {
  const legs = [];
  for (let i = 0; i < MAX_LEGS; i += 1) {
    const { source, destination, dateStart } = getLeg(values, i);
    if (!source || !destination || !dateStart) {
      if (i < 2) return null;
      break;
    }
    const formattedDate = formatDate(dateStart);
    if (!formattedDate) {
      if (i < 2) return null;
      break;
    }
    legs.push({
      origin_id: source,
      destination_id: destination,
      date: formattedDate,
    });
  }
  return legs.length >= 2 ? legs : null;
}

/** Normalize keyParams into a legs array for availability API mapping. */
export function resolveMultiCityLegsFromKeyParams(keyParams = {}) {
  const fromArray = parseLegsSearchParam(keyParams.legs);
  if (fromArray.length > 0) {
    return fromArray;
  }

  const legs = [];
  const addLeg = (origin_id, destination_id, date) => {
    if (origin_id != null && destination_id != null && date) {
      legs.push({ origin_id, destination_id, date });
    }
  };

  addLeg(keyParams.origin_id, keyParams.destination_id, keyParams.date);
  addLeg(keyParams.origin_id_2, keyParams.destination_id_2, keyParams.date_2);
  addLeg(keyParams.origin_id_3, keyParams.destination_id_3, keyParams.date_3);

  return legs;
}

export function hasValidMultiCityLegs(legs = []) {
  return (
    Array.isArray(legs) &&
    legs.length >= 2 &&
    legs.every((leg) => leg?.origin_id && leg?.destination_id && leg?.date)
  );
}

const toIsoLegDate = (value) => {
  const dateOnly = String(value || '').trim().slice(0, 10);
  if (!dateOnly) return '';
  return dateOnly.includes('T') ? dateOnly : `${dateOnly}T00:00:00`;
};

/** Sync top-level origin_id / destination_id / date to the active MC leg (OW-style URL). */
export function syncMcActiveLegToKeyParams(keyParams = {}, legIndex = 0) {
  const legs = resolveMultiCityLegsFromKeyParams(keyParams);
  const leg = legs[legIndex];
  if (!leg) return keyParams;

  const isoDate = toIsoLegDate(leg.date);
  const next = {
    ...keyParams,
    legs,
    origin_id: Number(leg.origin_id),
    destination_id: Number(leg.destination_id),
    date: isoDate,
  };

  if (legIndex === 0) return next;

  const { display_origin_id, display_destination_id, ...withoutDisplay } = next;
  return withoutDisplay;
}

/** Update one MC leg date in search params (week nav / calendar). */
export function updateMcLegDateInKeyParams(keyParams = {}, legIndex, newDateStr) {
  const isoDate = toIsoLegDate(newDateStr);
  if (!isoDate) return keyParams;

  const legs = resolveMultiCityLegsFromKeyParams(keyParams).map((leg, idx) =>
    idx === legIndex ? { ...leg, date: isoDate } : leg,
  );

  return syncMcActiveLegToKeyParams({ ...keyParams, legs }, legIndex);
}

/** MC search pair from keyParams legs — used for session registry and SelectedFlight. */
export function getMcSearchPairFromKeyParams(keyParams = {}) {
  const legs = resolveMultiCityLegsFromKeyParams(keyParams);
  const leg1Date = toDateOnly(legs[0]?.date);
  const leg2Date = toDateOnly(legs[1]?.date);
  if (!leg1Date || !leg2Date) return null;
  return { leg1Date, leg2Date, date: leg1Date, date_return: leg2Date };
}

/** Normalize MC pair shape for session / cache consumers. */
export function mcSearchPairToSessionContext(pair) {
  if (!pair) return null;
  const leg1Date = toDateOnly(pair.leg1Date ?? pair.date);
  const leg2Date = toDateOnly(pair.leg2Date ?? pair.date_return);
  if (!leg1Date || !leg2Date) return null;
  return { leg1Date, leg2Date, date: leg1Date, date_return: leg2Date };
}

/**
 * Resolve the FlightWithPrice search pair for a displayed calendar day.
 * Leg 1 phase: URL pair when day is in the loaded leg-1 week; else cached pair.
 * Leg 2 phase: frozen leg1 + URL leg2 when day is in loaded leg-2 week; else cached pair.
 */
export function resolveMcSearchPairForDay(dayKey, sources = {}) {
  const want = toDateOnly(dayKey);
  if (!want) return null;

  const urlPair = getMcSearchPairFromKeyParams(sources.keyParams);
  const frozenLeg1 = toDateOnly(sources.frozenLeg1Date);

  if (frozenLeg1 && urlPair?.leg2Date) {
    if (isDateInCalendarWeek(want, urlPair.leg2Date)) {
      return mcSearchPairToSessionContext({
        leg1Date: frozenLeg1,
        leg2Date: urlPair.leg2Date,
      });
    }
    const cachePair = sources.cacheEntry?.searchPair;
    if (cachePair && toDateOnly(sources.cacheEntry?.date) === want) {
      return mcSearchPairToSessionContext(cachePair);
    }
    return mcSearchPairToSessionContext({
      leg1Date: frozenLeg1,
      leg2Date: urlPair.leg2Date,
    });
  }

  if (urlPair?.leg1Date && isDateInCalendarWeek(want, urlPair.leg1Date)) {
    return urlPair;
  }

  const cachePair = sources.cacheEntry?.searchPair;
  if (cachePair && toDateOnly(sources.cacheEntry?.date) === want) {
    return mcSearchPairToSessionContext(cachePair);
  }

  return urlPair;
}

/**
 * Week ±7 for MC: leg 1 phase shifts both legs by the same offset;
 * leg 2 phase shifts only leg 2 while leg 1 stays frozen.
 */
export function shiftMcLegDatesForWeekNav(
  keyParams = {},
  legIndex,
  newCenterDateStr,
  frozenLeg1Date = null,
) {
  const center = toDateOnly(newCenterDateStr);
  if (!center) return keyParams;

  if (legIndex === 1) {
    let next = updateMcLegDateInKeyParams(keyParams, 1, center);
    const frozen = toDateOnly(frozenLeg1Date);
    if (frozen) {
      next = updateMcLegDateInKeyParams(next, 0, frozen);
    }
    return next;
  }

  const legs = resolveMultiCityLegsFromKeyParams(keyParams);
  const oldLeg1 = toDateOnly(legs[0]?.date);
  const oldLeg2 = toDateOnly(legs[1]?.date);
  if (!oldLeg1 || !oldLeg2) return keyParams;

  const oldDate = parseISO(oldLeg1);
  const newDate = parseISO(center);
  if (!isValid(oldDate) || !isValid(newDate)) return keyParams;

  const delta = differenceInCalendarDays(newDate, oldDate);
  const newLeg2 = format(addDays(parseISO(oldLeg2), delta), 'yyyy-MM-dd');

  let next = updateMcLegDateInKeyParams(keyParams, 0, center);
  next = updateMcLegDateInKeyParams(next, 1, newLeg2);
  return next;
}
