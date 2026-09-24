'use client'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { arSA, enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import useIsMobile from '@/hooks/useIsMobile';
import useIsArabic from '@/hooks/useIsArabic';
import { formatCalendarCaption, isCalendarArabic } from '@/util/calendarI18n';
import MonthNavigation from './MonthNavigation';
import SelectedDateDisplay from './SelectedDateDisplay';
import MobileCalendarDateFields from './MobileCalendarDateFields';
import CustomDayContent from './CustomDayContent';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import { addDays, isSameDay, startOfDay } from 'date-fns';
import { toCalendarDateKeyFromAny } from '@/util/calendarDateKey';
import { getFirstLeg } from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/legsUtils';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { TRIP_TYPES } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';

/** Stacked months for mobile vertical scroll (no prev/next). */
const MOBILE_SCROLL_MONTHS = 13;

/** Continuous range caps: outer corners rounded, inner edge flat (logical = RTL-safe). */
const RANGE_DAY_BUTTON_RESET =
    '[&>.rdp-day_button]:!bg-transparent [&>.rdp-day_button]:!rounded-none [&>.rdp-day_button]:!border-0';
const RANGE_CAP_START_CLASS = `!bg-secondary !text-white !rounded-s-xl !rounded-e-none ${RANGE_DAY_BUTTON_RESET}`;
const RANGE_CAP_END_CLASS = `!bg-secondary !text-white !rounded-e-xl !rounded-s-none ${RANGE_DAY_BUTTON_RESET}`;
const RANGE_MIDDLE_CLASS = `!bg-[#e6dabc61] !text-black !rounded-none ${RANGE_DAY_BUTTON_RESET}`;

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

const Dates = ({
    isChangeFlight,
    formik,
    selected,
    handleDateSelect,
    currentMonth,
    setCurrentMonth,
    minMonth,
    setMinMonth,
    handleReset,
    statusData = null,
    hasClickCalendar = false,
    scheduleMatchesActiveLeg = true,
    // When true (flight-schedule page), all days should be clickable
    // and the calendar should always be in range mode.
    isFlightSchedulePage = false,
    allowSameDayReturn = false,
    isModifySearch = false,
    enableKeyboardNavigation = false,
    isSchedulePending = false,
    minSelectableDayOverride = null,
    /** Multi-city leg calendar in MobModal: departure field only, no trip-type radios. */
    isMultiCityLeg = false,
}) => {
    const [shouldAnimateMonth, setShouldAnimateMonth] = useState(false);
    const [flashKey, setFlashKey] = useState(0);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [focusedDate, setFocusedDate] = useState(() => startOfDay(new Date()));
    const calendarKeyboardRef = useRef(null);
    const prevTripTypeRef = useRef(null);
    const currentMonthRef = useRef(currentMonth);
    const dateStartAutoAdvancedRef = useRef(null);
    const returnPickerViewInitializedRef = useRef(false);
    const isMobile = useIsMobile(767);
    const isArabic = useIsArabic();
    const { lang } = useParams();
    const copy = useBookingBoxContentOptional();
    const isRtl = isCalendarArabic(lang) || isArabic;
    const calendarLocale = isRtl ? arSA : enUS;
    const calendarFormatters = useMemo(
        () => ({
            formatCaption: (month) => formatCalendarCaption(month, isRtl ? 'ar' : 'en'),
        }),
        [isRtl],
    );
    const tripType = formik.values.tripType;
    const isSubsequentMultiCityLeg = minSelectableDayOverride != null;
    const dateStart = useMemo(() => {
        if (isSubsequentMultiCityLeg) {
            const legDate = formik.values?.dateStart;
            if (!legDate) return undefined;
            return legDate instanceof Date ? legDate : new Date(legDate);
        }
        const { dateStart: dateStartFromLeg } = getFirstLeg(formik.values);
        const resolved = dateStartFromLeg ?? formik.values?.dateStart;
        if (!resolved) return undefined;
        return resolved instanceof Date ? resolved : new Date(resolved);
    }, [formik.values?.dateStart, formik.values?.legs, isSubsequentMultiCityLeg]);
    const dateEnd = formik.values?.dateEnd;

    const [viewMonth, setViewMonth] = useState(() => startOfMonth(currentMonth));

    useEffect(() => {
        const normalized = startOfMonth(currentMonth);
        currentMonthRef.current = normalized;
        setViewMonth(normalized);
    }, [currentMonth]);

    useEffect(() => {
        if (!dateStart) {
            dateStartAutoAdvancedRef.current = null;
        }
    }, [dateStart]);

    useEffect(() => {
        if (!hasClickCalendar || dateEnd) {
            returnPickerViewInitializedRef.current = false;
        }
    }, [hasClickCalendar, dateEnd]);

    const containerClass = useMemo(() => {
        if (isChangeFlight) return 'w-full';
        // Multi-city mobile step is full-bleed inside MobModal.
        if (isMultiCityLeg && isMobile) return 'w-full';
        // Extra top padding so month titles / nav clear the popover edge.
        // Desktop multi-city uses the same padding as one-way / return.
        return 'bg-white rounded-2xl px-3 pt-4 pb-3 w-full max-w-7xl mx-auto';
    }, [isChangeFlight, isMultiCityLeg, isMobile]);

    // Earliest month the user may page to: today while picking departure; departure
    // month once the outbound date is set and the return leg is active.
    const navigationMinMonth = useMemo(() => {
        const todayMonth = startOfMonth(new Date());
        if (isFlightSchedulePage) return startOfMonth(minMonth);
        if (tripType !== 'Return' || !hasClickCalendar || !dateStart) {
            return todayMonth;
        }
        const departureMonth = startOfMonth(new Date(dateStart));
        return departureMonth < todayMonth ? todayMonth : departureMonth;
    }, [isFlightSchedulePage, tripType, hasClickCalendar, dateStart, minMonth]);

    const navigateMonth = useCallback((newMonth) => {
        const normalizedNewMonth = startOfMonth(newMonth);
        const normalizedMinMonth = startOfMonth(navigationMinMonth);

        if (normalizedNewMonth < normalizedMinMonth) return;

        currentMonthRef.current = normalizedNewMonth;
        setViewMonth(normalizedNewMonth);
        setCurrentMonth(normalizedNewMonth);
        setShouldAnimateMonth(true);
    }, [navigationMinMonth, setCurrentMonth]);

    // Automatically stop the animation after 300ms
    useEffect(() => {
        if (shouldAnimateMonth) {
            const timeout = setTimeout(() => {
                setShouldAnimateMonth(false);
            }, 300); // match animation duration
            return () => clearTimeout(timeout);
        }
    }, [shouldAnimateMonth]);

    // Detect trip type changes and trigger flash animation
    useEffect(() => {
        if (prevTripTypeRef.current !== null && prevTripTypeRef.current !== tripType) {
            // Trip type changed, trigger flash animation
            setFlashKey(prev => prev + 1);
        }
        prevTripTypeRef.current = tripType;
    }, [tripType]);

    const normalizeDateKey = useCallback((date) => toCalendarDateKeyFromAny(date), []);

    // Get the selected departure date key for exclusion from unavailable style
    // Always exclude the currently selected departure date (dateStart) from "unavailable",
    // regardless of trip type or scheduleStatusData (so it never appears disabled).
    const selectedDepartureDateKey = useMemo(() => {
        if (!dateStart) return null;

        // On flight schedule page we treat all days as available; skip this logic entirely
        if (isFlightSchedulePage) return null;

        const key = toCalendarDateKeyFromAny(dateStart);
        return key || null;
    }, [dateStart, isFlightSchedulePage]);

    // Inline matchers keyed by local date:
    // - availableMatcher: true only when status === "Available"
    // - unavailableMatcher: true when not available (or missing), but excludes the selected departure date
    const statusMap = useMemo(() => {
        if (isFlightSchedulePage) return null;
        if (!Array.isArray(statusData)) return null;
        const map = new Map();
        statusData.forEach((item) => {
            if (!item?.flightTimes) return;
            const dateStr = String(item.flightTimes);
            const trimmed = dateStr.trim();
            let key = '';
            if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
                key = trimmed.slice(0, 10);
            } else {
                key = toCalendarDateKeyFromAny(trimmed);
            }
            if (!key) return;
            map.set(key, item.status);
        });
        return map;
    }, [statusData, isFlightSchedulePage, normalizeDateKey]);

    const markUnavailableWithoutSchedule = useCallback(
        (date) => {
            if (selectedDepartureDateKey) {
                const key = normalizeDateKey(date);
                if (key === selectedDepartureDateKey) return false;
            }
            return true;
        },
        [normalizeDateKey, selectedDepartureDateKey],
    );

    const unavailableMatcher = useMemo(() => {
        if (isFlightSchedulePage) return () => false;

        const isPickingReturn =
            tripType === 'Return' && hasClickCalendar && !dateEnd;

        // While schedule is loading or still showing the wrong route, avoid greying
        // days until the correct leg data is ready (pending state blocks clicks).
        if ((isPickingReturn || isSubsequentMultiCityLeg) && !scheduleMatchesActiveLeg) {
            return () => false;
        }

        if (!statusMap) {
            if (isSubsequentMultiCityLeg) {
                return markUnavailableWithoutSchedule;
            }
            return () => false;
        }

        if (statusMap.size === 0) {
            if (isPickingReturn) {
                return () => false;
            }
            if (isSubsequentMultiCityLeg) {
                return markUnavailableWithoutSchedule;
            }
            return markUnavailableWithoutSchedule;
        }

        return (date) => {
            const key = normalizeDateKey(date);
            if (selectedDepartureDateKey && key === selectedDepartureDateKey) {
                return false;
            }
            const status = statusMap.get(key);
            return !status || status !== 'Available';
        };
    }, [
        isFlightSchedulePage,
        tripType,
        hasClickCalendar,
        dateEnd,
        isSubsequentMultiCityLeg,
        scheduleMatchesActiveLeg,
        statusMap,
        normalizeDateKey,
        markUnavailableWithoutSchedule,
    ]);

    const availableMatcher = useMemo(() => {
        if (isFlightSchedulePage) return () => false;
        if (!statusMap || statusMap.size === 0) return () => false;

        return (date) => {
            const key = normalizeDateKey(date);
            const status = statusMap.get(key);
            return status === 'Available';
        };
    }, [isFlightSchedulePage, statusMap, normalizeDateKey]);

    // After picking the first date in round-trip mode, advance the calendar by
    // one month if the chosen date is the last *available* (selectable) day in
    // the rightmost visible month — so the user can pick a return without
    // having to manually advance the calendar. Runs once per departure date,
    // not on every month navigation.
    useEffect(() => {
        if (isMobile) return; // Vertical month stack — no auto page-forward.
        if (tripType !== 'Return') return;
        if (!dateStart || dateEnd) return;

        const dateStartKey = toCalendarDateKeyFromAny(dateStart);
        if (!dateStartKey || dateStartAutoAdvancedRef.current === dateStartKey) return;

        const start = new Date(dateStart);
        const viewMonth = currentMonthRef.current;
        const numberOfMonths = 2;
        const rightmostMonth = new Date(
            viewMonth.getFullYear(),
            viewMonth.getMonth() + numberOfMonths - 1,
            1
        );
        const sameMonthAsRightmost =
            start.getFullYear() === rightmostMonth.getFullYear() &&
            start.getMonth() === rightmostMonth.getMonth();
        if (!sameMonthAsRightmost) return;

        const daysInRightmost = new Date(
            rightmostMonth.getFullYear(),
            rightmostMonth.getMonth() + 1,
            0
        ).getDate();

        // Walk back from the last calendar day to find the last day that isn't
        // marked unavailable. That's the last day a user can actually pick
        // without paging the calendar forward themselves.
        let lastSelectableDay = null;
        for (let day = daysInRightmost; day >= 1; day -= 1) {
            const candidate = new Date(
                rightmostMonth.getFullYear(),
                rightmostMonth.getMonth(),
                day
            );
            if (!unavailableMatcher(candidate)) {
                lastSelectableDay = day;
                break;
            }
        }

        if (lastSelectableDay != null && start.getDate() === lastSelectableDay) {
            const nextMonth = new Date(
                viewMonth.getFullYear(),
                viewMonth.getMonth() + 1,
                1
            );
            dateStartAutoAdvancedRef.current = dateStartKey;
            setCurrentMonth(nextMonth);
            setShouldAnimateMonth(true);
        }
    }, [dateStart, dateEnd, tripType, isMobile, setCurrentMonth, unavailableMatcher]);

    // Matcher for the hover-preview range while picking the return date
    // (round-trip only, after the first date is selected, before second is picked).
    const previewRangeMatcher = useMemo(() => {
        const isRoundTrip = tripType === 'Return';
        if (!isRoundTrip || !dateStart || dateEnd || !hoveredDate) {
            return () => false;
        }
        const startTime = new Date(dateStart).setHours(0, 0, 0, 0);
        const hoverTime = new Date(hoveredDate).setHours(0, 0, 0, 0);
        if (allowSameDayReturn ? hoverTime < startTime : hoverTime <= startTime) return () => false;

        return (date) => {
            const t = new Date(date).setHours(0, 0, 0, 0);
            return t > startTime && t < hoverTime;
        };
    }, [tripType, dateStart, dateEnd, hoveredDate, allowSameDayReturn]);

    const previewRangeEndMatcher = useMemo(() => {
        const isRoundTrip = tripType === 'Return';
        if (!isRoundTrip || !dateStart || dateEnd || !hoveredDate) {
            return () => false;
        }
        const startTime = new Date(dateStart).setHours(0, 0, 0, 0);
        const hoverTime = new Date(hoveredDate).setHours(0, 0, 0, 0);
        if (allowSameDayReturn ? hoverTime < startTime : hoverTime <= startTime) return () => false;

        return (date) => {
            const t = new Date(date).setHours(0, 0, 0, 0);
            return t === hoverTime;
        };
    }, [tripType, dateStart, dateEnd, hoveredDate, allowSameDayReturn]);

    // Matcher for first selected departure date in round-trip mode
    // Applies immediately after user selects the first date to show solid half circle
    const firstSelectedDepartureMatcher = useMemo(() => {
        const isRoundTrip = tripType === 'Return';

        // Only apply when: round-trip, first date selected (hasClickCalendar), dateStart exists, but no dateEnd yet
        // This ensures the style shows immediately after first date selection
        if (!isRoundTrip || !hasClickCalendar || !dateStart || dateEnd) {
            return () => false;
        }

        const dateStartKey = toCalendarDateKeyFromAny(dateStart);

        return (date) => {
            const key = normalizeDateKey(date);
            // Return true if this is the selected departure date
            return key === dateStartKey;
        };
    }, [tripType, hasClickCalendar, formik.values.dateStart, formik.values.dateEnd]);

    const canClearDates = Boolean(dateStart || dateEnd);

    const clearDatesLabel = isArabic ? 'مسح التواريخ' : 'Clear dates';

    /** Earliest day the user may pick: today for outbound; day after departure for return. */
    const minSelectableDay = useMemo(() => {
        if (minSelectableDayOverride) {
            const d =
                minSelectableDayOverride instanceof Date
                    ? minSelectableDayOverride
                    : new Date(minSelectableDayOverride);
            if (!Number.isNaN(d.getTime())) return startOfDay(d);
        }
        const today = startOfDay(new Date());
        if (tripType === 'OneWay') return today;
        if (!hasClickCalendar || !dateStart) return today;
        if (allowSameDayReturn) return startOfDay(new Date(dateStart));
        return addDays(startOfDay(new Date(dateStart)), 1);
    }, [tripType, hasClickCalendar, dateStart, allowSameDayReturn, minSelectableDayOverride]);

    // When the outbound date is confirmed, snap the view forward only if the user
    // is parked on an earlier month — do not re-run on every month navigation.
    useEffect(() => {
        if (isFlightSchedulePage || tripType !== 'Return' || !hasClickCalendar || !dateStart) {
            return;
        }
        const floorMonth = startOfMonth(new Date(dateStart));
        const todayMonth = startOfMonth(new Date());
        const navigationFloor = floorMonth < todayMonth ? todayMonth : floorMonth;
        const currentMonthStart = startOfMonth(currentMonthRef.current);
        if (currentMonthStart < navigationFloor) {
            setCurrentMonth(navigationFloor);
            setShouldAnimateMonth(true);
        }
    }, [
        isFlightSchedulePage,
        tripType,
        hasClickCalendar,
        dateStart,
        setCurrentMonth,
    ]);

    const syncKeyboardHover = useCallback((date) => {
        const normalized = startOfDay(date);
        setFocusedDate(normalized);
        setHoveredDate(normalized);
    }, []);

    const handleDayPickerSelect = useCallback(
        (range, triggerDate) => {
            // react-day-picker v9 passes the actually-clicked day as the 2nd arg.
            // Use it so a single click is never collapsed into a full {from,to} range.
            const clicked =
                triggerDate instanceof Date
                    ? triggerDate
                    : range instanceof Date
                      ? range
                      : range?.from instanceof Date
                        ? range.from
                        : null;

            if (clicked) {
                if (enableKeyboardNavigation) {
                    syncKeyboardHover(clicked);
                }
                handleDateSelect(clicked);
                return;
            }
            handleDateSelect(range);
        },
        [handleDateSelect, enableKeyboardNavigation, syncKeyboardHover],
    );

    const rangeMinNights = useMemo(() => {
        if (tripType !== 'Return') return undefined;
        if (!allowSameDayReturn) return 1;
        // Picking return leg: allow same-day; otherwise require separate departure click first
        if (hasClickCalendar && !dateEnd) return 0;
        // Modify search with existing range: allow one-click range edits
        if (isModifySearch && dateEnd) return 0;
        return 1;
    }, [tripType, allowSameDayReturn, hasClickCalendar, dateEnd, isModifySearch]);

    const beforeMinSelectableMatcher = useMemo(() => {
        const isPickingReturn =
            tripType === 'Return' && hasClickCalendar && !dateEnd;

        if (isPickingReturn) {
            const floor = minSelectableDayOverride
                ? startOfDay(
                      minSelectableDayOverride instanceof Date
                          ? minSelectableDayOverride
                          : new Date(minSelectableDayOverride),
                  )
                : startOfDay(new Date());
            return (date) => startOfDay(date) < floor;
        }

        const minDay = startOfDay(minSelectableDay);
        return (date) => startOfDay(date) < minDay;
    }, [
        tripType,
        hasClickCalendar,
        dateEnd,
        minSelectableDay,
        minSelectableDayOverride,
    ]);

    const calendarDisabledMatchers = useMemo(() => {
        if (isSchedulePending) {
            return [() => true];
        }

        if (isFlightSchedulePage) {
            return [
                {
                    before: dateStart ? new Date(dateStart) : new Date(),
                },
                ...(dateStart && hasClickCalendar
                    ? [
                          {
                              after: (() => {
                                  const startDate = new Date(dateStart);
                                  const maxDate = new Date(startDate);
                                  maxDate.setDate(maxDate.getDate() + 6);
                                  return maxDate;
                              })(),
                          },
                      ]
                    : []),
            ];
        }

        return [beforeMinSelectableMatcher, unavailableMatcher];
    }, [
        isSchedulePending,
        isFlightSchedulePage,
        dateStart,
        hasClickCalendar,
        beforeMinSelectableMatcher,
        unavailableMatcher,
    ]);

    const isDateDisabled = useCallback(
        (date) =>
            calendarDisabledMatchers.some((matcher) => {
                if (typeof matcher === 'function') return matcher(date);
                if (matcher?.before) return startOfDay(date) < startOfDay(matcher.before);
                if (matcher?.after) return startOfDay(date) > startOfDay(matcher.after);
                return false;
            }),
        [calendarDisabledMatchers],
    );

    const ensureMonthVisible = useCallback(
        (date) => {
            const view = currentMonthRef.current;
            const targetMonth = startOfMonth(date);
            const visibleStart = startOfMonth(view);
            const monthsVisible = isMobile ? MOBILE_SCROLL_MONTHS : 2;
            const visibleEnd = startOfMonth(
                new Date(view.getFullYear(), view.getMonth() + monthsVisible - 1, 1),
            );
            if (targetMonth < visibleStart || targetMonth > visibleEnd) {
                currentMonthRef.current = targetMonth;
                setViewMonth(targetMonth);
                setCurrentMonth(targetMonth);
                if (!isMobile) setShouldAnimateMonth(true);
            }
        },
        [isMobile, setCurrentMonth],
    );

    useEffect(() => {
        if (!dateStart) {
            if (enableKeyboardNavigation) {
                syncKeyboardHover(new Date());
            }
            return;
        }
        if (tripType === 'Return' && hasClickCalendar && !dateEnd) {
            const returnAnchor = allowSameDayReturn
                ? startOfDay(new Date(dateStart))
                : addDays(startOfDay(new Date(dateStart)), 1);
            if (enableKeyboardNavigation) {
                syncKeyboardHover(returnAnchor);
            }
            // Snap the view once when return selection begins (mobile + keyboard).
            // Avoid staying on the departure-step month anchored to today.
            if ((isMobile || enableKeyboardNavigation) && !returnPickerViewInitializedRef.current) {
                returnPickerViewInitializedRef.current = true;
                ensureMonthVisible(returnAnchor);
            }
            return;
        }
        if (enableKeyboardNavigation) {
            syncKeyboardHover(new Date(dateStart));
        }
    }, [
        enableKeyboardNavigation,
        isMobile,
        dateStart,
        dateEnd,
        tripType,
        hasClickCalendar,
        allowSameDayReturn,
        syncKeyboardHover,
        ensureMonthVisible,
    ]);

    // Keep the calendar container focused for keyboard navigation. Trip-type flash
    // remounts this subtree (key={flashKey}); refocus after that and when return
    // selection begins so arrow keys keep working.
    useEffect(() => {
        if (!enableKeyboardNavigation) return;
        calendarKeyboardRef.current?.focus({ preventScroll: true });
    }, [enableKeyboardNavigation, flashKey, hasClickCalendar]);

    const handleCalendarKeyDown = useCallback(
        (e) => {
            if (!enableKeyboardNavigation) return;

            const dayStep = {
                ArrowLeft: isArabic ? 1 : -1,
                ArrowRight: isArabic ? -1 : 1,
                ArrowUp: -7,
                ArrowDown: 7,
            }[e.key];

            if (dayStep != null) {
                e.preventDefault();
                const next = startOfDay(addDays(focusedDate, dayStep));
                syncKeyboardHover(next);
                ensureMonthVisible(next);
                return;
            }

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isDateDisabled(focusedDate)) return;

                const isRoundTrip = tripType === 'Return';
                const pickingDeparture =
                    isRoundTrip && (!hasClickCalendar || !dateStart);

                handleDateSelect(focusedDate);

                // After selecting the departure (first leg) with the keyboard,
                // immediately move focus to the first valid return date so the
                // user can pick the return without re-focusing the calendar.
                if (pickingDeparture) {
                    const returnAnchor = allowSameDayReturn
                        ? startOfDay(focusedDate)
                        : addDays(startOfDay(focusedDate), 1);
                    syncKeyboardHover(returnAnchor);
                    ensureMonthVisible(returnAnchor);
                }

                // Keep the calendar focused for the next arrow / Enter press.
                calendarKeyboardRef.current?.focus({ preventScroll: true });
            }
        },
        [
            enableKeyboardNavigation,
            isArabic,
            focusedDate,
            tripType,
            hasClickCalendar,
            dateStart,
            dateEnd,
            allowSameDayReturn,
            syncKeyboardHover,
            ensureMonthVisible,
            isDateDisabled,
            handleDateSelect,
        ],
    );

    const keyboardHoverAvailableMatcher = useMemo(() => {
        if (!enableKeyboardNavigation || !focusedDate) return () => false;
        return (date) => isSameDay(date, focusedDate) && availableMatcher(date);
    }, [enableKeyboardNavigation, focusedDate, availableMatcher]);

    const keyboardHoverUnavailableMatcher = useMemo(() => {
        if (!enableKeyboardNavigation || !focusedDate) return () => false;
        return (date) => isSameDay(date, focusedDate) && !availableMatcher(date);
    }, [enableKeyboardNavigation, focusedDate, availableMatcher]);

    // Continuous range caps: outer corners rounded, inner edge flat (logical = RTL-safe).
    // Kill RDP’s default circular day_button fill so the cell background reads as one pill.
    const dayPickerClassNames = useMemo(() => {
        const isRangeMode = isFlightSchedulePage || tripType === 'Return';
        // Single-date (one-way / multi-city): rounded-xl pill — same as hover + round-trip caps.
        const singleDayClass =
            'relative w-full min-h-8 sm:min-h-10 text-sm sm:text-md text-black rounded-xl';
        const base = {
            weekday:
                'uppercase text-xs sm:text-sm font-bold text-gray-500 text-center w-8 sm:w-10',
            caption_label:
                'text-center text-base sm:text-lg font-semibold text-black',
            // Range mode: full-width cells so middle fills connect; single keeps pill days.
            // Do not force !rounded-none here — available days need idle !rounded-xl (no hover flash).
            day: isRangeMode
                ? 'relative w-full min-h-8 sm:min-h-10 text-sm sm:text-md text-black rounded-none'
                : singleDayClass,
            today: isRangeMode
                ? 'relative w-full min-h-8 sm:min-h-10 text-sm sm:text-md text-black rounded-none'
                : singleDayClass,
            ...(isRangeMode
                ? {
                      day_button:
                          'w-full h-full min-h-8 sm:min-h-10 rounded-none border-0 bg-transparent',
                  }
                : {
                      day_button:
                          'w-full h-full min-h-8 sm:min-h-10 rounded-xl border-0 bg-transparent',
                  }),
            selected: isRangeMode
                ? RANGE_DAY_BUTTON_RESET
                : 'text-white !bg-secondary !rounded-xl',
            range_middle: RANGE_MIDDLE_CLASS,
            range_start: RANGE_CAP_START_CLASS,
            range_end: RANGE_CAP_END_CLASS,
            outside: '!cursor-default !bg-transparent !text-transparent after:!hidden',
        };
        if (!isMobile) {
            return {
                ...base,
                month_caption: 'hidden',
                caption_label: 'hidden',
            };
        }
        // Mobile: keep equal table columns (do not shrink cells to w-8).
        return {
            ...base,
            weekday:
                'uppercase text-xs font-bold text-gray-500 text-center align-middle p-0',
            day: 'relative text-sm text-black text-center align-middle p-0 rounded-none w-full',
            today: 'relative text-sm text-black text-center align-middle p-0 rounded-none w-full',
            day_button:
                'relative mx-auto flex min-h-9 w-full flex-col items-center justify-center rounded-none bg-transparent',
            months: 'flex flex-col gap-8 w-full',
            month: 'w-full',
            month_grid: 'w-full table-fixed border-collapse',
            weekdays: 'w-full',
            week: 'w-full',
        };
    }, [isMobile, isFlightSchedulePage, tripType]);

    const availableHoverClass =
        'keyboardHoverAvailable !bg-secondary !text-white !rounded-xl cursor-pointer after:!hidden';

    const unavailableHoverClass =
        '!bg-gray-300 !text-gray-600 !rounded-full !cursor-not-allowed !no-underline !opacity-100 after:!hidden';

    return (
        <div className={containerClass}>
            {isMobile && isMultiCityLeg ? (
                <div className="mb-4 w-full">
                    <MobileCalendarDateFields
                        tripType={TRIP_TYPES.ONEWAY}
                        dateStart={dateStart}
                        dateEnd={null}
                        hasClickCalendar={false}
                        onPickDeparture={() => {}}
                        onPickReturn={() => {}}
                        departureLabel={copy.flightInfo.departure}
                        returnLabel={copy.flightInfo.return}
                        selectDatePlaceholder={copy.flightInfo.selectDate}
                    />
                </div>
            ) : null}

            {/* Always show selected dates display */}
            {/* <SelectedDateDisplay
                selected={selected}
                tripType={tripType}
                handleReset={handleReset}
                isChangeFlight={isChangeFlight}
                isFlightSchedulePage={isFlightSchedulePage}
            /> */}

            <motion.div
                key={flashKey}
                initial={{ opacity: 1 }}
                animate={{
                    opacity: [1, 0.3, 1],
                }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                }}
                className={`booking-calendar-panel relative ${
                    !isMobile && shouldAnimateMonth ? 'animate-fadeInLeft' : ''
                }`}
            >
                {!isMobile ? (
                    <div className="booking-calendar-nav relative">
                        <MonthNavigation
                            currentMonth={viewMonth}
                            minMonth={navigationMinMonth}
                            handleMonthChange={navigateMonth}
                            visibleMonths={2}
                        />
                    </div>
                ) : null}
                <div
                    ref={calendarKeyboardRef}
                    tabIndex={enableKeyboardNavigation ? 0 : undefined}
                    onKeyDown={handleCalendarKeyDown}
                    className={`booking-calendar-grid overflow-x-hidden w-full outline-none ${
                        isSchedulePending ? 'pointer-events-none opacity-50' : ''
                    }`}
                    aria-busy={isSchedulePending}
                >
                    <DayPicker
                        today={new Date()}
                        month={viewMonth}
                        numberOfMonths={isMobile ? MOBILE_SCROLL_MONTHS : 2}
                        {...(isMobile
                            ? {
                                  hideNavigation: true,
                                  startMonth: navigationMinMonth,
                                  endMonth: new Date(
                                      navigationMinMonth.getFullYear(),
                                      navigationMinMonth.getMonth() +
                                          MOBILE_SCROLL_MONTHS -
                                          1,
                                      1,
                                  ),
                              }
                            : {
                                  startMonth: isFlightSchedulePage
                                      ? navigationMinMonth
                                      : undefined,
                              })}
                        fixedWeeks
                        showOutsideDays
                        locale={calendarLocale}
                        formatters={calendarFormatters}
                        min={rangeMinNights}
                        resetOnSelect={isModifySearch && tripType === 'Return'}
                        disabled={calendarDisabledMatchers}
                        modifiers={{
                            available: availableMatcher,
                            unavailable: unavailableMatcher,
                            firstSelectedDeparture: firstSelectedDepartureMatcher,
                            previewRange: previewRangeMatcher,
                            previewRangeEnd: previewRangeEndMatcher,
                            keyboardHoverAvailable: keyboardHoverAvailableMatcher,
                            keyboardHoverUnavailable: keyboardHoverUnavailableMatcher,
                        }}
                        onDayMouseEnter={(date) => {
                            // Only track hover for return-date range preview — avoids re-render flash on idle hover.
                            const needsPreview =
                                (isFlightSchedulePage || tripType === 'Return') &&
                                Boolean(dateStart) &&
                                !dateEnd;
                            if (needsPreview) {
                                setHoveredDate(date);
                            }
                            if (enableKeyboardNavigation) {
                                setFocusedDate(startOfDay(date));
                            }
                        }}
                        onDayMouseLeave={() => {
                            if (!enableKeyboardNavigation) {
                                setHoveredDate(null);
                            }
                        }}
                        modifiersClassNames={{
                            outside:
                                '!cursor-default !bg-transparent !text-transparent !opacity-100 !line-through-0 after:!hidden after:!content-none pointer-events-none',
                            available:
                                'cursor-pointer after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:rounded-full after:bg-secondary',
                            unavailable:
                                '!text-gray-400 !line-through !opacity-50 !cursor-not-allowed !hover:bg-transparent !hover:text-gray-400 after:!hidden',
                            firstSelectedDeparture: `${RANGE_CAP_START_CLASS} firstSelectedDeparture after:!hidden`,
                            previewRange: `${RANGE_MIDDLE_CLASS} previewRange !no-underline !opacity-100 after:!hidden`,
                            previewRangeEnd: `${RANGE_CAP_END_CLASS} previewRangeEnd !no-underline !opacity-100 after:!hidden`,
                            keyboardHoverAvailable: availableHoverClass,
                            keyboardHoverUnavailable: unavailableHoverClass,
                        }}
                        mode={isFlightSchedulePage ? 'range' : tripType === 'OneWay' ? 'single' : 'range'}
                        selected={selected}
                        onSelect={handleDayPickerSelect}
                        className={
                            isMobile
                                ? [
                                      'booking-calendar-range w-full [&_.rdp-nav]:hidden',
                                      '[&_.rdp-months]:flex [&_.rdp-months]:flex-col [&_.rdp-months]:gap-8 [&_.rdp-month]:w-full',
                                      '[&_.rdp-month_caption]:flex [&_.rdp-month_caption]:justify-center',
                                      '[&_.rdp-month_grid]:w-full [&_.rdp-month_grid]:table-fixed [&_.rdp-month_grid]:border-collapse',
                                      // Equal 7 columns — weekdays and days share the same cell width
                                      '[&_.rdp-weekday]:!w-[14.2857%] [&_.rdp-weekday]:!max-w-[14.2857%] [&_.rdp-weekday]:text-center [&_.rdp-weekday]:align-middle [&_.rdp-weekday]:!p-0',
                                      // Restore table-cell (global sets inline-flex) so columns line up under SU…SA
                                      '[&_.rdp-day]:!table-cell [&_.rdp-day]:!w-[14.2857%] [&_.rdp-day]:!max-w-[14.2857%] [&_.rdp-day]:!m-0 [&_.rdp-day]:!p-0.5 [&_.rdp-day]:!align-middle [&_.rdp-day]:!text-center [&_.rdp-day]:!aspect-auto',
                                      // Dot spacing comes from CustomDayContent — hide the cell ::after duplicate
                                      '[&_.rdp-day]:after:!hidden',
                                      '[&_.rdp-day_button]:!mx-auto [&_.rdp-day_button]:!my-0 [&_.rdp-day_button]:!flex [&_.rdp-day_button]:!min-h-9 [&_.rdp-day_button]:!w-full [&_.rdp-day_button]:!flex-col [&_.rdp-day_button]:!items-center [&_.rdp-day_button]:!justify-center [&_.rdp-day_button]:!rounded-none [&_.rdp-day_button]:!p-0 [&_.rdp-day_button]:!bg-transparent',
                                    ].join(' ')
                                : 'booking-calendar-range booking-calendar-hide-rdp-caption w-full [&_.rdp-nav]:hidden [&_.rdp-months]:flex [&_.rdp-months]:w-full [&_.rdp-months]:justify-between [&_.rdp-months]:gap-6 [&_.rdp-month]:min-w-0 [&_.rdp-month]:flex-1 [&_.rdp-table]:w-full [&_.rdp-cell]:text-center'
                        }
                        classNames={dayPickerClassNames}
                        components={{
                            DayContent: (props) => <CustomDayContent {...props} />,
                        }}
                    />
                </div>

                {typeof handleReset === 'function' && !isMobile && (
                    <div className="booking-calendar-footer mt-3 pt-3 flex flex-col items-end justify-center gap-1 border-t border-stone-200/90">
                        <button
                            type="button"
                            disabled={!canClearDates}
                            onClick={() => {
                                if (canClearDates) handleReset();
                            }}
                            className={`group hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-0.5 text-sm font-medium ${
                                canClearDates
                                    ? 'cursor-pointer text-[var(--text-600)] hover:text-secondary'
                                    : 'cursor-default! text-gray-400 opacity-0'
                            }`}
                            aria-label={clearDatesLabel}
                            aria-disabled={!canClearDates}
                        >
                            <ArrowCounterClockwise
                                size={16}
                                weight="bold"
                                className={`shrink-0 transition-colors ${
                                    canClearDates
                                        ? 'text-primary-2 group-hover:text-secondary'
                                        : 'text-gray-400'
                                }`}
                                aria-hidden
                            />
                            <span>{clearDatesLabel}</span>
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default (Dates);
