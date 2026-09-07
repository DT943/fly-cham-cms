'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { DROPDOWNS, TIMING, TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import {
  dropdownReducer,
  dropdownInitialState,
  DROPDOWN_ACTIONS,
} from '../reducers/dropdownReducer';

/**
 * Manages all dropdown/open state for the desktop booking box.
 *
 * Responsibilities:
 * - Tracks which high-level dropdown is open (`openDropdown`: dates, passengers, etc.).
 * - Tracks which airport dropdown is open per leg (`openAirPortsByLeg`).
 * - Tracks which multi‑city leg date row is open (`openDateRowId`).
 * - Encapsulates auto‑open calendar behavior for one‑way and return flows.
 * - Closes dropdowns when clicking outside the booking widget.
 */
export const useBookingDropdownState = ({
  autoOpenCalendar,
  isInModal,
  dateStart,
  hasClickCalendarFlag,
  tripType,
  formSource,
  formDestination,
}) => {
  const bookingBoxRef = useRef(null);
  const [state, dispatch] = useReducer(
    dropdownReducer,
    autoOpenCalendar,
    dropdownInitialState,
  );

  const { openDropdown, openAirPortsByLeg, openDateRowId } = state;

  const setOpenDropdown = useCallback(
    (next) => {
      const resolved = typeof next === 'function' ? next(openDropdown) : next;
      dispatch({
        type: DROPDOWN_ACTIONS.SET_OPEN_DROPDOWN,
        payload: resolved,
      });
      // Opening dates/guests closes airport lists only — never clear openDateRowId
      // here (multi-city auto-open may call setOpenDropdown(DEPARTURE) as a side path).
      if (resolved != null) {
        dispatch({ type: DROPDOWN_ACTIONS.RESET_AIRPORT_DROPDOWNS });
      }
    },
    [openDropdown],
  );

  const setOpenAirPortsForLeg = useCallback((legId, next) => {
    dispatch({
      type: DROPDOWN_ACTIONS.SET_OPEN_AIRPORT_FOR_LEG,
      payload: { legId, next },
    });
  }, []);

  const clearAllAirportDropdowns = useCallback(() => {
    dispatch({ type: DROPDOWN_ACTIONS.RESET_AIRPORT_DROPDOWNS });
  }, []);

  const setOpenDateRowId = useCallback((next) => {
    const resolved = typeof next === 'function' ? next(openDateRowId) : next;
    dispatch({
      type: DROPDOWN_ACTIONS.SET_OPEN_DATE_ROW_ID,
      payload: resolved,
    });
    // Opening a multi-city calendar closes airport lists only (never guests via
    // side effects that would fight requestOpenDatesCalendar / auto-open).
    if (resolved != null) {
      dispatch({ type: DROPDOWN_ACTIONS.RESET_AIRPORT_DROPDOWNS });
    }
  }, [openDateRowId]);

  // Auto-open calendar when both airports are selected and combination changes
  const lastAirportComboRef = useRef(null);
  useEffect(() => {
    const currentCombo =
      formSource && formDestination ? `${formSource}-${formDestination}` : null;
    const comboChanged =
      currentCombo && currentCombo !== lastAirportComboRef.current;

    if (
      tripType !== TRIP_TYPES.MULTICITY &&
      formDestination &&
      formSource &&
      comboChanged &&
      !openDropdown &&
      !isInModal
    ) {
      const timer = setTimeout(() => {
        setOpenDropdown(DROPDOWNS.DEPARTURE);
      }, TIMING.CALENDAR_AUTO_OPEN_DELAY_MS);

      lastAirportComboRef.current = currentCombo;
      return () => clearTimeout(timer);
    }

    if (currentCombo) {
      lastAirportComboRef.current = currentCombo;
    } else {
      lastAirportComboRef.current = null;
    }
  }, [formDestination, formSource, openDropdown, isInModal, setOpenDropdown, tripType]);

  // Auto-open calendar on results page when appropriate
  useEffect(() => {
    if (
      autoOpenCalendar &&
      isInModal &&
      dateStart &&
      hasClickCalendarFlag &&
      tripType === TRIP_TYPES.RETURN
    ) {
      setOpenDropdown(DROPDOWNS.DEPARTURE);
    }
  }, [
    autoOpenCalendar,
    isInModal,
    dateStart,
    hasClickCalendarFlag,
    tripType,
    setOpenDropdown,
  ]);

  // Close menus when clicking outside the widget, or elsewhere inside the widget (match round-trip InfoBoxes).
  useEffect(() => {
    const onMouseDown = (e) => {
      const el = bookingBoxRef.current;
      if (!el) return;

      const inCalendarPopover = e.target?.closest?.('.booking-calendar-popover');
      const inGuestsPopover = e.target?.closest?.('.booking-guests-popover');
      const onMcDateTrigger = e.target?.closest?.('[data-mc-date-trigger]');
      const onPassengersTrigger = e.target?.closest?.('[data-passengers-trigger]');
      const onDatesTrigger = e.target?.closest?.('[data-dates-trigger]');

      const inDatesArea =
        inCalendarPopover || onMcDateTrigger || onDatesTrigger;

      if (!el.contains(e.target)) {
        setOpenDropdown(null);
        clearAllAirportDropdowns();
        setOpenDateRowId(null);
        return;
      }

      if (!inDatesArea) {
        setOpenDateRowId(null);
        if (openDropdown === DROPDOWNS.DEPARTURE) {
          setOpenDropdown(null);
        }
      }
      if (!inGuestsPopover && !onPassengersTrigger && openDropdown === DROPDOWNS.PASSENGERS) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [setOpenDropdown, clearAllAirportDropdowns, setOpenDateRowId, openDropdown]);

  return {
    bookingBoxRef,
    openDropdown,
    setOpenDropdown,
    openAirPortsByLeg,
    setOpenAirPortsForLeg,
    clearAllAirportDropdowns,
    openDateRowId,
    setOpenDateRowId,
  };
};

