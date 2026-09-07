'use client';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import CityBox from './CityBox';
import AirportDropdown from './AirportDropdown';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { AirplaneTakeoff, AirplaneLanding } from '@phosphor-icons/react';
import useIsMobile from '@/hooks/useIsMobile';
import SwapIcon from './SwapIcon';
import { AIRPORT_SELECTOR, STEP_IDS } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { getCityInfo } from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/airportUtils';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';

/**
 * CityBox Component
 * Displays airport/city information in a clickable card
 */
// CityBox moved to its own file: components/CityBox.jsx

/**
 * AirportDropdown Component
 * Renders dropdown content for airport selection
 */
// AirportDropdown moved to its own file: components/AirportDropdown.jsx

/**
 * SwapButton
 * Desktop: centered between side-by-side fields.
 * Mobile/stacked: inset on the end edge (LTR: right, RTL/Arabic: left),
 * vertically centered on the From/To seam.
 * When an airport list is open, keep swap below the list (z-10); otherwise
 * z-40 so it stays above CityBox fields.
 */
const SwapButton = React.memo(({
  onClick,
  isStacked,
  swapAriaLabel,
  disabled = false,
  isRtl = false,
  airportListOpen = false,
}) => {
  const positionClass = isStacked
    ? isRtl
      ? 'absolute left-1/7 top-1/2 -translate-y-1/2'
      : 'absolute right-1/7 top-1/2 -translate-y-1/2'
    : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2';
  const zClass = airportListOpen ? 'z-[10]' : 'z-[40]';

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${positionClass} ${zClass} rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary-1 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      style={{ touchAction: 'manipulation' }}
      onClick={disabled ? undefined : onClick}
      aria-label={swapAriaLabel}
      aria-disabled={disabled}
    >
      <SwapIcon isMobile={isStacked} />
    </button>
  );
});

SwapButton.displayName = 'SwapButton';

/**
 * FromToSelector Component
 * Selector for departure and arrival airports with swap functionality
 * 
 * @param {Object} props
 * @param {Object} props.formikValues - Formik form values containing source and destination
 * @param {Function} props.setFieldValue - Formik setFieldValue function
 * @param {Function} props.onSwitch - Handler for swapping airports
 * @param {Function} props.onSourceClick - Handler for source airport click (fallback when dropdown props not provided)
 * @param {Function} props.onDestinationClick - Handler for destination airport click (fallback when dropdown props not provided)
 * @param {boolean} props.isResultsPage - Deprecated: No longer used for dropdown behavior
 * @param {React.ReactNode} props.sourceDropdownContent - Content for source dropdown (when provided, enables dropdown mode)
 * @param {React.ReactNode} props.destinationDropdownContent - Content for destination dropdown
 * @param {string|null} props.openDropdown - Currently open dropdown ('from' | 'to' | null)
 * @param {Function} props.setOpenDropdown - Function to set open dropdown
 */
