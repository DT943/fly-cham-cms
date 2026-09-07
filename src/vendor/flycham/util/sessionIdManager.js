/**
 * SessionId Manager Utility
 * Handles storing and retrieving sessionId from localStorage
 * for tracking requests to /contentmanagment/Page/GetPage
 */

const SESSION_ID_KEY = 'flycham_session_id';

/**
 * Check if code is running on client-side
 * @returns {boolean} True if running in browser
 */
const isClient = () => typeof window !== 'undefined';

/**
 * Get sessionId from localStorage
 * Returns empty string if not found or if localStorage is not available (SSR)
 * @returns {string} SessionId or empty string
 */
export const getSessionId = () => {
  if (!isClient()) {
    return '';
  }

  try {
    return localStorage.getItem(SESSION_ID_KEY) || '';
  } catch (error) {
    console.warn('Failed to get sessionId from localStorage:', error);
    return '';
  }
};

/**
 * Store sessionId in localStorage
 * @param {string} sessionId - The sessionId to store
 * @returns {boolean} True if successfully stored, false otherwise
 */
export const setSessionId = (sessionId) => {
  if (!isClient()) {
    return false;
  }

  if (!sessionId || typeof sessionId !== 'string' || !sessionId.trim()) {
    return false;
  }

  try {
    localStorage.setItem(SESSION_ID_KEY, sessionId.trim());
    return true;
  } catch (error) {
    console.error('Failed to store sessionId in localStorage:', error);
    return false;
  }
};

/**
 * Clear sessionId from localStorage
 */
export const clearSessionId = () => {
  if (!isClient()) {
    return;
  }

  try {
    localStorage.removeItem(SESSION_ID_KEY);
  } catch (error) {
    console.warn('Failed to clear sessionId from localStorage:', error);
  }
};
