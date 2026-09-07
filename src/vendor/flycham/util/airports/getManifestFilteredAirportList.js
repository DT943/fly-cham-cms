import { resolveScheduleRowsWithFallback } from '@/util/flightSchedules';
import { fetchB2cAllRoutes } from '@/lib/b2cAvailability/b2cAvailabilityApi';
import { buildAirportListPayload } from './buildAirportListFromManifest';
import staticAirportList from '@/data/staticAirportList.json';

/**
 * B2C route matrix, never throwing — a transport failure must fall through to the schedule source
 * rather than collapse the booking box.
 * @param {string} preferredLang
 * @returns {Promise<Array>}
 */
async function fetchRouteRowsSafe(preferredLang) {
  try {
    const rows = await fetchB2cAllRoutes(preferredLang);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Failed to fetch B2C routes for airport list:', error);
    return [];
  }
}

/**
 * Builds the booking airport list from `staticAirportList.json`, restricted to the IATA codes the
 * airline actually serves.
 *
 * Source of truth is the B2C route matrix (`/b2c_availabilityport/route/all`), which is where new
 * stations are activated. The flight schedule manifest is kept as a fallback only: it is sourced
 * from the AccelAero scrape and lags behind route activation (it returned no rows at all while DMM
 * and MJI were live, which hid both stations from every airport picker).
 *
 * @param {string} [preferredLang] - `en` | `ar` etc.; controls which translation is first per airport
 * @returns {Promise<{ items: object[], totalCount: number, page: number, pageSize: number }>}
 */
export async function getManifestFilteredAirportList(preferredLang = 'en') {
  const routeRows = await fetchRouteRowsSafe(preferredLang);
  if (routeRows.length > 0) {
    return buildAirportListPayload(routeRows, staticAirportList, preferredLang);
  }

  const scheduleRows = await resolveScheduleRowsWithFallback();
  return buildAirportListPayload(scheduleRows, staticAirportList, preferredLang);
}
