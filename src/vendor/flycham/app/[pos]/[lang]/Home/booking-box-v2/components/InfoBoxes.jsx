'use client'

import React, { useRef, useEffect, Fragment, useState, useCallback } from 'react';
import { Transition } from '@headlessui/react';
import { CaretDown, CaretUp } from '@phosphor-icons/react/dist/ssr';
import { CalendarBlank, UsersThree } from '@phosphor-icons/react';
import { getTripDates, normalizeDate, areTripDatesComplete, formatDisplayDate } from './widget/Dates/utils/dateDisplayUtils';
import { isCalendarArabic } from '@/util/calendarI18n';
import { useBookingBoxForm } from '../context/BookingBoxFormContext';
import { useBookingBoxGuests } from '../context/BookingBoxGuestsContext';
import { useBookingBoxCalendar } from '../context/BookingBoxCalendarContext';
import { useBookingBoxDropdown } from '../context/BookingBoxDropdownContext';
import { useBookingBoxModalsContext } from '../context/BookingBoxModalsContext';
import { useParams } from 'next/navigation';
import useIsMobile from '@/hooks/useIsMobile';
import { STEP_IDS } from '../constants/bookingBoxConstants';
import { getFirstLeg } from '../utils/legsUtils';
import {
    getBookingDropdownScrollContainer,
    isModalContext,
    measureDropdownScrollPadding,
} from '../utils/bookingBoxUtils';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { buildPassengerSummaryLabel } from '@/app/[pos]/[lang]/Home/booking-box/utils/passengerSummary';

