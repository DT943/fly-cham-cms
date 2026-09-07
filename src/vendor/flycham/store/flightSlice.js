// store/slices/flightSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createListPassengerService, createPaymentService, getAirports, getBySessionIdService, getFlightsService, getPreviewService } from './Services/flightServices';

const flightSlice = createSlice({
    name: 'flights',
    initialState: {
        activeTab: 'book',
        airPorts: [],
        flights: [],
        IndirectAirPort: [],
        pos: [],
        searchParams: {},
        formikData: {},
        selectedFlight: null,
        selectedPlan: {},
        isLoading: false,
        isLoadingCreatePassengers: false,
        isLoadingCreatePayment: false,
        isLoadingFlights: false,
        error: null,
        selectedPassengers: {},
        sessionInfo: {},
        pnr: '',
        /** Prefetched flight schedule rows (API / static fallback); see `src/util/flightSchedules/README.md`. */
        calendarData: [],
        previewResult: null,
        isLoadingPreview: false,
        /** Full `result` object from POST /PassengerInfo/Create — used to
         *  override the displayed total with `confirmedTotalFareAmount`. */
        passengerInfoResult: null,
        /** Latest `result` from POST b2c_ancillaryPort/SelectedAncillary. */
        selectedAncillaryResult: null,
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setAirports: (state, action) => {
            state.airPorts = action.payload;
        },
        setCalendarData: (state, action) => {
            state.calendarData = action.payload;
        },
        setPos: (state, action) => {
            state.pos = action.payload;
        },
        setSearchParams: (state, action) => {
            state.searchParams = action.payload;
        },
        setFormikData: (state, action) => {
            state.formikData = action.payload;
        },
        setSelectedF: (state, action) => {
            state.selectedFlight = action.payload;
        },
        setSelectedPlan: (state, action) => {
            state.selectedPlan = action.payload;
        },
        setSelectedpassengers: (state, action) => {
            state.selectedPassengers = action.payload;
        },
        setPassengerInfoResult: (state, action) => {
            state.passengerInfoResult = action.payload;
            state.selectedAncillaryResult = null;
        },
        clearPassengerInfoResult: (state) => {
            state.passengerInfoResult = null;
            state.selectedAncillaryResult = null;
        },
        setSelectedAncillaryResult: (state, action) => {
            state.selectedAncillaryResult = action.payload;
        },
        clearSelectedAncillaryResult: (state) => {
            state.selectedAncillaryResult = null;
        },
        setPnr: (state, action) => {
            state.pnr = action.payload;
        },

        setFlights: (state, action) => {
            state.flights = action.payload;
        },
        setIndirectAirPort: (state, action) => {
            state.IndirectAirPort = action.payload;
        },
        clearPassengerPaymentLoading: (state) => {
            state.isLoadingCreatePassengers = false;
            state.isLoadingCreatePayment = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // ========================GET AIR PORTS==================================

            .addCase(getAirports.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAirports.fulfilled, (state, action) => {
                state.isLoading = false;
                state.airPorts = action.payload;
            })
            .addCase(getAirports.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // ========================GET FLIGHTS==================================

            .addCase(getFlightsService.pending, (state) => {
                state.isLoadingFlights = true;
                state.error = null;
            })
            .addCase(getFlightsService.fulfilled, (state, action) => {
                state.isLoadingFlights = false;
                // state.flights = action.payload.flights;
                state.flights = action.payload.DirectAirPort;
                state.IndirectAirPort = action.payload.IndirectAirPort;
            })
            .addCase(getFlightsService.rejected, (state, action) => {
                state.isLoadingFlights = false;
                state.error = action.payload;
            })
            // ========================Passenger==================================

            .addCase(createListPassengerService.pending, (state) => {
                state.isLoadingCreatePassengers = true;
                state.error = null;
            })
            .addCase(createListPassengerService.fulfilled, (state, action) => {
                state.isLoadingCreatePassengers = false;
                // state.flights = action.payload.flights;
            })
            .addCase(createListPassengerService.rejected, (state, action) => {
                state.isLoadingCreatePassengers = false;
                state.error = action.payload;
            })
            // ========================Payment==================================
            .addCase(createPaymentService.pending, (state) => {
                state.isLoadingCreatePayment = true;
                state.error = null;
            })
            .addCase(createPaymentService.fulfilled, (state, action) => {
                state.isLoadingCreatePayment = false;
            })
            .addCase(createPaymentService.rejected, (state, action) => {
                state.isLoadingCreatePayment = false;
                state.error = action.payload;
            })
            // ========================SESSION INFO BY ID==================================
            .addCase(getBySessionIdService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getBySessionIdService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessionInfo = action.payload;
            })
            .addCase(getBySessionIdService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // ======================== PREVIEW (Pay & confirm step) ===================================
            .addCase(getPreviewService.pending, (state) => {
                state.isLoadingPreview = true;
            })
            .addCase(getPreviewService.fulfilled, (state, action) => {
                state.isLoadingPreview = false;
                state.previewResult = action.payload?.result ?? null;
            })
            .addCase(getPreviewService.rejected, (state) => {
                state.isLoadingPreview = false;
                state.previewResult = null;
            })

    },
});

export const { setActiveTab, setAirports, setCalendarData, setSearchParams, setSelectedF, setSelectedPlan,
    setSelectedpassengers, setPos, setPnr, setFormikData, setFlights, setIndirectAirPort, clearPassengerPaymentLoading,
    setPassengerInfoResult, clearPassengerInfoResult, setSelectedAncillaryResult, clearSelectedAncillaryResult
} = flightSlice.actions;
export default flightSlice.reducer;
