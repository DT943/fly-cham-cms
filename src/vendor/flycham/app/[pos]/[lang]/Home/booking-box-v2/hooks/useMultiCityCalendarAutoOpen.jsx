'use client';

import { useCallback, useEffect, useRef } from 'react';
import { startOfDay } from 'date-fns';
import { getConfigForLeg } from '../constants/bookingBoxConstants';
import { getLeg } from '../utils/legsUtils';

/**
 * Multi-city: auto-open calendar after the user picks a destination (not on prefilled/modal open).
 * Seeds destination refs on mount and when leg count changes so modify-search does not flash calendars.
 */
export function useMultiCityCalendarAutoOpen({
  isMultiCity,
  multiCityLegCount,
  formik,
  multiCityDatePicked,
  setOpenDateRowId,
  setActiveMultiCityCalendarLeg,
  setOpenDropdown,
  setOpenAirPortsForLeg,
  /** Mobile: open next-leg From in MobModal instead of inline airport dropdown. */
  onOpenLegAirports = null,
  /** Mobile: open guests in MobModal instead of passengers dropdown. */
  onOpenPassengers = null,
  suppressAutoOpenPassengers = false,
  requireSourceForAutoOpen = true,
  mcDropdownResetToken = 0,
}) {
  const prevDestinationsRef = useRef(null);
  const prevMultiCityPickedNonceRef = useRef(0);
  const lastLegCountRef = useRef(multiCityLegCount);

  const readDestinations = useCallback(
    () =>
      Array.from({ length: multiCityLegCount }, (_, idx) => {
        const leg = getLeg(formik.values, idx);
        return leg.destination || '';
      }),
    [multiCityLegCount, formik.values],
  );

  const seedDestinations = useCallback(() => {
    prevDestinationsRef.current = readDestinations();
  }, [readDestinations]);

  useEffect(() => {
    if (!mcDropdownResetToken) return;
    seedDestinations();
  }, [mcDropdownResetToken, seedDestinations]);

  useEffect(() => {
    if (!isMultiCity) {
      prevDestinationsRef.current = null;
      lastLegCountRef.current = multiCityLegCount;
      return;
    }
    const legCountChanged = lastLegCountRef.current !== multiCityLegCount;
    lastLegCountRef.current = multiCityLegCount;
    if (prevDestinationsRef.current === null || legCountChanged) {
      seedDestinations();
    }
  }, [isMultiCity, multiCityLegCount, seedDestinations]);

  useEffect(() => {
    if (!isMultiCity || prevDestinationsRef.current === null) return;

    const destinations = readDestinations();
    const prev = prevDestinationsRef.current;

    for (let i = 0; i < destinations.length; i += 1) {
      const prevVal = prev[i] || '';
      const nextVal = destinations[i] || '';
      const leg = getLeg(formik.values, i);
      const hasSource = Boolean(leg.source);
      if (
        nextVal &&
        nextVal !== prevVal &&
        (!requireSourceForAutoOpen || hasSource)
      ) {
        const legId = i + 1;
        setOpenAirPortsForLeg?.(legId, null);
        setOpenDropdown?.(null);
        setActiveMultiCityCalendarLeg?.(legId);
        setOpenDateRowId?.(legId);
        break;
      }
    }
    prevDestinationsRef.current = destinations;
  }, [
    isMultiCity,
    multiCityLegCount,
    formik.values,
    readDestinations,
    setActiveMultiCityCalendarLeg,
    setOpenDateRowId,
    setOpenDropdown,
    setOpenAirPortsForLeg,
    requireSourceForAutoOpen,
  ]);

  useEffect(() => {
    if (!isMultiCity) return;
    const nonce = multiCityDatePicked?.nonce || 0;
    if (nonce === prevMultiCityPickedNonceRef.current) return;
    prevMultiCityPickedNonceRef.current = nonce;

    const leg = multiCityDatePicked?.leg || 1;
    setOpenDateRowId?.(null);

    const isLegComplete = (legId) => {
      const legData = getLeg(formik.values, legId - 1);
      return Boolean(legData.source && legData.destination && legData.dateStart);
    };
    const allComplete = Array.from({ length: multiCityLegCount }, (_, idx) =>
      isLegComplete(idx + 1),
    ).every(Boolean);
    const isLatestLeg = leg === multiCityLegCount;

    if (!isLatestLeg && isLegComplete(leg)) {
      const nextLegId = leg + 1;
      setActiveMultiCityCalendarLeg?.(nextLegId);
      setTimeout(() => {
        if (typeof onOpenLegAirports === 'function') {
          onOpenLegAirports(nextLegId);
          return;
        }
        const nextLegConfig = getConfigForLeg(nextLegId);
        setOpenAirPortsForLeg?.(nextLegId, nextLegConfig.fromDropdownKey);
      }, 0);
      return;
    }

    if (isLatestLeg && allComplete && !suppressAutoOpenPassengers) {
      setTimeout(() => {
        if (typeof onOpenPassengers === 'function') {
          onOpenPassengers();
          return;
        }
        setOpenDropdown?.('passengers');
      }, 0);
    }
  }, [
    isMultiCity,
    multiCityDatePicked,
    multiCityLegCount,
    formik.values,
    setOpenDateRowId,
    setOpenDropdown,
    setOpenAirPortsForLeg,
    setActiveMultiCityCalendarLeg,
    onOpenLegAirports,
    onOpenPassengers,
    suppressAutoOpenPassengers,
  ]);

  return { seedDestinations };
}

/** Clear leg N date when it falls before leg N-1 (sequential multi-city dates). */
export function useMultiCityLegDateOrder({ isMultiCity, formik }) {
  const legs = formik.values?.legs;
  const multiCityLegCount = Array.isArray(legs) ? legs.length : 0;

  useEffect(() => {
    if (!isMultiCity || multiCityLegCount < 2) return;

    for (let i = 1; i < multiCityLegCount; i += 1) {
      const prevDate = getLeg(formik.values, i - 1)?.dateStart;
      const legDate = getLeg(formik.values, i)?.dateStart;
      if (!prevDate || !legDate) continue;

      const prevDay = startOfDay(prevDate instanceof Date ? prevDate : new Date(prevDate));
      const legDay = startOfDay(legDate instanceof Date ? legDate : new Date(legDate));
      if (legDay < prevDay) {
        formik.setFieldValue(`legs.${i}.dateStart`, '');
      }
    }
  }, [isMultiCity, multiCityLegCount, formik, formik.values.legs]);
}
