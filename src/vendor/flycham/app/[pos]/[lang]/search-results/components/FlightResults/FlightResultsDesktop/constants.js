/** Number of skeleton flight cards shown during step 0 loading. */
export const SKELETON_CARD_COUNT = 1;

/* ------------------------------------------------------------------ */
/*  ⬇⬇⬇  SINGLE SOURCE OF TRUTH FOR PAGE WIDTH  ⬇⬇⬇                  */
/*                                                                    */
/*  Change ONLY the max-w-[…] value on the line below to tighten or   */
/*  widen the whole search-results page.                              */
/*                                                                    */
/*  Every top-level rail — the top header (FlyCham logo + Modify      */
/*  search), the progress bar, the step content (passenger cards +    */
/*  summary), and the fixed bottom footer — reads from this one class */
/*  so they all share identical left/right edges at every viewport.   */
/*                                                                    */
/*  Breakdown:                                                        */
/*    `w-full`                → fills the viewport on small screens   */
/*    `px-4 sm:px-6 lg:px-8`  → edge whitespace that scales           */
/*    `max-w-[1200px]`        → hard cap on large screens (the knob)  */
/*    `mx-auto`               → keeps the content centered            */
/*                                                                    */
/*  Typical values: max-w-[1100px] (tight) · [1200px] · [1320px]      */
/* ------------------------------------------------------------------ */
/**
 *  The 1266px cap = 803 (form) + 24 (flex gap-6) + 375 (summary) + 64 (lg:px-8
 *  left+right). At this width the passenger-step columns render at their exact
 *  design sizes (803 / 375). Below the cap they shrink together in the same
 *  ratio. Change the number below to resize the whole page — if you also
 *  change the column targets in PassengerDetails.jsx update this number to
 *  `newLeft + newRight + 24 + 64` so everything stays math-consistent.
 */
export const MAIN_WIDTH_CLASS =
    'w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1266px] mx-auto';

/**
 * Progress bar wrapper below lg. Phones: centered narrow rail.
 * Tablets (md–1023): full width — horizontal inset comes from the fixed strip (`md:px-3`).
 */
export const PROGRESS_BAR_MOBILE_WRAP_CLASS =
    'w-[92%] max-w-lg mx-auto sm:max-w-xl md:w-full md:max-w-none';

/** Desktop: Header `md:h-20` + progress strip (`mt-1` + 66px bar, no bottom gap). */
export const DESKTOP_HEADER_HEIGHT_PX = 80;
export const DESKTOP_PROGRESS_STRIP_HEIGHT_PX = 70;
export const DESKTOP_MAIN_OFFSET_WITH_PROGRESS_PX =
    DESKTOP_HEADER_HEIGHT_PX + DESKTOP_PROGRESS_STRIP_HEIGHT_PX;
/** Tailwind class — must be a static string for JIT (80 + 70 = 150px). */
export const DESKTOP_MAIN_OFFSET_WITH_PROGRESS_CLASS = 'mt-[150px]';

/** Mobile: header block (~56px) + progress strip (`pt-4` + 58px bar). */
export const MOBILE_HEADER_HEIGHT_PX = 56;
export const MOBILE_PROGRESS_STRIP_HEIGHT_PX = 74;
export const MOBILE_MAIN_OFFSET_WITH_PROGRESS_PX =
    MOBILE_HEADER_HEIGHT_PX + MOBILE_PROGRESS_STRIP_HEIGHT_PX;
/** Fallback when ResizeObserver has not published yet. */
export const MOBILE_MAIN_OFFSET_WITH_PROGRESS_CLASS = 'mt-[130px]';

/**
 * Top inset inside `.search-scroll-content` — driven by usePublishSearchHeaderHeight.
 * Padding (not margin on the scroll root) keeps the full scroll range accurate in Safari
 * so titles like "Select Departure Flight" are not clipped under the fixed header.
 */
export const SEARCH_MAIN_TOP_OFFSET_CLASS =
    'pt-[var(--search-header-offset,130px)]';

/** When the progress stepper is hidden — header strip only. */
export const SEARCH_MAIN_HEADER_ONLY_OFFSET_CLASS =
    'pt-[var(--search-header-height,5rem)]';

/**
 * Bottom padding inside the scroll content when the fixed footer is visible.
 * Padding (not margin) keeps the full scroll height accurate so the last
 * passenger card is never clipped above a phantom white gap.
 * `--search-footer-height` is published by SearchFooterBar via ResizeObserver.
 */
export const SEARCH_SCROLL_PADDING_WITH_FOOTER_CLASS =
    'pb-[calc(var(--search-footer-height,11rem)+env(safe-area-inset-bottom,0px)+2rem)]';

/**
 * Bottom padding for the mobile main scroll area when the fixed footer is visible.
 * @deprecated Use SEARCH_SCROLL_PADDING_WITH_FOOTER_CLASS
 */
export const MOBILE_SCROLL_PADDING_WITH_FOOTER_CLASS =
    SEARCH_SCROLL_PADDING_WITH_FOOTER_CLASS;

/** Fixed booking footer — above page content; below modals. */
export const SEARCH_FOOTER_Z_INDEX = 60;

/** Fixed site header (Select seat / Modify search) — always above step content. */
export const SEARCH_SITE_HEADER_Z_INDEX = 50;

/** Fixed progress stepper — below site header, above scrollable step content. */
export const SEARCH_PROGRESS_Z_INDEX = 40;

/** Modals / sheets (modify search, flight details, seat prompt, …). */
export const SEARCH_MODAL_Z_INDEX = 2000;

/**
 * Nested full-screen sheets opened from inside a search modal (e.g. mobile
 * airport/date MobModal). Must sit above SEARCH_MODAL_Z_INDEX or the parent
 * dialog paints over the sheet while Headless UI marks the parent inert —
 * fields look visible but nothing is tappable.
 */
export const SEARCH_NESTED_MODAL_Z_INDEX = 2100;

/** Sticky in-step chrome (seat leg tabs, passenger carousel) — below progress bar. */
export const SEARCH_STEP_STICKY_Z_INDEX = 10;

/** Country / nationality dropdown menus — below sticky footer so menus never cover Confirm. */
export const SEARCH_FORM_DROPDOWN_Z_INDEX = 55;

/** Row placeholder width for "Direct Airport" / currency skeleton bar. */
export const ROW_SKELETON_WIDTH_CLASS = 'w-[90%] lg:w-[65%]';
