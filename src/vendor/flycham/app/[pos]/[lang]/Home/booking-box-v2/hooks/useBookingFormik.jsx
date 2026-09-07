'use client';
import { flushSync } from 'react-dom';
import { setFormikData, setSearchParams, setSelectedF, setSelectedPlan, setFlights, setIndirectAirPort } from '@/store/flightSlice';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { encodeSearchToken } from '@/util/searchToken';
import { toCalendarDateKeyFromAny } from '@/util/calendarDateKey';
import { saveRecentSearchCookie } from '@/util/recentSearchStorage';
import { ANALYTICS_EVENTS, pushAnalyticsEvent } from '@/lib/analytics';
import {
    buildSearchContextFromFormValues,
    setBookingAnalyticsContext,
} from '@/lib/bookingAnalyticsContext';
import {
    getDefaultLegs,
    getFirstLeg,
    normalizeFormikDataFromLegacy,
} from '@/app/[pos]/[lang]/Home/booking-box-v2/utils/legsUtils';
import {
    buildMultiCityLegsFromFormValues,
    MULTI_CITY_FLIGHT_TYPE,
} from '@/util/multiCitySearchParams';

/**
 * Encapsulates BookingBox formik + submit flow.
 * Leg data is stored in values.legs[] instead of source/source2/source3, etc.
 */
const defaultValues = {
    legs: getDefaultLegs(),
    adults: 1,
    children: 0,
    infants: 0,
    infantsWithSeat: 0,
    promoCode: '',
    cabinClass: 'Economy',
    dateEnd: '',
    type: 0,
    tripType: 'OneWay',
    nearby: false,
    hasClickCalendar: false,
    miles: false
};

const formatDate = (date) => {
    const key = toCalendarDateKeyFromAny(date);
    return key ? `${key}T00:00:00` : null;
};

const buildSearchQueryString = (data, token) => {
    if (token) {
        return new URLSearchParams({ token }).toString();
    }
    const fallbackParams = {};
    Object.entries(data).forEach(([k, v]) => {
        if (k === 'legs') {
            fallbackParams.legs = JSON.stringify(v);
            return;
        }
        if (v !== undefined && v !== null && v !== '') fallbackParams[k] = String(v);
    });
    return new URLSearchParams(fallbackParams).toString();
};

/**
 * Shared helper to build search payload + URL from current form values.
 * Used by both the submit handler and Link-based navigation.
 * Reads first leg from values.legs[0].
 */
export function buildSearchUrl({
  values,
  cId,
  resultsPath,
  airPorts,
  allowSameDayReturn = false,
}) {
    const {
        cabinClass,
        dateEnd,
        adults,
        children,
        infants,
        infantsWithSeat = 0,
        tripType,
        nearby = false,
    } = values;

    const { source, destination, dateStart } = getFirstLeg(values);

    const formattedDeparture = formatDate(dateStart);
    const formattedReturn = formatDate(dateEnd);
    const flightclass = cabinClass === 'Economy' ? 'Y' : 'C';

    if (tripType === MULTI_CITY_FLIGHT_TYPE) {
        const legs = buildMultiCityLegsFromFormValues(values, formatDate);
        if (!legs) {
            throw new Error('SEARCH_VALIDATION');
        }

        const data = {
            origin_id: legs[0].origin_id,
            destination_id: legs[0].destination_id,
            date: legs[0].date,
            adults,
            children,
            infants,
            flightclass,
            flighttype: MULTI_CITY_FLIGHT_TYPE,
            pos_id: 0,
            nearby: false,
            neirby: false,
            legs,
        };
        if (Number(infantsWithSeat) > 0) {
            data.infantswithseat = infantsWithSeat;
        }

        const token = encodeSearchToken(data);
        const query = buildSearchQueryString(data, token);

        const basePath = resultsPath
            ? resultsPath
            : `/${cId ? `search-results/c/${cId}` : 'search-results'}`;

        return {
            href: `${basePath}?${query}`,
            data,
        };
    }

    let data = {
        origin_id: source,
        destination_id: destination,
        date: formattedDeparture,
        adults,
        children,
        infants,
        flightclass,
        flighttype: tripType,
        pos_id: 0,
        nearby: Boolean(nearby),
        neirby: Boolean(nearby),
    };

    if (tripType === 'Return' && formattedReturn) {
        const depKey = formattedDeparture?.slice(0, 10);
        const retKey = formattedReturn?.slice(0, 10);
        const returnBeforeDeparture = allowSameDayReturn
            ? retKey < depKey
            : retKey <= depKey;
        if (depKey && retKey && returnBeforeDeparture) {
            throw new Error('RETURN_DATE_BEFORE_DEPARTURE');
        }
        data.date_return = formattedReturn;
    }

    if (Number(infantsWithSeat) > 0) {
        data.infantswithseat = infantsWithSeat;
    }

    const token = encodeSearchToken(data);
    const query = buildSearchQueryString(data, token);

    const basePath = resultsPath
        ? resultsPath
        : `/${cId ? `search-results/c/${cId}` : 'search-results'}`;

    return {
        href: `${basePath}?${query}`,
        data,
    };
}

