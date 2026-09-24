'use client';

import React from 'react';

import TabNavigation from './TabNavigation';
import ManageTap from './ManageTap';
import ModalTitle from './widget/ModalTitle';
import TripTypeSelector from './TripTypeSelector';
import FromToSelector from './FromToSelector';
import RecentSearchChip from './RecentSearchChip';
import InfoBoxes from './InfoBoxes';
import SearchFlightsButton from './SearchFlightsButton';
import DesktopPassengersBox from './DesktopPassengersBox';
import MultiCityDateField from './MultiCityDateField';
import {
  ACTIVE_TABS,
  MIN_MULTI_CITY_LEGS,
  TRIP_TYPES,
  STEP_IDS,
} from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { buildPassengerSummary } from '../utils/guestsUtils';
import { useBookingBoxForm } from '../context/BookingBoxFormContext';
import { useBookingBoxDropdown } from '../context/BookingBoxDropdownContext';
import { useBookingBoxCalendar } from '../context/BookingBoxCalendarContext';
import { useBookingBoxGuests } from '../context/BookingBoxGuestsContext';
import { useBookingBoxModalsContext } from '../context/BookingBoxModalsContext';
import { getFirstLeg, getLeg } from '../utils/legsUtils';
import { useDesktopMultiCity } from '../hooks/useDesktopMultiCity';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import mcStyles from './multiCityBookingLayout.module.css';

