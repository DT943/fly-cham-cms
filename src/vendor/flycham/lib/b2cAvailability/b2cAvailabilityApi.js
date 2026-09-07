import { fetchData } from '@/services/Api/apiService';
import { withB2cLanguageCode } from '@/util/b2cLanguageCode';

export const B2C_AIRPORT_CATALOG_PATH = '/B2C_AvailabilityPort/AirportCatalog/with-calendar';
export const B2C_ALL_ROUTES_PATH = '/b2c_availabilityport/route/all';

export function b2cFlightAvailByRoutePath(fromIata, toIata) {
  const from = String(fromIata || '')
    .trim()
    .toUpperCase();
  const to = String(toIata || '')
    .trim()
    .toUpperCase();
  return `/b2c_availabilityport/FlightAvail/by-route/${from}/${to}`;
}

function unwrapResult(data) {
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data)) return data;
  return [];
}

export async function fetchB2cAirportCatalog(languageCode = 'en') {
  const data = await fetchData(withB2cLanguageCode(B2C_AIRPORT_CATALOG_PATH, languageCode));
  return unwrapResult(data);
}

export async function fetchB2cAllRoutes(languageCode = 'en') {
  const data = await fetchData(withB2cLanguageCode(B2C_ALL_ROUTES_PATH, languageCode));
  return unwrapResult(data);
}

export async function fetchB2cFlightAvailByRoute(fromIata, toIata, languageCode = 'en') {
  if (!fromIata || !toIata) return [];
  const data = await fetchData(
    withB2cLanguageCode(b2cFlightAvailByRoutePath(fromIata, toIata), languageCode),
  );
  return unwrapResult(data);
}
