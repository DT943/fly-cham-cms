import {
  CalendarBlank,
  AirTrafficControl,
  AirplaneTilt,
  TrolleySuitcase,
} from '@phosphor-icons/react'

export const journeySteps = [
  {
    icon: CalendarBlank,
    stepLabel: '1. Before you travel',
    links: [
      { text: 'Baggage allowance' },
      { text: 'Travel with children' },
      { text: 'Seat selection' },
      { text: 'Ya Marhaba service' },
    ],
  },
  {
    icon: AirTrafficControl,
    stepLabel: '2. At the airport',
    links: [
      { text: 'VIP Boarding' },
      { text: 'Special Services' },
      { text: 'Business Lounge' },
      { text: 'Excess Baggage' },
    ],
  },
  {
    icon: AirplaneTilt,
    stepLabel: '3. On board',
    links: [
      { text: 'Meal service' },
      { text: 'Birthday cake' },
      { text: 'WiFi' },
      { text: 'Entertainment' },
    ],
  },
  {
    icon: TrolleySuitcase,
    stepLabel: '4. After your flight',
    links: [
      { text: 'Refunds & compensation' },
      { text: 'Lost and found' },
      { text: 'Baggage queries' },
      { text: 'Feedback & complaints' },
    ],
  },
]
