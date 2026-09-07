export const MODAL_ACTIONS = {
  OPEN_MOBILE: "OPEN_MOBILE",
  OPEN_DESKTOP: "OPEN_DESKTOP",
  CLOSE_ALL: "CLOSE_ALL",
};

export const modalInitialState = {
  mobileOpen: false,
  desktopOpen: false,
};

export function modalReducer(state, action) {
  switch (action.type) {
    case MODAL_ACTIONS.OPEN_MOBILE:
      return { ...state, mobileOpen: true };
    case MODAL_ACTIONS.OPEN_DESKTOP:
      return { ...state, desktopOpen: true };
    case MODAL_ACTIONS.CLOSE_ALL:
      return modalInitialState;
    default:
      return state;
  }
}

