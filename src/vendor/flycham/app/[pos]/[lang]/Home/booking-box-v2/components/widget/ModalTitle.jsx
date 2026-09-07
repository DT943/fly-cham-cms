'use client';
import Divider from '@/app/[pos]/[lang]/search-results/components/FlightResults/steps/SelectFlight/Divider';
import React from 'react';
import { X } from '@phosphor-icons/react/dist/ssr';
import { useBookingBoxForm } from '../../context/BookingBoxFormContext';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';

const ModalTitle = ({ onCloseMidifySearch: onCloseProp }) => {
    const { onCloseMidifySearch, isFlightSchedulePage } = useBookingBoxForm();
    const onClose = onCloseProp ?? onCloseMidifySearch;
    const copy = useBookingBoxContentOptional();
    const resolvedTitle = ((isFlightSchedulePage ?? false) ? copy.buttons.searchFlights : copy.buttons.modifySearch);

    return (
        <>
            <div className=" my-2 flex items-center justify-between w-full  py-1 rounded-t-lg">
                <h2 className="text-lg font-bold text-gray-800">{resolvedTitle}</h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 min-h-[44px] min-w-[44px] inline-flex items-center justify-center touch-manipulation pointer-events-auto"
                    aria-label="Close"
                >
                    <X size={20} weight="bold" />
                </button>
            </div>
            <Divider />
        </>
    );
};

export default ModalTitle

