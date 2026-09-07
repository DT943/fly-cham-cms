'use client';

import React, { useContext } from 'react';

/**
 * Dropdown content per leg, getLegProps.
 * Consumed by: BookingBoxMobile, BookingBoxDesktop (FromToSelector, multi-city rows).
 */
const BookingBoxAirportRenderersContext = React.createContext(null);

export const BookingBoxAirportRenderersProvider = ({ value, children }) => (
  <BookingBoxAirportRenderersContext.Provider value={value}>
    {children}
  </BookingBoxAirportRenderersContext.Provider>
);

export const useBookingBoxAirportRenderers = () => {
  const ctx = useContext(BookingBoxAirportRenderersContext);
  if (!ctx) {
    throw new Error('useBookingBoxAirportRenderers must be used within BookingBoxAirportRenderersProvider');
  }
  return ctx;
};
