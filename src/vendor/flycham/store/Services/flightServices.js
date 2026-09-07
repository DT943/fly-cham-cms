import { apiClient, ibeApiClient } from '@/lib/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const sliceName = 'airPorts';
// ===================================== GET AIR PORTS ==============================================
export const getAirports = createAsyncThunk(
    `${sliceName}/getAirports`,
    async ({ search }, thunkAPI) => {
        try {
            const filters = `language==en;search@=${search || ''}`;
            const response = await apiClient.get(`/booking/AirPort`, {
                params: { filters },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);
// ===================================== SEARCH FLIGHTS ==============================================
export const getFlightsService = createAsyncThunk(
    `${sliceName}/getFlightsService`,
    async (data, thunkAPI) => {
        try {
            const response = await ibeApiClient.post(
                `/GetFlightsWithPrice/?filters=language==en`,
                data,
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);
// ===================================== SEARCH FLIGHTS ==============================================
export const selectFlightService = createAsyncThunk(
    `${sliceName}/selectFlightService`,
    async (data, thunkAPI) => {
        try {

            // const response = await ibeApiClient.post(`/searchnewflow/selectedFlight`, data);
            const response = await ibeApiClient.post(`/searchflight/selectedFlight`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);
// ===================================== CREATE PASSENGER LISITS ==============================================

export const createListPassengerService = createAsyncThunk(
    `${sliceName}/createListPassengerService`,
    async (data, thunkAPI) => {
        try {

            const response = await apiClient.post(`/booking/Contact/CreateListPassenger`, data);
            // const response = await apiClient.post(`/booknewflow/Contact/CreateListPassenger`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data ?? error.message ?? 'Something went wrong'
            );
        }
    }
);
// ===================================== CREATE PAYMENT ==============================================

// thunk – SessionId, isLemo (+ optional analytics) in headers; body is only firstAddress / secondAddress
export const createPaymentService = createAsyncThunk(
    `${sliceName}/createPaymentService`,
    async (
        {
            sessionId,
            isLemo,
            firstAddress = '',
            secondAddress = '',
            analytic_userCode,
            analytic_source,
            analytic_url,
            campaignId,
        },
        thunkAPI,
    ) => {
        try {
            const headers = {
                ...(sessionId ? { SessionId: sessionId } : {}),
                isLemo: String(!!isLemo),
                ...(analytic_userCode ? { analytic_userCode } : {}),
                ...(analytic_source ? { analytic_source } : {}),
                ...(analytic_url ? { analytic_url } : {}),
                ...(campaignId ? { campaignId } : {}),
            };

            const payload = {
                firstAddress: String(firstAddress ?? ''),
                secondAddress: String(secondAddress ?? ''),
            };

            const response = await apiClient.post(
                '/booking/PaymentWithAncillary/Checkout',
                payload,
                { headers }
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);

// ===================================== PREVIEW (Pay & confirm step – amount, segments, passengers) ==============================================
export const getPreviewService = createAsyncThunk(
    `${sliceName}/getPreviewService`,
    async ({ sessionId, language = 'en', payload }, thunkAPI) => {
        try {
            const body = payload ?? { SessionId: sessionId, selectedAncillarySegments: [] };
            const response = await apiClient.post('/ancillary/Preview', body, {
                params: { language },
                headers: {
                    ...(sessionId ? { SessionId: sessionId } : {}),
                },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);

// ===================================== CREATE SESSION BY ID ==============================================

export const getBySessionIdService = createAsyncThunk(
    `${sliceName}/getBySessionIdService`,
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(
                `/booking/PaymentPNRResult/GetBySessionId`,
                {
                    headers: {
                        SessionId: id,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);
// ===================================== VALIDATE EMAIL ==============================================
export const validateEmailService = createAsyncThunk(
    `${sliceName}/validateEmailService`,
    async (email, thunkAPI) => {
        try {

            const response = await apiClient.get(`https://flycham.com/api/AbstractValidation/EmailDetail/ValidateEmail?email=${email}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);
// ===================================== VALIDATE PHONE NUMBER ==============================================
export const validatePhoneNumberService = createAsyncThunk(
    `${sliceName}/validatePhoneNumberService`,
    async (phoneNumber, thunkAPI) => {
        try {

            const response = await axios.get(`https://flycham.com/api/AbstractValidation/PhoneDetail/ValidatePhone?phoneNumber=${phoneNumber}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);
// ===================================== LIMOUSINE / DELIVERY SERVICE ==============================================
export const requestLimousineService = createAsyncThunk(
    `${sliceName}/requestLimousineService`,
    async (body, thunkAPI) => {
        try {
            const response = await apiClient.post('/Limousine/WhenBook/Request', body);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data ?? { message: error.message ?? 'Request failed' }
            );
        }
    }
);

// ===================================== DOWNLOAD TICKET ==============================================
export const downloadTickeyService = createAsyncThunk(
    `${sliceName}/downloadTickeyService`,
    async ({ SessionId, PNR }, thunkAPI) => {
        try {
            const response = await apiClient.get(
                `/booking/PDFTicket/DownloadTicketPDF`,
                {
                    headers: {
                        'SessionId': SessionId,
                        'PNR': PNR
                    }
                }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);
