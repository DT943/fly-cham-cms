'use client';

import React, { useContext } from 'react';

/**
 * Modal open/close state and handlers for mobile and desktop booking modals.
 * Consumed by: Modal shell, header close, buttons that open dates/guests/source/dest.
 */
const BookingBoxModalsContext = React.createContext(null);

export const BookingBoxModalsProvider = ({ value, children }) => (
  <BookingBoxModalsContext.Provider value={value}>
    {children}
  </BookingBoxModalsContext.Provider>
);

export const useBookingBoxModalsContext = () => {
  const ctx = useContext(BookingBoxModalsContext);
  if (!ctx) {
    throw new Error('useBookingBoxModalsContext must be used within BookingBoxModalsProvider');
  }
  return ctx;
};
