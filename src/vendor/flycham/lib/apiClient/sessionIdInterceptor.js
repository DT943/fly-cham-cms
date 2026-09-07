/**
 * SessionId Interceptor Utilities
 * Handles sessionId logic for GetPage API requests
 */

import { getSessionId, setSessionId } from '@/util/sessionIdManager';

const GET_PAGE_ENDPOINT = '/contentmanagment/Page/GetPage';
const CODE_HEADER_KEY = 'code';

/**
 * Check if URL is for GetPage endpoint
 * @param {string} url - The API URL
 * @returns {boolean} True if URL contains GetPage endpoint
 */
export const isGetPageEndpoint = (url) => {
  if (!url) return false;
  const urlString = typeof url === 'string' ? url : url.toString();
  return urlString.includes(GET_PAGE_ENDPOINT);
};

/**
 * Get the request URL from axios config
 * @param {Object} config - Axios request config
 * @returns {string} Full URL string
 */
const getRequestUrl = (config) => {
  const url = config?.url || '';
  const baseURL = config?.baseURL || '';
  return baseURL ? `${baseURL}${url}` : url;
};

/**
 * Request interceptor handler for sessionId
 * Adds 'code' header with sessionId for GetPage requests
 * @param {Object} config - Axios request config
 * @returns {Object} Modified config
 */
export const handleSessionIdRequest = (config) => {
  const url = getRequestUrl(config);
  
  if (isGetPageEndpoint(url)) {
    const sessionId = getSessionId();
    config.headers[CODE_HEADER_KEY] = sessionId || '';
  }
  
  return config;
};

/**
 * Response interceptor handler for sessionId
 * Extracts and stores sessionId from GetPage responses
 * @param {Object} response - Axios response
 * @returns {Object} Response object
 */
export const handleSessionIdResponse = (response) => {
  const url = getRequestUrl(response.config);
  
  if (isGetPageEndpoint(url)) {
    const sessionId = response.data?.result?.sessionId;
    
    if (sessionId && typeof sessionId === 'string' && sessionId.trim()) {
      setSessionId(sessionId);
    }
  }
  
  return response;
};
