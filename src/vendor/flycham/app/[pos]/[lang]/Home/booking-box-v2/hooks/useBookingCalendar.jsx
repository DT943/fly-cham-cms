'use client';

import { useCallback, useEffect, useState } from 'react';
import { TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import getIataCodeById from '../components/widget/Dates/utils/getIataCodeById';

/**
 * Computes and exposes calendar availability (scheduleStatusData) for the booking flow.
 *
 * Behavior:
 * - For one‑way trips, filters schedules in the origin → destination direction.
 * - For return trips:
 *   - Before first click, shows departure segment (origin → destination).
 *   - After first date selection, switches to return segment (destination → origin),
 *     with fallbacks and an MCT special‑case when no data exists.
 */
export const useBookingCalendar = ({
  formSource,
  formDestination,
  tripType,
  hasClickCalendarFlag,
  prefetchedSchedules,
  airPorts,
}) => {
  const [scheduleStatusData, setScheduleStatusData] = useState(null);

  const setScheduleDataSafe = useCallback((data) => {
    if (!data || data.length === 0) {
      setScheduleStatusData(null);
    } else {
      setScheduleStatusData(data);
    }
  }, []);

  const recomputeScheduleStatusData = useCallback(() => {
    if (
      !formSource ||
      !formDestination ||
      !Array.isArray(prefetchedSchedules) ||
      prefetchedSchedules.length === 0
    ) {
      setScheduleStatusData(null);
      return;
    }

    const originIata = getIataCodeById({ id: formSource, airPorts });
    const destIata = getIataCodeById({ id: formDestination, airPorts });

    if (!originIata || !destIata) {
      setScheduleStatusData(null);
      return;
    }

    const filterByRoute = (from, to) =>
      prefetchedSchedules.filter((item) => {
        const itemOrigin = (item?.origin || '').toUpperCase();
        const itemDest = (item?.destination || '').toUpperCase();
        return (
          itemOrigin === from.toUpperCase() &&
          itemDest === to.toUpperCase()
        );
      });

    if (tripType === TRIP_TYPES.RETURN) {
      if (hasClickCalendarFlag) {
        const returnFlights = filterByRoute(destIata, originIata);
        const departureFallback = filterByRoute(originIata, destIata);

        if (returnFlights.length > 0) {
          setScheduleStatusData(returnFlights);
        } else if (
          originIata.toUpperCase() === 'MCT' ||
          destIata.toUpperCase() === 'MCT'
        ) {
          setScheduleStatusData([]);
        } else if (departureFallback.length > 0) {
          setScheduleStatusData(departureFallback);
        } else {
          setScheduleStatusData([]);
        }
      } else {
        const departureFlights = filterByRoute(originIata, destIata);
        setScheduleStatusData(
          departureFlights.length > 0 ? departureFlights : null,
        );
      }
    } else {
      const oneWayFlights = filterByRoute(originIata, destIata);
      setScheduleStatusData(oneWayFlights.length > 0 ? oneWayFlights : null);
    }
  }, [
    formSource,
    formDestination,
    prefetchedSchedules,
    airPorts,
    tripType,
    hasClickCalendarFlag,
  ]);

  useEffect(() => {
    recomputeScheduleStatusData();
  }, [recomputeScheduleStatusData]);

  return { scheduleStatusData, setScheduleDataSafe, setScheduleStatusData };
};

