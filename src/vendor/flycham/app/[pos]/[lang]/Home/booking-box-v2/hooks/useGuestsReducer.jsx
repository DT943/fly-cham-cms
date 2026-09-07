'use client';

import { useCallback, useEffect, useReducer, useRef } from "react";
import { GUEST_FORM_FIELDS } from "../constants/bookingBoxConstants";
import { trackCabinClassClarityEvent, trackPassengerCountClarityEvent } from "@/lib/clarity";
import {
  buildGuestsState,
  GUEST_ACTIONS,
  guestsReducer,
} from "../reducers/guestsReducer";

const initGuestsState = (values) => buildGuestsState(values || {});

const areStatesEqual = (a, b) =>
  a.adults === b.adults &&
  a.children === b.children &&
  a.infants === b.infants &&
  a.infantsWithSeat === b.infantsWithSeat &&
  a.cabinClass === b.cabinClass &&
  a.promoCode === b.promoCode;

export default function useGuestsReducer(formik) {
  const [guestsState, dispatch] = useReducer(
    guestsReducer,
    formik?.values,
    initGuestsState
  );
  const skipFormikSyncRef = useRef(false);
  const guestChangeFromUserRef = useRef(false);
  const prevGuestCountsRef = useRef(null);

  const changeGuestCount = useCallback((key, delta) => {
    guestChangeFromUserRef.current = true;
    dispatch({ type: GUEST_ACTIONS.UPDATE_GUEST, payload: { key, delta } });
  }, []);

  const setGuestValue = useCallback((key, value) => {
    guestChangeFromUserRef.current = true;
    dispatch({ type: GUEST_ACTIONS.SET_GUEST, payload: { key, value } });
  }, []);

  const setCabinClass = useCallback((value) => {
    if (value !== guestsState.cabinClass) {
      trackCabinClassClarityEvent(value);
    }
    dispatch({ type: GUEST_ACTIONS.SET_CABIN_CLASS, payload: value });
  }, [guestsState.cabinClass]);

  const setPromoCode = useCallback((value) => {
    dispatch({ type: GUEST_ACTIONS.SET_PROMO_CODE, payload: value });
  }, []);

  const { values, setFieldValue } = formik || {};

  useEffect(() => {
    if (!values || typeof setFieldValue !== "function") return;

    let didSync = false;
    GUEST_FORM_FIELDS.forEach((field) => {
      if (values[field] !== guestsState[field]) {
        setFieldValue(field, guestsState[field], false);
        didSync = true;
      }
    });

    if (didSync) {
      skipFormikSyncRef.current = true;
    }
  }, [
    guestsState,
    setFieldValue,
    values?.adults,
    values?.children,
    values?.infants,
    values?.infantsWithSeat,
    values?.cabinClass,
    values?.promoCode,
  ]);

  useEffect(() => {
    if (!values) return;
    if (skipFormikSyncRef.current) {
      skipFormikSyncRef.current = false;
      return;
    }
    const nextFromFormik = buildGuestsState(values);
    if (!areStatesEqual(nextFromFormik, guestsState)) {
      dispatch({ type: GUEST_ACTIONS.SYNC_FROM_FORMIK, payload: nextFromFormik });
    }
  }, [
    guestsState,
    values?.adults,
    values?.children,
    values?.infants,
    values?.infantsWithSeat,
    values?.cabinClass,
    values?.promoCode,
  ]);

  useEffect(() => {
    const current = {
      adults: guestsState.adults,
      children: guestsState.children,
      infants: guestsState.infants,
      infantsWithSeat: guestsState.infantsWithSeat,
    };

    if (!guestChangeFromUserRef.current) {
      prevGuestCountsRef.current = current;
      return;
    }

    guestChangeFromUserRef.current = false;
    const prev = prevGuestCountsRef.current ?? current;
    const keys = ['adults', 'children', 'infants', 'infantsWithSeat'];

    for (const key of keys) {
      if (prev[key] !== current[key]) {
        trackPassengerCountClarityEvent(key, current[key]);
      }
    }

    prevGuestCountsRef.current = current;
  }, [
    guestsState.adults,
    guestsState.children,
    guestsState.infants,
    guestsState.infantsWithSeat,
  ]);

  return {
    guestsState,
    changeGuestCount,
    setGuestValue,
    setCabinClass,
    setPromoCode,
  };
}

