'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import getIataCodeById from './widget/Dates/utils/getIataCodeById';
import {
  AIRPORT_SELECTOR,
  AIRPORT_TYPES,
  SEARCH_V2_NEW_AIRPORT_IATA,
  STEP_IDS,
} from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import NearbyAirportsToggle from './NearbyAirportsToggle';
import styles from './AirportList.module.css';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import {
  trackOriginAirportClarityEvent,
  trackReturnAirportClarityEvent,
} from '@/lib/clarity';

function isSearchV2NewAirport(item) {
  return String(item?.iataCode || '').toUpperCase() === SEARCH_V2_NEW_AIRPORT_IATA;
}

function AirportListItem({
  item,
  type,
  values,
  isSelected,
  isActive,
  onSelect,
  showNewBadge,
  searchV2AirportUi,
  itemRef,
  newLabel = 'New',
  isRtl = false,
}) {
  const { id, iataCode, airPortTranslations = [] } = item;
  const translation = airPortTranslations[0] || {};
  const cityName = translation.city || 'Unknown city';
  const country = translation.country || 'Unknown country';
  const airportName = translation.airPortName || 'Unknown airport';

  const activeClass = isActive ? styles.snapItemActive : isSelected ? 'bg-[#E5E5E3]' : '';

  return (
    <button
      ref={itemRef}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect({ type, id })}
      className={`${styles.listItem} flex w-full items-center gap-3 border-b border-gray-200 p-3 sm:gap-4 rounded-none transition-colors duration-150 hover:rounded-lg hover:bg-[#F5F5F4] focus:outline-none focus-visible:rounded-lg focus-visible:bg-[#F5F5F4] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-1 ${activeClass}`}
      dir="ltr"
      aria-pressed={isSelected}
      aria-selected={isActive}
    >
      <div className="min-w-0 flex-1 text-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <p className="text-sm font-semibold text-gray-800 text-start">{`${cityName}, ${country}`}</p>
        <p className="my-1 text-xs text-gray-500 text-start md:my-0">{airportName}</p>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-3">
        {showNewBadge ? (
          searchV2AirportUi ? (
            <span className="rounded-md bg-primary-100 px-3 py-2 text-xs font-semibold text-primary-1">
              {newLabel}
            </span>
          ) : (
            <div className="rounded-md bg-main/20 px-3 py-2 text-xs font-semibold text-main">
              {newLabel}
            </div>
          )
        ) : null}
        {searchV2AirportUi ? (
          <span dir="ltr" className="font-en w-14 rounded-md bg-primary-1 py-2 text-center text-xs font-semibold text-white">
            {iataCode}
          </span>
        ) : (
          <div dir="ltr" className="font-en bg-main w-14 rounded-md p-2 text-center text-xs font-semibold text-white">
            {iataCode}
          </div>
        )}
      </div>
    </button>
  );
}

