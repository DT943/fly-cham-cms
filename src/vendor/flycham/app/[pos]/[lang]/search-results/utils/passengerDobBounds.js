import { PAX_TYPE, normalizePassengerTypeCode } from '@/app/[pos]/[lang]/search-results/utils/passengerTypeUtils';
import getPassengerClassification from '@/util/getPassengerClassification';
import {
    isMultiCityFlightType,
    resolveMultiCityLegsFromKeyParams,
} from '@/util/multiCitySearchParams';

export function parseDepartureDate(departureDate) {
    if (!departureDate) return new Date();
    if (departureDate instanceof Date && !Number.isNaN(departureDate.getTime())) {
        return departureDate;
    }
    const s = String(departureDate).trim().slice(0, 10);
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    const d = new Date(departureDate);
    return Number.isNaN(d.getTime()) ? new Date() : d;
}

function toDateOnly(value) {
    if (!value) return '';
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    return String(value).trim().slice(0, 10);
}

function addYears(date, years) {
    return new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
}

/** True when dob satisfies age rules for typeValue at departure (mirrors bookingValidationSchemas). */
export function isValidDobForPassengerType(dob, typeValue, departureDate) {
    if (!dob || !typeValue || Number.isNaN(dob.getTime())) return false;

    const asOf = parseDepartureDate(departureDate);
    if (dob > asOf) return false;

    switch (typeValue) {
        case 'ADT': {
            const twelve = addYears(dob, 12);
            return asOf >= twelve;
        }
        case 'CHD': {
            const two = addYears(dob, 2);
            const twelve = addYears(dob, 12);
            return asOf >= two && asOf < twelve;
        }
        case PAX_TYPE.INF:
        case PAX_TYPE.INS: {
            const two = addYears(dob, 2);
            return asOf < two;
        }
        default:
            return false;
    }
}

/**
 * Collect ordered unique trip dates for DOB type checks.
 * Multi-city: every leg date. Round trip: outbound + return.
 */
export function resolvePassengerTripSegmentDates({
    keyParams = null,
    departureDate = null,
    returnDate = null,
    segmentDates = null,
} = {}) {
    const unique = [];
    const push = (value) => {
        const key = toDateOnly(value);
        if (!key || unique.includes(key)) return;
        unique.push(key);
    };

    if (Array.isArray(segmentDates) && segmentDates.length > 0) {
        segmentDates.forEach(push);
        return unique;
    }

    if (isMultiCityFlightType(keyParams?.flighttype)) {
        resolveMultiCityLegsFromKeyParams(keyParams).forEach((leg) => push(leg?.date));
        if (unique.length >= 2) return unique;
    }

    push(departureDate ?? keyParams?.date);
    push(returnDate ?? keyParams?.date_return);
    return unique;
}

function localizeAgeClassification(classification, t) {
    const value = String(classification || '').toLowerCase();
    if (value.includes('infant')) {
        return t('searchResults.validation.classificationInfant');
    }
    if (value.includes('child')) {
        return t('searchResults.validation.classificationChild');
    }
    return t('searchResults.validation.classificationAdult');
}

/**
 * Round-trip / multi-city: DOB must keep the same booked passenger type on every
 * segment date (e.g. infant on first flight must still be infant on later flights).
 */
export function getCrossSegmentAgeMismatch({
    dob,
    typeValue,
    departureDate,
    returnDate,
    segmentDates,
    keyParams,
    tripKind,
    t,
}) {
    if (!dob || !typeValue || typeof t !== 'function') return null;
    const birth = dob instanceof Date ? dob : parseDepartureDate(dob);
    if (Number.isNaN(birth.getTime())) return null;

    const dates = resolvePassengerTripSegmentDates({
        keyParams,
        departureDate,
        returnDate,
        segmentDates,
    });
    if (dates.length < 2) return null;

    const firstAsOf = parseDepartureDate(dates[0]);
    // First-leg type rules are validated separately; only flag category drift across later legs.
    if (!isValidDobForPassengerType(birth, typeValue, firstAsOf)) return null;

    let failIndex = -1;
    for (let i = 1; i < dates.length; i += 1) {
        if (!isValidDobForPassengerType(birth, typeValue, dates[i])) {
            failIndex = i;
            break;
        }
    }
    if (failIndex < 0) return null;

    const laterAsOf = parseDepartureDate(dates[failIndex]);
    const firstClassification = localizeAgeClassification(
        getPassengerClassification(birth, firstAsOf),
        t,
    );
    const laterClassification = localizeAgeClassification(
        getPassengerClassification(birth, laterAsOf),
        t,
    );

    const resolvedTripKind =
        tripKind ||
        (isMultiCityFlightType(keyParams?.flighttype) ? 'multiCity' : 'roundTrip');

    const normalizedType = normalizePassengerTypeCode(typeValue);
    let message;
    if (normalizedType === PAX_TYPE.INF || normalizedType === PAX_TYPE.INS) {
        message = t('searchResults.validation.ageCategoryMismatchInfantTurns2');
    } else if (normalizedType === PAX_TYPE.CHD) {
        message = t('searchResults.validation.ageCategoryMismatchChildTurns12');
    } else if (resolvedTripKind === 'multiCity') {
        message = t('searchResults.validation.ageCategoryMismatchAcrossMultiCity', {
            firstClassification,
            laterClassification,
            firstLeg: 1,
            laterLeg: failIndex + 1,
        });
    } else {
        message = t('searchResults.validation.ageCategoryMismatchAcrossTrip', {
            outboundClassification: firstClassification,
            returnClassification: laterClassification,
        });
    }

    return {
        tripKind: resolvedTripKind,
        firstLeg: 1,
        laterLeg: failIndex + 1,
        outboundClassification: firstClassification,
        returnClassification: laterClassification,
        firstClassification,
        laterClassification,
        message,
    };
}

