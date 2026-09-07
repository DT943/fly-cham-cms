'use client';

import React, { useContext } from 'react';

/**
 * Date selection, multi-city date state, renderCalendar, and schedule data.
 * Consumed by: Date row, Dates component, multi-city logic.
 */
const BookingBoxCalendarContext = React.createContext(null);

export const BookingBoxCalendarProvider = ({ value, children }) => (
  <BookingBoxCalendarContext.Provider value={value}>
    {children}
  </BookingBoxCalendarContext.Provider>
);

export const useBookingBoxCalendar = () => {
  const ctx = useContext(BookingBoxCalendarContext);
  if (!ctx) {
    throw new Error('useBookingBoxCalendar must be used within BookingBoxCalendarProvider');
  }
  return ctx;
};
