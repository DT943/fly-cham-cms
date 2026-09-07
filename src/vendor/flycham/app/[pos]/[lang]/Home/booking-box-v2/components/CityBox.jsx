'use client';
import { X } from '@phosphor-icons/react';
import React, { useMemo } from 'react';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';

/**
 * CityBox
 * Small, reusable card UI showing city / airport and an icon — previously inline in FromToSelector
 */
const CityBox = ({
  icon,
  label,
  city,
  airport,
  onClick,
  isSchedulePage = false,
  onRemove,
  showRemove = false,
  disabled = false,
  hasSelection: hasSelectionProp,
  className = '',
}) => {
  const copy = useBookingBoxContentOptional();
  const placeholderCities = useMemo(
    () =>
      new Set([
        '',
        copy.airportSelector.fallbacks.departureCity,
        copy.airportSelector.fallbacks.arrivalCity,
        copy.airportSelector.fallbacks.selectOrigin,
        copy.airportSelector.fallbacks.selectDestination,
      ]),
    [copy.airportSelector.fallbacks],
  );
  const hasSelection = hasSelectionProp ?? Boolean(city && !placeholderCities.has(city));
  const shouldShowRemove = showRemove || (isSchedulePage && hasSelection);

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${label}: ${city}, ${airport}`}
      className={`box-border w-full max-w-full min-w-0 h-full text-start flex items-center gap-3 sm:gap-4 bg-[#F5F5F4] px-4 sm:px-5 lg:px-6 py-4 sm:py-2 focus:outline-none min-h-[72px] ${
        className || 'rounded-xl'
      } ${
        disabled
          ? 'opacity-50 cursor-not-allowed pointer-events-none'
          : 'hover:bg-[#E7E7E5] transition-colors duration-200 cursor-pointer'
      }`}
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
        {label && <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1 truncate">{label}</p>}
        <p className="text-base sm:text-lg font-semibold text-[#1E1E1E] truncate leading-tight">{city}</p>
        {airport && <p className="text-xs text-gray-500 truncate mt-0.5 sm:mt-1">{airport}</p>}
      </div>
      {shouldShowRemove && onRemove && (
        <X
          size={16}
          className='text-800 shrink-0 cursor-pointer hover:text-gray-600 transition-colors'
          weight="bold"
          onClick={handleRemoveClick}
          aria-label="Remove selection"
        />
      )}
    </div>
  );
};

CityBox.displayName = 'CityBox';

export default React.memo(CityBox);
