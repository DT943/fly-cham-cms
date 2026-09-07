'use client';

import { useCallback, useEffect, useReducer } from "react";
import {
  modalInitialState,
  modalReducer,
  MODAL_ACTIONS,
} from "../reducers/modalReducer";

export default function useBookingBoxModals(registerControls) {
  const [modalState, dispatch] = useReducer(modalReducer, modalInitialState);

  const openMobileModal = useCallback(() => {
    dispatch({ type: MODAL_ACTIONS.OPEN_MOBILE });
  }, []);

  const openDesktopModal = useCallback(() => {
    dispatch({ type: MODAL_ACTIONS.OPEN_DESKTOP });
  }, []);

  const closeAllModals = useCallback(() => {
    dispatch({ type: MODAL_ACTIONS.CLOSE_ALL });
  }, []);

  useEffect(() => {
    registerControls?.({
      openMobileModal,
      openDesktopModal,
      closeAllModals,
    });
    // Run once on mount: re-running when `registerControls` identity changes would call
    // parent setters (e.g. setModalControls) every time unstable deps recreate the callback,
    // causing "Maximum update depth exceeded".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    modalState,
    openMobileModal,
    openDesktopModal,
    closeAllModals,
  };
}

