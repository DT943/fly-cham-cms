'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CalendarBlank, CaretDown } from '@phosphor-icons/react';
import mcStyles from './multiCityBookingLayout.module.css';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { formatBookingBoxDisplayDate, isCalendarArabic } from '@/util/calendarI18n';

/**
 * Date field for each multi-city leg — same visual pattern as InfoBoxes DateBox
 * (secondary circle icon + label/value + caret).
 */
const MultiCityDateField = ({ value, onToggle, className = '', disabled = false }) => {
  const copy = useBookingBoxContentOptional();
  const { lang } = useParams() ?? {};
  const isRtl = isCalendarArabic(lang);
  const departureLabel = copy?.flightInfo?.departure ?? 'Departure';
  const selectDateLabel = copy?.flightInfo?.selectDate ?? 'Select date';
  const display =
    formatBookingBoxDisplayDate(value, lang, { uppercase: true }) || selectDateLabel;

  return (
    <div className={`${mcStyles.mcDateFieldInner} ${className}`.trim()}>
      <button
        type="button"
        data-mc-date-trigger
        onClick={disabled ? undefined : onToggle}
        disabled={disabled}
        className={`flex h-full min-h-[72px] w-full items-center gap-3 rounded-xl bg-[#F5F5F4] px-4 py-4 sm:px-6 sm:py-5 ${
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer transition-colors duration-200 hover:bg-[#E7E7E5]'
        }`}
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
          <CalendarBlank size={16} weight="fill" color="white" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col text-start">
          <span className="text-sm text-gray-500">{departureLabel}</span>
          <span
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`truncate text-sm font-semibold text-[#1E1E1E] ${isRtl ? '' : 'font-en'}`}
          >
            {display}
          </span>
        </div>
        <span className="flex-shrink-0 text-gray-500" aria-hidden>
          <CaretDown size={16} />
        </span>
      </button>
    </div>
  );
};

export default React.memo(MultiCityDateField);
