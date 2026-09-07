import staticAirportList from '@/data/staticAirportList.json';

/** Numeric IDs in this range are reserved for IATAs that appear on the schedule but are missing from `staticAirportList.json` (avoids clashing with typical low DB ids 1–99). */
const SYNTHETIC_MANIFEST_AIRPORT_ID_BASE = 880_000;

/**
 * Stable synthetic DB-style id for a manifest-only IATA (booking API may still require a real id from your backend).
 * @param {string} iata
 * @returns {number}
 */
export function syntheticNumericIdForManifestOnlyIata(iata) {
  const u = String(iata || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  let h = 0;
  for (let i = 0; i < u.length; i += 1) {
    h = (h * 31 + u.charCodeAt(i)) >>> 0;
  }
  return SYNTHETIC_MANIFEST_AIRPORT_ID_BASE + (h % 50_000);
}

/**
 * Minimal airport row when schedule references an IATA not present in the static list.
 * @param {string} iata
 * @returns {object}
 */
export function buildSyntheticManifestAirportRow(iata) {
  const code = String(iata || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return {
    id: syntheticNumericIdForManifestOnlyIata(code),
    iataCode: code,
    url: '',
    isNew: true,
    airPortTranslations: [
      {
        languageCode: 'en',
        city: code,
        country: '',
        airPortName: `${code}`,
        isDeleted: false,
      },
      {
        languageCode: 'ar',
        city: code,
        country: '',
        airPortName: `${code}    `,
        isDeleted: false,
      },
    ],
  };
}

/**
 * Walks schedule/route rows in order and collects unique IATA codes (origin/destination, no duplicates).
 *
 * Accepts both row shapes so the same builder works for either source:
 * - flight schedule rows (`origin` / `destination`)
 * - B2C route rows (`originAirportCode` / `destinationAirportCode`)
 *
 * @param {Array<{ origin?: string, destination?: string, originAirportCode?: string, destinationAirportCode?: string }>|null|undefined} rows
 * @returns {string[]} Uppercase IATA codes in first-seen order
 */
export function collectOrderedUniqueIataCodes(rows) {
  const seen = new Set();
  const ordered = [];
  const push = (code) => {
    if (code == null || typeof code !== 'string') return;
    const u = code.trim().toUpperCase();
    if (!u || seen.has(u)) return;
    seen.add(u);
    ordered.push(u);
  };
  for (const row of rows || []) {
    push(row.origin ?? row.originAirportCode);
    push(row.destination ?? row.destinationAirportCode);
  }
  return ordered;
}

/**
 * Puts the preferred language first in `airPortTranslations` so booking UI using `[0]` matches locale.
 * @param {object} airport
 * @param {string} [preferredLang]
 * @returns {object}
 */
export function normalizeTranslationOrder(airport, preferredLang = 'en') {
  const tr = [...(airport.airPortTranslations || [])];
  const pref = (preferredLang || 'en').toLowerCase();
  tr.sort((a, b) => {
    const la = (a.languageCode || '').toLowerCase();
    const lb = (b.languageCode || '').toLowerCase();
    if (la === pref) return -1;
    if (lb === pref) return 1;
    if (la === 'en') return -1;
    if (lb === 'en') return 1;
    return la.localeCompare(lb);
  });
  return { ...airport, airPortTranslations: tr };
}

/**
 * Builds `{ items, totalCount, page, pageSize }` in API shape: only airports that appear in schedule
 * manifest, ordered by first appearance, merged from `staticAirportList` by `iataCode`.
 * Schedule IATAs missing from the static list still appear via `buildSyntheticManifestAirportRow` so
 * dropdowns stay aligned with the manifest (replace with a static row + real `id` when your API exposes one).
 *
 * If no IATA codes are found on the schedule payload, falls back to all static airports (IATA order)
 * so booking stays usable when manifest resolution is empty.
 *
 * @param {Array|null|undefined} scheduleRows - Same rows as flight schedule / calendar (`result` array)
 * @param {object} [staticDoc] - Defaults to bundled `staticAirportList.json`
 * @param {string} [preferredLang] - First translation in each airport (for `[0]` UI usage)
 * @returns {{ items: object[], totalCount: number, page: number, pageSize: number }}
 */
export function buildAirportListPayload(
  scheduleRows,
  staticDoc = staticAirportList,
  preferredLang = 'en',
) {
  let order = collectOrderedUniqueIataCodes(scheduleRows);
  if (order.length === 0) {
    order = (staticDoc.items || [])
      .map((a) => (a.iataCode || '').toUpperCase())
      .filter(Boolean);
  }

  const byIata = new Map(
    (staticDoc.items || []).map((a) => [(a.iataCode || '').toUpperCase(), a]),
  );

  const items = [];
  for (const code of order) {
    const row = byIata.get(code);
    const resolved = row ?? buildSyntheticManifestAirportRow(code);
    items.push(normalizeTranslationOrder(resolved, preferredLang));
  }

  const n = items.length;
  return {
    items,
    totalCount: n,
    page: 1,
    pageSize: n || staticDoc.pageSize || 0,
  };
}
