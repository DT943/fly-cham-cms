/**
 * Pure builders for the six BookingBox context values.
 * Used inside useMemo in BookingBox.jsx so the shape of each context is explicit and testable.
 */

export function buildFormValue({
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
    bookingPreviewV2 = false,
    allowSameDayReturn = false,
    isModifySearch = false,
    isModifySearchOpen = false,
    mcDropdownResetToken = 0,
}) {
    return {
        activeTab,
        onCloseMidifySearch,
        formik,
        handleTripTypeChange,
        handleSwitch,
        submitted,
        handleSubmit: formik?.handleSearchSubmit ?? formik?.handleSubmit,
        cId,
        searchHref,
        tripType,
        isMobile,
        isFlightSchedulePage,
        prefetchedSchedules,
        airPorts,
        bookingPreviewV2,
        allowSameDayReturn,
        isModifySearch,
        isModifySearchOpen,
        mcDropdownResetToken,
    };
}

export function buildModalsValue({
    closeAllModals,
    onClose,
    isMobileModalOpen,
    openMobileModal,
}) {
    return {
        closeAllModals,
        onClose,
        isMobileModalOpen,
        openMobileModal,
    };
}

export function buildDropdownValue({
    bookingBoxRef,
    openDropdown,
    setOpenDropdown,
    openAirPortsByLeg,
    setOpenAirPortsForLeg,
    openDateRowId,
    setOpenDateRowId,
    clearAllAirportDropdowns,
    handleResetToFirstStep,
}) {
    return {
        bookingBoxRef,
        openDropdown,
        setOpenDropdown,
        openAirPortsByLeg,
        setOpenAirPortsForLeg,
        openDateRowId,
        setOpenDateRowId,
        clearExtraLegDropdowns: clearAllAirportDropdowns,
        handleResetToFirstStep,
    };
}

export function buildGuestsValue({ guestsState, renderGuests }) {
    return { guestsState, renderGuests };
}

export function buildCalendarValue({
    displaySelection,
    handleReset,
    setCurrentMonth,
    activeMultiCityCalendarLeg,
    setActiveMultiCityCalendarLeg,
    multiCityDatePicked,
    renderCalendar,
    isSchedulePending = false,
    requestOpenDatesCalendar,
}) {
    return {
        displaySelection,
        handleReset,
        setCurrentMonth,
        activeMultiCityCalendarLeg,
        setActiveMultiCityCalendarLeg,
        multiCityDatePicked,
        renderCalendar,
        isSchedulePending,
        requestOpenDatesCalendar,
    };
}

export function buildAirportRenderersValue({
    sourceDropdownContent,
    destinationDropdownContent,
    sourceDropdownContent2,
    destinationDropdownContent2,
    sourceDropdownContent3,
    destinationDropdownContent3,
    getLegProps,
}) {
    return {
        sourceDropdownContent,
        destinationDropdownContent,
        sourceDropdownContent2,
        destinationDropdownContent2,
        sourceDropdownContent3,
        destinationDropdownContent3,
        getLegProps,
    };
}
