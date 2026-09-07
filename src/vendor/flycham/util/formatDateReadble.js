/**
 * Human-readable calendar date for trip headers — no conversion to the viewer's local timezone.
 * - Strings: uses the literal YYYY-MM-DD prefix from the API / token (not parsed as local midnight).
 * - Date / other: uses UTC calendar fields only, formatted with timeZone: 'UTC'.
 */

const DATE_HEAD = /^(\d{4})-(\d{2})-(\d{2})/;

function extractYmd(dateInput) {
  if (dateInput == null || dateInput === '') return null;

  if (typeof dateInput === 'string') {
    const m = dateInput.trim().match(DATE_HEAD);
    if (m) {
      return {
        y: Number(m[1]),
        mo: Number(m[2]),
        d: Number(m[3]),
      };
    }
  }

  if (dateInput instanceof Date) {
    if (Number.isNaN(dateInput.getTime())) return null;
    return {
      y: dateInput.getUTCFullYear(),
      mo: dateInput.getUTCMonth() + 1,
      d: dateInput.getUTCDate(),
    };
  }

  const dt = new Date(dateInput);
  if (Number.isNaN(dt.getTime())) return null;
  return {
    y: dt.getUTCFullYear(),
    mo: dt.getUTCMonth() + 1,
    d: dt.getUTCDate(),
  };
}

function formatWithUtcCalendar(parts, intlOptions, locale = 'en-GB') {
  const utcMidnight = new Date(Date.UTC(parts.y, parts.mo - 1, parts.d));
  return new Intl.DateTimeFormat(locale, {
    ...intlOptions,
    timeZone: 'UTC',
  }).format(utcMidnight);
}

/** Levant Arabic month names (حزيران, etc.) with Latin digits. */
const AR_DATE_LOCALE = 'ar-SY-u-nu-latn';

function isArabicLocale(locale) {
  return typeof locale === 'string' && locale.startsWith('ar');
}

/**
 * "الأربعاء، 24 حزيران 2026" → "الأربعاء، 24 حزيران، 2026"
 *
 * Idempotent on purpose: some ICU builds (notably Apple's, on Safari/iOS) already emit the Arabic
 * comma before the year, and unconditionally inserting another produced a doubled "،، 2026". Only
 * add the separator when the preceding character is not already one.
 */
function ensureArabicYearComma(formatted) {
  return formatted.replace(/([^،,])\s+(\d{4})$/, '$1، $2');
}

const formatDateReadble = (dateInput, locale = 'en') => {
  const parts = extractYmd(dateInput);
  if (!parts) return null;
  if (isArabicLocale(locale)) {
    return ensureArabicYearComma(
      formatWithUtcCalendar(
        parts,
        {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        },
        AR_DATE_LOCALE,
      ),
    );
  }
  return formatWithUtcCalendar(parts, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateReadbleWithoutYear = (dateInput, locale = 'en') => {
  const parts = extractYmd(dateInput);
  if (!parts) return null;
  if (isArabicLocale(locale)) {
    return formatWithUtcCalendar(
      parts,
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      },
      AR_DATE_LOCALE,
    );
  }
  return formatWithUtcCalendar(parts, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
};

/** Same rules as default export: day + month only, no local-TZ shift. */
export function formatDateReadbleCompact(dateInput, locale = 'en') {
  const parts = extractYmd(dateInput);
  if (!parts) return null;
  if (isArabicLocale(locale)) {
    return formatWithUtcCalendar(
      parts,
      {
        day: 'numeric',
        month: 'long',
      },
      AR_DATE_LOCALE,
    );
  }
  return formatWithUtcCalendar(parts, {
    day: '2-digit',
    month: 'short',
  });
}

/** Calendar price-strip card header — e.g. "Thu, 25 Jun" / "الخميس، 25 حزيران". */
export function formatCalendarCardHeader(dateInput, locale = 'en') {
  const parts = extractYmd(dateInput);
  if (!parts) return null;
  if (isArabicLocale(locale)) {
    return formatWithUtcCalendar(
      parts,
      {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
      },
      AR_DATE_LOCALE,
    );
  }
  return formatWithUtcCalendar(
    parts,
    {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    },
    'en-GB',
  );
}

/** Calendar card — short weekday label for stacked tablet header. */
export function formatCalendarCardWeekdayShort(dateInput, locale = 'en') {
  const parts = extractYmd(dateInput);
  if (!parts) return null;
  if (isArabicLocale(locale)) {
    return formatWithUtcCalendar(parts, { weekday: 'short' }, AR_DATE_LOCALE);
  }
  return formatWithUtcCalendar(parts, { weekday: 'short' }, 'en-GB');
}

/** Calendar card — full month name (no abbreviation / ellipsis). */
export function formatCalendarCardMonthLong(dateInput, locale = 'en') {
  const parts = extractYmd(dateInput);
  if (!parts) return null;
  if (isArabicLocale(locale)) {
    return formatWithUtcCalendar(parts, { month: 'long' }, AR_DATE_LOCALE);
  }
  return formatWithUtcCalendar(parts, { month: 'long' }, 'en-GB');
}

/** Calendar mobile tile — full month name in Arabic (no English Aug/Sep abbreviations). */
export function formatCalendarCardMonth(dateInput, locale = 'en') {
  const parts = extractYmd(dateInput);
  if (!parts) return null;
  if (isArabicLocale(locale)) {
    return formatWithUtcCalendar(parts, { month: 'long' }, AR_DATE_LOCALE);
  }
  return formatWithUtcCalendar(parts, { month: 'short' }, 'en-GB');
}

/** Calendar mobile tile — day of month (Latin digits in Arabic). */
export function formatCalendarCardDay(dateInput) {
  const parts = extractYmd(dateInput);
  if (!parts) return null;
  return String(parts.d);
}

export default formatDateReadble;
