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
  variant = 'pill',
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

  // Segmented pill control per Figma node 38353:30597 (Component 29).
  const containerClasses = useMemo(
    () =>
      [
        'inline-flex items-center gap-[18.171px] rounded-[12px] bg-[#F5F5F4] px-[8.653px] py-[10.383px]',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [className]
  );

  // Mobile: plain radio buttons (ring + filled dot) instead of the pill control.
  if (variant === 'radio') {
    return (
      <div
        role="radiogroup"
        aria-label={resolvedAriaLabel}
        className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`.trim()}
      >
        {TRIP_TYPE_OPTIONS.map((option) => {
          const inputId = `trip-type-${option.value}`;
          const isChecked = tripType === option.value;
          const isDisabled = Boolean(option.disabled);
          const label = tripTypeLabels[option.value] ?? option.label;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`inline-flex select-none items-center gap-2 ${
                isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
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
                aria-hidden
                className={`grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                  isChecked ? 'border-[var(--primary-1)]' : 'border-[#5F5F5C]'
                }`}
              >
                {isChecked ? (
                  <span className="size-2.5 rounded-full bg-[var(--primary-1)]" />
                ) : null}
              </span>
              <span
                className={`whitespace-nowrap text-sm leading-none ${
                  isChecked
                    ? 'font-semibold text-[var(--primary-1)]'
                    : 'font-medium text-[#5F5F5C]'
                }`}
              >
                {label}
              </span>
            </label>
          );
        })}
      </div>
    );
  }

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
            className={`inline-flex items-center justify-center select-none transition-colors
              ${
                isChecked
                  ? 'h-[35px] min-w-[104px] rounded-[8px] bg-[var(--primary-1)] p-[8.653px]'
                  : 'px-[8.653px] py-[10.383px]'
              }
              ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
              className={`whitespace-nowrap text-sm leading-none
                ${isChecked ? 'font-semibold text-white' : 'font-medium text-[var(--primary-1)]'}
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
