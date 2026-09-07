'use client';

import React, { useContext } from 'react';

/**
 * Form state, search URL, trip type, and UI callbacks for the booking flow.
 * Consumed by: BookingBoxMobile, BookingBoxDesktop, TripTypeSelector, FromToSelector, SearchFlightsButton.
 */
const BookingBoxFormContext = React.createContext(null);

export const BookingBoxFormProvider = ({ value, children }) => (
  <BookingBoxFormContext.Provider value={value}>
    {children}
  </BookingBoxFormContext.Provider>
);

export const useBookingBoxForm = () => {
  const ctx = useContext(BookingBoxFormContext);
  if (!ctx) {
    throw new Error('useBookingBoxForm must be used within BookingBoxFormProvider');
  }
  return ctx;
};
