/**
 * Booking search box — Offers & Deals Figma (desktop 40951:24421, mobile
 * 40954:91233). Arbitrary px values only so the same classes render
 * identically in new_fly_cham (Tailwind v4) and cms2 (v3). Keep in sync with
 * flychamadmin `cms2/cmsComponents/BookingSearch/utils/classes.js`.
 */

/** Desktop card (lg+): 1220 × 301, content column 1161px from the start edge. */
export const DESKTOP_CARD =
  'relative w-full rounded-[16px] pb-6 pe-[30px] ps-[22px] pt-1 shadow-[0px_0px_5.192px_0px_rgba(33,37,41,0.2)]'
export const DESKTOP_COLUMN = 'w-full max-w-[1161px]'
export const DESKTOP_TABS = 'flex h-[51px] items-center gap-[34.611px] px-[10px]'
export const DESKTOP_TAB = 'relative flex cursor-pointer items-center justify-center border-0 bg-transparent p-[8.653px] text-base leading-[normal] no-underline'
/** Figma tab box widths (Book, Manage, Flight status). */
export const DESKTOP_TAB_WIDTH = ['min-w-[80.471px]', 'min-w-[105.564px]', 'min-w-[127.196px]']
/** Accent bar under the active tab + the full-width hairline. */
export const DESKTOP_TAB_BAR = 'pointer-events-none absolute -inset-x-[11.265px] top-[calc(100%+9.5px)] h-[1.73px] rounded-full'
export const DESKTOP_HAIRLINE = 'ms-[2px] mt-[2.43px] h-[0.865px] bg-[#e5e5e3]'
export const DESKTOP_TRIP_ROW = 'mt-[14.3px] flex h-[34px] items-center justify-between'
export const DESKTOP_TRIP_GROUP = 'flex items-center gap-[25px]'
export const DESKTOP_TRIP_OPTION = 'flex h-[41px] cursor-pointer items-center justify-between gap-[10px] rounded-[41px] border-0 bg-transparent text-base leading-[normal]'
export const DESKTOP_TRIP_OPTION_SIZE = ['min-w-[142px] p-[10px]', 'min-w-[128px] px-[8.653px] py-[10.383px]', 'min-w-[128px] px-[8.653px] py-[10.383px]']
export const DESKTOP_FIELDS_ROW = 'relative flex h-[63px] items-stretch'
/** Gap above the first fields row (trip row → fields). */
export const DESKTOP_FIELDS_TOP = 'mt-[33.4px]'
export const DESKTOP_ROUTE_BOX = 'relative flex h-full w-[298px] shrink-0 cursor-pointer items-start border-0 pt-[9px] text-start'
export const DESKTOP_SWAP = 'absolute start-[279.738px] top-[17px] z-[2] flex h-[30.68px] w-[36.524px] cursor-pointer items-center justify-center rounded-[44px] border-0 bg-transparent p-0'
/** Departure · Return · Passengers: three equal 178px columns (grid, so padding can't skew them). */
export const DESKTOP_DATES_GROUP = 'ms-[6.5px] grid min-w-0 flex-1 grid-cols-3 grid-rows-[63px] gap-[9px]'
export const DESKTOP_DATE_BOX = 'flex h-full min-w-0 flex-1 cursor-pointer items-center justify-between rounded-[8px] border-0 px-[10px] py-3 text-start'
export const DESKTOP_PAX_BOX = 'flex h-full min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[8px] border-0 p-[10px] text-start'
export const DESKTOP_BOTTOM_ROW = 'mt-[25px] flex items-center justify-between gap-3 ps-[5px]'
export const DESKTOP_BOTTOM_ACTIONS = 'flex shrink-0 items-center gap-[10px]'
/** Currency field on the bottom row (left of Search) — compact flag + name + code pill. */
export const DESKTOP_CURRENCY_TRIGGER =
  'inline-flex h-[49px] w-[188px] shrink-0 cursor-pointer items-center gap-[8px] rounded-[8px] border-0 px-[12px] py-[8px] text-start transition-[box-shadow]'
export const MOBILE_CURRENCY_TRIGGER =
  'flex w-full cursor-pointer items-center gap-[10px] rounded-[8px] border-0 px-3 py-2.5 text-start transition-[box-shadow]'
export const DESKTOP_SEARCH = 'inline-flex h-[49px] w-max min-w-[171px] shrink-0 cursor-pointer items-center justify-center gap-[10px] whitespace-nowrap rounded-[8px] border-0 px-[10px] py-3 text-base leading-[normal] transition-colors disabled:cursor-wait'

/** Mobile card (< lg): stacked fields, 16px rhythm. */
export const MOBILE_CARD =
  'flex w-full flex-col gap-4 rounded-[16px] p-4 shadow-[0px_4px_8px_0px_rgba(33,37,41,0.04)]'
export const MOBILE_TABS = 'flex w-full border-0 border-b border-solid border-[#e5e5e3]'
export const MOBILE_TAB = 'flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent text-sm leading-[normal]'
export const MOBILE_TRIP_ROW = 'flex w-full items-center justify-between gap-2'
export const MOBILE_TRIP_OPTION = 'flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 text-xs leading-[normal]'
export const MOBILE_FIELD = 'flex w-full cursor-pointer items-center gap-[10px] rounded-[8px] border-0 p-3 text-start'
export const MOBILE_SWAP = 'absolute end-[36px] top-[calc(50%-12px)] z-[2] flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[44px] border-0 bg-transparent p-0'
export const MOBILE_DATE_INPUT = 'flex h-12 w-full cursor-pointer items-center justify-between rounded-[6px] border-0 p-[10px] text-start'
export const MOBILE_SEARCH = 'inline-flex h-12 w-full cursor-pointer items-center justify-center gap-[10px] rounded-[8px] border-0 px-[26px] py-3 text-base leading-[normal] transition-colors disabled:cursor-wait'

/**
 * From/To fields rendered through the shared Dropdown (public app): the
 * `!` overrides beat its default field look (border, min-height, padding).
 */
export const DESKTOP_ROUTE_TRIGGER = '!h-full !min-h-0 !items-start !justify-start !rounded-[10.384px] !border-0 !pb-0 !pe-[52px] !pt-[9px]'
export const DESKTOP_ROUTE_TRIGGER_FROM = '!gap-[18px] !ps-3'
export const DESKTOP_ROUTE_TRIGGER_TO = '!gap-[14px] !ps-6'
export const MOBILE_FIELD_TRIGGER = '!min-h-0 !justify-start !gap-[10px] !rounded-[8px] !border-0 !p-3'

/** From/To boxes: the notch the swap button sits in (Figma "Subtract" shapes). */
export const routeNotchMask = (side) => {
  // From: r 18.825 circle centred 1.175px inside its end edge. To: r 20 circle
  // centred 5.3px outside its start edge.
  const gradient =
    side === 'right'
      ? 'radial-gradient(circle at calc(100% - 1.175px) 50.5%, transparent 18.825px, #000 19.325px)'
      : side === 'left'
        ? 'radial-gradient(circle at -5.3px 50.2%, transparent 20px, #000 20.5px)'
        : 'none'
  return { WebkitMaskImage: gradient, maskImage: gradient }
}

/** Fixed Figma text colours (not CMS tokens: these are UI chrome greys). */
export const MUTED = '#8a8a88'
export const SOFT = '#5f5f5c'
export const INK = '#282826'
