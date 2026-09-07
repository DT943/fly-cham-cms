import staticAirportList from '@/data/staticAirportList.json';
import { syntheticNumericIdForManifestOnlyIata } from '@/util/airports/buildAirportListFromManifest';

const staticItems = staticAirportList?.items ?? [];

const staticByIata = new Map(
  staticItems.map((row) => [(row.iataCode || '').toUpperCase(), row]),
);

const staticById = new Map(staticItems.map((row) => [Number(row.id), row]));

/** Maps both real static ids and synthetic manifest ids → IATA. */
let idToIataCache = null;

function getIdToIataMap() {
  if (idToIataCache) return idToIataCache;
  const map = new Map();
  for (const row of staticItems) {
    const iata = (row.iataCode || '').toUpperCase();
    if (!iata) continue;
    map.set(Number(row.id), iata);
    map.set(syntheticNumericIdForManifestOnlyIata(iata), iata);
  }
  idToIataCache = map;
  return map;
}

export function getStaticAirportItems() {
  return staticItems;
}

export function findStaticAirportByIata(iataCode) {
  const code = String(iataCode || '').trim().toUpperCase();
  if (!code) return null;
  return staticByIata.get(code) ?? null;
}

/**
 * Prefer the bundled static list id (search-results manifest / FlightWithPrice).
 * Fall back to synthetic id only when the IATA is not in staticAirportList.json.
 */
export function resolveAirportIdForIata(iataCode) {
  const row = findStaticAirportByIata(iataCode);
  if (row?.id != null) return Number(row.id);
  return syntheticNumericIdForManifestOnlyIata(iataCode);
}

function findIataInAirportItems(items, id) {
  if (id == null || id === '') return '';
  const target = String(id);
  const match = items.find((a) => String(a?.id) === target);
  return match?.iataCode ? String(match.iataCode).toUpperCase() : '';
}

/**
 * Resolve IATA for an airport id from the active airport list, static list, or synthetic map.
 */
export function resolveIataByAirportId(airportId, airPorts) {
  if (airportId == null || airportId === '') return '';
  const items = Array.isArray(airPorts)
    ? airPorts
    : airPorts?.items ?? [];
  const fromList = findIataInAirportItems(items, airportId);
  if (fromList) return fromList;
  const fromStatic = staticById.get(Number(airportId))?.iataCode;
  if (fromStatic) return String(fromStatic).toUpperCase();
  return getIdToIataMap().get(Number(airportId)) ?? '';
}

export function findAirportRowById(airportId, airPorts) {
  const id = Number(airportId);
  if (!Number.isFinite(id)) return null;
  const items = Array.isArray(airPorts)
    ? airPorts
    : airPorts?.items ?? [];
  const fromList = items.find((a) => Number(a?.id) === id);
  if (fromList) return fromList;
  const fromStatic = staticById.get(id);
  if (fromStatic) return fromStatic;
  const iata = getIdToIataMap().get(id);
  if (!iata) return null;
  return findStaticAirportByIata(iata);
}
