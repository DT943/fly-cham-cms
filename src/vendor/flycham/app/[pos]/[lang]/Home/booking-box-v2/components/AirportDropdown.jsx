"use client";
import React from 'react';

/**
 * AirportDropdown
 * Instant open/close (no leave fade) so the list does not animate like a hide.
 * Anchored with top-full so it always sits below the CityBox (never over it).
 */
const AirportDropdown = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 top-full z-[200] mt-1 box-border w-full rounded-lg border border-[#ccc] bg-white p-4 shadow-md">
      {children}
    </div>
  );
};

AirportDropdown.displayName = 'AirportDropdown';

export default React.memo(AirportDropdown);
