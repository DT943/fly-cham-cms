import {
  MAX_TOTAL_GUESTS,
  MIN_ADULTS,
  GUEST_KEYS,
} from "../constants/bookingBoxConstants";

export const GUEST_ACTIONS = {
  UPDATE_GUEST: "UPDATE_GUEST",
  SET_GUEST: "SET_GUEST",
  SET_CABIN_CLASS: "SET_CABIN_CLASS",
  SET_PROMO_CODE: "SET_PROMO_CODE",
  SYNC_FROM_FORMIK: "SYNC_FROM_FORMIK",
};

export const guestsInitialState = {
  adults: MIN_ADULTS,
  children: 0,
  infants: 0,
  infantsWithSeat: 0,
  cabinClass: "Economy",
  promoCode: "",
};

const getCombinedInfants = (state) =>
  Number(state.infants ?? 0) + Number(state.infantsWithSeat ?? 0);

const clampInfantGuestValue = (key, value, adultsCap, otherInfants) => {
  const cap = Math.max(0, adultsCap - otherInfants);
  return Math.min(cap, Math.max(0, value));
};

const clampValueByRole = (key, value, adultsCap, state = guestsInitialState) => {
  if (key === "adults") {
    return Math.min(MAX_TOTAL_GUESTS, Math.max(MIN_ADULTS, value));
  }

  if (key === "children") {
    return Math.min(MAX_TOTAL_GUESTS, Math.max(0, value));
  }

  if (key === "infants") {
    return clampInfantGuestValue(key, value, adultsCap, Number(state.infantsWithSeat ?? 0));
  }

  if (key === "infantsWithSeat") {
    return clampInfantGuestValue(key, value, adultsCap, Number(state.infants ?? 0));
  }

  return value;
};

const enforceTotalLimit = (state, key, value) => {
  const currentTotal =
    state.adults + state.children + getCombinedInfants(state);
  const currentKeyContribution =
    key === "adults"
      ? state.adults
      : key === "children"
      ? state.children
      : Number(state[key] ?? 0);
  const othersTotal = currentTotal - currentKeyContribution;
  const remainingCapacity = Math.max(0, MAX_TOTAL_GUESTS - othersTotal);

  if (key === "adults") {
    return Math.max(
      MIN_ADULTS,
      Math.min(Math.min(remainingCapacity, MAX_TOTAL_GUESTS), value)
    );
  }

  return Math.min(remainingCapacity, value);
};

const rebalanceInfantsForAdults = (state, adults) => {
  let next = { ...state, adults };
  let combined = getCombinedInfants(next);
  if (combined <= adults) return next;

  let overflow = combined - adults;
  let infantsWithSeat = Number(next.infantsWithSeat ?? 0);
  let infants = Number(next.infants ?? 0);

  while (overflow > 0 && infantsWithSeat > 0) {
    infantsWithSeat -= 1;
    overflow -= 1;
  }
  while (overflow > 0 && infants > 0) {
    infants -= 1;
    overflow -= 1;
  }

  return { ...next, infants, infantsWithSeat };
};

const applyGuestValue = (state, key, rawValue) => {
  if (!GUEST_KEYS.includes(key)) return state;

  const desiredValue = Number.isFinite(rawValue)
    ? Math.trunc(rawValue)
    : rawValue > 0
    ? 1
    : 0;

  const adultsCap = key === "adults" ? desiredValue : state.adults;
  let nextValue = clampValueByRole(key, desiredValue, adultsCap, state);
  nextValue = enforceTotalLimit(state, key, nextValue);

  if (key === "adults") {
    if (nextValue === state.adults) return state;
    return rebalanceInfantsForAdults({ ...state, adults: nextValue }, nextValue);
  }

  if (key === "children") {
    if (nextValue === state.children) return state;
    return { ...state, children: nextValue };
  }

  if (key === "infants" || key === "infantsWithSeat") {
    if (nextValue === state[key]) return state;
    return { ...state, [key]: nextValue };
  }

  return state;
};

const sanitizeGuestState = (candidate = {}) => {
  const adults = clampValueByRole(
    "adults",
    Number(candidate.adults ?? guestsInitialState.adults)
  );

  const remainingAfterAdults = Math.max(0, MAX_TOTAL_GUESTS - adults);
  const children = Math.min(
    remainingAfterAdults,
    clampValueByRole("children", Number(candidate.children ?? 0))
  );

  const remainingAfterChildren = Math.max(
    0,
    MAX_TOTAL_GUESTS - adults - children
  );
  const infants = Math.min(
    remainingAfterChildren,
    clampValueByRole(
      "infants",
      Number(candidate.infants ?? 0),
      adults,
      { ...candidate, adults }
    )
  );
  const infantsWithSeat = Math.min(
    remainingAfterChildren,
    clampValueByRole(
      "infantsWithSeat",
      Number(candidate.infantsWithSeat ?? 0),
      adults,
      { ...candidate, adults, infants }
    )
  );

  return rebalanceInfantsForAdults(
    {
      adults,
      children,
      infants,
      infantsWithSeat,
      cabinClass: candidate.cabinClass || guestsInitialState.cabinClass,
      promoCode: candidate.promoCode || "",
    },
    adults
  );
};

const areGuestStatesEqual = (a, b) =>
  a.adults === b.adults &&
  a.children === b.children &&
  a.infants === b.infants &&
  a.infantsWithSeat === b.infantsWithSeat &&
  a.cabinClass === b.cabinClass &&
  a.promoCode === b.promoCode;

export const guestsReducer = (state, action) => {
  switch (action.type) {
    case GUEST_ACTIONS.UPDATE_GUEST: {
      const { key, delta } = action.payload || {};
      if (!GUEST_KEYS.includes(key) || typeof delta !== "number") return state;
      return applyGuestValue(state, key, state[key] + delta);
    }

    case GUEST_ACTIONS.SET_GUEST: {
      const { key, value } = action.payload || {};
      if (!GUEST_KEYS.includes(key)) return state;
      return applyGuestValue(state, key, value);
    }

    case GUEST_ACTIONS.SET_CABIN_CLASS: {
      if (state.cabinClass === action.payload) return state;
      return {
        ...state,
        cabinClass: action.payload || guestsInitialState.cabinClass,
      };
    }

    case GUEST_ACTIONS.SET_PROMO_CODE: {
      if (state.promoCode === action.payload) return state;
      return {
        ...state,
        promoCode: action.payload || "",
      };
    }

    case GUEST_ACTIONS.SYNC_FROM_FORMIK: {
      const sanitized = sanitizeGuestState(action.payload);
      if (areGuestStatesEqual(state, sanitized)) return state;
      return sanitized;
    }

    default:
      return state;
  }
};

export const buildGuestsState = (values = {}) =>
  sanitizeGuestState({
    adults: values.adults,
    children: values.children,
    infants: values.infants,
    infantsWithSeat: values.infantsWithSeat,
    cabinClass: values.cabinClass,
    promoCode: values.promoCode,
  });
