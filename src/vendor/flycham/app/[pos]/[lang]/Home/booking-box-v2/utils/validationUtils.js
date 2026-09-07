/**
 * Validation utilities for booking form
 */
import { TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { getLeg } from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/legsUtils';
import { toCalendarDateKeyFromAny } from '@/util/calendarDateKey';

/**
 * Validates if search form is ready to submit.
 * Uses values.legs[] for leg data (legs[0], legs[1], legs[2]).
 */
export const isSearchFormValid = (values, { allowSameDayReturn = false } = {}) => {
  const leg0 = getLeg(values, 0);
  const { source, destination, dateStart } = leg0;
  const { dateEnd, tripType } = values || {};

  // Basic required fields (first leg)
  if (!source || !destination || !dateStart) {
    return false;
  }

  // For return trips, dateEnd is required and must be after departure
  if (tripType === TRIP_TYPES.RETURN) {
    if (!dateEnd) return false;
    const depKey = toCalendarDateKeyFromAny(dateStart);
    const retKey = toCalendarDateKeyFromAny(dateEnd);
    if (depKey && retKey && (allowSameDayReturn ? retKey < depKey : retKey <= depKey)) {
      return false;
    }
  }
  if (tripType === TRIP_TYPES.MULTICITY) {
    const leg1 = getLeg(values, 1);
    if (!leg1.source || !leg1.destination || !leg1.dateStart) {
      return false;
    }
  }

  return true;
};

