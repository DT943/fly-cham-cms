/**
 * Unique destination IATA codes for an origin from B2C route/all rows.
 *
 * @param {Array<{ originAirportCode?: string, destinationAirportCode?: string }>|null|undefined} routeRows
 * @param {string} originIata
 * @returns {string[]} Uppercase IATA list in first-seen order
 */
export function collectDestinationIatasFromB2cRoutes(routeRows, originIata) {
  if (!Array.isArray(routeRows) || !originIata) return [];

  const o = originIata.trim().toUpperCase();
  const seen = new Set();
  const ordered = [];

  for (const row of routeRows) {
    const ro = (row?.originAirportCode || row?.origin || '').trim().toUpperCase();
    const rd = (row?.destinationAirportCode || row?.destination || '')
      .trim()
      .toUpperCase();
    if (ro === o && rd && rd !== o && !seen.has(rd)) {
      seen.add(rd);
      ordered.push(rd);
    }
  }

  return ordered;
}