const DateBox = ({ label, date, onClick, isOpen, disabled = false, isLoading = false, loadingLabel }) => {
    const { lang } = useParams();
    const isRtl = isCalendarArabic(lang);
    const dateObj = date ? (date instanceof Date ? date : new Date(date)) : null;
    const isValidDate = dateObj && !isNaN(dateObj.getTime());
    const formattedDate = isValidDate
        ? formatDisplayDate(dateObj, { uppercase: true, lang })
        : '';

    return (
        <div
            onClick={disabled || isLoading ? undefined : onClick}
            role="button"
            tabIndex={disabled || isLoading ? -1 : 0}
            data-dates-trigger
            aria-disabled={disabled || isLoading}
            aria-busy={isLoading}
            className={`flex h-full min-h-[72px] min-w-0 flex-1 items-center gap-3 rounded-xl px-4 sm:px-6 py-4 ${
                disabled || isLoading
                    ? 'cursor-default bg-[#F5F5F4]'
                    : 'cursor-pointer bg-[#F5F5F4] hover:bg-[#E7E7E5] transition-colors duration-200'
            }`}
        >
            <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    isLoading ? 'bg-[#d6d3d1]' : 'bg-secondary'
                }`}
            >
                <CalendarBlank size={16} weight="fill" color="white" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-start text-sm text-gray-500">{label}</span>
                {isLoading ? (
                    <strong className="text-start font-semibold text-gray-400">{loadingLabel}</strong>
                ) : isValidDate ? (
                    <strong
                        dir={isRtl ? 'rtl' : 'ltr'}
                        className={`block font-semibold text-gray-900 text-start ${isRtl ? '' : 'font-en'}`}
                    >
                        {formattedDate}
                    </strong>
                ) : null}
            </div>
            {!isLoading && (
                <span className="flex-shrink-0 text-gray-500">
                    {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
                </span>
            )}
        </div>
    );
};

const InfoBoxes = () => {
    const copy = useBookingBoxContentOptional();
    const { lang } = useParams();
    const isRtl = lang === 'ar';
    const { formik, bookingPreviewV2, onCloseMidifySearch } = useBookingBoxForm();
    const { guestsState, renderGuests } = useBookingBoxGuests();
    const {
        displaySelection: selected,
        renderCalendar,
        isSchedulePending,
        requestOpenDatesCalendar,
    } = useBookingBoxCalendar();
    const { openDropdown, setOpenDropdown, clearExtraLegDropdowns } = useBookingBoxDropdown();
    const { openMobileModal } = useBookingBoxModalsContext();
    const isInModifySearchModal = isModalContext(onCloseMidifySearch);
    /** Phone ≤767; tablet 768–1023 uses the same absolute dropdowns as desktop. */
    const isSmallScreen = useIsMobile(767);
    const isTablet = useIsMobile(1023) && !isSmallScreen;
    /** ~1024–1150: dates+pax sit tight — calendar should span the full fields row. */
    const isNarrowDesktop = useIsMobile(1150) && !isTablet && !isSmallScreen;

    const values = { ...formik?.values, ...(guestsState || {}) };
    const {
        adults = 1,
        children = 0,
        infants = 0,
        infantsWithSeat = 0,
        cabinClass = 'Economy',
    } = values;
    const tripType = formik?.values?.tripType ?? 'OneWay';
    const firstLeg = getFirstLeg(formik?.values ?? {});
    const hasBothAirports = Boolean(firstLeg.source && firstLeg.destination);
    const showDatesLoading = Boolean(bookingPreviewV2 && isSchedulePending && hasBothAirports);

    const passengerLabel = buildPassengerSummaryLabel(
        { adults, children, infants, infantsWithSeat, cabinClass },
        copy,
    );
    const datesRef = useRef(null);
    const passengersRef = useRef(null);
    const calendarDropdownRef = useRef(null);
    const guestsDropdownRef = useRef(null);
    const dropdownScrollPadElRef = useRef(null);
    const dropdownScrollPadMaxRef = useRef(0);
    const [passengersKeyboardMode, setPassengersKeyboardMode] = useState(false);

    const { departureDate, returnDate } = getTripDates(selected, tripType);
    const legDepartureDate = normalizeDate(firstLeg.dateStart);
    const canOpenPassengers = areTripDatesComplete({
        tripType,
        selected,
        dateStart: formik?.values?.dateStart,
        dateEnd: formik?.values?.dateEnd,
        legs: formik?.values?.legs,
    });

    useEffect(() => {
        if (tripType !== 'Return') return;
        if (!legDepartureDate && (formik?.values?.dateEnd || formik?.values?.hasClickCalendar)) {
            formik.setFieldValue('dateEnd', '');
            formik.setFieldValue('hasClickCalendar', false);
        }
    }, [tripType, legDepartureDate, formik]);

    const openTravelWhenModal = () => {
        clearExtraLegDropdowns?.();
        setOpenDropdown(null);
        formik.setFieldValue('type', STEP_IDS.TRAVEL_WHEN);
        openMobileModal?.();
    };

    const openGuestsModal = () => {
        clearExtraLegDropdowns?.();
        setOpenDropdown(null);
        formik.setFieldValue('type', STEP_IDS.GUESTS);
        openMobileModal?.();
    };

    const handleOpenDates = () => {
        if (showDatesLoading) {
            requestOpenDatesCalendar?.({ mobile: isSmallScreen });
            return;
        }
        if (isSmallScreen) {
            openTravelWhenModal();
            return;
        }
        if (openDropdown === 'departure') {
            setOpenDropdown(null);
            return;
        }
        setOpenDropdown('departure');
    };

    // Clicking the Departure input means "change the first date": picking a day sets
    // the departure and clears the return so the user re-picks it.
    const handleOpenDeparture = () => {
        if (tripType === 'Return') {
            formik.setFieldValue('hasClickCalendar', false);
        }
        handleOpenDates();
    };

    // Clicking the Return input means "change the return": picking a day sets only the
    // return and leaves the departure untouched.
    const handleOpenReturn = () => {
        if (!canSelectReturnDate) return;
        formik.setFieldValue('hasClickCalendar', true);
        if (showDatesLoading) {
            requestOpenDatesCalendar?.({ mobile: isSmallScreen });
            return;
        }
        if (isSmallScreen) {
            openTravelWhenModal();
            return;
        }
        setOpenDropdown('departure');
    };

    useEffect(() => {
        if (isSmallScreen) return;

        const handleClickOutside = (event) => {
            const refs = [datesRef.current, passengersRef.current];
            const isClickInside = refs.some((ref) => ref && ref.contains(event.target));

            if (!isClickInside && openDropdown) {
                setPassengersKeyboardMode(false);
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown, isSmallScreen, setOpenDropdown]);

    const isReturnTrip = tripType === 'Return';
    const hasDepartureDate = Boolean(departureDate);
    const canSelectReturnDate = hasDepartureDate;

    const isDatesOpen = !isSmallScreen && openDropdown === 'departure';
    const showDateFieldsLoading = showDatesLoading && !isDatesOpen;
    const isPassengersOpen = !isSmallScreen && openDropdown === 'passengers';
    const isDropdownOpen = isDatesOpen || isPassengersOpen;
    const useDropdownScrollPad =
        !isSmallScreen && (isInModifySearchModal || isTablet) && isDropdownOpen;

    const clearDropdownScrollPadding = useCallback(() => {
        if (dropdownScrollPadElRef.current) {
            dropdownScrollPadElRef.current.style.paddingBottom = '';
            dropdownScrollPadElRef.current = null;
        }
        dropdownScrollPadMaxRef.current = 0;
    }, []);

    const syncDropdownScrollPadding = useCallback(() => {
        if (!useDropdownScrollPad) {
            clearDropdownScrollPadding();
            return;
        }

        const panelEl = isDatesOpen
            ? calendarDropdownRef.current
            : guestsDropdownRef.current;
        const scrollEl = getBookingDropdownScrollContainer();
        if (!panelEl || !scrollEl) return;

        const padding = measureDropdownScrollPadding(panelEl);
        dropdownScrollPadMaxRef.current = Math.max(dropdownScrollPadMaxRef.current, padding);

        if (dropdownScrollPadMaxRef.current > 0) {
            scrollEl.style.paddingBottom = `${dropdownScrollPadMaxRef.current}px`;
            dropdownScrollPadElRef.current = scrollEl;
        } else {
            clearDropdownScrollPadding();
        }
    }, [
        useDropdownScrollPad,
        isDatesOpen,
        clearDropdownScrollPadding,
    ]);

    useEffect(() => {
        dropdownScrollPadMaxRef.current = 0;
    }, [isDatesOpen, isPassengersOpen]);

    useEffect(() => {
        if (!useDropdownScrollPad) {
            clearDropdownScrollPadding();
            return undefined;
        }

        const frame = requestAnimationFrame(syncDropdownScrollPadding);
        window.addEventListener('resize', syncDropdownScrollPadding);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', syncDropdownScrollPadding);
            clearDropdownScrollPadding();
        };
    }, [
        useDropdownScrollPad,
        isDatesOpen,
        isPassengersOpen,
        syncDropdownScrollPadding,
        clearDropdownScrollPadding,
    ]);

    const attachCalendarDropdownRef = useCallback(
        (node) => {
            calendarDropdownRef.current = node;
            if (node && useDropdownScrollPad && isDatesOpen) {
                requestAnimationFrame(syncDropdownScrollPadding);
            }
        },
        [useDropdownScrollPad, isDatesOpen, syncDropdownScrollPadding],
    );

    const attachGuestsDropdownRef = useCallback(
        (node) => {
            guestsDropdownRef.current = node;
            if (node && useDropdownScrollPad && isPassengersOpen) {
                requestAnimationFrame(syncDropdownScrollPadding);
            }
        },
        [useDropdownScrollPad, isPassengersOpen, syncDropdownScrollPadding],
    );

    const closePassengers = useCallback(() => {
        setPassengersKeyboardMode(false);
        setOpenDropdown(null);
    }, [setOpenDropdown]);

    useEffect(() => {
        if (!canOpenPassengers && isPassengersOpen) {
            closePassengers();
        }
    }, [canOpenPassengers, isPassengersOpen, closePassengers]);

    const openPassengers = useCallback(
        (viaKeyboard) => {
            setPassengersKeyboardMode(viaKeyboard);
            setOpenDropdown('passengers');
        },
        [setOpenDropdown]
    );

    const handlePassengersClick = useCallback(() => {
        if (!canOpenPassengers) return;
        if (isSmallScreen) {
            openGuestsModal();
            return;
        }
        if (isPassengersOpen) {
            closePassengers();
        } else {
            openPassengers(false);
        }
    }, [canOpenPassengers, isSmallScreen, isPassengersOpen, closePassengers, openPassengers, openGuestsModal]);

    const handlePassengersKeyDown = useCallback(
        (e) => {
            if (!canOpenPassengers || isSmallScreen || (e.key !== 'Enter' && e.key !== ' ')) return;
            e.preventDefault();
            if (!isPassengersOpen) {
                openPassengers(true);
            } else {
                setPassengersKeyboardMode(true);
            }
        },
        [canOpenPassengers, isSmallScreen, isPassengersOpen, openPassengers]
    );

    const rootClass = isSmallScreen
        ? 'mt-4 flex flex-col gap-4'
        : isTablet
            ? 'mt-4 relative flex flex-col gap-4'
            : 'mt-4 relative flex gap-4';

    // Desktop: return = dates flex-[2] + passengers flex-1.
    // One-way = date flex-1 | passengers flex-1 | empty flex-1 (last third empty).
    const datesSectionClass = isSmallScreen
        ? 'relative flex w-full flex-col gap-3'
        : isTablet
            ? 'relative flex w-full gap-4 overflow-visible'
            : isReturnTrip
                ? 'relative flex flex-[2] gap-4 overflow-visible'
                : 'relative flex min-w-0 flex-1 gap-4 overflow-visible';

    const calendarPanelClass =
        'booking-calendar-popover bg-white shadow-xl rounded-lg border border-[var(--bg-300)] ring-1 ring-black/5';

    const calendarPanel = renderCalendar?.();

    const dropdownPanelClass =
        'absolute end-0 top-full mt-1 z-[200] bg-white shadow-xl rounded-lg border border-[var(--bg-300)] ring-1 ring-black/5';

    const passengersSectionClass = isSmallScreen
        ? 'relative w-full min-w-0'
        : isTablet
            ? 'relative w-full min-w-0'
            : 'relative min-w-0 flex-1';

    // Anchored to dates row:
    // - One-way desktop: span date + passengers (equal flex-1 + gap-4) → 200% + 1rem
    // - Return on narrow desktop (≤1150): span both dates (flex-[2]) + passengers (flex-1) → 150% + 1rem
    // - Return on wide desktop: width of the two date fields only
    const calendarWidthClass = (() => {
        if (isSmallScreen || isTablet) return 'w-full min-w-0';
        if (!isReturnTrip) return 'w-[calc(200%+1rem)] min-w-0';
        if (isNarrowDesktop) return 'w-[calc(150%+1rem)] min-w-0';
        return 'w-full min-w-0';
    })();
    const calendarPopoverClass = [
        'absolute top-full z-[200] mt-1',
        isRtl ? 'right-0' : 'left-0',
        calendarWidthClass,
    ].join(' ');

    return (
        <div className={rootClass}>
            <div
                ref={datesRef}
                className={`${datesSectionClass} ${isDatesOpen ? 'z-[200]' : 'z-0'}`}
            >
                <div className={`relative min-w-0 flex-1 ${isDatesOpen ? 'z-[200]' : ''}`}>
                    <DateBox
                        label={copy.flightInfo.departureDate}
                        date={departureDate}
                        isLoading={showDateFieldsLoading}
                        onClick={handleOpenDeparture}
                        isOpen={isDatesOpen}
                        loadingLabel={copy.flightInfo.loading}
                    />
                </div>

                {isReturnTrip && (
                    <DateBox
                        label={copy.flightInfo.returnDate}
                        date={returnDate}
                        isLoading={showDateFieldsLoading}
                        disabled={!canSelectReturnDate}
                        onClick={handleOpenReturn}
                        isOpen={isDatesOpen && canSelectReturnDate}
                        loadingLabel={copy.flightInfo.loading}
                    />
                )}

                {!isSmallScreen && (
                    <Transition
                        show={isDatesOpen}
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 -translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-1"
                    >
                        <div
                            ref={attachCalendarDropdownRef}
                            className={`booking-calendar-popover ${calendarPopoverClass} ${calendarPanelClass}`}
                        >
                            {calendarPanel}
                        </div>
                    </Transition>
                )}
            </div>

            <div
                ref={passengersRef}
                className={`${passengersSectionClass} ${isPassengersOpen ? 'z-[200]' : 'z-0'}`}
            >
                <div
                    role="button"
                    tabIndex={canOpenPassengers && !isSmallScreen ? 0 : -1}
                    data-passengers-trigger
                    aria-disabled={!canOpenPassengers}
                    onClick={handlePassengersClick}
                    onKeyDown={handlePassengersKeyDown}
                    className={`h-[100%] min-h-[72px] bg-[#F5F5F4] rounded-xl px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center gap-3 ${
                        canOpenPassengers
                            ? 'hover:bg-[#E7E7E5] transition-colors duration-200 cursor-pointer'
                            : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        {isSmallScreen && (
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                <UsersThree size={16} weight="fill" color="white" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="text-gray-500 text-sm text-start">{copy.passengers.andClass}</div>
                            <div className="font-semibold truncate text-start" dir="auto">{passengerLabel}</div>
                        </div>
                    </div>
                    <span className="text-gray-500 flex-shrink-0">
                        {isPassengersOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
                    </span>
                </div>

                {!isSmallScreen && isPassengersOpen && canOpenPassengers && (
                    <div
                        ref={attachGuestsDropdownRef}
                        className={`booking-guests-popover ${dropdownPanelClass} p-4 w-full min-w-[min(26rem,calc(100vw-1.5rem))] max-w-[min(28rem,calc(100vw-1.5rem))]`}
                    >
                        {renderGuests?.({
                            onClose: closePassengers,
                            keyboardNavActive: passengersKeyboardMode,
                        })}
                    </div>
                )}
            </div>

            {!isSmallScreen && !isTablet && !isReturnTrip && (
                <div className="min-w-0 flex-1" aria-hidden="true" />
            )}
        </div>
    );
};

export default InfoBoxes;
