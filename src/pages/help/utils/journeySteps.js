import {
  AirTrafficControl,
  AirplaneTilt,
  TrolleySuitcase,
  CalendarIcon,
} from '@phosphor-icons/react'
import { resolvePhosphorIcon } from '../../../cms/adapters/phosphorIcons'

export const journeyStepIcons = {
  calendar: CalendarIcon,
  airport: AirTrafficControl,
  airplane: AirplaneTilt,
  suitcase: TrolleySuitcase,
}

export function resolveJourneyStepIcon(name) {
  if (typeof name === 'function') return name
  return journeyStepIcons[name] || resolvePhosphorIcon(name)
}

export const journeySteps = [
  {
    id: 'before',
    icon: 'calendar',
    linkKeys: ['baggageAllowance', 'travelWithChildren', 'seatSelection', 'yaMarhaba'],
  },
  {
    id: 'airport',
    icon: 'airport',
    linkKeys: ['vipBoarding', 'specialServices', 'businessLounge', 'excessBaggage'],
  },
  {
    id: 'onboard',
    icon: 'airplane',
    linkKeys: ['mealService', 'birthdayCake', 'wifi', 'entertainment'],
  },
  {
    id: 'after',
    icon: 'suitcase',
    linkKeys: ['refunds', 'lostAndFound', 'baggageQueries', 'feedback'],
  },
]
