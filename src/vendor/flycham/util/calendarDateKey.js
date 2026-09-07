/**
 * Calendar YYYY-MM-DD for booking fields — stable across machines when possible.
 * - Plain date prefix in strings is used as-is.
 * - ISO strings with Z or numeric offset use UTC calendar day.
 * - Other date strings + Date objects from pickers use local calendar day.
 */

const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;

/** Parse YYYY-MM-DD (or prefix) as local midnight — avoids UTC shift from `new Date('YYYY-MM-DD')`. */
export function parseLocalCalendarDate(value) {
  if (value == null || value === '') return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const trimmed = String(value).trim();
  const m = trimmed.match(DATE_PREFIX);
  if (m) {
    const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function toCalendarDateKeyFromAny(value) {
  if (value == null || value === '') return '';

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const m = trimmed.match(DATE_PREFIX);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;

    const d = new Date(trimmed);
    if (Number.isNaN(d.getTime())) return '';
    const hasExplicitZone = /Z|[+-]\d{2}:?\d{2}$/i.test(trimmed);
    if (hasExplicitZone) {
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }

  return '';
}
