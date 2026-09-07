/**
 * Minimal Redux store for the vendored booking box.
 *
 * flychamwebsite's own `store/index.js` wires six slices (manage-booking v1/v2,
 * booking flow, layout, auth) behind redux-persist. The booking widget only ever
 * reads `state.flights`, and this app has no manage-booking flow, so the port
 * keeps just that slice and drops persistence — search state is carried to
 * flycham.com in the URL token, not in local storage.
 */
import { configureStore } from '@reduxjs/toolkit';
import flightsReducer from './flightSlice';

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
