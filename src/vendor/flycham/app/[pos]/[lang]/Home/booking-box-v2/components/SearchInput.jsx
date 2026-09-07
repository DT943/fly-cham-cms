'use client'
import { X } from "@phosphor-icons/react";
import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

const SearchInput = ({ search, placeholder, handleSearch, type, values, airPorts, inputRef, isOpen = true }) => {
  const { lang } = useParams();
  const isRtl = lang === 'ar';
  const inputDir = isRtl ? 'rtl' : 'ltr';
  const { source, destenations } = values
  // Get selected airport ID dynamically from `values`
  const selectedAirportId = values?.[type]; // either values.source or values.destination
  const selectedAirport = airPorts.find(
    (a) => String(a.id) === String(selectedAirportId)
  );
  const selectedAirportName = selectedAirport?.airPortTranslations?.[0]?.airPortName ?? "";

  const displayValue = selectedAirportName || search;
  const didAutoSelect = useRef(false);

  useEffect(() => {
    didAutoSelect.current = false;
  }, [selectedAirportId, type]);
  useEffect(() => {
    if (isOpen === false) return;
    inputRef?.current?.focus();

    // Only auto-select when showing the prefilled name (e.g., after returning to the step)
    // and only once (no re-select on subsequent keystrokes)
    if (values?.[type] && search === selectedAirportName && !didAutoSelect.current) {
      inputRef?.current?.select();
      didAutoSelect.current = true;
    }
  }, [isOpen, search, selectedAirportName, values?.[type], type, inputRef]);


  return (
    <div className="rounded-t-2xl py-6">

      <div className="flex items-center border-b border-gray-300">

        <input
          ref={inputRef}
          type="text"
          value={search ? search : displayValue}
          onChange={(e) => {
            // inputRef.current?.select();

            handleSearch(e.target.value, type)
          }}

          placeholder={placeholder}
          dir={inputDir}
          className="w-full text-start text-gray-700 placeholder-gray-400 text-[16px] px-0 py-2 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => {
              handleSearch('', type);
            }}
            className="cursor-pointer text-gray-700 hover:text-black text-sm px-2"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