const BookingBoxMobile = () => {
  const {
    activeTab,
    onCloseMidifySearch,
    formik,
    handleSwitch,
    isFlightSchedulePage,
    bookingPreviewV2 = false,
    mcDropdownResetToken = 0,
  } = useBookingBoxForm();

  const {
    setOpenAirPortsForLeg,
    clearExtraLegDropdowns,
    setOpenDateRowId,
    openDropdown,
    setOpenDropdown,
  } = useBookingBoxDropdown();
  const {
    setActiveMultiCityCalendarLeg,
    multiCityDatePicked,
  } = useBookingBoxCalendar();
  const { guestsState, renderGuests } = useBookingBoxGuests();
  const { openMobileModal } = useBookingBoxModalsContext();
  const copy = useBookingBoxContentOptional();

  /** One-way / round-trip: open full-screen city picker (MobModal), not inline From/To dropdowns */
  const openCitiesModalForSource = React.useCallback(() => {
    clearExtraLegDropdowns?.();
    setOpenDropdown?.(null);
    setOpenAirPortsForLeg?.(1, null);
    formik.setFieldValue('type', STEP_IDS.FLYING_FROM);
    openMobileModal?.();
  }, [
    formik,
    clearExtraLegDropdowns,
    setOpenDropdown,
    setOpenAirPortsForLeg,
    openMobileModal,
  ]);

  const openCitiesModalForDestination = React.useCallback(() => {
    clearExtraLegDropdowns?.();
    setOpenDropdown?.(null);
    setOpenAirPortsForLeg?.(1, null);
    formik.setFieldValue('type', STEP_IDS.FLYING_TO);
    openMobileModal?.();
  }, [
    formik,
    clearExtraLegDropdowns,
    setOpenDropdown,
    setOpenAirPortsForLeg,
    openMobileModal,
  ]);

  /** Multi-city: same full-screen MobModal, scoped to the active leg. */
  const openMcCitiesModal = React.useCallback(
    (legId, step) => {
      clearExtraLegDropdowns?.();
      setOpenDropdown?.(null);
      setOpenDateRowId?.(null);
      setActiveMultiCityCalendarLeg?.(legId);
      formik.setFieldValue('type', step);
      openMobileModal?.();
    },
    [
      formik,
      clearExtraLegDropdowns,
      setOpenDropdown,
      setOpenDateRowId,
      setActiveMultiCityCalendarLeg,
      openMobileModal,
    ],
  );

  const openMcDatesModal = React.useCallback(
    (legId) => {
      clearExtraLegDropdowns?.();
      setOpenDropdown?.(null);
      setOpenDateRowId?.(legId);
      setActiveMultiCityCalendarLeg?.(legId);
      formik.setFieldValue('type', STEP_IDS.TRAVEL_WHEN);
      openMobileModal?.();
    },
    [
      formik,
      clearExtraLegDropdowns,
      setOpenDropdown,
      setOpenDateRowId,
      setActiveMultiCityCalendarLeg,
      openMobileModal,
    ],
  );

  const openMcLegAirportsModal = React.useCallback(
    (legId) => openMcCitiesModal(legId, STEP_IDS.FLYING_FROM),
    [openMcCitiesModal],
  );

  const openMcPassengersModal = React.useCallback(() => {
    clearExtraLegDropdowns?.();
    setOpenDropdown?.(null);
    setOpenDateRowId?.(null);
    formik.setFieldValue('type', STEP_IDS.GUESTS);
    openMobileModal?.();
  }, [
    formik,
    clearExtraLegDropdowns,
    setOpenDropdown,
    setOpenDateRowId,
    openMobileModal,
  ]);

  const firstLeg = getFirstLeg(formik?.values ?? {});
  const isMultiCity = (formik?.values?.tripType ?? TRIP_TYPES.RETURN) === TRIP_TYPES.MULTICITY;
  const isLeg1Complete = Boolean(
    firstLeg.source && firstLeg.destination && firstLeg.dateStart,
  );
  const hasBothAirports = Boolean(firstLeg.source && firstLeg.destination);
  const allMcLegsComplete = Array.from({ length: MIN_MULTI_CITY_LEGS }, (_, i) => {
    const leg = getLeg(formik.values, i);
    return Boolean(leg.source && leg.destination && leg.dateStart);
  }).every(Boolean);

  const { seedDestinations } = useDesktopMultiCity({
    formik,
    multiCityDatePicked,
    setOpenDateRowId,
    setOpenDropdown,
    setActiveMultiCityCalendarLeg,
    setOpenAirPortsForLeg,
    clearExtraLegDropdowns,
    mcDropdownResetToken,
    onOpenLegAirports: openMcLegAirportsModal,
    onOpenPassengers: openMcPassengersModal,
  });

  const handleMcAirportRemove = React.useCallback(
    (legIndex) => {
      setOpenDateRowId(null);
      setOpenDropdown?.((prev) => (prev === 'passengers' ? null : prev));
      setActiveMultiCityCalendarLeg?.(legIndex + 1);
      seedDestinations();
    },
    [setOpenDateRowId, setOpenDropdown, setActiveMultiCityCalendarLeg, seedDestinations],
  );

  const defaultNoOp = () => { };
  const showTabNavigation = !onCloseMidifySearch || onCloseMidifySearch.toString() === defaultNoOp.toString();

  const passengerSummary = React.useMemo(
    () => buildPassengerSummary(formik.values, guestsState, copy),
    [formik.values, guestsState, copy],
  );

  return (
    <div
      id="search-widget"
      className={`${!showTabNavigation && 'rounded-sm bg-white p-6 h-[100vh]'} w-full`}
    >
      {showTabNavigation && <TabNavigation />}
      {activeTab === ACTIVE_TABS.MANAGE && <ManageTap />}
      {activeTab === ACTIVE_TABS.BOOK && (
        <>
          {!showTabNavigation && <ModalTitle />}
          <div className="mb-4">
            <TripTypeSelector variant="radio" />
          </div>

          {!isMultiCity && (
            <>
              <FromToSelector
                formikValues={{ ...formik.values, source: firstLeg.source, destination: firstLeg.destination }}
                setFieldValue={(field, value) => {
                  if (field === 'source' || field === 'destination') {
                    formik.setFieldValue(`legs.0.${field}`, value);
                  } else {
                    formik.setFieldValue(field, value);
                  }
                }}
                onSwitch={handleSwitch}
                onSourceClick={openCitiesModalForSource}
                onDestinationClick={openCitiesModalForDestination}
                destinationDisabled={bookingPreviewV2 && !firstLeg.source}
              />
              {hasBothAirports && <InfoBoxes />}
              {showTabNavigation && !hasBothAirports && (
                <RecentSearchChip />
              )}
            </>
          )}

          {isMultiCity && (
            <div className={mcStyles.mcSection}>
              {Array.from({ length: MIN_MULTI_CITY_LEGS }, (_, idx) => {
                const legId = idx + 1;
                const legIndex = legId - 1;
                const legValues = getLeg(formik.values, legIndex);
                const isSecondLeg = legIndex === 1;
                const legRowDisabled = isSecondLeg && !isLeg1Complete;
                const hasLegAirports = Boolean(legValues.source && legValues.destination);

                return (
                  <div key={legId} className="rounded-xl bg-white">
                    <div className="text-sm font-semibold text-[#1E1E1E] mb-2">
                      {typeof copy.flightInfo?.flightLeg === 'function'
                        ? copy.flightInfo.flightLeg(legId)
                        : `Flight ${legId}`}
                    </div>

                    <FromToSelector
                      formikValues={{
                        ...formik.values,
                        source: legValues.source,
                        destination: legValues.destination,
                      }}
                      setFieldValue={(field, value) => {
                        if (field === 'source' || field === 'destination' || field === 'dateStart') {
                          if (field === 'source' && !value) {
                            formik.setFieldValue(`legs.${legIndex}.destination`, '');
                          }
                          formik.setFieldValue(`legs.${legIndex}.${field}`, value);
                        } else {
                          formik.setFieldValue(field, value);
                        }
                      }}
                      sourceField="source"
                      destinationField="destination"
                      layout="stacked"
                      onSwitch={() => {
                        formik.setFieldValue(`legs.${legIndex}.source`, legValues.destination || '');
                        formik.setFieldValue(`legs.${legIndex}.destination`, legValues.source || '');
                      }}
                      onSourceClick={() => openMcCitiesModal(legId, STEP_IDS.FLYING_FROM)}
                      onDestinationClick={() => openMcCitiesModal(legId, STEP_IDS.FLYING_TO)}
                      sourceDisabled={legRowDisabled}
                      destinationDisabled={
                        legRowDisabled || (isSecondLeg && !legValues.source)
                      }
                      onAfterRemoveSource={() => handleMcAirportRemove(legIndex)}
                      onAfterRemoveDestination={() => handleMcAirportRemove(legIndex)}
                    />

                    <div className={`${mcStyles.mcDateField} mt-2`}>
                      <MultiCityDateField
                        value={legValues.dateStart}
                        disabled={legRowDisabled || !hasLegAirports}
                        onToggle={() => {
                          if (legRowDisabled || !hasLegAirports) return;
                          openMcDatesModal(legId);
                        }}
                      />
                    </div>

                    {idx < MIN_MULTI_CITY_LEGS - 1 && (
                      <div
                        className="mt-4 h-px w-full"
                        style={{
                          background:
                            'repeating-linear-gradient(90deg, #E0E0E0 0px, #E0E0E0 6px, transparent 6px, transparent 12px)',
                        }}
                        aria-hidden
                      />
                    )}
                  </div>
                );
              })}

              <DesktopPassengersBox
                summary={passengerSummary}
                containerClassName={mcStyles.mcPassengersBox}
                dropdownClassName={`booking-guests-popover ${mcStyles.mcPassengersDropdown}`}
                disabled={!allMcLegsComplete}
                isOpen={allMcLegsComplete && openDropdown === 'passengers'}
                onToggle={() => {
                  if (!allMcLegsComplete) return;
                  if (openDropdown === 'passengers') {
                    setOpenDropdown?.(null);
                    return;
                  }
                  openMcPassengersModal();
                }}
                renderGuests={renderGuests}
              />
            </div>
          )}

          {isMultiCity ? (
            <div className={mcStyles.mcFooterWrap}>
              <SearchFlightsButton />
            </div>
          ) : (
            <SearchFlightsButton />
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(BookingBoxMobile);
