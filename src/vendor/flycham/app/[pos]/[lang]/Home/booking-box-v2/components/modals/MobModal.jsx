'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import { addDays, startOfDay } from 'date-fns';
import { STEP_IDS, TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { useBookingBoxForm } from '../../context/BookingBoxFormContext';
import { useBookingBoxGuests } from '../../context/BookingBoxGuestsContext';
import { useBookingBoxCalendar } from '../../context/BookingBoxCalendarContext';
import { useBookingBoxModalsContext } from '../../context/BookingBoxModalsContext';
import { useBookingBoxAirportRenderers } from '../../context/BookingBoxAirportRenderersContext';
import { getFirstLeg, getLeg } from '../../utils/legsUtils';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { SEARCH_NESTED_MODAL_Z_INDEX } from '@/app/[pos]/[lang]/search-results/components/FlightResults/FlightResultsDesktop/constants';
import MobileAirportStepHeader from './MobileAirportStepHeader';
import {
  getAirportCityLabel,
  getTripDurationDays,
} from '../../utils/tripDuration';

const getStepTitle = (stepId, copy, { tripType, hasClickCalendar, dateStart, dateEnd } = {}) => {
  switch (stepId) {
    case STEP_IDS.FLYING_FROM:
      return copy.stepTitles.flyingFrom;
    case STEP_IDS.FLYING_TO:
      return copy.stepTitles.flyingTo;
    case STEP_IDS.GUESTS:
      return copy.stepTitles.guests;
    case STEP_IDS.TRAVEL_WHEN:
      if (tripType === TRIP_TYPES.ONEWAY || tripType === TRIP_TYPES.MULTICITY) {
        return copy.stepTitles.departureDate;
      }
      if (!dateStart) return copy.stepTitles.departureDate;
      if (hasClickCalendar && !dateEnd) return copy.stepTitles.returnDate;
      if (dateStart && dateEnd) return copy.stepTitles.departureAndReturnDates;
      return copy.stepTitles.selectDates;
    default:
      return '';
  }
};

const MobModal = () => {
  const copy = useBookingBoxContentOptional();
  const { lang } = useParams();
  const isRtl = lang === 'ar';
  const BackCaret = isRtl ? CaretRight : CaretLeft;
  const {
    formik,
    bookingPreviewV2 = false,
    allowSameDayReturn = false,
    airPorts,
  } = useBookingBoxForm();
  const { isMobileModalOpen: isOpen, onClose } = useBookingBoxModalsContext();
  const { renderGuests } = useBookingBoxGuests();
  const {
    handleReset,
    renderCalendar,
    setCurrentMonth,
    activeMultiCityCalendarLeg,
  } = useBookingBoxCalendar();
  const {
    sourceDropdownContent,
    destinationDropdownContent,
    sourceDropdownContent2,
    destinationDropdownContent2,
    sourceDropdownContent3,
    destinationDropdownContent3,
  } = useBookingBoxAirportRenderers();

  const values = formik?.values ?? {};
  const activeStep = Number(values.type ?? STEP_IDS.FLYING_FROM);
  const tripType = values.tripType ?? TRIP_TYPES.RETURN;
  const isMultiCity = tripType === TRIP_TYPES.MULTICITY;
  const activeLegId = isMultiCity
    ? Number(activeMultiCityCalendarLeg) || 1
    : 1;
  const activeLegIndex = Math.max(0, activeLegId - 1);
  const activeLeg = isMultiCity ? getLeg(values, activeLegIndex) : getFirstLeg(values);
  const firstLeg = getFirstLeg(values);
  const dateStart = isMultiCity
    ? (activeLeg?.dateStart ?? null)
    : (firstLeg?.dateStart ?? null);
  const dateEnd = values?.dateEnd ?? null;
  const hasClickCalendar = Boolean(values.hasClickCalendar);
  const isAirportStep =
    activeStep === STEP_IDS.FLYING_FROM || activeStep === STEP_IDS.FLYING_TO;

  const modalTitle = useMemo(
    () => getStepTitle(activeStep, copy, { tripType, hasClickCalendar, dateStart, dateEnd }),
    [activeStep, copy, tripType, hasClickCalendar, dateStart, dateEnd],
  );

  const sourceCity = useMemo(
    () => getAirportCityLabel(airPorts, activeLeg?.source),
    [airPorts, activeLeg?.source],
  );
  const destinationCity = useMemo(
    () => getAirportCityLabel(airPorts, activeLeg?.destination),
    [airPorts, activeLeg?.destination],
  );

  const tripDurationDays = useMemo(() => getTripDurationDays(values), [values]);
  const tripDurationLabel =
    tripDurationDays != null && typeof copy.flightInfo?.tripDuration === 'function'
      ? copy.flightInfo.tripDuration(tripDurationDays)
      : '';

  const airportBodyByLeg = useMemo(
    () => ({
      1: {
        from: sourceDropdownContent,
        to: destinationDropdownContent,
      },
      2: {
        from: sourceDropdownContent2,
        to: destinationDropdownContent2,
      },
      3: {
        from: sourceDropdownContent3,
        to: destinationDropdownContent3,
      },
    }),
    [
      sourceDropdownContent,
      destinationDropdownContent,
      sourceDropdownContent2,
      destinationDropdownContent2,
      sourceDropdownContent3,
      destinationDropdownContent3,
    ],
  );

  // Anchor the visible month when the date modal opens (avoids stale month locks).
  useEffect(() => {
    if (!isOpen || activeStep !== STEP_IDS.TRAVEL_WHEN || typeof setCurrentMonth !== 'function') {
      return;
    }
    const today = startOfDay(new Date());
    let anchor = today;

    if (tripType === TRIP_TYPES.RETURN && dateStart) {
      const departure =
        dateStart instanceof Date ? dateStart : new Date(dateStart);
      if (!Number.isNaN(departure.getTime())) {
        if (hasClickCalendar && !dateEnd) {
          // Return step: first selectable return day, not the departure month anchor.
          anchor = allowSameDayReturn
            ? startOfDay(departure)
            : addDays(startOfDay(departure), 1);
        } else if (!hasClickCalendar) {
          anchor = startOfDay(departure);
        }
      }
    } else if (dateStart) {
      const departure =
        dateStart instanceof Date ? dateStart : new Date(dateStart);
      if (!Number.isNaN(departure.getTime())) {
        anchor = startOfDay(departure);
      }
    }

    setCurrentMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
  }, [
    isOpen,
    activeStep,
    tripType,
    hasClickCalendar,
    dateStart,
    dateEnd,
    allowSameDayReturn,
    setCurrentMonth,
  ]);

  // The visual step order is not the numeric STEP_IDS order: the website flow
  // (bookingPreviewV2) is From → To → Dates → Guests, while the legacy flow is
  // From → To → Guests → Dates. "Back" must walk this order, not just decrement
  // the step id (which would jump from Dates straight to Guests).
  const stepOrder = useMemo(
    () =>
      bookingPreviewV2
        ? [STEP_IDS.FLYING_FROM, STEP_IDS.FLYING_TO, STEP_IDS.TRAVEL_WHEN, STEP_IDS.GUESTS]
        : [STEP_IDS.FLYING_FROM, STEP_IDS.FLYING_TO, STEP_IDS.GUESTS, STEP_IDS.TRAVEL_WHEN],
    [bookingPreviewV2],
  );

  const stepIndex = stepOrder.indexOf(activeStep);
  const canStepBack = stepIndex > 0;

  const stepBack = useCallback(() => {
    if (stepIndex <= 0) return;
    formik.setFieldValue('type', stepOrder[stepIndex - 1]);
  }, [stepIndex, stepOrder, formik]);

  const canContinueFromCalendar = useMemo(() => {
    if (tripType === TRIP_TYPES.RETURN) return Boolean(dateStart && dateEnd);
    return Boolean(dateStart);
  }, [tripType, dateStart, dateEnd]);

  const scrollToSearch = useCallback(() => {
    const btn = document.getElementById('search-flight-button');
    btn?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  }, []);

  const footer = useMemo(() => {
    if (activeStep === STEP_IDS.GUESTS) {
      if (bookingPreviewV2) {
        return {
          label: copy.buttons.done,
          disabled: false,
          onClick: () => {
            onClose?.();
            scrollToSearch();
          },
        };
      }
      return {
        label: copy.buttons.next,
        disabled: false,
        onClick: () => formik.setFieldValue('type', STEP_IDS.TRAVEL_WHEN),
      };
    }
    if (activeStep === STEP_IDS.TRAVEL_WHEN) {
      return {
        label: copy.buttons.continue,
        disabled: !canContinueFromCalendar,
        onClick: () => {
          // Multi-city advances to the next leg via calendar auto-open; just dismiss.
          if (isMultiCity) {
            onClose?.();
            scrollToSearch();
            return;
          }
          if (bookingPreviewV2) {
            formik.setFieldValue('type', STEP_IDS.GUESTS);
            return;
          }
          onClose?.();
          scrollToSearch();
        },
      };
    }
    return null;
  }, [
    activeStep,
    formik,
    onClose,
    canContinueFromCalendar,
    bookingPreviewV2,
    isMultiCity,
    scrollToSearch,
    copy.buttons,
  ]);

  const body = useMemo(() => {
    if (activeStep === STEP_IDS.FLYING_FROM) {
      return airportBodyByLeg[activeLegId]?.from ?? sourceDropdownContent ?? null;
    }
    if (activeStep === STEP_IDS.FLYING_TO) {
      return airportBodyByLeg[activeLegId]?.to ?? destinationDropdownContent ?? null;
    }
    if (activeStep === STEP_IDS.GUESTS) return renderGuests?.({ onClose }) ?? null;
    if (activeStep === STEP_IDS.TRAVEL_WHEN) return renderCalendar?.() ?? null;
    return null;
  }, [
    activeStep,
    activeLegId,
    airportBodyByLeg,
    sourceDropdownContent,
    destinationDropdownContent,
    renderGuests,
    onClose,
    renderCalendar,
  ]);

  return (
    <Transition appear show={Boolean(isOpen)} as={Fragment}>
      <Dialog
        as="div"
        className="block md:hidden relative"
        style={{ zIndex: SEARCH_NESTED_MODAL_Z_INDEX }}
        onClose={onClose}
      >
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-end justify-center" style={{ zIndex: SEARCH_NESTED_MODAL_Z_INDEX }}>
          <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-200" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transform transition ease-in-out duration-150" leaveFrom="translate-y-0" leaveTo="translate-y-full">
            <Dialog.Panel className="relative w-full h-full bg-white shadow-xl flex flex-col pointer-events-auto touch-manipulation" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="px-4 flex items-center justify-between h-14 shrink-0 shadow-md bg-[#F1F1F1]">
                {canStepBack ? (
                  <button type="button" className="text-[var(--Primary-1,#054E72)] min-h-[44px] min-w-[44px] inline-flex items-center justify-center touch-manipulation" onClick={stepBack} aria-label={copy.buttons.back}>
                    <BackCaret size={24} />
                  </button>
                ) : (
                  <span className="w-6" />
                )}

                <h2 className="text-base font-semibold not-italic text-[var(--Primary-1,#054E72)] mx-auto">
                  {modalTitle}
                </h2>

                <button type="button" onClick={onClose} className="text-[var(--Primary-1,#054E72)] min-h-[44px] min-w-[44px] inline-flex items-center justify-center touch-manipulation" aria-label={copy.buttons?.close ?? 'Close'}>
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col overscroll-contain">
                {isMultiCity && (isAirportStep || activeStep === STEP_IDS.TRAVEL_WHEN) ? (
                  <p className="mb-2 text-sm font-semibold text-[#1E1E1E]">
                    {typeof copy.flightInfo?.flightLeg === 'function'
                      ? copy.flightInfo.flightLeg(activeLegId)
                      : `Flight ${activeLegId}`}
                  </p>
                ) : null}
                {isAirportStep ? (
                  <MobileAirportStepHeader
                    activeStep={activeStep}
                    stepIds={STEP_IDS}
                    isRtl={isRtl}
                    flyingFromTitle={copy.stepTitles.flyingFrom}
                    flyingFromValue={
                      sourceCity || copy.flightInfo.departure
                    }
                    flyingToTitle={copy.stepTitles.flyingTo}
                    flyingToValue={
                      destinationCity ||
                      copy.flightInfo.destination ||
                      copy.airportSelector.fallbacks.arrivalCity
                    }
                  />
                ) : null}
                {body}
              </div>

              {footer && (
                <div className="flex flex-col justify-center items-center gap-3 px-4 py-6 border-t border-gray-200">
                  {activeStep === STEP_IDS.TRAVEL_WHEN && tripDurationLabel ? (
                    <p className="w-full text-start text-sm text-[#5F5F5C]">
                      {tripDurationLabel}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    disabled={footer.disabled}
                    onClick={footer.onClick}
                    className="flex w-full h-[56px] px-[10px] py-[10px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-secondary text-white font-semibold text-[16px] disabled:opacity-50 touch-manipulation"
                  >
                    {footer.label}
                  </button>
                  {activeStep === STEP_IDS.TRAVEL_WHEN && (
                    <button type="button" onClick={handleReset} className="text-primary-1 font-semibold text-[16px] min-h-[44px] touch-manipulation">
                      {copy.buttons.reset}
                    </button>
                  )}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MobModal;
