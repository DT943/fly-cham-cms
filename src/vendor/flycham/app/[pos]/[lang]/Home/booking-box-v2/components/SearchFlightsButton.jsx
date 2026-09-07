'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BUTTON_CONFIG } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { isSearchFormValid } from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/validationUtils';
import { useBookingBoxForm } from '../context/BookingBoxFormContext';
import ButtonSpinner from '@/components/Ui/ButtonSpinner';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { trackSearchFlightsClarityEvent } from '@/lib/clarity';

/**
 * SearchFlightsButton – uses Form context for form values, submit state, and search href.
 * Optional props: className, label (override default).
 */
const SearchFlightsButton = ({
  className = '',
  label,
}) => {
  const copy = useBookingBoxContentOptional();
  const resolvedLabel = label ?? copy.buttons.searchFlights;
  const router = useRouter();
  const { searchHref: href, handleSubmit, formik, allowSameDayReturn, isModifySearch } =
    useBookingBoxForm();
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigatingRef = useRef(false);
  const formValues = formik?.values ?? {};

  const isValid = useMemo(
    () => isSearchFormValid(formValues, { allowSameDayReturn: Boolean(allowSameDayReturn) }),
    [formValues, allowSameDayReturn]
  );

  const isDisabled = !isValid || loading;

  useEffect(() => {
    if (!isDisabled && href) {
      router.prefetch(href);
    }
  }, [isDisabled, href, router]);

  const buttonClasses = useMemo(() => {
    const baseClasses = BUTTON_CONFIG.SEARCH_FLIGHTS.STYLES.BASE;
    const stateClasses = isDisabled
      ? BUTTON_CONFIG.SEARCH_FLIGHTS.STYLES.DISABLED
      : BUTTON_CONFIG.SEARCH_FLIGHTS.STYLES.ENABLED;

    return `${baseClasses} ${stateClasses} ${className}`.trim();
  }, [isDisabled, className]);

  const handleClick = async () => {
    if (isDisabled || !href || loading) return;
    trackSearchFlightsClarityEvent({
      ...formValues,
      modifySearch: Boolean(isModifySearch),
    });
    setLoading(true);
    setIsNavigating(false);
    navigatingRef.current = false;

    try {
      if (typeof handleSubmit === 'function') {
        const shouldLock = await handleSubmit();
        if (shouldLock) {
          setIsNavigating(true);
          navigatingRef.current = true;
        }
      }
    } catch (err) {
      console.error('Search flights submit failed', err);
    } finally {
      if (!navigatingRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <button
      id={BUTTON_CONFIG.SEARCH_FLIGHTS.ID}
      type="button"
      disabled={isDisabled}
      aria-label={resolvedLabel}
      aria-disabled={isDisabled}
      onClick={handleClick}
      className={buttonClasses}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {(loading || isNavigating) && <ButtonSpinner size={20} />}
        <span>{resolvedLabel}</span>
      </span>
    </button>
  );
};

export default React.memo(SearchFlightsButton);
