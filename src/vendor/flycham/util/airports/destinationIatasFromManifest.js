/**
 * Unique destination IATA codes that appear in the manifest for an origin, in first-seen order.
 *
 * - Matches rows where `origin` equals `originIata` (case-insensitive).
 *
 * @param {Array<{ origin?: string, destination?: string }>|null|undefined} scheduleRows
 * @param {string} originIata
 * @returns {string[]} Uppercase IATA list (may be empty)
 */
export function collectDestinationIatasForOrigin(scheduleRows, originIata) {
  if (!Array.isArray(scheduleRows) || !originIata) return [];

  const o = originIata.trim().toUpperCase();
  const seen = new Set();
  const ordered = [];

  for (const row of scheduleRows) {
    const ro = (row?.origin || '').trim().toUpperCase();
    const rd = (row?.destination || '').trim().toUpperCase();
    if (ro === o && rd && rd !== o && !seen.has(rd)) {
      seen.add(rd);
      ordered.push(rd);
    }
  }

  return ordered;
}
