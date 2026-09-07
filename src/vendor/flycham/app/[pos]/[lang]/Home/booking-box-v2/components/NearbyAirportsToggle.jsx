'use client';

import React from 'react';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { trackNearbyAirportsClarityEvent } from '@/lib/clarity';

const NearbyAirportsToggle = ({ checked, onChange }) => {
  const copy = useBookingBoxContentOptional();

  const handleToggle = () => {
    const next = !checked;
    if (next) {
      trackNearbyAirportsClarityEvent(true);
    }
    onChange(next);
  };

  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 px-1">
      <span className="text-sm font-medium text-[#5f5f5c]">
        {copy.airportSelector.includeNearbyAirports}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 ${
          checked ? 'bg-primary-1' : 'bg-[#d6d3d1]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
};

export default React.memo(NearbyAirportsToggle);