/** Years (desc) where at least one calendar date in that year is valid for the pax type. */
export function getAllowedYearsForPassengerType(typeValue, departureDate) {
    const asOf = parseDepartureDate(departureDate);
    const endYear = asOf.getFullYear();
    const startYear = Math.max(1900, endYear - 120);
    const years = [];

    for (let y = endYear; y >= startYear; y -= 1) {
        const probes = [
            new Date(y, 0, 1),
            new Date(y, 5, 15),
            new Date(y, 11, 28),
        ];
        if (probes.some((d) => isValidDobForPassengerType(d, typeValue, asOf))) {
            years.push(y);
        }
    }

    return years;
}

/**
 * Years (desc) where the EXACT picked day+month is a valid DOB for the pax type — so once the user has
 * chosen a day and month, the year select only offers years that keep the age rule (e.g. an infant picking
 * Jan 1 won't be offered a year that makes them ≥ 2 on the departure date). Falls back to the pax-type range
 * until both day and month are chosen.
 */
export function getAllowedYearsForDayMonth(day, month, typeValue, departureDate) {
    if (!day || !month) return getAllowedYearsForPassengerType(typeValue, departureDate);

    const asOf = parseDepartureDate(departureDate);
    const endYear = asOf.getFullYear();
    const startYear = Math.max(1900, endYear - 120);
    const d = Number(day);
    const m = Number(month);
    const years = [];

    for (let y = endYear; y >= startYear; y -= 1) {
        if (d > daysInMonth(m, y)) continue; // e.g. Feb 29 only exists on leap years
        const dob = new Date(y, m - 1, d);
        if (isValidDobForPassengerType(dob, typeValue, asOf)) {
            years.push(y);
        }
    }

    return years;
}

export function daysInMonth(month, year) {
    if (!month || !year) return 31;
    const m = Number(month);
    const y = Number(year);
    if (!Number.isFinite(m) || !Number.isFinite(y) || m < 1 || m > 12) return 31;
    return new Date(y, m, 0).getDate();
}

export function isValidCalendarDate(day, month, year) {
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y)) return false;
    if (d < 1 || m < 1 || m > 12) return false;
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function formatIsoDate(day, month, year) {
    if (!isValidCalendarDate(day, month, year)) return '';
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseIsoDate(value) {
    if (!value) return { day: '', month: '', year: '' };
    const m = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return { day: '', month: '', year: '' };
    return { year: m[1], month: m[2], day: m[3] };
}

export function getAllowedMonthsForDayYear(day, year, typeValue, departureDate) {
    if (!day || !year) return [];
    const months = [];
    for (let m = 1; m <= 12; m += 1) {
        const maxDay = daysInMonth(m, year);
        if (Number(day) > maxDay) continue;
        const dob = new Date(Number(year), m - 1, Number(day));
        if (isValidDobForPassengerType(dob, typeValue, departureDate)) {
            months.push(m);
        }
    }
    return months;
}

export function getAllowedDaysForMonthYear(month, year, typeValue, departureDate) {
    if (!month || !year) {
        return Array.from({ length: 31 }, (_, i) => i + 1);
    }
    const max = daysInMonth(month, year);
    const days = [];
    for (let d = 1; d <= max; d += 1) {
        const dob = new Date(Number(year), Number(month) - 1, d);
        if (isValidDobForPassengerType(dob, typeValue, departureDate)) {
            days.push(d);
        }
    }
    return days;
}
