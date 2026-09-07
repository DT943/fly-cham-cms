'use client';

import React, { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Dates from '../components/widget/Dates/Dates';
import AirportDropdownPanel from '../components/AirportDropdownPanel';
import {
  AIRPORT_SELECTOR,
  AIRPORT_TYPES,
  TRIP_TYPES,
} from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import getIataCodeById from '../components/widget/Dates/utils/getIataCodeById';
import { startOfDay } from 'date-fns';
import { getLeg } from '../utils/legsUtils';
import { getBookingBoxContent } from '@/app/[pos]/[lang]/Home/booking-box/content';

/**
 * Encapsulates all complex render logic for:
 * - Calendar rendering (normal vs multi‑city legs)
 * - Airport dropdown rendering for leg 1, 2, 3, and 4+
 *
 * BookingBox passes state + callbacks in, and receives memoized
 * renderer functions / JSX fragments back.
 */
export const useBookingBoxRenderers = ({
  // Calendar inputs
  tripType,
  activeMultiCityCalendarLeg,
  openDateRowId = null,
  formik,
  minMonth,
  setMinMonth,
  currentMonth,
  setCurrentMonth,
  handleCalendarSelect,
  handleReset,
  displaySelection,
  scheduleStatusData,
  hasClickCalendarFlag,
  prefetchedSchedules,
  airPorts,
  setMultiCityDatePicked,
  allowSameDayReturn = false,
  isModifySearch = false,
  requestOpenDatesCalendar,
  isSchedulePending = false,
  scheduleMatchesActiveLeg = true,

  // Airport dropdown inputs
  airportItems,
  isMobile,
  sliderRef = null, // optional; was used by legacy step slider, now no-op in dropdown flow
  setOpenAirPortsForLeg,
  setScheduleDataSafe,
  sourceSearch,
  destinationSearch,
  setSourceSearch,
  setDestinationSearch,
  searchByLeg,
  setSearchByLeg,
  handleSearch,
  handleSearchForLeg,
  getCitiesArray,
  onClose,
  inputRef,
  openAirPortsByLeg,
  setOpenDropdown,
  setOpenDateRowId,
  setActiveMultiCityCalendarLeg,
  hideNewAirportUi = false,
  searchV2AirportUi = false,
  skipManifestScheduleFilter = false,
  mcRouteApiForLeg2Plus = false,
}) => {
  const { lang } = useParams();
  const copy = useMemo(() => getBookingBoxContent(lang), [lang]);
  const renderCalendar = useCallback(() => {
    if (tripType === TRIP_TYPES.MULTICITY) {
      const leg = openDateRowId || activeMultiCityCalendarLeg || 1;
      const legIndex = leg - 1;
      const legValues = getLeg(formik.values, legIndex);

      const mappedFormik = {
        ...formik,
        values: {
          ...formik.values,
          tripType: TRIP_TYPES.ONEWAY,
          source: legValues.source,
          destination: legValues.destination,
          dateStart: legValues.dateStart,
          dateEnd: '',
          hasClickCalendar: false,
        },
        setFieldValue: (field, value) => {
          if (field === 'dateStart') {
            formik.setFieldValue(`legs.${legIndex}.dateStart`, value);
            return;
          }
          formik.setFieldValue(`legs.${legIndex}.${field}`, value);
        },
      };

      const originIata = getIataCodeById({ id: legValues.source, airPorts });
      const destIata = getIataCodeById({ id: legValues.destination, airPorts });
      const useRouteSchedule =
        (skipManifestScheduleFilter || (mcRouteApiForLeg2Plus && legIndex >= 1)) &&
        originIata &&
        destIata;
      const statusDataForLeg = useRouteSchedule
        ? scheduleMatchesActiveLeg
          ? scheduleStatusData
          : null
        : Array.isArray(prefetchedSchedules) && originIata && destIata
          ? prefetchedSchedules.filter((item) => {
              const itemOrigin = (item?.origin || '').toUpperCase();
              const itemDest = (item?.destination || '').toUpperCase();
              return (
                itemOrigin === originIata.toUpperCase() &&
                itemDest === destIata.toUpperCase()
              );
            })
          : null;

      const selectedForLeg = legValues.dateStart
        ? legValues.dateStart instanceof Date
          ? legValues.dateStart
          : new Date(legValues.dateStart)
        : undefined;

      let minSelectableDayOverride = null;
      if (legIndex > 0) {
        const prevLegDate = getLeg(formik.values, legIndex - 1)?.dateStart;
        if (prevLegDate) {
          const prevDay = startOfDay(
            prevLegDate instanceof Date ? prevLegDate : new Date(prevLegDate),
          );
          const today = startOfDay(new Date());
          minSelectableDayOverride = prevDay > today ? prevDay : today;
        }
      }

      return (
        <Dates
          formik={mappedFormik}
          selected={selectedForLeg}
          minMonth={minMonth}
          setMinMonth={setMinMonth}
          setCurrentMonth={setCurrentMonth}
          currentMonth={currentMonth}
          handleDateSelect={(value) => {
            mappedFormik.setFieldValue('dateStart', value);
            setMultiCityDatePicked((prev) => ({
              leg,
              nonce: (prev?.nonce || 0) + 1,
            }));
          }}
          handleReset={() => {
            // Clear only this leg's date — never other multi-city flights.
            formik.setFieldValue(`legs.${legIndex}.dateStart`, null);
          }}
          statusData={statusDataForLeg}
          hasClickCalendar={false}
          isSchedulePending={
            useRouteSchedule ? isSchedulePending || !scheduleMatchesActiveLeg : false
          }
          scheduleMatchesActiveLeg={useRouteSchedule ? scheduleMatchesActiveLeg : true}
          enableKeyboardNavigation={searchV2AirportUi}
          minSelectableDayOverride={minSelectableDayOverride}
          isMultiCityLeg
        />
      );
    }

    return (
      <Dates
        formik={formik}
        selected={displaySelection}
        minMonth={minMonth}
        setMinMonth={setMinMonth}
        setCurrentMonth={setCurrentMonth}
        currentMonth={currentMonth}
        handleDateSelect={handleCalendarSelect}
        handleReset={handleReset}
        statusData={scheduleStatusData}
        hasClickCalendar={hasClickCalendarFlag}
        allowSameDayReturn={allowSameDayReturn}
        isModifySearch={isModifySearch}
        isSchedulePending={isSchedulePending}
        scheduleMatchesActiveLeg={scheduleMatchesActiveLeg}
        enableKeyboardNavigation={searchV2AirportUi}
      />
    );
  }, [
    tripType,
    activeMultiCityCalendarLeg,
    openDateRowId,
    formik,
    minMonth,
    setMinMonth,
    setCurrentMonth,
    currentMonth,
    handleCalendarSelect,
    handleReset,
    displaySelection,
    scheduleStatusData,
    hasClickCalendarFlag,
    prefetchedSchedules,
    airPorts,
    setMultiCityDatePicked,
    allowSameDayReturn,
    isModifySearch,
    isSchedulePending,
    scheduleMatchesActiveLeg,
    searchV2AirportUi,
    skipManifestScheduleFilter,
    mcRouteApiForLeg2Plus,
  ]);

  const renderAirportDropdown = useCallback(
    ({
      searchValue,
      placeholder,
      fieldType,
      setSearchValue,
      valuesOverride,
      setFieldValueOverride,
      handleSearchOverride,
      setOpenAirPortsDropdownOverride,
      destinationDropdownKey,
      onDestinationSelected,
      isOpen = false,
      getCitiesArrayOverride = null,
      trackClarityAirportSelection = false,
    }) => (
      <AirportDropdownPanel
        isOpen={isOpen}
        searchValue={searchValue}
        placeholder={placeholder}
        fieldType={fieldType}
        setSearchValue={setSearchValue}
        valuesOverride={valuesOverride || formik.values}
        setFieldValueOverride={setFieldValueOverride || formik.setFieldValue}
        handleSearchOverride={handleSearchOverride}
        setOpenAirPortsDropdownOverride={
          setOpenAirPortsDropdownOverride ||
          ((v) => setOpenAirPortsForLeg(1, v))
        }
        destinationDropdownKey={destinationDropdownKey}
        onDestinationSelected={onDestinationSelected}
        getCitiesArray={getCitiesArrayOverride || getCitiesArray}
        isMobile={isMobile}
        sliderRef={sliderRef}
        handleSearch={handleSearch}
        airportItems={airportItems}
        prefetchedSchedules={prefetchedSchedules}
        onScheduleDataChange={setScheduleDataSafe}
        hideNewAirportUi={hideNewAirportUi}
        searchV2AirportUi={searchV2AirportUi}
        skipManifestScheduleFilter={skipManifestScheduleFilter}
        trackClarityAirportSelection={trackClarityAirportSelection}
      />
    ),
    [
      handleSearch,
      formik.values,
      formik.setFieldValue,
      airportItems,
      getCitiesArray,
      isMobile,
      sliderRef,
      setOpenAirPortsForLeg,
      prefetchedSchedules,
      setScheduleDataSafe,
      hideNewAirportUi,
      searchV2AirportUi,
      skipManifestScheduleFilter,
    ],
  );

  const leg1ValuesAdapter = useMemo(
    () => ({
      ...formik.values,
      ...getLeg(formik.values, 0),
    }),
    [formik.values],
  );

  const setFieldValueForLeg = useCallback(
    (legIndex, field, value) => {
      if (field === 'source' || field === 'destination' || field === 'dateStart') {
        formik.setFieldValue(`legs.${legIndex}.${field}`, value);
        if (legIndex === 1 && field === 'source') {
          formik.setFieldValue('legs.1.destination', '');
        }
        return;
      }
      formik.setFieldValue(field, value);
    },
    [formik],
  );

  const getCitiesArrayLeg2 = useCallback(
    (type, iataSourceCode, search) =>
      getCitiesArray(type, iataSourceCode, search, {
        multiCityLegIndex: 1,
        tripType: TRIP_TYPES.MULTICITY,
        formikValues: formik.values,
      }),
    [getCitiesArray, formik.values],
  );

  const sourceDropdownContent = useMemo(
    () =>
      renderAirportDropdown({
        searchValue: sourceSearch,
        placeholder: copy.placeholders.searchAirport,
        fieldType: AIRPORT_TYPES.SOURCE,
        setSearchValue: setSourceSearch,
        valuesOverride: leg1ValuesAdapter,
        setFieldValueOverride: (field, value) => setFieldValueForLeg(0, field, value),
        isOpen: isMobile || openAirPortsByLeg?.[1] === AIRPORT_SELECTOR.FROM,
        trackClarityAirportSelection: true,
      }),
    [renderAirportDropdown, sourceSearch, setSourceSearch, leg1ValuesAdapter, setFieldValueForLeg, openAirPortsByLeg, isMobile, copy],
  );

  const destinationDropdownContent = useMemo(
    () =>
      renderAirportDropdown({
        searchValue: destinationSearch,
        placeholder: copy.placeholders.destination,
        fieldType: AIRPORT_TYPES.DESTINATION,
        setSearchValue: setDestinationSearch,
        valuesOverride: leg1ValuesAdapter,
        setFieldValueOverride: (field, value) => setFieldValueForLeg(0, field, value),
        isOpen: isMobile || openAirPortsByLeg?.[1] === AIRPORT_SELECTOR.TO,
        onDestinationSelected: () => {
          if (tripType === TRIP_TYPES.MULTICITY) {
            setActiveMultiCityCalendarLeg?.(1);
            setOpenAirPortsForLeg?.(1, null);
            setOpenDropdown?.(null);
            if (typeof requestOpenDatesCalendar === 'function') {
              requestOpenDatesCalendar({ mobile: isMobile });
            }
            setOpenDateRowId?.(1);
            return;
          }
          if (typeof requestOpenDatesCalendar === 'function') {
            requestOpenDatesCalendar({ mobile: isMobile });
            return;
          }
          if (typeof setOpenDropdown === 'function') setOpenDropdown('departure');
        },
        trackClarityAirportSelection: true,
      }),
    [renderAirportDropdown, destinationSearch, setDestinationSearch, leg1ValuesAdapter, setFieldValueForLeg, setOpenDropdown, setOpenDateRowId, setActiveMultiCityCalendarLeg, setOpenAirPortsForLeg, requestOpenDatesCalendar, tripType, openAirPortsByLeg, isMobile, copy],
  );

  const leg2ValuesAdapter = useMemo(
    () => ({
      ...formik.values,
      ...getLeg(formik.values, 1),
    }),
    [formik.values],
  );
  const leg3ValuesAdapter = useMemo(
    () => ({
      ...formik.values,
      ...getLeg(formik.values, 2),
    }),
    [formik.values],
  );

  const sourceDropdownContent2 = useMemo(
    () =>
      renderAirportDropdown({
        searchValue: searchByLeg[2]?.source ?? '',
        placeholder: copy.placeholders.searchAirport,
        fieldType: AIRPORT_TYPES.SOURCE,
        setSearchValue: (v) =>
          setSearchByLeg((prev) => ({
            ...prev,
            2: { ...(prev[2] || { source: '', dest: '' }), source: v },
          })),
        valuesOverride: leg2ValuesAdapter,
        setFieldValueOverride: (field, value) =>
          setFieldValueForLeg(1, field, value),
        handleSearchOverride: (value, type) =>
          handleSearchForLeg(2, value, type),
        setOpenAirPortsDropdownOverride: (v) => setOpenAirPortsForLeg(2, v),
        destinationDropdownKey: 'to2',
        isOpen: isMobile || openAirPortsByLeg?.[2] === 'from2',
        getCitiesArrayOverride: getCitiesArrayLeg2,
      }),
    [
      renderAirportDropdown,
      searchByLeg,
      leg2ValuesAdapter,
      setFieldValueForLeg,
      handleSearchForLeg,
      setOpenAirPortsForLeg,
      setSearchByLeg,
      openAirPortsByLeg,
      getCitiesArrayLeg2,
      isMobile,
      copy,
    ],
  );

  const destinationDropdownContent2 = useMemo(
    () =>
      renderAirportDropdown({
        searchValue: searchByLeg[2]?.dest ?? '',
        placeholder: copy.placeholders.destination,
        fieldType: AIRPORT_TYPES.DESTINATION,
        setSearchValue: (v) =>
          setSearchByLeg((prev) => ({
            ...prev,
            2: { ...(prev[2] || { source: '', dest: '' }), dest: v },
          })),
        valuesOverride: leg2ValuesAdapter,
        setFieldValueOverride: (field, value) =>
          setFieldValueForLeg(1, field, value),
        handleSearchOverride: (value, type) =>
          handleSearchForLeg(2, value, type),
        setOpenAirPortsDropdownOverride: (v) => setOpenAirPortsForLeg(2, v),
        destinationDropdownKey: 'to2',
        isOpen: isMobile || openAirPortsByLeg?.[2] === 'to2',
        getCitiesArrayOverride: getCitiesArrayLeg2,
        onDestinationSelected: () => {
          setActiveMultiCityCalendarLeg?.(2);
          setOpenAirPortsForLeg?.(2, null);
          setOpenDropdown?.(null);
          if (typeof requestOpenDatesCalendar === 'function') {
            requestOpenDatesCalendar({ mobile: isMobile });
          }
          if (typeof setOpenDateRowId === 'function') setOpenDateRowId(2);
        },
      }),
    [
      renderAirportDropdown,
      searchByLeg,
      leg2ValuesAdapter,
      setFieldValueForLeg,
      handleSearchForLeg,
      setOpenAirPortsForLeg,
      setSearchByLeg,
      setOpenDateRowId,
      setActiveMultiCityCalendarLeg,
      setOpenDropdown,
      requestOpenDatesCalendar,
      isMobile,
      openAirPortsByLeg,
      getCitiesArrayLeg2,
      copy,
    ],
  );

  const sourceDropdownContent3 = useMemo(
    () =>
      renderAirportDropdown({
        searchValue: searchByLeg[3]?.source ?? '',
        placeholder: copy.placeholders.searchAirport,
        fieldType: AIRPORT_TYPES.SOURCE,
        setSearchValue: (v) =>
          setSearchByLeg((prev) => ({
            ...prev,
            3: { ...(prev[3] || { source: '', dest: '' }), source: v },
          })),
        valuesOverride: leg3ValuesAdapter,
        setFieldValueOverride: (field, value) =>
          setFieldValueForLeg(2, field, value),
        handleSearchOverride: (value, type) =>
          handleSearchForLeg(3, value, type),
        setOpenAirPortsDropdownOverride: (v) => setOpenAirPortsForLeg(3, v),
        destinationDropdownKey: 'to3',
        isOpen: isMobile || openAirPortsByLeg?.[3] === 'from3',
      }),
    [
      renderAirportDropdown,
      searchByLeg,
      leg3ValuesAdapter,
      setFieldValueForLeg,
      handleSearchForLeg,
      setOpenAirPortsForLeg,
      setSearchByLeg,
      openAirPortsByLeg,
      isMobile,
      copy,
    ],
  );

  const destinationDropdownContent3 = useMemo(
    () =>
      renderAirportDropdown({
        searchValue: searchByLeg[3]?.dest ?? '',
        placeholder: copy.placeholders.destination,
        fieldType: AIRPORT_TYPES.DESTINATION,
        setSearchValue: (v) =>
          setSearchByLeg((prev) => ({
            ...prev,
            3: { ...(prev[3] || { source: '', dest: '' }), dest: v },
          })),
        valuesOverride: leg3ValuesAdapter,
        setFieldValueOverride: (field, value) =>
          setFieldValueForLeg(2, field, value),
        handleSearchOverride: (value, type) =>
          handleSearchForLeg(3, value, type),
        setOpenAirPortsDropdownOverride: (v) => setOpenAirPortsForLeg(3, v),
        destinationDropdownKey: 'to3',
        isOpen: isMobile || openAirPortsByLeg?.[3] === 'to3',
        onDestinationSelected: () => {
          if (typeof setOpenDateRowId === 'function') setOpenDateRowId(3);
        },
      }),
    [
      renderAirportDropdown,
      searchByLeg,
      leg3ValuesAdapter,
      setFieldValueForLeg,
      handleSearchForLeg,
      setOpenAirPortsForLeg,
      setSearchByLeg,
      setOpenDateRowId,
      openAirPortsByLeg,
      isMobile,
      copy,
    ],
  );

  const getLegProps = useCallback(
    (legId) => {
      if (legId <= 3) return null;
      const sourceKey = `source${legId}`;
      const destinationKey = `destination${legId}`;
      const valuesAdapter = {
        ...formik.values,
        source: formik.values[sourceKey] ?? '',
        destination: formik.values[destinationKey] ?? '',
      };
      const legSearch = searchByLeg[legId] || { source: '', dest: '' };
      return {
        openDropdown: openAirPortsByLeg[legId] ?? null,
        setOpenDropdown: (v) => setOpenAirPortsForLeg(legId, v),
        sourceDropdownContent: renderAirportDropdown({
          searchValue: legSearch.source ?? '',
          placeholder: copy.placeholders.searchAirport,
          fieldType: AIRPORT_TYPES.SOURCE,
          setSearchValue: (v) =>
            setSearchByLeg((prev) => ({
              ...prev,
              [legId]: {
                ...(prev[legId] || { source: '', dest: '' }),
                source: v,
              },
            })),
          valuesOverride: valuesAdapter,
          setFieldValueOverride: (field, value) => {
            if (field === 'source') formik.setFieldValue(sourceKey, value);
            else if (field === 'destination')
              formik.setFieldValue(destinationKey, value);
            else formik.setFieldValue(field, value);
          },
          handleSearchOverride: (value, type) =>
            handleSearchForLeg(legId, value, type),
          setOpenAirPortsDropdownOverride: (v) =>
            setOpenAirPortsForLeg(legId, v),
          destinationDropdownKey: `to${legId}`,
          isOpen: openAirPortsByLeg?.[legId] === `from${legId}`,
        }),
        destinationDropdownContent: renderAirportDropdown({
          searchValue: legSearch.dest ?? '',
          placeholder: copy.placeholders.destination,
          fieldType: AIRPORT_TYPES.DESTINATION,
          setSearchValue: (v) =>
            setSearchByLeg((prev) => ({
              ...prev,
              [legId]: {
                ...(prev[legId] || { source: '', dest: '' }),
                dest: v,
              },
            })),
          valuesOverride: valuesAdapter,
          setFieldValueOverride: (field, value) => {
            if (field === 'source') formik.setFieldValue(sourceKey, value);
            else if (field === 'destination')
              formik.setFieldValue(destinationKey, value);
            else formik.setFieldValue(field, value);
          },
          handleSearchOverride: (value, type) =>
            handleSearchForLeg(legId, value, type),
          setOpenAirPortsDropdownOverride: (v) =>
            setOpenAirPortsForLeg(legId, v),
          destinationDropdownKey: `to${legId}`,
          isOpen: openAirPortsByLeg?.[legId] === `to${legId}`,
          onDestinationSelected: () => {
            if (typeof setOpenDateRowId === 'function') setOpenDateRowId(legId);
          },
        }),
      };
    },
    [
      formik,
      searchByLeg,
      openAirPortsByLeg,
      setOpenAirPortsForLeg,
      renderAirportDropdown,
      handleSearchForLeg,
      setSearchByLeg,
      setOpenDateRowId,
      copy,
    ],
  );

  return {
    renderCalendar,
    renderAirportDropdown,
    sourceDropdownContent,
    destinationDropdownContent,
    sourceDropdownContent2,
    destinationDropdownContent2,
    sourceDropdownContent3,
    destinationDropdownContent3,
    getLegProps,
  };
};

