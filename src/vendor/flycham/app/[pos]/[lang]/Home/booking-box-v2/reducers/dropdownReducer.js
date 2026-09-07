import { DROPDOWNS } from '../constants/bookingBoxConstants';

export const DROPDOWN_ACTIONS = {
  SET_OPEN_DROPDOWN: 'SET_OPEN_DROPDOWN',
  SET_OPEN_AIRPORT_FOR_LEG: 'SET_OPEN_AIRPORT_FOR_LEG',
  RESET_AIRPORT_DROPDOWNS: 'RESET_AIRPORT_DROPDOWNS',
  SET_OPEN_DATE_ROW_ID: 'SET_OPEN_DATE_ROW_ID',
};

export const dropdownInitialState = (autoOpenCalendar) => ({
  openDropdown: autoOpenCalendar ? DROPDOWNS.DEPARTURE : null,
  openAirPortsByLeg: {},
  openDateRowId: null,
});

/**
 * Plain open-state updates. Mutual exclusion for user toggles lives in
 * BookingBoxDesktop / useBookingDropdownState so multi-city auto-open
 * (From → To → date → next From) is not interrupted.
 */
export function dropdownReducer(state, action) {
  switch (action.type) {
    case DROPDOWN_ACTIONS.SET_OPEN_DROPDOWN:
      return { ...state, openDropdown: action.payload };
    case DROPDOWN_ACTIONS.SET_OPEN_AIRPORT_FOR_LEG: {
      const { legId, next } = action.payload;
      const prevVal = state.openAirPortsByLeg?.[legId] ?? null;
      const nextVal = typeof next === 'function' ? next(prevVal) : next;
      return {
        ...state,
        openAirPortsByLeg: { ...state.openAirPortsByLeg, [legId]: nextVal },
      };
    }
    case DROPDOWN_ACTIONS.RESET_AIRPORT_DROPDOWNS:
      return { ...state, openAirPortsByLeg: {} };
    case DROPDOWN_ACTIONS.SET_OPEN_DATE_ROW_ID:
      return { ...state, openDateRowId: action.payload };
    default:
      return state;
  }
}
