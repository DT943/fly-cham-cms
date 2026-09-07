'use client';

import React, { useMemo } from 'react';

import useIsMobile from '@/hooks/useIsMobile';
import { Trash } from '@phosphor-icons/react/dist/ssr';

import { TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { formatDisplayDate, getTripDates } from './utils/dateDisplayUtils';

const ResetButton = ({ onClick, className, children }) => (
  <button type="button" onClick={onClick} className={className}>
    {children}
  </button>
);

const ChangeFlightSummary = ({ departureDate, returnDate, tripType, onReset }) => {
  const showReturn = tripType === TRIP_TYPES.RETURN && returnDate;

  return (
    <div className="flex flex-col items-center justify-between w-full gap-3 text-sm text-[#003A59] md:flex-row md:text-base">
      <div className="flex flex-col items-center gap-1 text-center md:flex-row md:gap-6 md:text-left">
        <span className="font-medium">
          New departure:{' '}
          <strong className="text-primary-1">
            {formatDisplayDate(departureDate, { uppercase: true })}
          </strong>
        </span>
        {showReturn && (
          <span className="font-medium">
            New return:{' '}
            <strong className="text-primary-1">
              {formatDisplayDate(returnDate, { uppercase: true })}
            </strong>
          </span>
        )}
      </div>

      <ResetButton
        onClick={onReset}
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-[#C1040C] md:text-sm"
      >
        <Trash size={16} weight="bold" />
        Clear
      </ResetButton>
    </div>
  );
};

const StandardSummary = ({
  tripType,
  departureDate,
  returnDate,
  desktopResetButton,
  isFlightSchedulePage = false,
}) => {
  const isReturnTrip = tripType === TRIP_TYPES.RETURN && departureDate;
  const isOneWayTrip = tripType === TRIP_TYPES.ONEWAY && departureDate;

  const departureLabel = isFlightSchedulePage ? 'From' : 'Departure';
  const returnLabel = isFlightSchedulePage ? 'To' : 'Return';

  if (isReturnTrip) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm">
        {departureLabel}:{' '}
        <strong>{formatDisplayDate(departureDate)}</strong> — {returnLabel}:
        {returnDate ? (
          <>
            <strong>{formatDisplayDate(returnDate)}</strong>
            {desktopResetButton}
          </>
        ) : (
          ` Select ${returnLabel.toLowerCase()} date`
        )}
      </div>
    );
  }

  if (isOneWayTrip) {
    return (
      <div className="flex items-center justify-center gap-2">
        {departureLabel}:{' '}
        <strong>{formatDisplayDate(departureDate)}</strong>
        {desktopResetButton}
      </div>
    );
  }

  return null;
};

const SelectedDateDisplay = ({
  selected,
  tripType = TRIP_TYPES.RETURN,
  handleReset,
  isChangeFlight,
  isFlightSchedulePage = false,
}) => {
  const isMobile = useIsMobile();
  const { departureDate, returnDate } = useMemo(
    () => getTripDates(selected, tripType),
    [selected, tripType],
  );

  if (isChangeFlight) {
    return (
      <ChangeFlightSummary
        departureDate={departureDate}
        returnDate={returnDate}
        tripType={tripType}
        onReset={handleReset}
      />
    );
  }

  const desktopResetButton = !isMobile ? (
    <ResetButton
      onClick={handleReset}
      className="text-sm cursor-pointer underline text-main hover:text-[#002233]"
    >
      Reset Dates
    </ResetButton>
  ) : null;

  const content = (
    <StandardSummary
      tripType={tripType}
      departureDate={departureDate}
      returnDate={returnDate}
      desktopResetButton={desktopResetButton}
      isFlightSchedulePage={isFlightSchedulePage}
    />
  );

  return (
    <div
      className="w-full my-5 mb-2 text-sm text-center transition-opacity duration-300 min-h-[20px]"
      style={{ opacity: content ? 1 : 0 }}
    >
      {content || '‎'}
    </div>
  );
};

export default SelectedDateDisplay;
