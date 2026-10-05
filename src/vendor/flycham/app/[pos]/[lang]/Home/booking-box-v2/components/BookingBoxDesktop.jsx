'use client';

import React from 'react';
import { Transition } from '@headlessui/react';
import TabNavigation from './TabNavigation';
import ManageTap from './ManageTap';
import ModalTitle from './widget/ModalTitle';
import TripTypeSelector from './TripTypeSelector';
import MilesToggle from './MilesToggle';
import FromToSelector from './FromToSelector';
import RecentSearchChip from './RecentSearchChip';
import InfoBoxes from './InfoBoxes';
import ModalFooter from './ModalFooter';
import DesktopPassengersBox from './DesktopPassengersBox';
import MultiCityDateField from './MultiCityDateField';
import {
  ACTIVE_TABS,
  TRIP_TYPES,
  NOOP,
  getConfigForLeg,
  MIN_MULTI_CITY_LEGS,
} from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import { useBookingBoxForm } from '../context/BookingBoxFormContext';
import { useBookingBoxDropdown } from '../context/BookingBoxDropdownContext';
import { useBookingBoxGuests } from '../context/BookingBoxGuestsContext';
import { useBookingBoxCalendar } from '../context/BookingBoxCalendarContext';
import { useBookingBoxAirportRenderers } from '../context/BookingBoxAirportRenderersContext';
import { getLeg } from '../utils/legsUtils';
import { useDesktopMultiCity } from '../hooks/useDesktopMultiCity';
import { buildPassengerSummary } from '../utils/guestsUtils';
import { Eraser } from '@phosphor-icons/react';
import useIsMobile from '@/hooks/useIsMobile';
import mcStyles from './multiCityBookingLayout.module.css';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';

