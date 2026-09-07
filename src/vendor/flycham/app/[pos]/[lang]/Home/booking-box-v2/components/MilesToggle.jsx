'use client';
import React from 'react';
import { useBookingBoxForm } from '../context/BookingBoxFormContext';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';

const MilesToggle = ({ isMobile: isMobileProp }) => {
  const copy = useBookingBoxContentOptional();
  const { isMobile: isMobileFromContext } = useBookingBoxForm();
  const isMobile = isMobileProp ?? isMobileFromContext;

  return (
    // Toggle sizing and label per Figma node 38353:30597 (Component 29).
    <div className={`flex items-center gap-[10px] ${isMobile ? 'mt-2' : ''}`}>
      <label className="relative inline-flex items-center w-[37px] h-[22.49px] cursor-pointer">
        <input type="checkbox" className="sr-only peer" disabled />
        <div className="w-full h-full bg-[rgba(120,120,128,0.16)] rounded-full peer-checked:bg-[var(--primary-1)] transition-colors duration-300" />
        <div className="absolute top-[1.45px] start-[1.45px] w-[19.588px] h-[19.588px] bg-white rounded-full shadow-[0px_2.176px_5.804px_0px_rgba(0,0,0,0.15),0px_2.176px_0.725px_0px_rgba(0,0,0,0.06)] transition-all duration-300 transform peer-checked:translate-x-[14.5px] rtl:peer-checked:-translate-x-[14.5px]" />
      </label>

      <span className="text-sm text-[var(--primary-1)] font-medium whitespace-nowrap">
        {copy.milesToggle.label}
      </span>
    </div>
  );
};

export default MilesToggle;
