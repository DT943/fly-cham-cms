'use client';

import { useCallback, useState } from 'react';
import { AIRPORT_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';

/**
 * Manages per‑leg airport search state for multi‑city legs (2+).
 *
 * Leg 1 search is handled by useAirportState; this hook keeps
 * track of `searchByLeg` and provides a single handler to update
 * Formik + local search state for leg >= 2.
 */
export const useLegSearchState = ({ formik }) => {
  const [searchByLeg, setSearchByLeg] = useState({});

  const handleSearchForLeg = useCallback(
    (leg, searchValue, type) => {
      const legIndex = leg - 1;
      const field = type === AIRPORT_TYPES.SOURCE ? 'source' : 'destination';
      const targetPath = `legs.${legIndex}.${field}`;

      if (searchValue === '') {
        formik.setFieldValue(targetPath, '');
      }

      if (leg >= 2) {
        const key = type === AIRPORT_TYPES.SOURCE ? 'source' : 'dest';
        setSearchByLeg((prev) => ({
          ...prev,
          [leg]: {
            ...(prev[leg] || { source: '', dest: '' }),
            [key]: searchValue,
          },
        }));
      }
    },
    [formik],
  );

  return { searchByLeg, setSearchByLeg, handleSearchForLeg };
};

