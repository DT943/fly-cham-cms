/** Internal form / UI pax codes for search-results. */
export const PAX_TYPE = {
    ADT: 'ADT',
    CHD: 'CHD',
    INF: 'INF',
    /** Infant with own seat (FlightWithPrice `infantswithseat`). */
    INS: 'INS',
};

export function normalizePassengerTypeCode(value) {
    const t = String(value ?? '').trim().toUpperCase();
    if (t === 'ADULT' || t === 'AD' || t === 'ADT') return PAX_TYPE.ADT;
    if (t === 'CHILD' || t === 'CH' || t === 'CHD') return PAX_TYPE.CHD;
    if (
        t === 'INFANT_WITH_SEAT' ||
        t === 'INFANTWITHSEAT' ||
        t === 'INFANTS_WITH_SEAT' ||
        t === 'INS'
    ) {
        return PAX_TYPE.INS;
    }
    if (t === 'INFANT' || t === 'INF' || t === 'IN') return PAX_TYPE.INF;
    return t;
}

export function isLapInfantType(value) {
    return normalizePassengerTypeCode(value) === PAX_TYPE.INF;
}

export function isInfantWithSeatType(value) {
    return normalizePassengerTypeCode(value) === PAX_TYPE.INS;
}

/** Lap infant and infant with seat share under-2 DOB rules and minor titles. */
export function isInfantAgePassengerType(value) {
    const code = normalizePassengerTypeCode(value);
    return code === PAX_TYPE.INF || code === PAX_TYPE.INS;
}

/** Lap infants only — excluded from seat, baggage, wheelchair, and lounge SSR selection. */
export function isAncillarySelectionDisabledType(value) {
    return isLapInfantType(value);
}

export function mapPassengerTypeForApi(typeValue) {
    const code = normalizePassengerTypeCode(typeValue);
    if (code === PAX_TYPE.ADT) return 'ADULT';
    if (code === PAX_TYPE.CHD) return 'CHILD';
    if (code === PAX_TYPE.INS) return 'INFANT_WITH_SEAT';
    return 'INFANT';
}

export function getPassengerFormTypeKey(typeValue) {
    const code = normalizePassengerTypeCode(typeValue);
    if (code === PAX_TYPE.ADT) return 'adult';
    if (code === PAX_TYPE.CHD) return 'child';
    if (code === PAX_TYPE.INS) return 'infantWithSeat';
    return 'infant';
}
