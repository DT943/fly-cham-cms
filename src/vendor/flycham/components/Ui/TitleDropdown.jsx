'use client'
import { useEffect, useRef, useState, useLayoutEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import useIsArabic from '@/hooks/useIsArabic';
import {
  BOOKING_FORM_FIELD_ATTR,
  handleBookingFormEnterKey,
} from '@/util/bookingFormFieldNav';
import styles from './TitleDropdown.module.css';

function useDropdownRtl() {
  const params = useParams();
  const routeLang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  const isArabic = useIsArabic();
  return routeLang === 'ar' || isArabic;
}

function optionDisplayLabel(opt, countrtNameOnly) {
  if (countrtNameOnly) return opt.displayLabel ?? opt.countryName ?? opt.label;
  return opt.displayLabel ?? opt.label;
}

/** Footer reserved by search-results (`--search-footer-height`); 0 elsewhere. */
function readSearchFooterInsetPx() {
  if (typeof window === 'undefined') return 0;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--search-footer-height')
    .trim();
  const footer = parseFloat(raw);
  if (Number.isFinite(footer) && footer > 0) {
    return Math.ceil(footer) + 8;
  }
  const bar = document.querySelector('.search-footer-bar');
  if (bar) {
    const height = bar.getBoundingClientRect().height;
    if (height > 0) return Math.ceil(height) + 8;
  }
  return 0;
}

const MENU_MAX_HEIGHT = 288;
const MENU_MIN_HEIGHT = 96;
const MENU_GAP = 4;

export default function CustomDropdown({
  selected,
  onChange,
  options = [],
  countrtNameOnly = false,
  placeholder = 'Select',
  type,
  error = false,
  label,
  /** When true, label/value alignment matches `Input` (v2 passenger nationality). */
  floatingLabelMatchInput = false,
  searchPlaceholder,
  noMatchesText,
  menuZIndex = 10000,
  bookingFormField = false,
  disabled = false,
  /** Increment to imperatively open (e.g. DOB day → month → year). */
  requestOpenKey = 0,
  /** Option row text alignment. Use `center` for compact DOB day/month/year lists. */
  optionAlign = 'start',
  /**
   * Placement policy when opening (portal menus only):
   * - `auto` — prefer below, flip above only when below is clearly too small
   * - `below` — stay below whenever possible (shrink height before flipping)
   */
  preferPlacement = 'auto',
  /**
   * Passenger-form only: render the menu in-flow under the field (`absolute`),
   * so it scrolls with the field and never jumps/flips. Portal/modals unchanged.
   */
  pinBelow = false,
  /** Fires when open state changes (passenger form uses this for stacking + scroll-into-view). */
  onOpenChange,
  /**
   * Keep English values left-aligned even on Arabic pages (e.g. adult passenger name).
   * Chevron / page chrome stay RTL; only the selected value text is LTR.
   */
  forceLtrContent = false,
}) {
  const { t } = useTranslation();
  const isRtl = useDropdownRtl();
  const valueIsLtr = forceLtrContent || !isRtl;
  const resolvedSearchPlaceholder =
    searchPlaceholder ??
    t('searchResults.contactForm.countrySearchPlaceholder', {
      defaultValue: 'Search country or code',
    });
  const resolvedNoMatches =
    noMatchesText ??
    t('searchResults.contactForm.countryNoMatches', {
      defaultValue: 'No matches found',
    });
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // Notify parent outside the setState updater — calling onOpenChange inside the
  // updater updates PassengerNationalityDropdown while CustomDropdown is rendering.
  const setOpen = useCallback((next) => {
    const prev = isOpenRef.current;
    const value = typeof next === 'function' ? next(prev) : next;
    if (value === prev) return;
    isOpenRef.current = value;
    setIsOpen(value);
    onOpenChangeRef.current?.(value);
  }, []);
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    right: 0,
    maxHeight: MENU_MAX_HEIGHT,
    placement: 'below',
  });
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const scrollRef = useRef(null);
  const thumbRef = useRef(null);
  const inputRef = useRef(null);
  const lastRequestOpenKeyRef = useRef(0);
  const placementLockRef = useRef(null);
  const rafRef = useRef(null);

  const MIN_THUMB_HEIGHT = 28;

  const updateThumb = useCallback(() => {
    const container = scrollRef.current;
    const thumb = thumbRef.current;
    if (!container || !thumb) return;

    const { scrollHeight, clientHeight, scrollTop } = container;
    if (scrollHeight <= clientHeight + 1) {
      thumb.style.opacity = '0';
      return;
    }

    const trackHeight = clientHeight;
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * trackHeight,
      MIN_THUMB_HEIGHT,
    );
    const maxThumbTop = trackHeight - thumbHeight;
    const scrollRange = scrollHeight - clientHeight;
    const top = scrollRange > 0 ? (scrollTop / scrollRange) * maxThumbTop : 0;

    thumb.style.opacity = '1';
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${top}px)`;
  }, []);

  const toggleDropdown = () => {
    if (disabled) return;
    setOpen((p) => !p);
  };

  const handleSelect = (value) => {
    onChange(value);
    setQuery('');
    setOpen(false);
  };

  const showLabelAbove = Boolean(label);
  const hasSelection = Boolean(selected);
  const selectedOption = options.find((o) => o.value === selected);
  const buttonDisplay = hasSelection
    ? optionDisplayLabel(selectedOption ?? { label: selected }, countrtNameOnly) || selected
    : (floatingLabelMatchInput ? '' : placeholder);

  const labelClasses = floatingLabelMatchInput
    ? `absolute top-0 ${isRtl ? 'right-0 text-right' : 'left-0 text-left'} px-3 sm:px-4 pt-[18px] text-xs sm:text-sm pointer-events-none z-10 transition duration-100 ease-in-out ${isRtl ? 'origin-top-right' : 'origin-top-left'} w-full ${isRtl ? 'ps-8 pe-3 sm:ps-8 sm:pe-4' : 'pe-8'} overflow-hidden text-ellipsis whitespace-nowrap
        ${hasSelection ? 'scale-90 -translate-y-2 text-xs text-[var(--primary-1)]' : 'text-gray-600'}
        ${error ? 'text-alert' : ''}`
    : `absolute ${isRtl ? 'right-0 text-right' : 'left-0 text-left'} px-3 sm:px-4 pt-[10px] text-xs sm:text-sm pointer-events-none z-10 transition duration-100 w-full ${isRtl ? 'ps-8 pe-3 sm:ps-8 sm:pe-4' : 'pe-8'} overflow-hidden text-ellipsis whitespace-nowrap
        ${hasSelection ? 'scale-90 -translate-y-0.5 text-xs text-[var(--primary-1)]' : 'text-gray-600'}
        ${error ? 'text-alert' : ''}`;

  useEffect(() => {
    if (disabled && isOpen) setOpen(false);
  }, [disabled, isOpen, setOpen]);

  useEffect(() => {
    if (!requestOpenKey || requestOpenKey === lastRequestOpenKeyRef.current) return;
    // Wait until the segment is enabled (e.g. month after day) before consuming the key.
    if (disabled) return;
    lastRequestOpenKeyRef.current = requestOpenKey;
    if (disabled) return;
    const timer = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, [requestOpenKey, disabled, setOpen]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!isOpen) return;
      const inButton = rootRef.current?.contains(e.target);
      const inList = listRef.current?.contains(e.target);
      if (!inButton && !inList) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen, setOpen]);

  /** Portal menus only — pinBelow uses in-flow absolute and skips this. */
  const updatePosition = useCallback((recomputePlacement = false) => {
    if (pinBelow) return;
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    const vvTop = vv?.offsetTop ?? 0;
    const vvHeight = vv?.height ?? window.innerHeight;
    const vvBottom = vvTop + vvHeight;
    const footerInset = readSearchFooterInsetPx();
    const usableBottom = vvBottom - footerInset;
    const spaceBelow = usableBottom - r.bottom - MENU_GAP;
    const spaceAbove = r.top - vvTop - MENU_GAP;

    let placement = placementLockRef.current;
    if (!placement || recomputePlacement) {
      if (preferPlacement === 'below') {
        placement =
          spaceBelow >= MENU_MIN_HEIGHT || spaceBelow >= spaceAbove ? 'below' : 'above';
      } else {
        placement =
          spaceBelow < MENU_MIN_HEIGHT && spaceAbove > spaceBelow ? 'above' : 'below';
      }
      placementLockRef.current = placement;
    }

    let top;
    let maxHeight;

    if (placement === 'above') {
      maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(MENU_MIN_HEIGHT, spaceAbove - 8));
      top = Math.max(vvTop + MENU_GAP, r.top - MENU_GAP - maxHeight);
      if (spaceAbove < MENU_MIN_HEIGHT && spaceBelow > spaceAbove) {
        placementLockRef.current = 'below';
        placement = 'below';
        top = r.bottom + MENU_GAP;
        maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(MENU_MIN_HEIGHT, spaceBelow - 8));
      }
    } else {
      top = r.bottom + MENU_GAP;
      maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(48, spaceBelow - 8));
      if (spaceBelow < 48 && spaceAbove >= MENU_MIN_HEIGHT) {
        placementLockRef.current = 'above';
        placement = 'above';
        maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(MENU_MIN_HEIGHT, spaceAbove - 8));
        top = Math.max(vvTop + MENU_GAP, r.top - MENU_GAP - maxHeight);
      } else {
        const maxAllowed = Math.max(48, usableBottom - top - 4);
        maxHeight = Math.min(maxHeight, maxAllowed);
      }
    }

    setCoords({
      top,
      left: r.left,
      width: r.width,
      right: r.right,
      maxHeight,
      placement,
    });
  }, [pinBelow, preferPlacement]);

  useLayoutEffect(() => {
    if (!isOpen || pinBelow) {
      if (!isOpen) placementLockRef.current = null;
      return undefined;
    }
    updatePosition(true);
    return undefined;
  }, [isOpen, pinBelow, updatePosition]);

  useEffect(() => {
    if (!isOpen || pinBelow) return undefined;

    const onScrollOrResize = (event) => {
      if (event?.type === 'scroll' && listRef.current?.contains(event.target)) {
        return;
      }
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updatePosition(false);
      });
    };

    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    window.visualViewport?.addEventListener('resize', onScrollOrResize);
    window.visualViewport?.addEventListener('scroll', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      window.visualViewport?.removeEventListener('resize', onScrollOrResize);
      window.visualViewport?.removeEventListener('scroll', onScrollOrResize);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isOpen, pinBelow, updatePosition]);

  useEffect(() => {
    if (isOpen && type === 'countries' && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen, type]);

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) => {
        const display = optionDisplayLabel(opt, countrtNameOnly);
        const l = (opt.label || '').toLowerCase();
        const d = (display || '').toLowerCase();
        const cn = (opt.countryName || '').toLowerCase();
        const v = (opt.value || '').toLowerCase();
        const q = query.toLowerCase();
        return l.includes(q) || d.includes(q) || cn.includes(q) || v.includes(q);
      }),
    [options, countrtNameOnly, query],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const container = scrollRef.current;
    if (!container) return undefined;

    updateThumb();
    container.addEventListener('scroll', updateThumb, { passive: true });

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateThumb);
      resizeObserver.observe(container);
    }

    return () => {
      container.removeEventListener('scroll', updateThumb);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [isOpen, updateThumb, filteredOptions.length, coords.maxHeight, pinBelow]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const thumb = thumbRef.current;
    const container = scrollRef.current;
    if (!thumb || !container) return undefined;

    let dragging = false;
    let startY = 0;
    let startScrollTop = 0;

    const onPointerDown = (e) => {
      dragging = true;
      startY = e.clientY;
      startScrollTop = container.scrollTop;
      document.body.style.userSelect = 'none';
      thumb.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const { scrollHeight, clientHeight } = container;
      const trackHeight = clientHeight;
      const thumbHeight = Math.max(
        (clientHeight / scrollHeight) * trackHeight,
        MIN_THUMB_HEIGHT,
      );
      const maxThumbTop = trackHeight - thumbHeight;
      if (maxThumbTop <= 0) return;
      const scrollRange = scrollHeight - clientHeight;
      const deltaY = e.clientY - startY;
      container.scrollTop = startScrollTop + (deltaY / maxThumbTop) * scrollRange;
    };

    const onPointerUp = () => {
      dragging = false;
      document.body.style.userSelect = '';
    };

    thumb.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      thumb.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isOpen, filteredOptions.length]);

  const optionTextClass = optionAlign === 'center' ? 'text-center' : 'text-start';
  const menuMaxHeight = pinBelow ? MENU_MAX_HEIGHT : coords.maxHeight;

  const menuInner = (
    <div className={styles.scrollWrapper}>
      <div
        ref={scrollRef}
        data-title-dropdown-scroll=""
        className={styles.scrollArea}
        style={{ maxHeight: menuMaxHeight }}
      >
        {type === 'countries' && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            className="w-full px-4 py-2 text-sm border-b border-gray-300 focus:outline-none text-start"
            placeholder={resolvedSearchPlaceholder}
            enterKeyHint="search"
            dir={isRtl ? 'rtl' : 'ltr'}
          />
        )}

        <ul className={optionTextClass}>
          {filteredOptions.map((opt) => (
            <li
              key={`${opt.value}::${opt.label}`}
              onClick={() => handleSelect(opt.value)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#054E72] hover:text-white ${optionTextClass}
                ${selected === opt.value ? 'bg-[#054E72] text-white' : 'text-gray-700'}`}
            >
              {optionDisplayLabel(opt, countrtNameOnly)}
            </li>
          ))}
          {filteredOptions.length === 0 && (
            <li className={`px-4 py-2 text-sm text-gray-500 ${optionTextClass}`}>
              {resolvedNoMatches}
            </li>
          )}
        </ul>
      </div>
      <div className={styles.scrollTrack} aria-hidden="true">
        <div ref={thumbRef} className={styles.scrollThumb} />
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      data-title-dropdown=""
      className={`relative w-full rounded-md ${pinBelow ? 'overflow-visible' : ''}`}
      style={
        pinBelow && isOpen
          ? { zIndex: menuZIndex }
          : pinBelow
            ? { zIndex: 0 }
            : undefined
      }
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {showLabelAbove && (
        <span className={labelClasses}>
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        onKeyDown={(event) => {
          if (!isOpen) handleBookingFormEnterKey(event);
        }}
        {...(bookingFormField ? { [BOOKING_FORM_FIELD_ATTR]: '' } : {})}
        className={`w-full rounded-md relative bg-100 ${valueIsLtr ? 'text-left' : 'text-right'}
          ${showLabelAbove ? 'h-14 min-h-[3.5rem] pt-6 pb-2 px-3 sm:px-4' : 'px-3 sm:px-4 py-4'}
          ${error ? 'border border-alert' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`text-xs sm:text-sm block overflow-hidden text-ellipsis whitespace-nowrap ${
            isRtl ? 'ps-8 pe-0' : 'pe-8'
          } ${error ? 'text-alert' : 'text-gray-600'} ${
            floatingLabelMatchInput && !hasSelection ? 'invisible' : ''
          } ${forceLtrContent ? 'text-left' : ''}`}
          dir={forceLtrContent ? 'ltr' : undefined}
        >
          {buttonDisplay}
        </span>
        <svg
          className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-3' : 'right-3'} ${error ? 'text-alert' : 'text-600'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Passenger form: in-flow under the field — scrolls with it, never jumps above */}
      {isOpen && pinBelow && (
        <div
          ref={listRef}
          data-title-dropdown-menu=""
          className="absolute left-0 right-0 top-full mt-1 bg-100 rounded-md shadow-lg ring-1 ring-black/5"
          style={{ zIndex: menuZIndex, maxHeight: MENU_MAX_HEIGHT }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {menuInner}
        </div>
      )}

      {/* Default / modals: fixed portal (unchanged behavior) */}
      {isOpen &&
        !pinBelow &&
        createPortal(
          <div
            ref={listRef}
            data-title-dropdown-menu=""
            className="fixed bg-100 rounded-md shadow-lg ring-1 ring-black/5"
            style={{
              position: 'fixed',
              top: coords.top,
              left: isRtl ? 'auto' : coords.left,
              right: isRtl ? window.innerWidth - coords.right : 'auto',
              width: coords.width,
              zIndex: menuZIndex,
              maxHeight: coords.maxHeight,
            }}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {menuInner}
          </div>,
          document.body
        )}
    </div>
  );
}
