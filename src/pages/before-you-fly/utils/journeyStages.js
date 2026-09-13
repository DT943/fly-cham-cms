import { Airplane, AirplaneLanding, AirplaneTakeoff, Headset, Question } from '@phosphor-icons/react'
import seatSelectionPhoto from '../../../assets/images/before-you-fly/seat-selection.png'
import manageBookingPhoto from '../../../assets/images/before-you-fly/manage-booking.png'
import yaMarhabaPhoto from '../../../assets/images/before-you-fly/ya-marhaba.png'
import limousinePhoto from '../../../assets/images/before-you-fly/limousine.png'
import unaccompaniedMinorPhoto from '../../../assets/images/before-you-fly/unaccompanied-minor.png'
import oxygenPhoto from '../../../assets/images/before-you-fly/oxygen.png'
import heroPhoto from '../../../assets/images/before-you-fly/hero.png'

export const JOURNEY_STAGE_PATH = /^\/travel-experience\/([^/]+)$/

const helpHref = '/help'

/**
 * Shared Before You Fly template data for every travel-experience stage page.
 * Photos are placeholders until stage-specific assets are added.
 */
const journeyStages = {
  'before-you-fly': {
    i18nKey: 'beforeYouFly',
    heroImage: heroPhoto,
    services: [
      { id: 'seatSelection', image: seatSelectionPhoto, href: helpHref },
      { id: 'manageBooking', image: manageBookingPhoto, href: helpHref },
      { id: 'allowedBaggage', image: manageBookingPhoto, href: helpHref },
      { id: 'paymentMethods', image: manageBookingPhoto, href: helpHref },
      { id: 'yaMarhaba', image: yaMarhabaPhoto, href: helpHref },
      { id: 'limousine', image: limousinePhoto, href: helpHref },
      { id: 'unaccompaniedMinor', image: unaccompaniedMinorPhoto, href: helpHref },
      { id: 'oxygenCylinder', image: oxygenPhoto, href: helpHref },
      { id: 'prohibitedItems', image: oxygenPhoto, href: helpHref },
    ],
    nextSteps: [
      { id: 'airportServices', href: '/travel-experience/at-the-airport', icon: AirplaneTakeoff },
      { id: 'getSupport', href: helpHref, icon: Headset },
    ],
  },
  'at-the-airport': {
    i18nKey: 'atTheAirport',
    heroImage: heroPhoto,
    services: [
      { id: 'lounge', image: manageBookingPhoto, href: helpHref },
      { id: 'wheelchair', image: unaccompaniedMinorPhoto, href: helpHref },
      { id: 'vipBoarding', image: yaMarhabaPhoto, href: helpHref },
    ],
    nextSteps: [
      { id: 'onboardServices', href: '/travel-experience/onboard', icon: Airplane },
      { id: 'getSupport', href: helpHref, icon: Headset },
    ],
  },
  onboard: {
    i18nKey: 'onboard',
    heroImage: heroPhoto,
    services: [
      { id: 'travelClasses', image: seatSelectionPhoto, href: helpHref },
      { id: 'meals', image: limousinePhoto, href: helpHref },
      { id: 'entertainment', image: yaMarhabaPhoto, href: helpHref },
      { id: 'birthdayCakes', image: unaccompaniedMinorPhoto, href: helpHref },
      { id: 'travelerMagazine', image: manageBookingPhoto, href: helpHref },
      { id: 'kidsToys', image: oxygenPhoto, href: helpHref },
      { id: 'wifiOnboard', image: seatSelectionPhoto, href: helpHref },
    ],
    nextSteps: [
      { id: 'afterTravel', href: '/travel-experience/after-travel', icon: AirplaneLanding },
      { id: 'getSupport', href: helpHref, icon: Headset },
    ],
  },
  'after-travel': {
    i18nKey: 'afterTravel',
    heroImage: heroPhoto,
    services: [
      { id: 'baggageClaims', image: manageBookingPhoto, href: helpHref },
      { id: 'refunds', image: yaMarhabaPhoto, href: helpHref },
      { id: 'loyaltyMiles', image: limousinePhoto, href: helpHref },
      { id: 'feedbackSupport', image: oxygenPhoto, href: helpHref },
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
