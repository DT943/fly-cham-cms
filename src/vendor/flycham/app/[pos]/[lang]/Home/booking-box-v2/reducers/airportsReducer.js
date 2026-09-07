export const AIRPORT_ACTIONS = {
  SET_CITIES: "SET_CITIES",
  SET_SOURCE_SEARCH: "SET_SOURCE_SEARCH",
  SET_DESTINATION_SEARCH: "SET_DESTINATION_SEARCH",
};

const initialState = {
  cities: [],
  sourceSearch: "",
  destinationSearch: "",
};

export const airportsInitialState = initialState;

export const airportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case AIRPORT_ACTIONS.SET_CITIES: {
      const nextCities = Array.isArray(action.payload) ? action.payload : [];
      if (state.cities === nextCities) {
        return state;
      }
      return {
        ...state,
        cities: nextCities,
      };
    }

    case AIRPORT_ACTIONS.SET_SOURCE_SEARCH: {
      const value = action.payload ?? "";
      if (state.sourceSearch === value) return state;
      return {
        ...state,
        sourceSearch: value,
      };
    }

    case AIRPORT_ACTIONS.SET_DESTINATION_SEARCH: {
      const value = action.payload ?? "";
      if (state.destinationSearch === value) return state;
      return {
        ...state,
        destinationSearch: value,
      };
    }

    default:
      return state;
  }
};

