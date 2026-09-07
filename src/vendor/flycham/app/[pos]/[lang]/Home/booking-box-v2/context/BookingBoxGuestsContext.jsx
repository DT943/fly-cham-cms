'use client';

import React, { useContext } from 'react';

/**
 * Guest counts, cabin class, guest actions, and renderGuests for the booking flow.
 * Consumed by: Guests component, InfoBoxes.
 */
const BookingBoxGuestsContext = React.createContext(null);

export const BookingBoxGuestsProvider = ({ value, children }) => (
  <BookingBoxGuestsContext.Provider value={value}>
    {children}
  </BookingBoxGuestsContext.Provider>
);

export const useBookingBoxGuests = () => {
  const ctx = useContext(BookingBoxGuestsContext);
  if (!ctx) {
    throw new Error('useBookingBoxGuests must be used within BookingBoxGuestsProvider');
  }
  return ctx;
};
