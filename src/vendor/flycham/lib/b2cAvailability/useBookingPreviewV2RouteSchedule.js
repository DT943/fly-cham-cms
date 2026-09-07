'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import getIataCodeById from '@/app/[pos]/[lang]/Home/booking-box-v2/components/widget/Dates/utils/getIataCodeById';
import { TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { fetchB2cFlightAvailByRoute } from '@/lib/b2cAvailability/b2cAvailabilityApi';
import { mapFlightAvailToScheduleRows } from '@/lib/b2cAvailability/mapFlightAvailToScheduleRows';

const SCHEDULE_SKELETON_MIN_MS = 400;

function waitForMinSkeleton(startedAt) {
  const elapsed = Date.now() - startedAt;
  const remaining = SCHEDULE_SKELETON_MIN_MS - elapsed;
  if (remaining <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, remaining);
  });
}

function buildRouteKey(originIata, destIata) {
  return `${String(originIata || '').toUpperCase()}-${String(destIata || '').toUpperCase()}`;
}

/**
 * Loads calendar availability from B2C FlightAvail/by-route for booking-box-v2
 * when `bookingPreviewV2` (live B2C schedule) mode is enabled.
 * Fetches once per origin+destination pair (outbound); date selection does not refetch.
 */
export function useBookingPreviewV2RouteSchedule({
  enabled,
  formSource,
  formDestination,
  airPorts,
  tripType = TRIP_TYPES.RETURN,
  hasClickCalendarFlag = false,
}) {
  const { lang = 'en' } = useParams();
  const [scheduleStatusData, setScheduleStatusData] = useState(null);
  const [scheduleFetchState, setScheduleFetchState] = useState('idle');
  const [activeRouteKey, setActiveRouteKey] = useState(null);
  const requestIdRef = useRef(0);
  const routeCacheRef = useRef(new Map());
  const activeRouteKeyRef = useRef(null);

  const setScheduleDataSafe = useCallback((data) => {
    if (!data || data.length === 0) {
      setScheduleStatusData(null);
      setScheduleFetchState('ready');
    } else {
      setScheduleStatusData(data);
      setScheduleFetchState('ready');
    }
  }, []);

  const loadRouteSchedule = useCallback(
    async ({ bypassCache = false } = {}) => {
      if (!enabled || !formSource || !formDestination) {
        activeRouteKeyRef.current = null;
        setActiveRouteKey(null);
        setScheduleStatusData(null);
        setScheduleFetchState('idle');
        return;
      }

      const originIata = getIataCodeById({ id: formSource, airPorts });
      const destIata = getIataCodeById({ id: formDestination, airPorts });
      if (!originIata || !destIata) {
        activeRouteKeyRef.current = null;
        setActiveRouteKey(null);
        setScheduleStatusData(null);
        setScheduleFetchState('idle');
        return;
      }

      // Round-trip: after the departure date is picked, load return-leg
      // availability (destination → origin), matching the main site flow.
      const pickingReturn =
        tripType === TRIP_TYPES.RETURN && Boolean(hasClickCalendarFlag);
      const from = pickingReturn ? destIata : originIata;
      const to = pickingReturn ? originIata : destIata;
      const routeKey = buildRouteKey(from, to);
      activeRouteKeyRef.current = routeKey;
      setActiveRouteKey(routeKey);

      if (!bypassCache && routeCacheRef.current.has(routeKey)) {
        setScheduleStatusData(routeCacheRef.current.get(routeKey));
        setScheduleFetchState('ready');
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      const fetchStartedAt = Date.now();
      setScheduleFetchState('loading');
      setScheduleStatusData(null);

      try {
        const apiRows = await fetchB2cFlightAvailByRoute(from, to, lang);
        if (requestIdRef.current !== requestId) return;
        if (activeRouteKeyRef.current !== routeKey) return;
        await waitForMinSkeleton(fetchStartedAt);
        if (requestIdRef.current !== requestId) return;
        if (activeRouteKeyRef.current !== routeKey) return;
        const mapped = mapFlightAvailToScheduleRows(apiRows, from, to);
        const scheduleRows = mapped.length > 0 ? mapped : [];
        routeCacheRef.current.set(routeKey, scheduleRows);
        setScheduleStatusData(scheduleRows);
        setScheduleFetchState('ready');
      } catch {
        if (requestIdRef.current !== requestId) return;
        if (activeRouteKeyRef.current !== routeKey) return;
        await waitForMinSkeleton(fetchStartedAt);
        if (requestIdRef.current !== requestId) return;
        if (activeRouteKeyRef.current !== routeKey) return;
        setScheduleStatusData(null);
        setScheduleFetchState('error');
      }
    },
    [enabled, formSource, formDestination, airPorts, tripType, hasClickCalendarFlag, lang],
  );

  useEffect(() => {
    loadRouteSchedule();
  }, [loadRouteSchedule]);

  const reloadRouteSchedule = useCallback(() => {
    loadRouteSchedule({ bypassCache: true });
  }, [loadRouteSchedule]);

  const pickingReturn =
    tripType === TRIP_TYPES.RETURN && Boolean(hasClickCalendarFlag);
  const originIata = getIataCodeById({ id: formSource, airPorts });
  const destIata = getIataCodeById({ id: formDestination, airPorts });
  const expectedRouteKey =
    originIata && destIata
      ? buildRouteKey(pickingReturn ? destIata : originIata, pickingReturn ? originIata : destIata)
      : null;
  const scheduleMatchesActiveLeg =
    Boolean(expectedRouteKey) &&
    scheduleFetchState !== 'loading' &&
    activeRouteKey === expectedRouteKey;

  return {
    scheduleStatusData,
    setScheduleStatusData,
    setScheduleDataSafe,
    isLoading: scheduleFetchState === 'loading',
    isSchedulePending: scheduleFetchState === 'loading',
    scheduleMatchesActiveLeg,
    reloadRouteSchedule,
  };
}
