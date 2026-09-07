import { fetchFlightSchedulesFromApi } from './fetchFromApi';
import { loadStaticFlightScheduleRows } from './staticFallback';

function hasUsableRows(raw) {
  return Array.isArray(raw) && raw.length > 0;
}

/**
 * Tries the backend first, then the bundled manifest (`flightmanifestData.result`).
 * @returns {Promise<Array|null>}
 */
export async function resolveScheduleRowsWithFallback() {
  const fromApi = await fetchFlightSchedulesFromApi();
  if (hasUsableRows(fromApi)) return fromApi;
  return loadStaticFlightScheduleRows();
}
