'use client';

import React, { useRef } from 'react';
import SearchInput from './SearchInput';
import AirportList from './AirportList';

/**
 * One airport dropdown (from or to) with its own input ref so keyboard nav
 * binds to the correct field when both panels are mounted.
 */
const AirportDropdownPanel = ({
  isOpen = false,
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
  getCitiesArray,
  isMobile,
  sliderRef,
  handleSearch,
  airportItems,
  prefetchedSchedules,
  onScheduleDataChange,
  hideNewAirportUi,
  searchV2AirportUi,
  skipManifestScheduleFilter,
  trackClarityAirportSelection = false,
}) => {
  const inputRef = useRef(null);

  return (
    <>
      <SearchInput
        search={searchValue}
        handleSearch={handleSearchOverride || handleSearch}
        placeholder={placeholder}
        type={fieldType}
        values={valuesOverride}
        airPorts={airportItems}
        inputRef={inputRef}
        isOpen={isOpen}
      />
      <AirportList
        type={fieldType}
        values={valuesOverride}
        setFieldValue={setFieldValueOverride}
        getCitiesArray={getCitiesArray}
        isMobile={isMobile}
        sliderRef={sliderRef}
        search={searchValue}
        setSearch={setSearchValue}
        setOpenAirPortsDropdown={setOpenAirPortsDropdownOverride}
        destinationDropdownKey={destinationDropdownKey}
        onDestinationSelected={onDestinationSelected}
        prefetchedSchedules={prefetchedSchedules}
        onScheduleDataChange={onScheduleDataChange}
        hideNewAirportUi={hideNewAirportUi}
        searchV2AirportUi={searchV2AirportUi}
        skipManifestScheduleFilter={skipManifestScheduleFilter}
        inputRef={inputRef}
        isOpen={isOpen}
        trackClarityAirportSelection={trackClarityAirportSelection}
      />
    </>
  );
};

export default React.memo(AirportDropdownPanel);
