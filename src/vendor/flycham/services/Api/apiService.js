// apiService.js — shared URL rules for apiClient (same flow as contact-us GetPage prefetch)
import { apiClient } from "@/lib/apiClient";

// Get API base URL from environment, with fallback for production
// On server-side, we need full URL. On client-side, we can use relative path with Next.js rewrite
const getApiBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const isServer = typeof window === 'undefined';

    // On server-side, always use production URL (rewrites don't work on server)
    if (isServer) {
        return 'https://flycham.com/api';
    }

    // On client-side, if API_BASE_URL is not set or points to localhost, return null
    // This allows apiClient's baseURL: '/api' to handle it via Next.js rewrite
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
        return null;
    }

    // If we have a valid production URL, use it
    return envUrl;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Headless PDF renderer loads the e-ticket page on loopback (127.0.0.1). In
 * production the client bundle normally calls https://flycham.com/api directly,
 * which is cross-origin from loopback and blocked by CORS — the ticket never
 * renders and PDF generation fails. The renderer adds ?pdfRender=1 so we keep
 * using the same-origin /api proxy (same as local dev).
 */
function shouldUseLocalApiProxy() {
    if (typeof window === 'undefined') return false;
    try {
        return new URLSearchParams(window.location.search).has('pdfRender');
    } catch {
        return false;
    }
}

/**
 * Routes implemented only in Next.js (`src/app/api/*`), not on flycham upstream.
 * In production `NEXT_PUBLIC_API_BASE_URL` points at upstream — these must stay
 * on same-origin `/api` (apiClient baseURL) or they 404.
 */
const NEXTJS_ONLY_API_PREFIXES = [
    'retrieve-booking-token',
    'eticket-pdf',
    'b2b-payment/create',
    'b2b-payment/validate',
    'ota-payment/create',
    'ota-payment/validate',
    'callcenter-payment/create',
    'places-autocomplete',
    'geocode',
    'reverse-geocode',
    'zapier-survey',
    'city-bounds',
];

function isNextJsOnlyApiPath(url) {
    const normalized = String(url || '').replace(/^\//, '').split('?')[0].toLowerCase();
    return NEXTJS_ONLY_API_PREFIXES.some(
        (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
    );
}

/**
 * Resolve path the same way for all CMS + loyalty calls:
 * - Server / full base: `https://flycham.com/api` + `/loyalty/member/...` or `/contentmanagment/...`
 * - Client dev: strip leading `/` so axios uses apiClient baseURL `/api` → `http://localhost:3000/api/...`
 * - Next.js-only routes: always same-origin `/api` (never upstream flycham.com/api)
 */
function resolveRequestUrl(url) {
    const path = url.startsWith('/') ? url : `/${url}`;
    if (shouldUseLocalApiProxy() || isNextJsOnlyApiPath(path)) {
        return path.substring(1);
    }
    return API_BASE_URL ? `${API_BASE_URL}${path}` : path.substring(1);
}

export const fetchData = async (url) => {
    // SessionId handling is done automatically by apiClient interceptors
    const { data } = await apiClient.get(resolveRequestUrl(url));
    return data;
};

export const getData = async (url, headers = {}) => {
    const config = {
        headers: {
            ...headers,
        },
    };
    const { data } = await apiClient.get(resolveRequestUrl(url), config);
    return data;
};

export const postData = async (url, body, headers = {}) => {
    const isFormData = body instanceof FormData;

    const config = {
        headers: {
            ...headers,
        },
    };

    if (isFormData) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
    }

    const { data } = await apiClient.post(resolveRequestUrl(url), body, config);
    return data;
};


export const updateData = async (url, body) => {
    const { data } = await apiClient.patch(resolveRequestUrl(url), body);
    return data;
};

export const deleteData = async (url) => {
    const { data } = await apiClient.delete(resolveRequestUrl(url));
    return data;
};

export const deleteDataWithBody = async (url, body, headers = {}) => {
    const { data } = await apiClient.delete(resolveRequestUrl(url), {
        data: body,
        headers,
    });
    return data;
};

// --- Profile / loyalty API (same URL flow as fetchData / GetPage — via apiClient + resolveRequestUrl) ---

const PROFILE_LOYALTY_PREFIX = "/loyalty";

function loyaltyPath(endpoint) {
    const suffix = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${PROFILE_LOYALTY_PREFIX}${suffix}`;
}

export const getProfileData = async (endpoint, headers = {}) => {
    const { data } = await apiClient.get(resolveRequestUrl(loyaltyPath(endpoint)), {
        headers: { "Content-Type": "application/json", ...headers },
    });
    return data;
};

export const postProfileData = async (endpoint, body, headers = {}) => {
    const isFormData = body instanceof FormData;
    const config = {
        headers: { ...headers },
    };
    if (!isFormData) {
        config.headers["Content-Type"] = "application/json";
    } else {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
    }
    const { data } = await apiClient.post(resolveRequestUrl(loyaltyPath(endpoint)), body, config);
    return data;
};

export const putProfileData = async (endpoint, body, headers = {}) => {
    const isFormData = body instanceof FormData;
    const config = {
        headers: { ...headers },
    };
    if (!isFormData) {
        config.headers["Content-Type"] = "application/json";
    } else {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
    }
    const { data } = await apiClient.put(resolveRequestUrl(loyaltyPath(endpoint)), body, config);
    return data;
};

export const deleteProfileData = async (endpoint, headers = {}) => {
    const { data } = await apiClient.delete(resolveRequestUrl(loyaltyPath(endpoint)), {
        headers: { ...headers },
    });
    return data;
};
