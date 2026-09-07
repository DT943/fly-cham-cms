'use client';

import React, { useContext } from 'react';

/**
 * Which dropdown or leg row is open; reset-step and ref for the booking box.
 * Consumed by: Desktop leg rows, mobile/desktop FromToSelector, InfoBoxes.
 */
const BookingBoxDropdownContext = React.createContext(null);

export const BookingBoxDropdownProvider = ({ value, children }) => (
  <BookingBoxDropdownContext.Provider value={value}>
    {children}
  </BookingBoxDropdownContext.Provider>
);

export const useBookingBoxDropdown = () => {
  const ctx = useContext(BookingBoxDropdownContext);
  if (!ctx) {
    throw new Error('useBookingBoxDropdown must be used within BookingBoxDropdownProvider');
  }
  return ctx;
};
