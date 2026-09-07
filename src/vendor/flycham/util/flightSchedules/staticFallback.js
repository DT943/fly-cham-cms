/**
 * Loads bundled manifest rows when the API returns nothing usable and Redux has no cache.
 * Dynamic import keeps the large JSON off the critical path until fallback is needed.
 * @returns {Promise<Array|null>}
 */
export async function loadStaticFlightScheduleRows() {
  try {
    const { flightmanifestData } = await import('@/data/flightmanifestData');
    const rows = flightmanifestData?.result;
    return Array.isArray(rows) && rows.length > 0 ? rows : null;
  } catch (error) {
    console.error('Static flight manifest fallback failed:', error);
    return null;
  }
}
