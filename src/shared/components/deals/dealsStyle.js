/**
 * Shared sizes for the Offers & Deals cards (Figma 40951:24297 desktop,
 * 40954:91178 mobile). Arbitrary px values only — they render the same in
 * cms2 (Tailwind v3) and new_fly_cham (v4). Keep the class strings identical
 * to flychamadmin `cms2/cmsComponents/shared/deals/dealsStyle.js`.
 */

/** Card width per breakpoint: mobile peek row / full stack, 2 cards on md, 3 on lg. */
export const DEAL_CARD_WIDTH = {
  carousel: 'w-[calc(100%-23px)] md:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.667px)]',
  stack: 'w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.667px)]',
}

/** Body spacing: flight cards sit 15px under the photo, service cards 24px. */
export const DEAL_BODY_CLASS = {
  flight: 'p-4 lg:px-[21px] lg:pb-[30px] lg:pt-[15px]',
  service: 'p-4 lg:px-[21px] lg:pb-[21px] lg:pt-6',
}

export const DEAL_TITLE_CLASS = {
  flight: 'text-[20px] leading-[normal] lg:text-[24px]',
  service: 'text-[22px] leading-[normal] lg:text-[24px]',
}

/** Sand tag on flight cards, blue countdown pill on service cards. */
export const DEAL_BADGE_CLASS = {
  flight:
    'absolute start-0 top-5 rounded-e-[4px] px-[10px] py-2 text-xs leading-[normal] lg:top-[28px] lg:rounded-[4px] lg:text-[14px]',
  service:
    'absolute start-0 top-5 rounded-e-[4px] px-[10px] py-2 text-xs leading-[normal] lg:start-[-2px] lg:top-[28px] lg:rounded-[8px] lg:p-[10px] lg:text-[14px]',
}

export const DEAL_BUTTON_HEIGHT = {
  flight: 'h-[42px] lg:h-[52px]',
  service: 'h-12 lg:h-[52px]',
}

export const DEAL_FARE_CLASS = 'text-[13px] leading-[1.6] lg:text-[14px] lg:leading-[normal]'
export const DEAL_PRICE_CLASS = 'whitespace-nowrap text-[18px]'
export const DEAL_DATES_CLASS = 'text-xs leading-[1.5] lg:text-[14px] lg:leading-[normal]'
export const DEAL_ROUTES_CLASS = 'text-xs leading-[1.5] lg:text-[14px] lg:leading-[normal]'

/** 'Book now' CTA — getButtonStyle / InspectorButtonStyle options. */
export const DEAL_BUTTON = {
  bgKey: 'buttonBg',
  bgFallback: 'primary-1',
  bgHoverFallback: 'primary-700',
  textKey: 'buttonText',
  textFallback: 'white',
  weightFallback: 'semibold',
}

/** Countdown unit letters (UI chrome, not CMS content). */
export const COUNTDOWN_UNITS = {
  en: { d: 'd', h: 'h', m: 'm', s: 's' },
  ar: { d: 'ي', h: 'س', m: 'د', s: 'ث' },
}

export const SECTION_PADDING_CLASS = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

