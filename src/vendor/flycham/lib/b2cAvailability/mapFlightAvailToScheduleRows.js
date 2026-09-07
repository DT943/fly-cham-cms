/**
 * Maps B2C FlightAvail/by-route rows to booking calendar `statusData` shape.
 * @param {Array<{ flightDate?: string, flightCount?: number }>} rows
 * @param {string} originIata
 * @param {string} destinationIata
 */
export function mapFlightAvailToScheduleRows(rows, originIata, destinationIata) {
  const origin = String(originIata || '').toUpperCase();
  const dest = String(destinationIata || '').toUpperCase();
  if (!origin || !dest) return [];

  return (Array.isArray(rows) ? rows : [])
    .map((row) => {
      const dateKey = String(row?.flightDate ?? '').trim().slice(0, 10);
      const count = Number(row?.flightCount ?? 0);
      if (!dateKey || !Number.isFinite(count) || count <= 0) return null;
      return {
        origin,
        destination: dest,
        flightTimes: `${dateKey}T00:00:00`,
        status: 'Available',
        flightCount: count,
      };
    })
    .filter(Boolean);
}
