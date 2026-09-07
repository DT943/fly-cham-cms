'use client';
import React, { useCallback, useMemo } from 'react';
import { TRIP_TYPES, TRIP_TYPE_OPTIONS } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { useBookingBoxForm } from '../context/BookingBoxFormContext';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { trackTripTypeClarityEvent } from '@/lib/clarity';

const TripTypeSelector = ({
  tripType: tripTypeProp,
  onChange: onChangeProp,
  className = '',
  ariaLabel,
}) => {
  const copy = useBookingBoxContentOptional();
  const { formik, handleTripTypeChange } = useBookingBoxForm();
  const tripType = tripTypeProp ?? formik?.values?.tripType ?? TRIP_TYPES.RETURN;
  const onChange = onChangeProp ?? handleTripTypeChange ?? (() => {});

  const tripTypeLabels = useMemo(
    () => ({
      [TRIP_TYPES.RETURN]: copy.tripTypes.roundTrip,
      [TRIP_TYPES.ONEWAY]: copy.tripTypes.oneWay,
      [TRIP_TYPES.MULTICITY]: copy.tripTypes.multiCity,
    }),
    [copy.tripTypes],
  );

  const resolvedAriaLabel = ariaLabel ?? copy.tripTypes.ariaLabel;

  const handleSelect = useCallback(
    (type, disabled) => {
      if (disabled) return;
      if (type !== tripType) {
        trackTripTypeClarityEvent(type);
        onChange(type);
      }
    },
    [onChange, tripType]
  );

  const containerClasses = useMemo(
    () =>
      [
        'inline-flex items-center gap-8',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [className]
  );

  return (
    <div role="radiogroup" aria-label={resolvedAriaLabel} className={containerClasses}>
      {TRIP_TYPE_OPTIONS.map((option) => {
        const inputId = `trip-type-${option.value}`;
        const isChecked = tripType === option.value;
        const isDisabled = Boolean(option.disabled);
        const label = tripTypeLabels[option.value] ?? option.label;

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={`inline-flex items-center gap-3 select-none ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <input
              id={inputId}
              type="radio"
              name="tripType"
              value={option.value}
              checked={isChecked}
              disabled={isDisabled}
              onChange={() => handleSelect(option.value, isDisabled)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`h-[20px] w-[20px] rounded-full border flex items-center justify-center transition-colors
                ${isChecked ? 'border-[3px] border-[var(--primary-1)]' : 'border-2 border-[#6B6B6B]'}
                ${isDisabled ? 'opacity-60' : ''}`}
            >
              {isChecked && <span className="h-[10px] w-[10px] rounded-full bg-[var(--primary-1)]" />}
            </span>
            <span
              className={`text-xs md:text-sm leading-none
                ${isChecked ? 'text-[var(--primary-1)] font-semibold' : 'text-[#5F5F5C] font-medium'}
                ${isDisabled ? 'opacity-80' : ''}`}
            >
              {label}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default TripTypeSelector;
