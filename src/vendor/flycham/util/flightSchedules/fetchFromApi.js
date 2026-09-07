import { fetchData } from '@/services/Api/apiService';
import { FLIGHT_SCHEDULE_GET_FLIGHTS_PATH } from './constants';

/**
 * Fetches schedule rows from the backend only (no store, no static fallback).
 * @returns {Promise<Array|null>}
 */
export async function fetchFlightSchedulesFromApi() {
  try {
    const data = await fetchData(FLIGHT_SCHEDULE_GET_FLIGHTS_PATH);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.result)) return data.result;
    return null;
  } catch (error) {
    console.error('Failed to fetch flight schedules from API:', error);
    return null;
  }
}
