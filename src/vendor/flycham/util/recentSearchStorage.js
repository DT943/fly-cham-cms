import { toCalendarDateKeyFromAny } from '@/util/calendarDateKey';

export const RECENT_SEARCH_KEY = 'flycham_recent_search';

/** Same-tab listeners (e.g. multiple `useRecentSearchesSync` instances) refresh when storage mutates */
export const RECENT_SEARCH_CHANGED_EVENT = 'flycham-recent-search-changed';

function notifyRecentSearchChanged() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(RECENT_SEARCH_CHANGED_EVENT));
  } catch {
    // ignore
  }
}

const MAX_RECENT = 3;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function todayCalendarKey() {
  return toCalendarDateKeyFromAny(new Date());
}

/** Outbound / departure calendar key (YYYY-MM-DD) from a recent-search entry. */
export function getDepartureCalendarKey(data) {
  return toCalendarDateKeyFromAny(data?.date);
}

/**
 * True when the outbound date is today or in the future.
 * Uses calendar keys (same rules as booking-box date formatting) to avoid TZ drift.
 */
export function isSearchDateUpcoming(data) {
  const depKey = getDepartureCalendarKey(data);
  if (!depKey) return false;
  const todayKey = todayCalendarKey();
  if (!todayKey) return false;
  return depKey >= todayKey;
}

/**
 * Drop past-date (and other invalid) entries from localStorage.
 * @returns {boolean} true when storage was mutated
 */
export function purgeStaleRecentSearches() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    const now = Date.now();
    const valid = list.filter((item) => isValidRecentSearchEntry(item, now));
    if (valid.length === list.length) return false;
    if (valid.length === 0) {
      localStorage.removeItem(RECENT_SEARCH_KEY);
    } else {
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(valid));
    }
    notifyRecentSearchChanged();
    return true;
  } catch {
    return false;
  }
}

function isValidRecentSearchEntry(item, now) {
  return (
    item.savedAt &&
    now - item.savedAt < MAX_AGE_MS &&
    item.origin_id &&
    item.destination_id &&
    item.origin_city &&
    item.destination_city &&
    item.date &&
    isSearchDateUpcoming(item)
  );
}

/**
 * Resolve a city name from airport items by id.
 */
function getCityByAirportId(airportItems, id) {
  if (!id || !airportItems?.length) return '';
  const airport = airportItems.find((a) => String(a.id) === String(id));
  if (!airport) return '';
  const trans = airport.airPortTranslations?.[0];
  return trans?.city || airport.iataCode || '';
}

/**
 * Read the array of recent searches from localStorage.
 * Filters out expired entries (older than 7 days).
 */
export function readRecentSearches() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    // Migrate: if old format was a single object, wrap in array
    const list = Array.isArray(parsed) ? parsed : [parsed];

    const now = Date.now();
    const valid = list.filter((item) => isValidRecentSearchEntry(item, now));

    if (valid.length !== list.length) {
      try {
        if (valid.length === 0) {
          localStorage.removeItem(RECENT_SEARCH_KEY);
        } else {
          localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(valid));
        }
        notifyRecentSearchChanged();
      } catch {
        // ignore write failures
      }
    }

    return valid;
  } catch {
    return [];
  }
}

/**
 * Persist the latest search params into localStorage.
 * Keeps up to 3 most recent searches. Deduplicates by origin+destination+date.
 */
export function saveRecentSearchCookie(data, airportItems) {
  if (typeof window === 'undefined' || !data) return;

  const originId = data.display_origin_id || data.origin_id;
  const destinationId = data.display_destination_id || data.destination_id;

  // Don't save incomplete searches
  if (!originId || !destinationId || !data.date) return;

  const originCity = getCityByAirportId(airportItems, originId);
  const destinationCity = getCityByAirportId(airportItems, destinationId);
  if (!originCity || !destinationCity) return;

  const payload = {
    origin_id: originId,
    destination_id: destinationId,
    origin_city: originCity,
    destination_city: destinationCity,
    date: data.date,
    date_return: data.date_return || null,
    flighttype: data.flighttype,
    adults: data.adults,
    children: data.children,
    infants: data.infants,
    flightclass: data.flightclass,
    savedAt: Date.now(),
  };

  if (!isSearchDateUpcoming(payload)) return;

  try {
    const existing = readRecentSearches();

    // Remove duplicate (same route: origin + destination + date + return date)
    const filtered = existing.filter(
      (item) =>
        !(
          String(item.origin_id) === String(payload.origin_id) &&
          String(item.destination_id) === String(payload.destination_id) &&
          item.date === payload.date &&
          item.date_return === payload.date_return
        ),
    );

    // Add new search at the end (FIFO: oldest at index 0 gets dropped when > 3)
    const updated = [...filtered, payload];
    // If exceeds max, drop the oldest (first item)
    while (updated.length > MAX_RECENT) {
      updated.shift();
    }

    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    notifyRecentSearchChanged();
  } catch {
    // silently ignore storage write failures
  }
}

/**
 * Remove a single recent search by index.
 */
export function removeRecentSearch(index) {
  if (typeof window === 'undefined') return;
  try {
    const list = readRecentSearches();
    list.splice(index, 1);
    if (list.length === 0) {
      localStorage.removeItem(RECENT_SEARCH_KEY);
    } else {
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(list));
    }
    notifyRecentSearchChanged();
  } catch {
    // silently ignore
  }
}

/**
 * Remove all recent searches from localStorage.
 */
export function clearRecentSearchCookie() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCH_KEY);
    notifyRecentSearchChanged();
  } catch {
    // silently ignore
  }
}
