/**
 * Detect TitleDropdown focus / open menus so cham-miles can freeze section
 * scroll while the user is picking from a dropdown (Join form DOB, title, etc.).
 */

export function isWheelOverTitleDropdownMenu(target) {
  return Boolean(target?.closest?.("[data-title-dropdown-menu]"));
}

/** True when a TitleDropdown trigger is focused or any menu is open. */
export function isTitleDropdownScrollLocked(target) {
  if (typeof document === "undefined") return false;
  if (document.querySelector("[data-title-dropdown-menu]")) return true;
  const ae = document.activeElement;
  if (ae?.closest?.("[data-title-dropdown]")) return true;
  if (target?.closest?.("[data-title-dropdown]")) return true;
  if (target?.closest?.("[data-title-dropdown-menu]")) return true;
  return false;
}

/**
 * While a dropdown is open: always stop page / step scroll (incl. scroll-up
 * leaving Join). If the wheel is over the open menu, scroll that list instead.
 * @returns {boolean} true when the event was consumed
 */
export function consumeWheelWhileTitleDropdownOpen(e) {
  if (!isTitleDropdownScrollLocked(e?.target)) return false;
  e.preventDefault();
  e.stopPropagation();
  const menu = e.target?.closest?.("[data-title-dropdown-menu]");
  if (menu) {
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 16;
    else if (e.deltaMode === 2) {
      dy *= typeof window !== "undefined" ? window.innerHeight : 800;
    }
    const scroller =
      e.target?.closest?.("[data-title-dropdown-scroll]") ||
      menu.querySelector("[data-title-dropdown-scroll]") ||
      menu;
    scroller.scrollTop += dy;
  }
  return true;
}

/**
 * Touch equivalent — block page scrub while a dropdown is open. Native overflow
 * on the menu still works when the touch is inside it (no preventDefault).
 * @returns {boolean} true when the page gesture was blocked
 */
export function consumeTouchWhileTitleDropdownOpen(e) {
  if (!isTitleDropdownScrollLocked(e?.target)) return false;
  if (isWheelOverTitleDropdownMenu(e.target)) return false;
  e.preventDefault();
  e.stopPropagation();
  return true;
}
