'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Minus, PlusCircle } from '@phosphor-icons/react';
import {
  MAX_TOTAL_GUESTS,
  BUTTON_CONFIG,
} from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import styles from './Guests.module.css';
import GuestBaggageInfo from './GuestBaggageInfo';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';

const Guests = ({
  guestsState,
  onGuestDelta,
  onGuestInput,
  onCabinClassChange,
  onPromoCodeChange,
  onDone,
  keyboardNavActive = false,
  isMobile,
  enableInfantsWithSeat = false,
}) => {
  const copy = useBookingBoxContentOptional();
  const { lang } = useParams();
  const isRtl = lang === 'ar';
  const guestOptions = enableInfantsWithSeat && copy.guests.infantsWithSeatOption
    ? [...copy.guests.optionsV2, copy.guests.infantsWithSeatOption]
    : copy.guests.optionsV2;
  const cabinClassOptions = copy.guests.cabinClassOptions;
  const { adults, children, infants, infantsWithSeat = 0, cabinClass, promoCode } = guestsState;
  const combinedInfants = infants + infantsWithSeat;
  const totalGuests = adults + children + combinedInfants;

  const showContinue = Boolean(onDone) && !isMobile;

  const [isKeyboardMode, setIsKeyboardMode] = useState(keyboardNavActive);
  const [activeRowIndex, setActiveRowIndex] = useState(keyboardNavActive ? 0 : -1);
  const activeRowIndexRef = useRef(keyboardNavActive ? 0 : -1);
  const panelRef = useRef(null);
  const continueRef = useRef(null);

  useEffect(() => {
    activeRowIndexRef.current = activeRowIndex;
  }, [activeRowIndex]);

  useEffect(() => {
    // Focus the panel on open either way so the keyboard works even after a
    // mouse-open; the active highlight only shows once we're in keyboard mode.
    if (keyboardNavActive) {
      setIsKeyboardMode(true);
      activeRowIndexRef.current = 0;
      setActiveRowIndex(0);
    } else {
      setIsKeyboardMode(false);
      activeRowIndexRef.current = -1;
      setActiveRowIndex(-1);
    }

    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
  }, [keyboardNavActive]);

  const handleGuestChange = (key, delta) => {
    onGuestDelta?.(key, delta);
  };

  const handleInputChange = (key, value) => {
    onGuestInput?.(key, value);
  };

  const isMinusEnabled = useCallback(
    (key) => {
      const currentValue = guestsState[key];
      return key === 'adults' ? currentValue > 1 : currentValue > 0;
    },
    [guestsState]
  );

  const isPlusDisabled = useCallback(
    (key) =>
      totalGuests >= MAX_TOTAL_GUESTS ||
      (key === 'adults' && adults >= MAX_TOTAL_GUESTS) ||
      (key === 'children' && children >= MAX_TOTAL_GUESTS) ||
      (key === 'infants' && combinedInfants >= adults) ||
      (key === 'infantsWithSeat' && combinedInfants >= adults),
    [totalGuests, adults, children, combinedInfants]
  );

  // Enter / Continue: close the dropdown, then move focus to the main
  // "Search flights" button so a subsequent Enter/Space triggers the search
  // (with the button's own loading state) — no duplicate search logic here.
  const handleContinue = useCallback(() => {
    onDone?.();
    requestAnimationFrame(() => {
      const btn = document.getElementById(BUTTON_CONFIG.SEARCH_FLIGHTS.ID);
      if (btn && !btn.disabled) btn.focus();
    });
  }, [onDone]);

  const enableKeyboardMode = useCallback(() => {
    setIsKeyboardMode(true);
    if (activeRowIndexRef.current < 0) {
      activeRowIndexRef.current = 0;
      setActiveRowIndex(0);
    }
    panelRef.current?.focus();
  }, []);

  const stepGuestCount = useCallback(
    (direction) => {
      const rowIndex = activeRowIndexRef.current;
      if (rowIndex < 0 || rowIndex >= guestOptions.length) return;

      const { key } = guestOptions[rowIndex];
      if (direction > 0) {
        if (!isPlusDisabled(key)) handleGuestChange(key, 1);
      } else if (isMinusEnabled(key)) {
        handleGuestChange(key, -1);
      }
    },
    [isMinusEnabled, isPlusDisabled, guestOptions]
  );

  // Tab / Space: cycle through the passenger rows only
  // (Adults -> Children -> Infants -> Adults ...).
  const cycleToNextRow = useCallback(() => {
    const current = activeRowIndexRef.current;
    const next = (Math.max(current, 0) + 1) % guestOptions.length;
    activeRowIndexRef.current = next;
    setActiveRowIndex(next);
  }, [guestOptions]);

  const handlePanelKeyDown = useCallback(
    (e) => {
      enableKeyboardMode();

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        stepGuestCount(-1);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        stepGuestCount(1);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
        return;
      }

      if (e.key === ' ' || e.key === 'Tab') {
        e.preventDefault();
        cycleToNextRow();
      }
    },
    [enableKeyboardMode, stepGuestCount, handleContinue, cycleToNextRow]
  );

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      onKeyDown={handlePanelKeyDown}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${styles.panel} flex flex-col md:flex-row justify-between gap-12 px-2 md:px-2 py-2 bg-white rounded-2xl`}
      role="group"
      aria-label={copy.guests.ariaLabel}
    >
      <div className="flex-1">
        <div className={styles.guestsHeader}>
          <h3 className="text-[16px] font-semibold">{copy.guests.title}</h3>
          <div className={styles.cabinClassRow}>
            {cabinClassOptions.map((option) => (
              <label key={option.value} className={styles.cabinClassOption}>
                <input
                  type="radio"
                  name="cabinClass"
                  value={option.value}
                  checked={cabinClass === option.value}
                  onChange={() => onCabinClassChange?.(option.value)}
                  className="accent-[#054E72] shrink-0"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {combinedInfants > 0 && copy.guests.infantPerAdultNote ? (
            <p className={styles.infantPerAdultNote} role="note">
              {copy.guests.infantPerAdultNote}
            </p>
          ) : null}
        </div>

        {guestOptions.map(({ label, sub, key, note }, rowIndex) => {
          const currentValue = guestsState[key];
          const minusEnabled = isMinusEnabled(key);
          const plusDisabled = isPlusDisabled(key);
          const isActive = isKeyboardMode && activeRowIndex === rowIndex;

          return (
            <div
              key={key}
              className={`${styles.guestRow} ${
                isActive ? styles.activeRow : ''
              }`}
              aria-selected={isActive}
            >
              <div className={styles.guestRowLabel}>
                <div className={styles.guestLabelLine}>
                  <p className="text-[14px] font-semibold text-gray-800">{label}</p>
                  {note ? <GuestBaggageInfo content={note} /> : null}
                </div>
                <p className="text-[12px] text-gray-500">{sub}</p>
              </div>
              <div className={styles.guestCounters}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGuestChange(key, 1);
                  }}
                  disabled={plusDisabled}
                  tabIndex={-1}
                  className={`w-8 h-8 flex items-center justify-center rounded-[6px] transition
                          ${!plusDisabled ? 'bg-primary-1 cursor-pointer' : 'bg-300 cursor-not-allowed'}`}
                >
                  <Plus
                    size={12}
                    weight="bold"
                    className={!plusDisabled ? 'text-white' : 'text-600'}
                  />
                </button>

                <input
                  type="number"
                  value={currentValue}
                  tabIndex={-1}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10) || 0;
                    const value = key === 'adults' ? Math.max(1, parsed) : Math.max(0, parsed);
                    handleInputChange(key, value);
                  }}
                  className="w-10 h-8 text-center border border-gray-400 rounded-md text-sm font-medium focus:outline-none custom-number-input"
                  style={{
                    appearance: 'textfield',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                    textAlign: 'center',
                  }}
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGuestChange(key, -1);
                  }}
                  disabled={!minusEnabled}
                  tabIndex={-1}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm transition
                        ${minusEnabled ? 'bg-primary-1 cursor-pointer' : 'bg-300 cursor-not-allowed'}`}
                >
                  <Minus
                    size={12}
                    weight="bold"
                    className={!minusEnabled ? 'text-600' : 'text-white'}
                  />
                </button>
              </div>
            </div>
          );
        })}

        {enableInfantsWithSeat
          ? combinedInfants > 0 && adults === combinedInfants && (
              <p className="text-green text-sm">
                {copy.guests.infantCombinedLimit(adults)}
              </p>
            )
          : adults === infants && (
              <p className="text-green text-sm">{copy.guests.infantLimit(adults)}</p>
            )}

        {showContinue && (
          <div className={styles.continueRow}>
            <button
              ref={continueRef}
              type="button"
              onClick={onDone}
              className="px-5 py-2 rounded-sm bg-primary-1 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {copy.buttons.continue}
            </button>
          </div>
        )}
      </div>

      {false && (
        <div className="flex-1">
          <h3 className="text-[16px] mb-4">{copy.guests.classTitle}</h3>
          {cabinClassOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between bg-[#F5F5F5] px-6 py-[14px] rounded-xl mb-3 cursor-pointer"
            >
              <span className="text-[14px] text-800 font-medium">{option.label}</span>

              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition
        ${cabinClass === option.value ? 'border-[var(--primary-1)]' : 'border-gray-400'}`}
              >
                {cabinClass === option.value && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-1)]"></span>
                )}
              </span>

              <input
                type="radio"
                name="cabinClass"
                checked={cabinClass === option.value}
                onChange={() => onCabinClassChange?.(option.value)}
                className="hidden"
              />
            </label>
          ))}

          <div className="mt-7 relative w-full group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-primary-1 pointer-events-none transition-opacity duration-200 group-focus-within:opacity-0">
              <PlusCircle size={16} weight="bold" />
            </span>

            <label
              htmlFor="promoCodeInput"
              className={`absolute left-7 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 transition-all
      group-focus-within:top-0 group-focus-within:text-xs group-focus-within:text-primary-1
      ${promoCode ? 'top-0 text-xs text-primary-1' : ''}`}
            >
              {copy.guests.promoCode}
            </label>

            <input
              id="promoCodeInput"
              type="text"
              value={promoCode}
              onChange={(e) => onPromoCodeChange?.(e.target.value)}
              className="w-full pl-7 pr-2 pt-5 pb-1 border-b-2 border-gray-300 focus:border-primary-1 outline-none text-sm text-gray-800 placeholder-transparent"
              placeholder={copy.guests.promoCode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Guests);