const AirportList = ({
  search,
  setSearch,
  type,
  values,
  setFieldValue,
  isMobile,
  sliderRef,
  getCitiesArray,
  setOpenAirPortsDropdown,
  destinationDropdownKey = AIRPORT_SELECTOR.TO,
  onDestinationSelected,
  prefetchedSchedules,
  onScheduleDataChange,
  hideNewAirportUi = false,
  searchV2AirportUi = false,
  skipManifestScheduleFilter = false,
  inputRef = null,
  isOpen = false,
  /** When true, fire Clarity events for leg-1 origin / return airport picks. */
  trackClarityAirportSelection = false,
}) => {
  const copy = useBookingBoxContentOptional();
  const { lang } = useParams();
  const isRtl = lang === 'ar';
  const { airPorts } = useSelector(state => state.flights);
  const airports = airPorts?.items || [];
  const useSearchV2Ui = searchV2AirportUi && !hideNewAirportUi;

  const [activeIndex, setActiveIndex] = useState(-1);
  const activeIndexRef = useRef(-1);
  const itemRefs = useRef([]);
  const scrollRef = useRef(null);
  const thumbRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);

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
      MIN_THUMB_HEIGHT
    );
    const maxThumbTop = trackHeight - thumbHeight;
    const scrollRange = scrollHeight - clientHeight;
    const top = scrollRange > 0 ? (scrollTop / scrollRange) * maxThumbTop : 0;

    thumb.style.opacity = '1';
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${top}px)`;
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const iataSourceCode = useMemo(() => {
    const sourceAirport = airports.find(
      (item) => String(item.id) === String(values.source)
    );
    return sourceAirport?.iataCode;
  }, [airports, values.source]);

  const citiesArray = useMemo(
    () => getCitiesArray?.(type, iataSourceCode, search) || [],
    [getCitiesArray, type, iataSourceCode, search]
  );
  const newAirports = useMemo(() => {
    if (!useSearchV2Ui) return [];
    return citiesArray.filter(isSearchV2NewAirport);
  }, [citiesArray, useSearchV2Ui]);
  const regularAirports = useMemo(() => {
    if (hideNewAirportUi || !useSearchV2Ui) return citiesArray;
    return citiesArray.filter((item) => !isSearchV2NewAirport(item));
  }, [citiesArray, hideNewAirportUi, useSearchV2Ui]);

  const selectableAirports = useMemo(
    () => [...newAirports, ...regularAirports],
    [newAirports, regularAirports]
  );

  useEffect(() => {
    itemRefs.current = [];
    const hasSearch = String(search || '').trim().length > 0;
    if (hasSearch && selectableAirports.length > 0) {
      activeIndexRef.current = 0;
      setActiveIndex(0);
    } else {
      activeIndexRef.current = -1;
      setActiveIndex(-1);
    }
  }, [search, selectableAirports]);

  const scrollToItemIndex = useCallback((index) => {
    const el = itemRefs.current[index];
    const container = scrollRef.current;
    if (!el || !container || index < 0) return;

    isProgrammaticScrollRef.current = true;

    const itemTop = el.offsetTop;
    const itemHeight = el.offsetHeight;
    const viewHeight = container.clientHeight;
    const maxScroll = Math.max(0, container.scrollHeight - viewHeight);

    if (index === 0) {
      container.scrollTop = 0;
    } else {
      const viewTop = container.scrollTop;
      const viewBottom = viewTop + viewHeight;
      if (itemTop < viewTop) {
        container.scrollTop = itemTop;
      } else if (itemTop + itemHeight > viewBottom) {
        container.scrollTop = Math.min(itemTop + itemHeight - viewHeight, maxScroll);
      }
    }

    requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false;
    });
  }, []);

  const stepScrollIndex = useCallback(
    (direction) => {
      const count = selectableAirports.length;
      if (!count) return;
      const current = activeIndexRef.current < 0 ? 0 : activeIndexRef.current;
      const next =
        direction > 0
          ? Math.min(current + 1, count - 1)
          : Math.max(current - 1, 0);
      if (next === current && activeIndexRef.current >= 0) return;
      activeIndexRef.current = next;
      setActiveIndex(next);
      scrollToItemIndex(next);
    },
    [selectableAirports.length, scrollToItemIndex]
  );

  useEffect(() => {
    if (!useSearchV2Ui) return undefined;
    const container = scrollRef.current;
    if (!container) return undefined;

    const onWheel = (e) => {
      if (isProgrammaticScrollRef.current) return;
      e.preventDefault();
      stepScrollIndex(e.deltaY > 0 ? 1 : -1);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [useSearchV2Ui, stepScrollIndex, selectableAirports]);

  useEffect(() => {
    if (!useSearchV2Ui) return undefined;
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
  }, [useSearchV2Ui, updateThumb, selectableAirports, isOpen]);

  useEffect(() => {
    if (!useSearchV2Ui) return undefined;
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
        MIN_THUMB_HEIGHT
      );
      const maxThumbTop = trackHeight - thumbHeight;
      if (maxThumbTop <= 0) return;
      const scrollRange = scrollHeight - clientHeight;
      const deltaY = e.clientY - startY;
      isProgrammaticScrollRef.current = true;
      container.scrollTop = startScrollTop + (deltaY / maxThumbTop) * scrollRange;
      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
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
  }, [useSearchV2Ui]);

  const closeDropdown = useCallback(() => {
    setOpenAirPortsDropdown?.(null);
  }, [setOpenAirPortsDropdown]);

  const handleAirportSelection = useCallback(({ type, id }) => {
    const previousId = values?.[type];
    const isNewSelection = String(previousId ?? '') !== String(id ?? '');
    const selectedAirport = airports.find((item) => String(item.id) === String(id));
    const iataCode = selectedAirport?.iataCode;

    if (trackClarityAirportSelection && isNewSelection) {
      if (type === AIRPORT_TYPES.SOURCE) {
        trackOriginAirportClarityEvent(iataCode);
      } else if (type === AIRPORT_TYPES.DESTINATION) {
        trackReturnAirportClarityEvent(iataCode);
      }
    }

    setFieldValue(type, id);

    if (type === "source") {
      setSearch("");
      setFieldValue("destination", "");
      setFieldValue("dateStart", null);
      setFieldValue("dateEnd", null);
      setFieldValue("hasClickCalendar", false);
      setFieldValue("type", 1);
      if (isMobile && sliderRef?.current) sliderRef.current.slickGoTo(1);

      closeDropdown();
      setTimeout(() => {
        setOpenAirPortsDropdown?.(destinationDropdownKey);
      }, 0);
    } else if (type === "destination") {
      setSearch("");
      setFieldValue("dateStart", null);
      setFieldValue("dateEnd", null);
      setFieldValue("hasClickCalendar", false);

      const dep = getIataCodeById({ id: values.source, airPorts });
      const arr = getIataCodeById({ id, airPorts });

      if (!skipManifestScheduleFilter) {
        const filtered = Array.isArray(prefetchedSchedules)
          ? prefetchedSchedules.filter((item) => {
              const origin = (item?.origin || '').toUpperCase();
              const destination = (item?.destination || '').toUpperCase();
              return origin === (dep || '').toUpperCase() && destination === (arr || '').toUpperCase();
            })
          : [];

        if (typeof onScheduleDataChange === 'function') {
          onScheduleDataChange(filtered);
        }
      }

      closeDropdown();

      // Website flow: airports → dates → guests. When a calendar callback is
      // provided, advance to the travel-dates step (not guests).
      if (typeof onDestinationSelected === 'function') {
        setFieldValue("type", STEP_IDS.TRAVEL_WHEN);
        setTimeout(() => {
          onDestinationSelected({ destinationId: id });
        }, 0);
      } else {
        setFieldValue("type", STEP_IDS.GUESTS);
        if (isMobile && sliderRef?.current) sliderRef.current.slickGoTo(2);
      }
    } else {
      closeDropdown();
    }
  }, [setFieldValue, setSearch, isMobile, sliderRef, closeDropdown, setOpenAirPortsDropdown, values, airPorts, prefetchedSchedules, onScheduleDataChange, skipManifestScheduleFilter, destinationDropdownKey, onDestinationSelected, trackClarityAirportSelection, airports]);

  const selectByIndex = useCallback(
    (index) => {
      const item = selectableAirports[index];
      if (!item) return;
      handleAirportSelection({ type, id: item.id });
    },
    [selectableAirports, handleAirportSelection, type]
  );

  useEffect(() => {
    if (!useSearchV2Ui || !inputRef?.current) return undefined;

    const input = inputRef.current;

    const onKeyDown = (e) => {
      if (document.activeElement !== input) return;
      const count = selectableAirports.length;
      if (!count) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const current = activeIndexRef.current;
        const next = current < 0 ? 0 : Math.min(current + 1, count - 1);
        activeIndexRef.current = next;
        setActiveIndex(next);
        scrollToItemIndex(next);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const current = activeIndexRef.current;
        const next = current < 0 ? 0 : Math.max(current - 1, 0);
        activeIndexRef.current = next;
        setActiveIndex(next);
        scrollToItemIndex(next);
        return;
      }

      if (
        (e.key === 'Enter' || e.key === ' ') &&
        activeIndexRef.current >= 0
      ) {
        e.preventDefault();
        selectByIndex(activeIndexRef.current);
      }
    };

    input.addEventListener('keydown', onKeyDown);
    return () => input.removeEventListener('keydown', onKeyDown);
  }, [useSearchV2Ui, inputRef, selectableAirports, selectByIndex, scrollToItemIndex]);

  const getSelectableIndex = useCallback(
    (item) => selectableAirports.findIndex((a) => String(a.id) === String(item.id)),
    [selectableAirports]
  );

  const scrollClassName = useSearchV2Ui
    ? isMobile
      ? `${styles.scrollArea} ${styles.scrollAreaMobile}`
      : styles.scrollArea
    : `${!isMobile ? 'max-h-[300px]' : ''} overflow-y-auto pr-1`;

  const scrollStyle = useSearchV2Ui
    ? undefined
    : {
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      };

  const listContent = (
    <div className={useSearchV2Ui ? '' : 'space-y-2'}>
      {newAirports.length > 0 && (
        <p
          className={
            useSearchV2Ui
              ? `${styles.sectionTitle} text-start text-sm font-medium text-gray-500`
              : 'px-1 text-start text-sm font-medium text-gray-500'
          }
        >
          {copy.airportSelector.newSection}
        </p>
      )}
      {newAirports.map((item) => {
        const idx = getSelectableIndex(item);
        return (
          <AirportListItem
            key={item.id}
            item={item}
            type={type}
            values={values}
            isSelected={String(values?.[type]) === String(item.id)}
            isActive={activeIndex === idx}
            onSelect={handleAirportSelection}
            showNewBadge
            newLabel={copy.airportSelector.newSection}
            searchV2AirportUi={useSearchV2Ui}
            isRtl={isRtl}
            itemRef={(el) => {
              if (idx >= 0) itemRefs.current[idx] = el;
            }}
          />
        );
      })}

      {regularAirports.length > 0 && (
        <p
          className={
            useSearchV2Ui
              ? `${styles.sectionTitle} pt-2 text-start text-sm font-medium text-gray-500`
              : 'px-1 pt-2 text-start text-sm font-medium text-gray-500'
          }
        >
          {copy.airportSelector.allAirports}
        </p>
      )}
      {regularAirports.map((item) => {
        const idx = getSelectableIndex(item);
        return (
          <AirportListItem
            key={item.id}
            item={item}
            type={type}
            values={values}
            isSelected={String(values?.[type]) === String(item.id)}
            isActive={activeIndex === idx}
            onSelect={handleAirportSelection}
            showNewBadge={false}
            searchV2AirportUi={useSearchV2Ui}
            isRtl={isRtl}
            itemRef={(el) => {
              if (idx >= 0) itemRefs.current[idx] = el;
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3">
      {useSearchV2Ui && (
        <NearbyAirportsToggle
          checked={Boolean(values.nearby)}
          onChange={(next) => setFieldValue('nearby', next)}
        />
      )}

      {useSearchV2Ui ? (
        <div className={styles.scrollWrapper}>
          <div ref={scrollRef} className={scrollClassName} style={scrollStyle}>
            {listContent}
          </div>
          <div className={styles.scrollTrack} aria-hidden="true">
            <div ref={thumbRef} className={styles.scrollThumb} />
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className={scrollClassName} style={scrollStyle}>
          {listContent}
        </div>
      )}
    </div>
  );
};

export default React.memo(AirportList);
