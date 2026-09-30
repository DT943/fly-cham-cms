import { Airplane, AirplaneLanding, AirplaneTakeoff, Headset, Question } from '@phosphor-icons/react'

export const JOURNEY_STAGE_PATH = /^\/travel-experience\/([^/]+)$/

const helpHref = '/help'

/**
 * Shared Before You Fly template data for every travel-experience stage page.
 * Text lives under the stage's i18n key; images come only from the CMS.
 */
const journeyStages = {
  'before-you-fly': {
    i18nKey: 'beforeYouFly',
    services: [
      { id: 'seatSelection', href: helpHref },
      { id: 'manageBooking', href: helpHref },
      { id: 'allowedBaggage', href: helpHref },
      { id: 'paymentMethods', href: helpHref },
      { id: 'yaMarhaba', href: '/travel-experience/before-you-fly/transportation-service' },
      { id: 'limousine', href: '/travel-experience/before-you-fly/limousine-service' },
      { id: 'unaccompaniedMinor', href: '/travel-experience/before-you-fly/unaccompanied-minors' },
      { id: 'oxygenCylinder', href: helpHref },
      { id: 'prohibitedItems', href: '/travel-experience/before-you-fly/prohibited-items' },
    ],
    nextSteps: [
      { id: 'airportServices', href: '/travel-experience/at-the-airport', icon: AirplaneTakeoff },
      { id: 'getSupport', href: helpHref, icon: Headset },
    ],
  },
  'at-the-airport': {
    i18nKey: 'atTheAirport',
    services: [
      { id: 'lounge', href: helpHref },
      { id: 'wheelchair', href: '/travel-experience/at-the-airport/wheelchair-service' },
      { id: 'vipBoarding', href: '/travel-experience/at-the-airport/vip-boarding' },
    ],
    nextSteps: [
      { id: 'onboardServices', href: '/travel-experience/on-board', icon: Airplane },
      { id: 'getSupport', href: helpHref, icon: Headset },
    ],
  },
  onboard: {
    i18nKey: 'onboard',
    services: [
      { id: 'travelClasses', href: '/travel-experience/on-board/travel-classes' },
      { id: 'meals', href: '/travel-experience/on-board/meals-onboard' },
      { id: 'entertainment', href: '/travel-experience/on-board/entertainment-system' },
      { id: 'birthdayCakes', href: '/travel-experience/on-board/birthday-onboard' },
      { id: 'travelerMagazine', href: '/travel-experience/traveler-magazine' },
      { id: 'kidsToys', href: '/travel-experience/on-board/kids-toys' },
      { id: 'wifiOnboard', href: '/travel-experience/on-board/onboard-wi-fi' },
    ],
    nextSteps: [
      { id: 'afterTravel', href: '/travel-experience/after-travel', icon: AirplaneLanding },
      { id: 'getSupport', href: helpHref, icon: Headset },
    ],
  },
  'after-travel': {
    i18nKey: 'afterTravel',
    services: [
      { id: 'baggageClaims', href: helpHref },
      { id: 'refunds', href: helpHref },
      { id: 'loyaltyMiles', href: helpHref },
      { id: 'feedbackSupport', href: helpHref },
    ],
    nextSteps: [
      { id: 'helpSupport', href: helpHref, icon: Headset },
      { id: 'quickAnswer', href: '/help/faqs', icon: Question },
    ],
  },
}

export function getJourneyStageSlug(path = '') {
  return path.match(JOURNEY_STAGE_PATH)?.[1] || null
}

export function getJourneyStage(slug) {
  return journeyStages[slug] || null
}

export function journeyStageHref(slug) {
  return `/travel-experience/${slug}`
}

export const journeyStageSlugs = Object.keys(journeyStages)

/** @deprecated Use getJourneyStage('before-you-fly').services */
export const beforeYouFlyServices = journeyStages['before-you-fly'].services
