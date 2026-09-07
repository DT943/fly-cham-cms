import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { getFirstLeg } from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/legsUtils';

function toValidDay(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return startOfDay(date);
}

/**
 * Inclusive calendar days between trip bounds for mobile date footer.
 * Round-trip: return − departure. Multi-city: last leg date − first leg date.
 * @returns {number|null}
 */
export function getTripDurationDays(values = {}) {
  const tripType = values.tripType;

  if (tripType === TRIP_TYPES.RETURN) {
    const firstLeg = getFirstLeg(values);
    const start = toValidDay(firstLeg?.dateStart ?? values.dateStart);
    const end = toValidDay(values.dateEnd);
    if (!start || !end) return null;
    const days = differenceInCalendarDays(end, start);
    // Inclusive span (e.g. 30 Jun → 31 Jul = 32 days), matching mobile design copy.
    return days >= 0 ? days + 1 : null;
  }

  if (tripType === TRIP_TYPES.MULTICITY) {
    const legs = Array.isArray(values.legs) ? values.legs : [];
    const daysList = legs
      .map((leg) => toValidDay(leg?.dateStart))
      .filter(Boolean)
      .sort((a, b) => a.getTime() - b.getTime());
    if (daysList.length < 2) return null;
    const days = differenceInCalendarDays(
      daysList[daysList.length - 1],
      daysList[0],
    );
    return days >= 0 ? days + 1 : null;
  }

  return null;
}

export function getAirportCityLabel(airPorts, airportId) {
  if (!airportId || !airPorts?.items?.length) return '';
  const airport = airPorts.items.find((item) => item.id === airportId);
  const translation = airport?.airPortTranslations?.[0];
  return translation?.city || translation?.airPortName || '';
}
