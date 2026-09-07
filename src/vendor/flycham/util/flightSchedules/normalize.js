/**
 * Converts empty schedule arrays to `null` so calendars treat "no data" consistently.
 * @param {Array|null|undefined} schedules
 * @returns {Array|null}
 */
export function normalizePrefetchedSchedules(schedules) {
  if (!schedules || (Array.isArray(schedules) && schedules.length === 0)) {
    return null;
  }
  return schedules;
}
