'use client';
import { TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { parseLocalCalendarDate } from '@/util/calendarDateKey';
import { formatBookingBoxDisplayDate } from '@/util/calendarI18n';


export const normalizeDate = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const local = parseLocalCalendarDate(value);
  if (local) return local;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDisplayDate = (
  value,
  { uppercase = false, lang = 'en', placeholder = 'Select date' } = {},
) => {
  const date = normalizeDate(value);
  if (!date) return placeholder;

  return formatBookingBoxDisplayDate(date, lang, { uppercase });
};

// Provide normalized departure/return dates based on trip type
export const getTripDates = (selected, tripType = TRIP_TYPES.RETURN) => {
  if (tripType === TRIP_TYPES.RETURN) {
    return {
      departureDate: normalizeDate(selected?.from),
      returnDate: normalizeDate(selected?.to),
    };
  }

  return {
    departureDate: normalizeDate(selected),
    returnDate: null,
  };
};

/** True when every required date field for the trip type is filled. */
export function areTripDatesComplete({
  tripType = TRIP_TYPES.RETURN,
  selected,
  dateStart,
  dateEnd,
  legs,
} = {}) {
  if (tripType === TRIP_TYPES.MULTICITY) {
    const legList = Array.isArray(legs) ? legs : [];
    if (legList.length === 0) return false;
    return legList.every((leg) => normalizeDate(leg?.dateStart));
  }

  const { departureDate, returnDate } = getTripDates(selected, tripType);
  const dep = departureDate ?? normalizeDate(dateStart);

  if (tripType === TRIP_TYPES.RETURN) {
    const ret = returnDate ?? normalizeDate(dateEnd);
    return Boolean(dep && ret);
  }

  return Boolean(dep);
};