const BookingBoxDesktop = () => {
  const copy = useBookingBoxContentOptional();
  const {
    activeTab,
    onCloseMidifySearch,
    formik,
    handleTripTypeChange,
    handleSwitch,
    handleSubmit,
    cId,
    submitted,
    tripType,
    isMobile,
    searchHref,
    prefetchedSchedules,
    airPorts,
    isFlightSchedulePage = false,
    bookingPreviewV2 = false,
    mcDropdownResetToken = 0,
  } = useBookingBoxForm();

  const {
    openAirPortsByLeg,
    setOpenAirPortsForLeg,
    openDropdown,
    setOpenDropdown,
    openDateRowId,
    setOpenDateRowId,
    handleResetToFirstStep,
    clearExtraLegDropdowns,
  } = useBookingBoxDropdown();

  const { guestsState, renderGuests } = useBookingBoxGuests();

  const {
    displaySelection,
    handleReset,
    setCurrentMonth,
    setActiveMultiCityCalendarLeg,
    multiCityDatePicked,
    renderCalendar,
  } = useBookingBoxCalendar();

  const {
    sourceDropdownContent,
    destinationDropdownContent,
    sourceDropdownContent2,
    destinationDropdownContent2,
    sourceDropdownContent3,
    destinationDropdownContent3,
    getLegProps,
  } = useBookingBoxAirportRenderers();
  const showTabNavigation = onCloseMidifySearch === NOOP;
  const mcUseStackedLayout = useIsMobile(1279);
  const {
    isMultiCity,
    handleClearAllFlights,
    suppressAutoOpenPassengers,
    setSuppressAutoOpenPassengers,
    seedDestinations,
  } = useDesktopMultiCity({
    formik,
    multiCityDatePicked,
    setOpenDateRowId,
    setOpenDropdown,
    setActiveMultiCityCalendarLeg,
    setOpenAirPortsForLeg,
    clearExtraLegDropdowns,
    mcDropdownResetToken,
  });

  const openDateRowRef = React.useRef(null);

  /** Open one popover at a time — calendar vs airport lists never stack. */
  const openMcDateCalendar = React.useCallback(
    (legId) => {
      clearExtraLegDropdowns?.();
      setOpenDropdown(null);
      setActiveMultiCityCalendarLeg?.(legId);
      setOpenDateRowId((prev) => (prev === legId ? null : legId));
    },
    [
      clearExtraLegDropdowns,
      setOpenDropdown,
      setActiveMultiCityCalendarLeg,
      setOpenDateRowId,
    ],
  );

  /**
   * User-driven airport open/close. Opening closes calendar/guests/other legs;
   * closing must NOT touch date — FromToSelector click-outside fires on calendar
   * mousedown, and auto-open relies on date staying open.
   */
  const setMcAirPortsForLeg = React.useCallback(
    (legId, next) => {
      const prevVal = openAirPortsByLeg[legId] ?? null;
      const nextVal = typeof next === 'function' ? next(prevVal) : next;

      if (nextVal != null) {
        clearExtraLegDropdowns?.();
        setOpenDateRowId(null);
        setOpenDropdown(null);
        setOpenAirPortsForLeg(legId, nextVal);
        return;
      }

      setOpenAirPortsForLeg(legId, null);
    },
    [
      openAirPortsByLeg,
      clearExtraLegDropdowns,
      setOpenDateRowId,
      setOpenDropdown,
      setOpenAirPortsForLeg,
    ],
  );

  const firstLeg = getLeg(formik.values, 0);
  const isLeg1Complete = Boolean(
    firstLeg.source && firstLeg.destination && firstLeg.dateStart,
  );
  const hasBothAirports = Boolean(firstLeg.source && firstLeg.destination);
  const allMcLegsComplete = Array.from({ length: MIN_MULTI_CITY_LEGS }, (_, i) => {
    const leg = getLeg(formik.values, i);
    return Boolean(leg.source && leg.destination && leg.dateStart);
  }).every(Boolean);

  const handleMcAirportRemove = React.useCallback(
    (legIndex) => {
      setOpenDateRowId(null);
      setOpenDropdown((prev) => (prev === 'passengers' ? null : prev));
      setActiveMultiCityCalendarLeg?.(legIndex + 1);
      seedDestinations();
    },
    [setOpenDateRowId, setOpenDropdown, setActiveMultiCityCalendarLeg, seedDestinations],
  );
  // One-way / round-trip always show date + passengers row below From/To
  const containerHeightClass = '';

  const passengerSummary = React.useMemo(
    () => buildPassengerSummary(formik.values, guestsState, copy),
    [formik.values, guestsState, copy],
  );

  const legPropsById = React.useMemo(() => ({
    1: {
      openDropdown: openAirPortsByLeg[1] ?? null,
      setOpenDropdown: (v) => setMcAirPortsForLeg(1, v),
      sourceDropdownContent,
      destinationDropdownContent,
    },
    2: {
      openDropdown: openAirPortsByLeg[2] ?? null,
      setOpenDropdown: (v) => setMcAirPortsForLeg(2, v),
      sourceDropdownContent: sourceDropdownContent2,
      destinationDropdownContent: destinationDropdownContent2,
    },
    3: {
      openDropdown: openAirPortsByLeg[3] ?? null,
      setOpenDropdown: (v) => setMcAirPortsForLeg(3, v),
      sourceDropdownContent: sourceDropdownContent3,
      destinationDropdownContent: destinationDropdownContent3,
    },
  }), [
    openAirPortsByLeg,
    setMcAirPortsForLeg,
    sourceDropdownContent,
    destinationDropdownContent,
    sourceDropdownContent2,
    destinationDropdownContent2,
    sourceDropdownContent3,
    destinationDropdownContent3,
  ]);

  return (
    <div
      id="search-widget"
      className={`bg-white rounded-2xl py-3 w-full relative z-20 overflow-visible ${containerHeightClass} px-6`}
    >
      {showTabNavigation && <TabNavigation />}
      {activeTab === ACTIVE_TABS.MANAGE && <ManageTap />}
      {activeTab === ACTIVE_TABS.BOOK && (
        <div>
          {!showTabNavigation && <ModalTitle />}

        <div className="flex items-center justify-between mb-4">
          <TripTypeSelector />
          {/* {!isFlightSchedulePage && <MilesToggle />} */}
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
            openDropdown={openAirPortsByLeg[1] ?? null}
            setOpenDropdown={(v) => setMcAirPortsForLeg(1, v)}
            sourceDropdownContent={sourceDropdownContent}
            destinationDropdownContent={destinationDropdownContent}
            destinationDisabled={bookingPreviewV2 && !firstLeg.source}
          />
          </>
        )}

        {isMultiCity && (
          <div className={mcStyles.mcSection}>
            {Array.from({ length: MIN_MULTI_CITY_LEGS }, (_, idx) => {
              const id = idx + 1;
              const legConfig = getConfigForLeg(id);
              const legIndex = legConfig.id - 1;
              const legValues = getLeg(formik.values, legIndex);
              const isSecondLeg = legIndex === 1;
              const legRowDisabled = isSecondLeg && !isLeg1Complete;
              const hasLegAirports = Boolean(legValues.source && legValues.destination);
              const setFieldValueForLeg = (field, value) => {
                if (field === 'source' || field === 'destination' || field === 'dateStart') {
                  if (field === 'source' && !value) {
                    formik.setFieldValue(`legs.${legIndex}.destination`, '');
                  }
                  formik.setFieldValue(`legs.${legIndex}.${field}`, value);
                } else {
                  formik.setFieldValue(field, value);
                }
              };
              const rowProps = legConfig.id <= 3 ? legPropsById[legConfig.id] : getLegProps?.(legConfig.id);
              return (
                <React.Fragment key={legConfig.id}>
                  <div
                    className={`${mcStyles.mcLegRow} ${
                      openDateRowId === legConfig.id
                        ? 'z-[220]'
                        : rowProps?.openDropdown
                          ? 'z-[200]'
                          : 'z-0'
                    }`}
                    ref={(el) => {
                      if (openDateRowId === legConfig.id) openDateRowRef.current = el;
                    }}
                  >
                    <div className={mcStyles.mcLegFields}>
                      <div
                        className={`${mcStyles.mcLegFromTo} ${
                          rowProps?.openDropdown ? mcStyles.mcLegFromToOpen : ''
                        }`}
                      >
                        {rowProps && (
                          <FromToSelector
                            formikValues={{ ...formik.values, source: legValues.source, destination: legValues.destination }}
                            setFieldValue={setFieldValueForLeg}
                            sourceField="source"
                            destinationField="destination"
                            fromDropdownKey={legConfig.fromDropdownKey}
                            toDropdownKey={legConfig.toDropdownKey}
                            layout={mcUseStackedLayout ? 'stacked' : 'row'}
                            onSwitch={() => {
                              formik.setFieldValue(`legs.${legIndex}.source`, legValues.destination || '');
                              formik.setFieldValue(`legs.${legIndex}.destination`, legValues.source || '');
                            }}
                            openDropdown={rowProps.openDropdown}
                            setOpenDropdown={rowProps.setOpenDropdown}
                            sourceDropdownContent={rowProps.sourceDropdownContent}
                            destinationDropdownContent={rowProps.destinationDropdownContent}
                            sourceDisabled={legRowDisabled}
                            destinationDisabled={
                              legRowDisabled || (isSecondLeg && !legValues.source)
                            }
                            onAfterRemoveSource={() => handleMcAirportRemove(legIndex)}
                            onAfterRemoveDestination={() => handleMcAirportRemove(legIndex)}
                          />
                        )}
                      </div>
                      <div
                        className={`${mcStyles.mcDateField} ${
                          openDateRowId === legConfig.id ? mcStyles.mcDateFieldOpen : ''
                        }`}
                      >
                        <MultiCityDateField
                          value={legValues.dateStart}
                          disabled={legRowDisabled || !hasLegAirports}
                          onToggle={() => {
                            if (legRowDisabled || !hasLegAirports) return;
                            openMcDateCalendar(legConfig.id);
                          }}
                        />
                      </div>
                    </div>

                    {/* Full leg-row width — same dual-month panel shape as one-way / return */}
                    <Transition
                      show={openDateRowId === legConfig.id}
                      as={React.Fragment}
                      enter="ease-out duration-200"
                      enterFrom="opacity-0 -translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <div className={`booking-calendar-popover ${mcStyles.mcCalendarPopover}`}>
                        {renderCalendar?.()}
                      </div>
                    </Transition>
                  </div>
                  {idx < MIN_MULTI_CITY_LEGS - 1 && (
                    <div
                      className="mt-3 h-px w-full flex-shrink-0"
                      style={{
                        background: 'repeating-linear-gradient(90deg, #E0E0E0 0px, #E0E0E0 6px, transparent 6px, transparent 12px)',
                      }}
                      aria-hidden
                    />
                  )}
                </React.Fragment>
              );
            })}
{/* 
            <div className={`flex items-center justify-end pt-2 ${mcStyles.mcSection}`}>
              <button
                type="button"
                onClick={handleClearAllFlights}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-1 hover:underline"
              >
                <Eraser size={16} className="flex-shrink-0" />
                Clear all flights
              </button>
            </div> */}

            <div
              className={`${mcStyles.mcPassengersWrap} ${
                allMcLegsComplete && openDropdown === 'passengers'
                  ? mcStyles.mcPassengersWrapOpen
                  : ''
              }`}
            >
              <DesktopPassengersBox
                summary={passengerSummary}
                containerClassName={mcStyles.mcPassengersBox}
                dropdownClassName={`booking-guests-popover ${mcStyles.mcPassengersDropdown}`}
                disabled={!allMcLegsComplete}
                isOpen={allMcLegsComplete && openDropdown === 'passengers'}
                onToggle={() => {
                  clearExtraLegDropdowns?.();
                  setOpenDateRowId(null);
                  setOpenDropdown((prev) => {
                    const next = prev === 'passengers' ? null : 'passengers';
                    if (prev === 'passengers' && next === null) {
                      setSuppressAutoOpenPassengers(true);
                    }
                    return next;
                  });
                }}
                renderGuests={renderGuests}
              />
            </div>
          </div>
        )}

          {!isMultiCity && hasBothAirports && <InfoBoxes />}

          {!isMultiCity && showTabNavigation && !hasBothAirports && (
            <RecentSearchChip />
          )}

          {(hasBothAirports || isMultiCity) && (
            isMultiCity ? (
              <div className={mcStyles.mcFooterWrap}>
                <ModalFooter />
              </div>
            ) : (
              <ModalFooter />
            )
          )}
        </div>
      )}

    </div>
  );
};

export default React.memo(BookingBoxDesktop);
