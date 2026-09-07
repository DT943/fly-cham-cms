import { normalizePrefetchedSchedules } from './normalize';
import { resolveScheduleRowsWithFallback } from './resolveScheduleRows';

/**
 * Client: `null` = prior load had no rows; non-empty array = cached rows; `[]` = never loaded.
 * Server (RSC): Redux is not used — always resolves via API then static fallback.
 */
function shouldFetchFromApi(calendarData) {
  if (typeof window === 'undefined') return true;
  if (calendarData === null) return false;
  if (Array.isArray(calendarData) && calendarData.length > 0) return false;
  return true;
}

/** Deduplicate concurrent client fetches (e.g. React Strict Mode). */
let clientInflight = null;

/**
 * Returns flight schedule rows for calendars.
 *
 * **Server (RSC):** calls the API, then falls back to `src/data/flightmanifestData` if the API
 * returns no usable rows. Returns a raw array or `null` (pages often use {@link normalizePrefetchedSchedules}).
 *
 * **Client:** uses `flights.calendarData` when already populated (including `null` after an empty
 * successful load). Otherwise resolves API → static fallback, dispatches `setCalendarData` with
 * the normalized value, and returns that value.
 *
 * @returns {Promise<Array|null>}
 */
export async function getPrefetchedFlightSchedules() {
  if (typeof window !== 'undefined') {
    const [{ store }, { setCalendarData }] = await Promise.all([
      import('@/store'),
      import('@/store/flightSlice'),
    ]);
    const fromStore = store.getState()?.flights?.calendarData;
    if (!shouldFetchFromApi(fromStore)) {
      return fromStore;
    }
    if (clientInflight) {
      return clientInflight;
    }
    clientInflight = (async () => {
      try {
        const raw = await resolveScheduleRowsWithFallback();
        const normalized = normalizePrefetchedSchedules(raw);
        store.dispatch(setCalendarData(normalized));
        return normalized;
      } finally {
        clientInflight = null;
      }
    })();
    return clientInflight;
  }

  return resolveScheduleRowsWithFallback();
}