export default function useBookingFormik({
    cId,
    setSelectedFlight: setSelectedFlightProp = () => { },
    setActiveStep: setActiveStepProp = () => { },
    handleResetToFirstStep = () => { },
    onCloseMidifySearch = () => { },
    setSubmitted = () => { },     // to toggle submit state in the caller
    resultsPath,
    onBeforeNavigate = async () => { },
    /** In-page modify (search-results): skeleton + clear list before async fetch. */
    onSearchIntentStart = null,
    navigateWithRouter = true,    // allow callers to opt out of router navigation when using <Link>
    defaultTripType,
    allowSameDayReturn = false,
}) {
    const [isNavigating, startTransition] = useTransition();
    const searchNavigateLockRef = useRef(false);

    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { formikData, airPorts } = useSelector((state) => state.flights);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            ...defaultValues,
            ...(defaultTripType ? { tripType: defaultTripType } : {}),
            ...(formikData ? normalizeFormikDataFromLegacy(formikData) : {}),
        },
        onSubmit: async (values) => {
            console.log('onSubmit', values);

            const { data, href } = buildSearchUrl({
                values,
                cId,
                resultsPath,
                airPorts,
                allowSameDayReturn,
            });
            const { dateStart, source, destination } = getFirstLeg(values);

            if (!dateStart || !source || !destination) {
                setSubmitted(false);
                throw new Error('SEARCH_VALIDATION');
            }

            // Skeleton + clear stale results before modal close / reset re-render (modify search).
            if (!navigateWithRouter && typeof onSearchIntentStart === 'function') {
                onSearchIntentStart(data);
            }

            dispatch(setSelectedF(null));
            dispatch(setSelectedPlan(null));
            setSubmitted(true);
            onCloseMidifySearch();
            flushSync(() => {
                if (typeof setSelectedFlightProp === 'function') setSelectedFlightProp(null);
                if (typeof setActiveStepProp === 'function') setActiveStepProp(0);
                dispatch(setSelectedF(null));
                handleResetToFirstStep();
            });

            saveRecentSearchCookie(data, airPorts?.items);
            const searchContext = buildSearchContextFromFormValues(values);
            setBookingAnalyticsContext(searchContext);
            pushAnalyticsEvent(ANALYTICS_EVENTS.FLIGHT_SEARCH, {
                event_action: 'search',
                ...searchContext,
                promo_code: values?.promoCode || undefined,
            });

            // Persist in redux. In-page modify (search-results) updates searchParams in applySearchParams
            // after fetch — early setSearchParams here desyncs URL vs Redux and can trigger stale refetches.
            if (navigateWithRouter) {
                // Drop previous search's flight lists before navigating so results never paint SAW under SHJ.
                dispatch(setFlights([]));
                dispatch(setIndirectAirPort([]));
                void queryClient.removeQueries({ queryKey: ['availability'] });
                dispatch(setSearchParams(data));
            }
            dispatch(setFormikData(values));

            try {
                if (typeof onBeforeNavigate === 'function') {
                    await onBeforeNavigate(data, values);
                }
                // Clear selection again after API finishes so prev selection is never shown with new data
                flushSync(() => {
                    if (typeof setSelectedFlightProp === 'function') setSelectedFlightProp(null);
                    if (typeof setActiveStepProp === 'function') setActiveStepProp(0);
                    dispatch(setSelectedF(null));
                    handleResetToFirstStep();
                });
            } catch (error) {
                console.error('Pre-navigation search failed', error);
                setSubmitted(false);
                throw error;
            }

            if (navigateWithRouter) {
                searchNavigateLockRef.current = true;
                startTransition(() => {
                    router.push(href);
                });
            } else {
                searchNavigateLockRef.current = false;
            }
        },
    });

    const handleSearchSubmit = useCallback(async () => {
        searchNavigateLockRef.current = false;
        try {
            await formik.submitForm();
        } catch (err) {
            console.error('Search form submit failed', err);
        }
        return searchNavigateLockRef.current;
    }, [formik]);

    return Object.assign(formik, { handleSearchSubmit });
}