const FromToSelector = ({
  formikValues,
  setFieldValue,
  onSwitch,
  onSourceClick,
  onDestinationClick,
  isResultsPage = false,
  sourceDropdownContent,
  destinationDropdownContent,
  openDropdown,
  setOpenDropdown,
  sourceField = 'source',
  destinationField = 'destination',
  fromDropdownKey = AIRPORT_SELECTOR.FROM,
  toDropdownKey = AIRPORT_SELECTOR.TO,
  /** When true, arrival/destination cannot be opened until departure is selected. */
  destinationDisabled = false,
  /** When true, departure/from cannot be opened. */
  sourceDisabled = false,
  /** MC responsive: force stacked from/to layout below 1280px. */
  layout = 'auto',
  /** Optional hooks after clearing an airport (e.g. close multi-city calendar). */
  onAfterRemoveSource,
  onAfterRemoveDestination,
}) => {
  const isMobile = useIsMobile(767);
  const useStackedLayout = layout === 'stacked' || (layout === 'auto' && isMobile);
  const copy = useBookingBoxContentOptional();
  const { lang } = useParams() ?? {};
  const planeIconClass = lang === 'ar' ? 'scale-x-[-1]' : undefined;
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const { airPorts } = useSelector((state) => state.flights);
  const cities = airPorts?.items || [];

  // Get city information with memoization
  const sourceInfo = useMemo(
    () =>
      getCityInfo(
        cities,
        formikValues?.[sourceField],
        copy.airportSelector.fallbacks.departureCity,
        copy.airportSelector.fallbacks.selectOrigin
      ),
    [cities, formikValues, sourceField, copy.airportSelector.fallbacks]
  );

  const destinationInfo = useMemo(
    () =>
      getCityInfo(
        cities,
        formikValues?.[destinationField],
        copy.airportSelector.fallbacks.arrivalCity,
        copy.airportSelector.fallbacks.selectDestination
      ),
    [cities, formikValues, destinationField, copy.airportSelector.fallbacks]
  );

  // Check if dropdown mode should be used (when dropdown props are provided)
  const useDropdownMode = useMemo(
    () => Boolean(setOpenDropdown && sourceDropdownContent && destinationDropdownContent),
    [setOpenDropdown, sourceDropdownContent, destinationDropdownContent]
  );

  // Scroll helper to bring the active dropdown into view smoothly
  const scrollDropdownIntoView = useCallback((targetRef) => {
    if (!targetRef?.current) return;

    const scrollOnce = () => {
      const el = targetRef.current;
      // Native scrollIntoView as a primary attempt (helps when body scrolling is managed)
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      } catch (_) {
        // ignore
      }

      // Manual scroll adjustment with offset for sticky header
      try {
        const rect = el.getBoundingClientRect();
        const currentScroll = window.scrollY || window.pageYOffset;
        const offset = 80; // leave room for header and keep dropdown fully in view
        const targetScroll = rect.top + currentScroll - offset;
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        window.scrollTo({ top: finalScroll, behavior: 'smooth' });
      } catch (error) {
        console.error('Error scrolling to dropdown:', error);
      }
    };

    // Initial scroll as soon as possible
    requestAnimationFrame(() => {
      scrollOnce();
      // Re-run after a short delay to account for dropdown height rendering
      setTimeout(scrollOnce, 120);
    });
  }, []);

  // Handle card click with proper routing
  const handleSourceClick = useCallback(() => {
    if (sourceDisabled) return;

    // Always use dropdown mode if props are provided
    if (useDropdownMode) {
      setOpenDropdown?.((prev) => (prev === fromDropdownKey ? null : fromDropdownKey));
      return;
    }

    if (onSourceClick) {
      onSourceClick();
      return;
    }

    // Fallback behavior
    if (isMobile) {
      setFieldValue?.('type', STEP_IDS.FLYING_FROM);
    }
  }, [sourceDisabled, useDropdownMode, isMobile, setFieldValue, onSourceClick, setOpenDropdown, fromDropdownKey]);

  const handleDestinationClick = useCallback(() => {
    if (destinationDisabled) return;

    // Always use dropdown mode if props are provided
    if (useDropdownMode) {
      setOpenDropdown?.((prev) => (prev === toDropdownKey ? null : toDropdownKey));
      return;
    }

    if (onDestinationClick) {
      onDestinationClick();
      return;
    }

    // Fallback behavior
    if (isMobile) {
      setFieldValue?.('type', STEP_IDS.FLYING_TO);
    }
  }, [
    destinationDisabled,
    useDropdownMode,
    isMobile,
    setFieldValue,
    onDestinationClick,
    setOpenDropdown,
    toDropdownKey,
  ]);

  // Handle remove source: reset dates and re-open the From list for this leg
  const handleRemoveSource = useCallback((e) => {
    if (e) e.stopPropagation();
    setFieldValue?.(sourceField, '');
    setFieldValue?.('dateStart', null);
    setFieldValue?.('dateEnd', null);
    setFieldValue?.('hasClickCalendar', false);
    onAfterRemoveSource?.();
    setTimeout(() => {
      if (useDropdownMode) {
        setOpenDropdown?.(fromDropdownKey);
        return;
      }
      onSourceClick?.();
    }, 0);
  }, [
    setFieldValue,
    setOpenDropdown,
    sourceField,
    fromDropdownKey,
    onAfterRemoveSource,
    useDropdownMode,
    onSourceClick,
  ]);

  // Handle remove destination: reset dates and re-open the To list for this leg
  const handleRemoveDestination = useCallback((e) => {
    if (e) e.stopPropagation();
    setFieldValue?.(destinationField, '');
    setFieldValue?.('dateStart', null);
    setFieldValue?.('dateEnd', null);
    setFieldValue?.('hasClickCalendar', false);
    onAfterRemoveDestination?.();
    setTimeout(() => {
      if (useDropdownMode) {
        setOpenDropdown?.(toDropdownKey);
        return;
      }
      onDestinationClick?.();
    }, 0);
  }, [
    setFieldValue,
    setOpenDropdown,
    destinationField,
    toDropdownKey,
    onAfterRemoveDestination,
    useDropdownMode,
    onDestinationClick,
  ]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    if (!useDropdownMode || !setOpenDropdown) return;

    const handleClickOutside = (e) => {
      const isClickInside =
        (fromRef.current?.contains(e.target)) || (toRef.current?.contains(e.target));

      if (!isClickInside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [useDropdownMode, setOpenDropdown]);

  // Scroll to BookingBox when dropdown opens
  const prevOpenDropdownRef = useRef(openDropdown);
  useEffect(() => {
    if (!useDropdownMode || !openDropdown) {
      prevOpenDropdownRef.current = openDropdown;
      return;
    }
    const wasClosed = !prevOpenDropdownRef.current;
    const isNowOpen = Boolean(openDropdown);
    if (wasClosed && isNowOpen) {
      if (openDropdown === fromDropdownKey) {
        scrollDropdownIntoView(fromRef);
      } else if (openDropdown === toDropdownKey) {
        scrollDropdownIntoView(toRef);
      }
    }
    prevOpenDropdownRef.current = openDropdown;
  }, [openDropdown, useDropdownMode, scrollDropdownIntoView, fromDropdownKey, toDropdownKey]);

  const isFromOpen = Boolean(useDropdownMode && openDropdown === fromDropdownKey);
  const isToOpen = Boolean(useDropdownMode && openDropdown === toDropdownKey);
  const isAirportListOpen = isFromOpen || isToOpen;

  // Elevate the whole From/To block when a list is open (beats dates / next legs).
  // The open field wrap must sit above the swap control; closed fields stay under swap.
  const containerClasses = useMemo(
    () =>
      [
        'relative overflow-visible',
        isAirportListOpen ? 'z-[200]' : 'z-0',
        useStackedLayout
          ? 'flex flex-col items-stretch gap-3'
          : 'grid grid-cols-2 items-stretch gap-x-7',
      ].join(' '),
    [useStackedLayout, isAirportListOpen]
  );

  const fromWrapClass = [
    'relative min-w-0 w-full max-w-full',
    isFromOpen ? 'z-[50]' : 'z-0',
  ].join(' ');

  const toWrapClass = [
    'relative min-w-0 w-full max-w-full',
    isToOpen ? 'z-[50]' : 'z-0',
  ].join(' ');

  return (
    <div className={containerClasses}>
      {/* FROM / SOURCE */}
      <div ref={fromRef} className={fromWrapClass}>
        <CityBox
          icon={<AirplaneTakeoff weight="fill" size={16} color="white" className={planeIconClass} />}
          label={copy.airportSelector.labels.from}
          city={sourceInfo.city}
          airport={sourceInfo.airport}
          onClick={handleSourceClick}
          onRemove={handleRemoveSource}
          showRemove={Boolean(formikValues?.[sourceField])}
          disabled={sourceDisabled}
        />
        {useDropdownMode && (
          <AirportDropdown isOpen={isFromOpen}>
            {sourceDropdownContent}
          </AirportDropdown>
        )}
      </div>

      {/* SWAP — below open airport list, above closed CityBox fields */}
      <SwapButton
        onClick={onSwitch}
        isStacked={useStackedLayout}
        swapAriaLabel={copy.aria.swapOriginDestination}
        disabled={sourceDisabled}
        isRtl={lang === 'ar'}
        airportListOpen={isAirportListOpen}
      />

      {/* TO / DESTINATION */}
      <div ref={toRef} className={toWrapClass}>
        <CityBox
          icon={<AirplaneLanding weight="fill" size={16} color="white" className={planeIconClass} />}
          label={copy.airportSelector.labels.to}
          city={destinationInfo.city}
          airport={destinationInfo.airport}
          onClick={handleDestinationClick}
          onRemove={handleRemoveDestination}
          showRemove={Boolean(formikValues?.[destinationField])}
          disabled={destinationDisabled}
        />
        {useDropdownMode && (
          <AirportDropdown isOpen={isToOpen}>
            {destinationDropdownContent}
          </AirportDropdown>
        )}
      </div>
    </div>
  );
};

export default React.memo(FromToSelector);
