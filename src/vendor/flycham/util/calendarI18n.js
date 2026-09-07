import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

/** Levant Arabic month names (حزيران, etc.) — matches formatDateReadble trip headers */
export const AR_CALENDAR_LOCALE = 'ar-SY-u-nu-latn';

export function isCalendarArabic(langOrLocale) {
  return typeof langOrLocale === 'string' && langOrLocale.startsWith('ar');
}

/** Month caption for react-day-picker, e.g. "حزيران 2026" or "June 2026". */
export function formatCalendarCaption(month, lang = 'en') {
  if (!isCalendarArabic(lang)) {
    return format(month, 'MMMM yyyy', { locale: enUS });
  }
  return new Intl.DateTimeFormat(AR_CALENDAR_LOCALE, {
    month: 'long',
    year: 'numeric',
  }).format(month);
}

/**
 * Booking-box date field display — e.g. "13 AUG 2026" / "13 آب 2026".
 * Uses local calendar fields (same as the day-picker selection).
 */
export function formatBookingBoxDisplayDate(value, lang = 'en', { uppercase = true } = {}) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  if (isCalendarArabic(lang)) {
    return new Intl.DateTimeFormat(AR_CALENDAR_LOCALE, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  const formatted = format(date, 'dd MMM yyyy');
  return uppercase ? formatted.toUpperCase() : formatted;
}
