'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  TRIP_TYPES,
  MIN_MULTI_CITY_LEGS,
} from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { getLeg, setLeg } from '../utils/legsUtils';
import { useMultiCityCalendarAutoOpen } from './useMultiCityCalendarAutoOpen';

/**
 * Desktop multi-city state: leg count, add/delete/clear, calendar auto-open (shared hook).
 */
export const useDesktopMultiCity = ({
  formik,
  multiCityDatePicked,
  setOpenDateRowId,
  setOpenDropdown,
  setActiveMultiCityCalendarLeg,
  setOpenAirPortsForLeg,
  clearExtraLegDropdowns,
  mcDropdownResetToken = 0,
  onOpenLegAirports = null,
  onOpenPassengers = null,
}) => {
  const isMultiCity = formik.values.tripType === TRIP_TYPES.MULTICITY;

  const [suppressAutoOpenPassengers, setSuppressAutoOpenPassengers] = useState(false);
  const lastMultiCitySigRef = useRef('');

  const { seedDestinations } = useMultiCityCalendarAutoOpen({
    isMultiCity,
    multiCityLegCount: MIN_MULTI_CITY_LEGS,
    formik,
    multiCityDatePicked,
    setOpenDateRowId,
    setActiveMultiCityCalendarLeg,
    setOpenDropdown,
    setOpenAirPortsForLeg,
    onOpenLegAirports,
    onOpenPassengers,
    suppressAutoOpenPassengers,
    requireSourceForAutoOpen: true,
    mcDropdownResetToken,
  });

  useEffect(() => {
    if (!isMultiCity) return;
    const leg1 = getLeg(formik.values, 0);
    const leg2 = getLeg(formik.values, 1);
    const leg1Complete = Boolean(leg1.source && leg1.destination && leg1.dateStart);

    if (!leg1Complete) {
      if (leg2.source || leg2.destination || leg2.dateStart) {
        setLeg(formik, 1, { source: '', destination: '', dateStart: '' });
      }
      return;
    }

    const sig = Array.from({ length: MIN_MULTI_CITY_LEGS }, (_, idx) => {
      const leg = getLeg(formik.values, idx);
      return `${leg.source || ''}|${leg.destination || ''}|${String(leg.dateStart || '')}`;
    }).join('||');

    if (sig !== lastMultiCitySigRef.current) {
      lastMultiCitySigRef.current = sig;
      setSuppressAutoOpenPassengers(false);
    }
  }, [isMultiCity, formik, formik.values?.legs]);

  const prevLeg1AirportsRef = useRef('');
  useEffect(() => {
    if (!isMultiCity) return;
    const leg1 = getLeg(formik.values, 0);
    const airportSig = `${leg1.source || ''}|${leg1.destination || ''}`;
    if (prevLeg1AirportsRef.current && prevLeg1AirportsRef.current !== airportSig) {
      setLeg(formik, 1, { source: '', destination: '', dateStart: '' });
      setOpenAirPortsForLeg?.(2, null);
      setOpenDateRowId?.(null);
      setOpenDropdown?.((prev) => (prev === 'passengers' ? null : prev));
      setActiveMultiCityCalendarLeg?.(1);
      seedDestinations();
    }
    prevLeg1AirportsRef.current = airportSig;
  }, [
    isMultiCity,
    formik,
    formik.values?.legs,
    setOpenAirPortsForLeg,
    setOpenDateRowId,
    setOpenDropdown,
    setActiveMultiCityCalendarLeg,
    seedDestinations,
  ]);

  const handleClearAllFlights = useCallback(() => {
    for (let i = 0; i < MIN_MULTI_CITY_LEGS; i += 1) {
      setLeg(formik, i, { source: '', destination: '', dateStart: '' });
    }
    clearExtraLegDropdowns?.();
  }, [formik, clearExtraLegDropdowns]);

  return {
    isMultiCity,
    multiCityLegCount: MIN_MULTI_CITY_LEGS,
    handleClearAllFlights,
    suppressAutoOpenPassengers,
    setSuppressAutoOpenPassengers,
    seedDestinations,
  };
};
