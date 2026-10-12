'use client'
/**
 * Main booking widget for the home/results page.
 * Dropdown-only flow: one-way, return, and multi-city via inline dropdowns (no step modals).
 *
 * Responsibilities:
 * - Orchestrates form state (Formik), dropdown/calendar/leg state via custom hooks.
 * - Renders either mobile (BookingBoxMobile) or desktop (BookingBoxDesktop).
 * - Builds and provides six focused contexts for form, modals, dropdown, guests, calendar, airport renderers.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingBoxContentProvider } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import BookingBoxMobile from "./components/BookingBoxMobile";
import BookingBoxDesktop from "./components/BookingBoxDesktop";
import useIsMobile from "@/hooks/useIsMobile";
import { useDispatch, useSelector } from "react-redux";
import { setAirports, setPos } from "@/store/flightSlice";
import Guests from "./components/Guests";
import {
    NOOP,
    TRIP_TYPES,
    AIRPORT_TYPES,
    DROPDOWNS,
    STEP_IDS,
} from "@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants";
import useBookingBoxModals from "./hooks/useBookingBoxModals";
import useGuestsReducer from "./hooks/useGuestsReducer";
import { useAirportState } from "./hooks/useAirportState";
import { useCalendarState } from "./hooks/useCalendarState";
import {
    switchSourceDestinationValues,
    isModalContext,
    isStepValid as isStepValidUtil,
} from "./utils/bookingBoxUtils";
import getIataCodeById from "./components/widget/Dates/utils/getIataCodeById";
import { useQuery } from "@tanstack/react-query";
import { buildSearchUrl } from "./hooks/useBookingFormik";
import { useBookingDropdownState } from "./hooks/useBookingDropdownState";
import { useBookingCalendar } from "./hooks/useBookingCalendar";
import { useBookingPreviewV2RouteSchedule } from "@/lib/b2cAvailability/useBookingPreviewV2RouteSchedule";
import { useBookingPreviewV2AllRoutes } from "@/lib/b2cAvailability/useBookingPreviewV2AllRoutes";
import { useMultiCityLegs } from "./hooks/useMultiCityLegs";
import { useMultiCityLegDateOrder } from "./hooks/useMultiCityCalendarAutoOpen";
import { useBookingBoxRenderers } from "./hooks/useBookingBoxRenderers";
import { useLegSearchState } from "./hooks/useLegSearchState";
import { getFirstLeg, clearLegsFrom, getLeg } from "./utils/legsUtils";
import {
    buildFormValue,
    buildModalsValue,
    buildDropdownValue,
    buildGuestsValue,
    buildCalendarValue,
    buildAirportRenderersValue,
} from "./utils/bookingBoxContextValues";
import { BookingBoxFormProvider } from "./context/BookingBoxFormContext";
import { BookingBoxModalsProvider } from "./context/BookingBoxModalsContext";
import { BookingBoxDropdownProvider } from "./context/BookingBoxDropdownContext";
import { BookingBoxGuestsProvider } from "./context/BookingBoxGuestsContext";
import { BookingBoxCalendarProvider } from "./context/BookingBoxCalendarContext";
import { BookingBoxAirportRenderersProvider } from "./context/BookingBoxAirportRenderersContext";
import MobModal from "./components/modals/MobModal";

const BookingBox = ({
    flights,
    pos,
    handleResetToFirstStep = NOOP,
    onCloseMidifySearch = NOOP,
    cId,
    formik,
    submitted,
    onRegisterReset,
    onRegisterModalControls = NOOP,
    prefetchedSchedules,
    resultsPath,
    isFlightSchedulePage = false,
    autoOpenCalendar = false,
    /** Live B2C AirportCatalog + FlightAvail/by-route (isolated from home manifest). */
    bookingPreviewV2 = false,
    /** Flat airport list without "New" section (legacy flows only). */
    hideNewAirportUi = false,
    /** Search / CMS widget: Figma picker + nearby toggle; uses API `isNew`. */
    searchV2AirportUi = false,
    /** Round-trip may depart and return on the same calendar day (preview-v2 + modify search). */
    allowSameDayReturn = false,
    /** True while modify-search modal is open (search-results). */
    isModifySearchOpen = false,
    /** search-results modify search: lap infant + infant with seat share adults cap. */
    enableInfantsWithSeat = false,
}) => {
    const { lang } = useParams();
    const boxDir = lang === "ar" ? "rtl" : "ltr";

    // ——— Routing & device ———
    const router = useRouter();
    /** Phone-only layout (≤767px). iPad Mini / tablets at 768px+ use desktop dropdowns. */
    const isMobile = useIsMobile(767);
    const isInModal = isModalContext(onCloseMidifySearch);
    const sameDayReturnEnabled = allowSameDayReturn || bookingPreviewV2;
    const isModifySearch = isInModal && !isFlightSchedulePage;
    const [mcDropdownResetToken, setMcDropdownResetToken] = useState(0);
    const prevModifySearchOpenRef = useRef(false);

    // ——— Form / leg state ———
    const firstLeg = getFirstLeg(formik.values);
    const { dateStart, source: formSource, destination: formDestination } = firstLeg;
    const {
        dateEnd,
        tripType,
        hasClickCalendar: hasClickCalendarFlag,
        type: currentStepType = 0,
    } = formik.values;

    // ——— Dropdown state ———
    const {
        bookingBoxRef,
        openDropdown,
        setOpenDropdown,
        openAirPortsByLeg,
        setOpenAirPortsForLeg,
        clearAllAirportDropdowns,
        openDateRowId,
        setOpenDateRowId,
    } = useBookingDropdownState({
        autoOpenCalendar,
        isInModal,
        dateStart,
        hasClickCalendarFlag,
        tripType,
        formSource,
        formDestination,
    });

    // ——— Modals (close only; no step modals) ———
    // Ref keeps latest focus logic without re-registering modal controls each render (avoids
    // setModalControls loops when register callback deps change every paint).
    const focusSourceFieldRef = useRef(() => {});
    const { modalState, openMobileModal, closeAllModals } = useBookingBoxModals(
        useCallback(
            (controls) => {
                onRegisterModalControls?.({
                    ...controls,
                    focusSourceField: () => focusSourceFieldRef.current?.(),
                });
            },
            [onRegisterModalControls]
        )
    );
    focusSourceFieldRef.current = () => {
        const isMultiCityFlow = formik?.values?.tripType === TRIP_TYPES.MULTICITY;
        if (isMobile && !isMultiCityFlow) {
            clearAllAirportDropdowns();
            setOpenDropdown(null);
            setOpenAirPortsForLeg(1, null);
            formik.setFieldValue('type', STEP_IDS.FLYING_FROM);
            openMobileModal();
            return;
        }
        setOpenAirPortsForLeg(1, AIRPORT_TYPES.SOURCE);
    };

    // ——— Guests ———
    const {
        guestsState,
        changeGuestCount,
        setGuestValue,
        setCabinClass,
        setPromoCode,
    } = useGuestsReducer(formik);

    // ——— Redux & registration ———
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setAirports(flights));
        dispatch(setPos(pos));
    }, [dispatch, flights, pos]);
    useEffect(() => {
        onRegisterReset?.(handleResetToFirstStep);
    }, [onRegisterReset, handleResetToFirstStep]);

    // ——— Airport & search (from Redux + hooks) ———
    const { airPorts, activeTab } = useSelector((state) => state.flights);
    const airportItems = airPorts?.items ?? [];
    const { routeRows: b2cRouteRows } = useBookingPreviewV2AllRoutes(bookingPreviewV2);

    const {
        sourceSearch,
        destinationSearch,
        setSourceSearch,
        setDestinationSearch,
        getCitiesArray,
    } = useAirportState({
        formik,
        airports: airPorts,
        prefetchedSchedules: bookingPreviewV2 ? null : prefetchedSchedules,
        b2cRouteRows: bookingPreviewV2 ? b2cRouteRows : null,
        b2cRoutesPending: bookingPreviewV2 && b2cRouteRows == null,
    });

    // ——— Calendar ———
    const {
        minMonth,
        currentMonth,
        setMinMonth,
        setCurrentMonth,
        handleDateSelect,
        handleReset: resetPrimaryTripDates,
        displaySelection,
    } = useCalendarState(formik, {
        allowSameDayReturn: sameDayReturnEnabled,
        isModifySearch,
    });

    const {
        activeMultiCityCalendarLeg,
        setActiveMultiCityCalendarLeg,
        multiCityDatePicked,
        setMultiCityDatePicked,
    } = useMultiCityLegs();

    // Multi-city: Reset clears only the active leg date. One-way / return: clear both dates.
    const handleReset = useCallback(() => {
        if (formik.values.tripType === TRIP_TYPES.MULTICITY) {
            const leg = openDateRowId || activeMultiCityCalendarLeg || 1;
            const legIndex = Math.max(0, Number(leg) - 1);
            formik.setFieldValue(`legs.${legIndex}.dateStart`, null);
            return;
        }
        resetPrimaryTripDates();
    }, [
        formik,
        openDateRowId,
        activeMultiCityCalendarLeg,
        resetPrimaryTripDates,
    ]);

    const { searchByLeg, setSearchByLeg, handleSearchForLeg } = useLegSearchState({
        formik,
    });

    const isMultiCityTrip = tripType === TRIP_TYPES.MULTICITY;
    useMultiCityLegDateOrder({
        isMultiCity: isMultiCityTrip,
        formik,
    });

    useEffect(() => {
        const justOpened = isModifySearch && isModifySearchOpen && !prevModifySearchOpenRef.current;
        prevModifySearchOpenRef.current = Boolean(isModifySearchOpen);
        if (!justOpened) return;

        setOpenDropdown(null);
        setOpenDateRowId(null);
        clearAllAirportDropdowns();
        setActiveMultiCityCalendarLeg(1);
        setMcDropdownResetToken((token) => token + 1);
    }, [isModifySearch, isModifySearchOpen]);

    const mcScheduleLegId = isMultiCityTrip
        ? (openDateRowId || activeMultiCityCalendarLeg || 1)
        : null;
    const mcScheduleLeg = mcScheduleLegId
        ? getLeg(formik.values, mcScheduleLegId - 1)
        : null;
    const scheduleFormSource = mcScheduleLeg?.source || formSource;
    const scheduleFormDestination = mcScheduleLeg?.destination || formDestination;
    const mcRouteApiForLeg2Plus = isMultiCityTrip && mcScheduleLegId >= 2;
    const useRouteApiSchedule = bookingPreviewV2 || mcRouteApiForLeg2Plus;

    const sliderRef = useRef(null);
    // null means "no schedule data restrictions" (e.g. API failed) → all days available
    // [] means "we have schedule data but no flights for this route" → all days unavailable
    const [legacyScheduleStatusData, setLegacyScheduleStatusData] = useState(null);

    const previewV2Schedule = useBookingPreviewV2RouteSchedule({
        enabled: useRouteApiSchedule,
        formSource: scheduleFormSource,
        formDestination: scheduleFormDestination,
        airPorts,
        tripType: bookingPreviewV2 ? tripType : TRIP_TYPES.ONEWAY,
        hasClickCalendarFlag: bookingPreviewV2 ? hasClickCalendarFlag : false,
    });

    const isSchedulePending =
        useRouteApiSchedule &&
        Boolean(scheduleFormSource && scheduleFormDestination && previewV2Schedule.isSchedulePending);

    const [pendingDatesCalendarOpen, setPendingDatesCalendarOpen] = useState(false);
    const pendingDatesCalendarMobileRef = useRef(false);

    const requestOpenDatesCalendar = useCallback(
        (opts = {}) => {
            if (!bookingPreviewV2) {
                setOpenDropdown(DROPDOWNS.DEPARTURE);
                return;
            }
            pendingDatesCalendarMobileRef.current = Boolean(opts.mobile);
            setPendingDatesCalendarOpen(true);
        },
        [bookingPreviewV2, setOpenDropdown],
    );

    useEffect(() => {
        if (!pendingDatesCalendarOpen || isSchedulePending) return;

        if (pendingDatesCalendarMobileRef.current) {
            formik.setFieldValue('type', STEP_IDS.TRAVEL_WHEN);
            openMobileModal();
        } else {
            setOpenDropdown(DROPDOWNS.DEPARTURE);
        }
        setPendingDatesCalendarOpen(false);
        pendingDatesCalendarMobileRef.current = false;
    }, [
        pendingDatesCalendarOpen,
        isSchedulePending,
        formik,
        openMobileModal,
        setOpenDropdown,
    ]);

    useEffect(() => {
        setPendingDatesCalendarOpen(false);
        pendingDatesCalendarMobileRef.current = false;
    }, [formSource, formDestination]);

    const scheduleStatusData = useRouteApiSchedule
        ? previewV2Schedule.scheduleStatusData
        : legacyScheduleStatusData;
    const scheduleMatchesActiveLeg = useRouteApiSchedule
        ? previewV2Schedule.scheduleMatchesActiveLeg
        : true;
    const setScheduleStatusData = bookingPreviewV2
        ? previewV2Schedule.setScheduleStatusData
        : setLegacyScheduleStatusData;

    // Safe setter for schedule data - used by AirportList when user changes airports
    const setScheduleDataSafe = useCallback((data) => {
        if (bookingPreviewV2) {
            previewV2Schedule.setScheduleDataSafe(data);
            return;
        }
        if (!data || data.length === 0) {
            setLegacyScheduleStatusData(null); // null = no restrictions, all days enabled
        } else {
            setLegacyScheduleStatusData(data);
        }
    }, [bookingPreviewV2, previewV2Schedule]);

    // Update calendar availability based on route and date selection state
    // Round-trip flow:
    //   1. INITIAL (hasClickCalendarFlag=false): Show DEPARTURE flights (DAM → MCT)
    //   2. AFTER FIRST DATE (hasClickCalendarFlag=true): Show RETURN flights (MCT → DAM)
    //
    // DAM routes: merge ALP schedule data (before reopening) with DAM data (after reopening)
    useEffect(() => {
        if (bookingPreviewV2) return;
        if (!formSource || !formDestination || !Array.isArray(prefetchedSchedules) || prefetchedSchedules.length === 0) {
            setLegacyScheduleStatusData(null);
            return;
        }

        const originIata = getIataCodeById({ id: formSource, airPorts });
        const destIata = getIataCodeById({ id: formDestination, airPorts });

        if (!originIata || !destIata) {
            setLegacyScheduleStatusData(null);
            return;
        }

        // Get schedule data for a direction — direct match, no aliasing
        const getRouteFlights = (fromIata, toIata) => {
            return prefetchedSchedules.filter((item) => {
                const iO = (item?.origin || '').toUpperCase();
                const iD = (item?.destination || '').toUpperCase();
                return iO === (fromIata || '').toUpperCase() && iD === (toIata || '').toUpperCase();
            });
        };

        if (tripType === TRIP_TYPES.RETURN) {
            if (hasClickCalendarFlag) {
                // AFTER first date selected: Show RETURN flights (reversed: dest → origin)
                const returnFlights = getRouteFlights(destIata, originIata);

                if (returnFlights.length > 0) {
                    setLegacyScheduleStatusData(returnFlights);
                } else if (originIata.toUpperCase() === 'MCT' || destIata.toUpperCase() === 'MCT') {
                    setLegacyScheduleStatusData([]);
                } else {
                    const departureFallback = getRouteFlights(originIata, destIata);
                    if (departureFallback.length > 0) {
                        setLegacyScheduleStatusData(departureFallback);
                    } else {
                        setLegacyScheduleStatusData([]);
                    }
                }
            } else {
                // INITIAL state: Show DEPARTURE flights (forward: origin → dest)
                const departureFlights = getRouteFlights(originIata, destIata);
                setLegacyScheduleStatusData(departureFlights.length > 0 ? departureFlights : null);
            }
        } else {
            // One-way: Always show forward direction only
            const oneWayFlights = getRouteFlights(originIata, destIata);
            setLegacyScheduleStatusData(oneWayFlights.length > 0 ? oneWayFlights : null);
        }
    }, [bookingPreviewV2, formSource, formDestination, prefetchedSchedules, airPorts, tripType, hasClickCalendarFlag]);

    const handleClick = useCallback(
        (id) => {
            if (id > currentStepType && !isStepValidUtil(currentStepType, formik.values)) {
                return;
            }

            formik.setFieldValue("type", id);

            if (sliderRef.current) {
                sliderRef.current.slickGoTo(id);
            }
        },
        [currentStepType, formik]
    );


    const handleTripTypeChange = useCallback((type) => {
        formik.setFieldValue("tripType", type);
        if (type !== TRIP_TYPES.MULTICITY) {
            clearLegsFrom(formik, 1);
        } else {
            formik.setFieldValue("dateEnd", "");
        }
        setOpenDropdown(null);
        setOpenDateRowId(null);
        clearAllAirportDropdowns();
        // Always clear the primary trip dates when switching modes (not leg-scoped).
        resetPrimaryTripDates();
    }, [formik, resetPrimaryTripDates, setOpenDropdown, setOpenDateRowId, clearAllAirportDropdowns]);

    const renderGuests = useCallback(
        (opts) => (
            <Guests
                guestsState={guestsState}
                onGuestDelta={changeGuestCount}
                onGuestInput={setGuestValue}
                onCabinClassChange={setCabinClass}
                onPromoCodeChange={setPromoCode}
                onDone={opts?.onClose}
                keyboardNavActive={Boolean(opts?.keyboardNavActive)}
                isMobile={isMobile}
                enableInfantsWithSeat={enableInfantsWithSeat}
            />
        ),
        [guestsState, changeGuestCount, setGuestValue, setCabinClass, setPromoCode, isMobile, enableInfantsWithSeat]
    );

    const handleCalendarSelect = useCallback(
        (value) => {
            const datesComplete = handleDateSelect(value);
            if (!datesComplete) return;

            // Mobile: stay on the calendar step until the user taps Continue.
            if (isMobile) return;

            // Desktop: dates complete → close calendar and open passengers.
            setOpenDropdown(DROPDOWNS.PASSENGERS);
        },
        [handleDateSelect, isMobile, setOpenDropdown],
    );

    const onClose = useCallback(() => closeAllModals(), [closeAllModals]);

    const inputRef = useRef(null);
    const handleSearch = useCallback(
        (searchValue, type) => {
            const field = type === AIRPORT_TYPES.SOURCE ? "source" : "destination";
            if (searchValue === "") {
                formik.setFieldValue(`legs.0.${field}`, "");
            }
            if (type === AIRPORT_TYPES.SOURCE) {
                setSourceSearch(searchValue);
            } else {
                setDestinationSearch(searchValue);
            }
        },
        [formik, setSourceSearch, setDestinationSearch]
    );

    // ——— Airport dropdown renderers (no sliderRef; dropdown-only flow) ———
    const {
        renderCalendar,
        sourceDropdownContent,
        destinationDropdownContent,
        sourceDropdownContent2,
        destinationDropdownContent2,
        sourceDropdownContent3,
        destinationDropdownContent3,
        getLegProps,
    } = useBookingBoxRenderers({
        tripType,
        activeMultiCityCalendarLeg,
        openDateRowId,
        formik,
        minMonth,
        setMinMonth,
        currentMonth,
        setCurrentMonth,
        handleCalendarSelect,
        handleReset,
        displaySelection,
        scheduleStatusData,
        hasClickCalendarFlag,
        scheduleMatchesActiveLeg,
        prefetchedSchedules,
        airPorts,
        setMultiCityDatePicked,
        airportItems,
        isMobile,
        setOpenAirPortsForLeg,
        setScheduleDataSafe,
        sourceSearch,
        destinationSearch,
        setSourceSearch,
        setDestinationSearch,
        searchByLeg,
        setSearchByLeg,
        handleSearch,
        handleSearchForLeg,
        getCitiesArray,
        onClose,
        inputRef,
        openAirPortsByLeg,
        setOpenDropdown,
        setOpenDateRowId,
        setActiveMultiCityCalendarLeg,
        hideNewAirportUi,
        searchV2AirportUi,
        skipManifestScheduleFilter: bookingPreviewV2,
        mcRouteApiForLeg2Plus,
        allowSameDayReturn: sameDayReturnEnabled,
        isModifySearch,
        isSchedulePending,
        scheduleMatchesActiveLeg,
        requestOpenDatesCalendar,
    });

    const handleSwitch = useCallback(() => {
        const legs = Array.isArray(formik.values.legs) ? formik.values.legs : [];
        const resetValues = {
            ...formik.values,
            legs: legs.map((leg, i) => (i === 0 ? { ...leg, dateStart: null } : leg)),
            dateEnd: null,
            hasClickCalendar: false,
        };
        const newValues = switchSourceDestinationValues(resetValues);
        formik.setValues(newValues);

        if (bookingPreviewV2) {
            return;
        }
        const { source, destination } = getFirstLeg(newValues);
        if (source && destination && Array.isArray(prefetchedSchedules)) {
            const dep = getIataCodeById({ id: source, airPorts });
            const arr = getIataCodeById({ id: destination, airPorts });

            if (dep && arr) {
                const filteredForward = prefetchedSchedules.filter((item) => {
                    const origin = (item?.origin || '').toUpperCase();
                    const destination = (item?.destination || '').toUpperCase();
                    return origin === dep.toUpperCase() && destination === arr.toUpperCase();
                });
                setLegacyScheduleStatusData(filteredForward);
            } else {
                setLegacyScheduleStatusData([]);
            }
        } else {
            setLegacyScheduleStatusData([]);
        }
    }, [bookingPreviewV2, formik, prefetchedSchedules, airPorts]);

    const searchHref = useMemo(() => {
        if (!formik?.values) return undefined;
        try {
            return buildSearchUrl({
                values: formik.values,
                cId,
                resultsPath,
                airPorts,
                allowSameDayReturn: sameDayReturnEnabled,
            }).href;
        } catch {
            return undefined;
        }
    }, [formik?.values, cId, resultsPath, airPorts, sameDayReturnEnabled]);

    useEffect(() => {
        if (!searchHref || isInModal) return;
        try {
            router.prefetch(searchHref);
        } catch (_) {}
    }, [searchHref, router, isInModal]);

    // ——— Context values (memoized; stable hook count when switching mobile/desktop) ———
    const formValue = useMemo(
        () =>
            buildFormValue({
                activeTab,
                onCloseMidifySearch,
                formik,
                handleTripTypeChange,
                handleSwitch,
                submitted,
                cId,
                searchHref,
                tripType,
                isMobile,
                isFlightSchedulePage,
                prefetchedSchedules,
                airPorts,
                bookingPreviewV2,
                allowSameDayReturn: sameDayReturnEnabled,
                isModifySearch,
                isModifySearchOpen,
                mcDropdownResetToken,
            }),
        [
            activeTab,
            onCloseMidifySearch,
            formik,
            handleTripTypeChange,
            handleSwitch,
            submitted,
            cId,
            searchHref,
            tripType,
            isMobile,
            isFlightSchedulePage,
            prefetchedSchedules,
            airPorts,
            bookingPreviewV2,
            sameDayReturnEnabled,
            isModifySearch,
            isModifySearchOpen,
            mcDropdownResetToken,
        ]
    );
    const modalsValue = useMemo(
        () =>
            buildModalsValue({
                closeAllModals,
                onClose: closeAllModals,
                isMobileModalOpen: modalState.mobileOpen,
                openMobileModal,
            }),
        [closeAllModals, modalState.mobileOpen, openMobileModal]
    );
    const dropdownValue = useMemo(
        () =>
            buildDropdownValue({
                bookingBoxRef,
                openDropdown,
                setOpenDropdown,
                openAirPortsByLeg,
                setOpenAirPortsForLeg,
                openDateRowId,
                setOpenDateRowId,
                clearAllAirportDropdowns,
                handleResetToFirstStep,
            }),
        [
            bookingBoxRef,
            openDropdown,
            setOpenDropdown,
            openAirPortsByLeg,
            setOpenAirPortsForLeg,
            openDateRowId,
            setOpenDateRowId,
            clearAllAirportDropdowns,
            handleResetToFirstStep,
        ]
    );
    const guestsValue = useMemo(
        () => buildGuestsValue({ guestsState, renderGuests }),
        [guestsState, renderGuests]
    );
    const calendarValue = useMemo(
        () =>
            buildCalendarValue({
                displaySelection,
                handleReset,
                setCurrentMonth,
                activeMultiCityCalendarLeg,
                setActiveMultiCityCalendarLeg,
                multiCityDatePicked,
                renderCalendar,
                isSchedulePending,
                requestOpenDatesCalendar,
            }),
        [
            displaySelection,
            activeMultiCityCalendarLeg,
            handleReset,
            setCurrentMonth,
            setActiveMultiCityCalendarLeg,
            multiCityDatePicked,
            renderCalendar,
            isSchedulePending,
            requestOpenDatesCalendar,
        ]
    );
    const airportRenderersValue = useMemo(
        () =>
            buildAirportRenderersValue({
                sourceDropdownContent,
                destinationDropdownContent,
                sourceDropdownContent2,
                destinationDropdownContent2,
                sourceDropdownContent3,
                destinationDropdownContent3,
                getLegProps,
            }),
        [
            sourceDropdownContent,
            destinationDropdownContent,
            sourceDropdownContent2,
            destinationDropdownContent2,
            sourceDropdownContent3,
            destinationDropdownContent3,
            getLegProps,
        ]
    );

    if (!formik?.values) {
        return null;
    }

    return (
        <BookingBoxContentProvider lang={lang}>
        <div ref={bookingBoxRef} className="overflow-visible" dir={boxDir}>
            <BookingBoxFormProvider value={formValue}>
                <BookingBoxModalsProvider value={modalsValue}>
                    <BookingBoxDropdownProvider value={dropdownValue}>
                        <BookingBoxGuestsProvider value={guestsValue}>
                            <BookingBoxCalendarProvider value={calendarValue}>
                                <BookingBoxAirportRenderersProvider value={airportRenderersValue}>
                                    {isMobile ? <BookingBoxMobile /> : <BookingBoxDesktop />}
                                    {isMobile ? <MobModal /> : null}
                                </BookingBoxAirportRenderersProvider>
                            </BookingBoxCalendarProvider>
                        </BookingBoxGuestsProvider>
                    </BookingBoxDropdownProvider>
                </BookingBoxModalsProvider>
            </BookingBoxFormProvider>
        </div>
        </BookingBoxContentProvider>
    );
};

export default BookingBox;
