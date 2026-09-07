/**
 * Calendar reducer for managing calendar-related state
 * Handles minMonth and currentMonth state
 * Note: hasClickCalendar is managed in formik.values, not in this reducer
 */

export const CALENDAR_ACTIONS = {
  SET_MIN_MONTH: 'SET_MIN_MONTH',
  SET_CURRENT_MONTH: 'SET_CURRENT_MONTH',
  RESET_CALENDAR: 'RESET_CALENDAR',
};

const initialState = {
  minMonth: new Date(),
  currentMonth: new Date(),
};

export const calendarReducer = (state, action) => {
  switch (action.type) {
    case CALENDAR_ACTIONS.SET_MIN_MONTH:
      return {
        ...state,
        minMonth: action.payload,
      };

    case CALENDAR_ACTIONS.SET_CURRENT_MONTH:
      return {
        ...state,
        currentMonth: action.payload,
      };

    case CALENDAR_ACTIONS.RESET_CALENDAR:
      return {
        ...initialState,
        minMonth: new Date(),
        currentMonth: new Date(),
      };

    default:
      return state;
  }
};

