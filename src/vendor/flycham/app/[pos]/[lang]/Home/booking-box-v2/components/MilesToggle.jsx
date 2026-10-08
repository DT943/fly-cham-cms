'use client';
import React from 'react';
import { useBookingBoxForm } from '../context/BookingBoxFormContext';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';

const MilesToggle = ({ isMobile: isMobileProp }) => {
  const copy = useBookingBoxContentOptional();
  const { isMobile: isMobileFromContext } = useBookingBoxForm();
  const isMobile = isMobileProp ?? isMobileFromContext;

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'mt-2' : ''}`}>
      <label className="relative inline-flex items-center w-9 h-5 cursor-pointer">
        <input type="checkbox" className="sr-only peer" disabled />
        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-main transition-colors duration-300" />
        <div className="absolute top-[2px] start-[2px] w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 transform peer-checked:translate-x-[16px] rtl:peer-checked:-translate-x-[16px]" />
      </label>

      <span className="text-sm text-main font-semibold whitespace-nowrap">
        {copy.milesToggle.label}
      </span>
    </div>
  );
};

export default MilesToggle;
