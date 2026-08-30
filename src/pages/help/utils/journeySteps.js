import {
  CalendarBlank,
  AirTrafficControl,
  AirplaneTilt,
  TrolleySuitcase,
} from '@phosphor-icons/react'

export const journeySteps = [
  {
    id: 'before',
    icon: CalendarBlank,
    linkKeys: ['baggageAllowance', 'travelWithChildren', 'seatSelection', 'yaMarhaba'],
  },
  {
    id: 'airport',
    icon: AirTrafficControl,
    linkKeys: ['vipBoarding', 'specialServices', 'businessLounge', 'excessBaggage'],
  },
  {
    id: 'onboard',
    icon: AirplaneTilt,
    linkKeys: ['mealService', 'birthdayCake', 'wifi', 'entertainment'],
  },
  {
    id: 'after',
    icon: TrolleySuitcase,
    linkKeys: ['refunds', 'lostAndFound', 'baggageQueries', 'feedback'],
  },
]
