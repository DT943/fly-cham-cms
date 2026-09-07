'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { formatBookingBoxDisplayDate } from '@/util/calendarI18n';

function formatFieldDate(value, lang) {
  return formatBookingBoxDisplayDate(value, lang, { uppercase: true }) || null;
}

function DateFieldCard({ label, date, active, onClick, placeholder, lang }) {
  const display = formatFieldDate(date, lang);
  const isRtl = typeof lang === 'string' && lang.startsWith('ar');
  return (
    <button
      type="button"
      onClick={onClick}
      className={`box-border flex min-h-[64px] w-full min-w-0 flex-col items-stretch justify-center rounded-lg border px-3 py-2.5 text-start transition-colors touch-manipulation ${
        active
          ? 'border-primary-1 bg-white'
          : 'border-[#D4D4D2] bg-white'
      }`}
    >
      <span className="block w-full truncate text-xs font-medium leading-tight text-[#9E9E9B]">
        {label}
      </span>
      <span
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`mt-1 block w-full truncate text-sm font-semibold leading-tight ${
          display ? 'text-primary-1' : 'text-[#C8C8C4]'
        } ${isRtl || !display ? '' : 'font-en'}`}
      >
        {display || placeholder}
      </span>
    </button>
  );
}

/**
 * Mobile calendar date summary cards (labels inside the fields).
 * Round-trip: Departure + Return side by side. One-way: Departure only.
 */
export default function MobileCalendarDateFields({
  tripType,
  dateStart,
  dateEnd,
  hasClickCalendar,
  onPickDeparture,
  onPickReturn,
  departureLabel,
  returnLabel,
  selectDatePlaceholder,
}) {
  const { lang } = useParams() ?? {};
  const pickingReturn =
    tripType === TRIP_TYPES.RETURN && Boolean(hasClickCalendar) && !dateEnd;

  if (tripType === TRIP_TYPES.ONEWAY) {
    return (
      <div className="w-full">
        <DateFieldCard
          label={departureLabel}
          date={dateStart}
          active
          onClick={onPickDeparture}
          placeholder={selectDatePlaceholder}
          lang={lang}
        />
      </div>
    );
  }

  if (tripType !== TRIP_TYPES.RETURN) {
    return null;
  }

  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <DateFieldCard
        label={departureLabel}
        date={dateStart}
        active={!pickingReturn}
        onClick={onPickDeparture}
        placeholder={selectDatePlaceholder}
        lang={lang}
      />
      <DateFieldCard
        label={returnLabel}
        date={dateEnd}
        active={pickingReturn}
        onClick={onPickReturn}
        placeholder={selectDatePlaceholder}
        lang={lang}
      />
    </div>
  );
}
