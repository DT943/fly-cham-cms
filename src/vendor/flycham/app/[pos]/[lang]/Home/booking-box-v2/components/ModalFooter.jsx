'use client';
import Divider from '@/app/[pos]/[lang]/search-results/components/FlightResults/steps/SelectFlight/Divider';
import CustomCheckbox from '@/components/Ui/CustomCheckbox';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BUTTON_CONFIG,
  TRIP_TYPES,
} from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { getLeg } from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/legsUtils';
import { toCalendarDateKeyFromAny } from '@/util/calendarDateKey';
import { useBookingBoxForm } from '../context/BookingBoxFormContext';
import { useBookingBoxDropdown } from '../context/BookingBoxDropdownContext';
import ButtonSpinner from '@/components/Ui/ButtonSpinner';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { trackSearchFlightsClarityEvent } from '@/lib/clarity';
import { emitValidatedSearchNavigation, releaseSearchSubmissionLock } from '@/lib/searchSubmission';
import BookingWidgetCurrency from '../../../../../../../../shared/booking-search/BookingWidgetCurrency.jsx';

const ModalFooter = () => {
    const copy = useBookingBoxContentOptional();
    const { formik, searchHref: href, handleSubmit, onCloseMidifySearch, allowSameDayReturn, isModifySearch } = useBookingBoxForm();
    const { handleResetToFirstStep } = useBookingBoxDropdown();
    const values = formik?.values ?? {};
    const setFieldValue = formik?.setFieldValue ?? (() => {});
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const navigatingRef = useRef(false);
    const leg0 = getLeg(values, 0);
    const leg1 = getLeg(values, 1);
    const leg2 = getLeg(values, 2);
    const { dateStart, source, destination } = leg0;
    const { dateEnd, tripType } = values || {};
    const hasAnyLeg3 = Boolean(leg2.source || leg2.destination || leg2.dateStart);
    const isMultiCityInvalid =
        tripType === TRIP_TYPES.MULTICITY &&
        (!leg1.source || !leg1.destination || !leg1.dateStart || (hasAnyLeg3 && (!leg2.source || !leg2.destination || !leg2.dateStart)));
    const returnOnOrBeforeDeparture =
        tripType === TRIP_TYPES.RETURN &&
        dateEnd &&
        dateStart &&
        (() => {
            const depKey = toCalendarDateKeyFromAny(dateStart);
            const retKey = toCalendarDateKeyFromAny(dateEnd);
            const sameDayAllowed = Boolean(allowSameDayReturn);
            return depKey && retKey && (sameDayAllowed ? retKey < depKey : retKey <= depKey);
        })();
    const isFormInvalid =
        !dateStart ||
        !source ||
        !destination ||
        (tripType === TRIP_TYPES.RETURN && !dateEnd) ||
        returnOnOrBeforeDeparture ||
        isMultiCityInvalid;
    const shouldDisableButton = isFormInvalid || loading;

    const buttonClasses = `cursor-pointer px-8 py-4 rounded-md text-[16px] font-bold transition-opacity duration-200  
                      ${shouldDisableButton
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#BAA981] text-btn cursor-pointer hover:bg-[#a89773]'
        }`;

    useEffect(() => {
        if (!isFormInvalid && href) {
            router.prefetch(href);
        }
    }, [isFormInvalid, href, router]);

    const handleClick = async () => {
        if (isFormInvalid || !href || loading) return;
        const submission = trackSearchFlightsClarityEvent({
            ...values,
            modifySearch: Boolean(isModifySearch),
        });
        if (!submission?.accepted) return;
        setLoading(true);
        setIsNavigating(false);
        navigatingRef.current = false;

        try {
            if (handleSubmit) {
                const shouldLock = await handleSubmit();
                if (shouldLock) {
                    // Keep submit locked until route change (same as Stripe payment redirect).
                    setIsNavigating(true);
                    navigatingRef.current = true;
                } else {
                    releaseSearchSubmissionLock();
                }
                return;
            }
            onCloseMidifySearch();
            handleResetToFirstStep();
            const external = /^[a-z][a-z0-9+.-]*:\/\//i.test(String(href || ''));
            try {
                emitValidatedSearchNavigation({ href, external });
            } catch (analyticsError) {
                console.error('Search analytics failed', analyticsError);
            }
            router.push(href);
            setIsNavigating(true);
            navigatingRef.current = true;
        } catch (err) {
            console.error('Search flights submit failed', err);
            releaseSearchSubmissionLock();
        } finally {
            if (!navigatingRef.current) {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Divider />
            <div className="flex flex-wrap items-center justify-end gap-3 my-4">
                {/* <CustomCheckbox
                    checked={values.nearby}
                    onChange={() => setFieldValue("nearby", !values.nearby)}
                    label={copy.airportSelector.includeNearbyAirports}
                /> */}
                {/* new_fly_cham: same currency dropdown as the booking-search block */}
                <BookingWidgetCurrency
                    value={values.currency}
                    onChange={(code) => setFieldValue('currency', code)}
                />
                <button
                    id={BUTTON_CONFIG.SEARCH_FLIGHTS.ID}
                    type="button"
                    disabled={shouldDisableButton}
                    onClick={handleClick}
                    className={buttonClasses}
                >
                    <span className="inline-flex items-center justify-center gap-2">
                        {(loading || isNavigating) && <ButtonSpinner size={20} />}
                        <span>{copy.buttons.searchFlights}</span>
                    </span>
                </button>

            </div>
        </>
    );
};

export default ModalFooter;
