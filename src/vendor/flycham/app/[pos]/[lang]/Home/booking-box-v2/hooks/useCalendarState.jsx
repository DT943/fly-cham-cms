import { useCallback, useMemo, useReducer } from 'react';
import { calendarReducer, CALENDAR_ACTIONS } from '../reducers/calendarReducer';
import { TRIP_TYPES } from '../constants/bookingBoxConstants';
import { toCalendarDateKeyFromAny } from '@/util/calendarDateKey';
import { getFirstLeg } from '../utils/legsUtils';
import {
  trackDepartureDateClarityEvent,
  trackReturnDateClarityEvent,
} from '@/lib/clarity';

function isReturnBeforeDeparture(departure, returnDate, allowSameDayReturn = false) {
  if (!departure || !returnDate) return false;
  const depKey = toCalendarDateKeyFromAny(departure);
  const retKey = toCalendarDateKeyFromAny(returnDate);
  if (!depKey || !retKey) return false;
  return allowSameDayReturn ? retKey < depKey : retKey <= depKey;
}

function pickDateFromValue(value) {
  if (value instanceof Date) return value;
  if (value?.from instanceof Date) return value.from;
  return null;
}

function setPrimaryDepartureDate(formik, pickedDate) {
  const legs = Array.isArray(formik.values.legs) ? formik.values.legs : [];
  formik.setValues({
    ...formik.values,
    legs: legs.map((leg, i) =>
      i === 0 ? { ...leg, dateStart: pickedDate } : leg,
    ),
    dateStart: pickedDate,
    dateEnd: '',
  });
}

/**
 * Hook for managing calendar state and date selection logic
 * @param {Object} formik - Formik form instance
 * @returns {Object} Calendar state and handlers
 */
export const useCalendarState = (formik, { allowSameDayReturn = false } = {}) => {
  const [calendarState, dispatch] = useReducer(calendarReducer, {
    minMonth: new Date(),
    currentMonth: new Date(),
  });

  const setMinMonth = useCallback((date) => {
    dispatch({ type: CALENDAR_ACTIONS.SET_MIN_MONTH, payload: date });
  }, []);

  const setCurrentMonth = useCallback((date) => {
    dispatch({ type: CALENDAR_ACTIONS.SET_CURRENT_MONTH, payload: date });
  }, []);

  const resetCalendar = useCallback(() => {
    dispatch({ type: CALENDAR_ACTIONS.RESET_CALENDAR });
  }, []);

  /**
   * Handles date selection based on trip type (oneway or return).
   *
   * Return-trip selection is intent-driven via `hasClickCalendar`:
   *   - hasClickCalendar === false → the click sets the DEPARTURE (and clears the return)
   *   - hasClickCalendar === true  → the click sets the RETURN (departure untouched)
   *
   * The owning component decides the intent (e.g. clicking the Departure vs Return
   * input), so changing the first date always resets the return, while changing the
   * return never affects the first date.
   *
   * @returns {boolean} true when the trip dates are complete (ready for next field)
   */
  const handleDateSelect = useCallback(
    (value) => {
      const tripType = formik.values.tripType;
      const firstLeg = getFirstLeg(formik.values);
      const dateStart = firstLeg.dateStart;

      if (tripType === TRIP_TYPES.ONEWAY) {
        if (value instanceof Date) {
          const existingKey = dateStart
            ? toCalendarDateKeyFromAny(dateStart)
            : '';
          const nextKey = toCalendarDateKeyFromAny(value);

          if (existingKey && existingKey === nextKey) return false;

          formik.setFieldValue('legs.0.dateStart', value);
          formik.setFieldValue('dateStart', value);
          formik.setFieldValue('dateEnd', '');
          trackDepartureDateClarityEvent(value);
          return true;
        }
        return false;
      }

      const { hasClickCalendar, dateEnd } = formik.values;
      const pickedDate = pickDateFromValue(value);

      // RDP may emit an empty range when re-clicking the same day while picking return.
      if (!pickedDate) {
        if (hasClickCalendar && dateStart) {
          formik.setFieldValue('dateEnd', dateStart);
          formik.setFieldValue('hasClickCalendar', false);
          trackReturnDateClarityEvent(dateStart);
          return true;
        }
        return false;
      }

      // Intent: picking the RETURN date (departure already selected).
      if (hasClickCalendar && dateStart) {
        // Clicking before the departure restarts the selection as a new departure.
        if (isReturnBeforeDeparture(dateStart, pickedDate, allowSameDayReturn)) {
          setPrimaryDepartureDate(formik, pickedDate);
          formik.setFieldValue('hasClickCalendar', true);
          trackDepartureDateClarityEvent(pickedDate);
          return false;
        }
        formik.setValues({
          ...formik.values,
          dateEnd: pickedDate,
          hasClickCalendar: false,
        });
        trackReturnDateClarityEvent(pickedDate);
        return true;
      }

      // Intent: picking the DEPARTURE date (fresh selection, or changing the first
      // date in modify). Always clear the return so the user re-picks it.
      setPrimaryDepartureDate(formik, pickedDate);
      formik.setFieldValue('hasClickCalendar', true);
      trackDepartureDateClarityEvent(pickedDate);
      return false;
    },
    [formik, allowSameDayReturn]
  );

  /**
   * Resets calendar dates for one-way / return (primary trip).
   * Multi-city leg resets are handled per active leg in BookingBox / renderers.
   */
  const handleReset = useCallback(() => {
    formik.setFieldValue('legs.0.dateStart', null);
    formik.setFieldValue('dateStart', null);
    formik.setFieldValue('dateEnd', null);
    formik.setFieldValue('hasClickCalendar', false);
  }, [formik]);

  /**
   * Computes display selection based on trip type (reads first leg for dateStart)
   */
  const { tripType, dateEnd } = formik.values;
  const firstLegDateStart = getFirstLeg(formik.values).dateStart;
  const dateStartKey = toCalendarDateKeyFromAny(firstLegDateStart);
  const dateEndKey = toCalendarDateKeyFromAny(dateEnd);

  const displaySelection = useMemo(() => {
    if (tripType === TRIP_TYPES.ONEWAY) {
      return dateStartKey ? new Date(firstLegDateStart) : undefined;
    }

    return dateStartKey
      ? {
          from: new Date(firstLegDateStart),
          to: dateEndKey ? new Date(dateEnd) : undefined,
        }
      : undefined;
  }, [tripType, dateStartKey, dateEndKey, firstLegDateStart, dateEnd]);

  return {
    minMonth: calendarState.minMonth,
    currentMonth: calendarState.currentMonth,
    setMinMonth,
    setCurrentMonth,
    handleDateSelect,
    handleReset,
    displaySelection,
  };
};
