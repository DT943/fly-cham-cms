import { collectDestinationIatasFromB2cRoutes } from '@/lib/b2cAvailability/collectDestinationIatasFromB2cRoutes';

function normalizeCountry(country) {
  return String(country || '').trim().toLowerCase();
}

function normalizeIata(iata) {
  return String(iata || '').trim().toUpperCase();
}

/** GCC countries treated as one region for multi-city leg 2 only. */
const GULF_COUNTRIES_NORMALIZED = new Set([
  'united arab emirates',
  'uae',
  'الامارات',
  'الإمارات العربية المتحدة',
  // 'kuwait',
  // 'الكويت',
  'oman',
  'عمان',
  // 'saudi arabia',
  // 'kingdom of saudi arabia',
  // 'السعودية',
]);

export function isGulfCountry(country) {
  const norm = normalizeCountry(country);
  if (!norm) return false;
  if (GULF_COUNTRIES_NORMALIZED.has(norm)) return true;
  return (
    norm.includes('emirates') ||
    norm.includes('الإمارات') ||
    norm.includes('الامارات') ||
    // norm.includes('kuwait') ||
    // norm.includes('كويت') ||
    norm.includes('oman') ||
    norm.includes('عمان')
    // norm.includes('saudi') ||
    // norm.includes('سعود')
  );
}

function collectIatasInGulfRegion(airports) {
  const iatas = new Set();
  for (const airport of airports || []) {
    if (!isGulfCountry(getAirportCountry(airport))) continue;
    const iata = normalizeIata(airport?.iataCode);
    if (iata) iatas.add(iata);
  }
  return iatas;
}

/**
 * Leg-2 country scope: single country, or full GCC when that country is in the Gulf.
 */
function resolveLeg2CountryIatas(airports, countryNorm) {
  if (!countryNorm) return new Set();
  if (isGulfCountry(countryNorm)) {
    return collectIatasInGulfRegion(airports);
  }
  return collectIatasInCountry(airports, countryNorm);
}

/** @param {Array<{ originAirportCode?: string, destinationAirportCode?: string, origin?: string, destination?: string }>} rows */
export function normalizeRouteRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    originAirportCode: row?.originAirportCode ?? row?.origin ?? '',
    destinationAirportCode: row?.destinationAirportCode ?? row?.destination ?? '',
  }));
}

function getAirportByIata(airports, iata) {
  const code = normalizeIata(iata);
  if (!code) return null;
  return (
    airports?.find((item) => normalizeIata(item?.iataCode) === code) ?? null
  );
}

function getAirportCountry(airport) {
  return normalizeCountry(airport?.airPortTranslations?.[0]?.country);
}

function collectIatasInCountry(airports, countryNorm) {
  if (!countryNorm) return new Set();
  const iatas = new Set();
  for (const airport of airports || []) {
    if (getAirportCountry(airport) === countryNorm) {
      const iata = normalizeIata(airport?.iataCode);
      if (iata) iatas.add(iata);
    }
  }
  return iatas;
}

/**
 * Leg 2 "From" options: airports in leg-1 destination country (GCC as one region
 * when destination is Gulf) that have at least one served route to any airport in
 * leg-1 origin country (also expanded to GCC when origin is Gulf).
 */
export function collectMultiCityLeg2SourceIatas({
  routeRows,
  airports,
  leg1OriginIata,
  leg1DestIata,
}) {
  const originMeta = getAirportByIata(airports, leg1OriginIata);
  const destMeta = getAirportByIata(airports, leg1DestIata);
  const originCountry = getAirportCountry(originMeta);
  const destCountry = getAirportCountry(destMeta);
  if (!originCountry || !destCountry) return [];

  const originCountryIatas = resolveLeg2CountryIatas(airports, originCountry);
  const destCountryIatas = resolveLeg2CountryIatas(airports, destCountry);
  const rows = normalizeRouteRows(routeRows);
  const ordered = [];
  const seen = new Set();

  for (const row of rows) {
    const from = normalizeIata(row.originAirportCode);
    const to = normalizeIata(row.destinationAirportCode);
    if (!from || !to || from === to) continue;
    if (!destCountryIatas.has(from) || !originCountryIatas.has(to)) continue;
    if (seen.has(from)) continue;
    seen.add(from);
    ordered.push(from);
  }

  return ordered;
}

/**
 * Leg 2 "To" options: airports in leg-1 origin country (GCC as one region when
 * origin is Gulf) with a served route from the selected leg-2 origin.
 */
export function collectMultiCityLeg2DestinationIatas({
  routeRows,
  airports,
  leg1OriginIata,
  leg2SourceIata,
}) {
  const leg2From = normalizeIata(leg2SourceIata);
  if (!leg2From) return [];

  const originMeta = getAirportByIata(airports, leg1OriginIata);
  const originCountry = getAirportCountry(originMeta);
  if (!originCountry) return [];

  const originCountryIatas = resolveLeg2CountryIatas(airports, originCountry);
  const rows = normalizeRouteRows(routeRows);
  const fromRoutes = collectDestinationIatasFromB2cRoutes(rows, leg2From);

  return fromRoutes.filter((iata) => originCountryIatas.has(normalizeIata(iata)));
}

export function resolveAirportIataById(airports, airportId) {
  if (!airportId) return '';
  const item = airports?.find((a) => String(a.id) === String(airportId));
  return normalizeIata(item?.iataCode);
}
