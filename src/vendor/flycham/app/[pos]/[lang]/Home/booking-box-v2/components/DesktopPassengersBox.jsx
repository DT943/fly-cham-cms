'use client';

import React, { useCallback, useState } from 'react';
import { CaretDown, CaretUp, UsersThree } from '@phosphor-icons/react';
import useIsMobile from '@/hooks/useIsMobile';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';

/**
 * Passengers & Class field. Matches InfoBoxes: icon on mobile (≤767), chevron always.
 */
const DesktopPassengersBox = ({
  summary,
  isOpen,
  onToggle,
  renderGuests,
  disabled = false,
  containerClassName = 'relative min-w-0 mt-2 w-1/3',
  dropdownClassName = 'booking-guests-popover absolute start-0 mt-1 bg-white shadow-md rounded-lg p-4 w-full min-w-[min(100%,26rem)] max-w-[min(28rem,calc(100vw-1.5rem))] z-[200] border-1 border-[var(--bg-300)]',
}) => {
  const copy = useBookingBoxContentOptional();
  const isSmallScreen = useIsMobile(767);
  const passengerSummary = summary;
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const passengersLabel = copy?.passengers?.andClass ?? 'Passengers and class';

  const handleClose = useCallback(() => {
    setKeyboardNavActive(false);
    onToggle();
  }, [onToggle]);

  const handleMouseToggle = useCallback(() => {
    if (disabled) return;
    setKeyboardNavActive(false);
    onToggle();
  }, [disabled, onToggle]);

  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (!isOpen) {
        setKeyboardNavActive(true);
        onToggle();
      } else {
        setKeyboardNavActive(true);
      }
    },
    [disabled, isOpen, onToggle],
  );

  return (
    <div className={`${containerClassName} ${isOpen && !disabled ? 'relative z-[200]' : 'relative z-0'}`}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        data-passengers-trigger
        onClick={handleMouseToggle}
        onKeyDown={handleKeyDown}
        className={`h-[100%] min-h-[72px] bg-[#F5F5F4] rounded-xl px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center gap-3 min-w-0 ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#E7E7E5] transition-colors duration-200 cursor-pointer'
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isSmallScreen && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
              <UsersThree size={16} weight="fill" color="white" />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm text-gray-500 text-start">{passengersLabel}</div>
            <div className="truncate font-semibold text-start" dir="auto">
              {passengerSummary}
            </div>
          </div>
        </div>
        <span className="flex-shrink-0 text-gray-500">
          {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
        </span>
      </div>
      {isOpen && !disabled && (
        <div className={dropdownClassName}>
          {renderGuests?.({ onClose: handleClose, keyboardNavActive })}
        </div>
      )}
    </div>
  );
};

export default React.memo(DesktopPassengersBox);
