// lib/apiClient.js

import axios from "axios";
import https from "https";
import { handleSessionIdRequest, handleSessionIdResponse } from "./apiClient/sessionIdInterceptor";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const IBE_API_BASE_URL = process.env.NEXT_PUBLIC_IBE_API_BASE_URL;

// Create HTTPS agent that accepts expired certificates (development only)
// WARNING: Only use this in development. In production, the API server should have a valid SSL certificate.
const httpsAgent = new https.Agent({
    rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
});

export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    httpsAgent: httpsAgent,
});

// Request interceptor: Handle FormData and sessionId
apiClient.interceptors.request.use(
    (config) => {
        // Remove Content-Type header for FormData to let axios set multipart/form-data with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
        }

        // Handle sessionId for GetPage requests
        return handleSessionIdRequest(config);
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Store sessionId from GetPage responses
apiClient.interceptors.response.use(
    handleSessionIdResponse,
    (error) => Promise.reject(error)
);
export const ibeApiClient = axios.create({
    baseURL: IBE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    httpsAgent: httpsAgent,
    // You can add interceptors here if needed
});

