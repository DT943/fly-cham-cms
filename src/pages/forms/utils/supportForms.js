import {
  ArrowsClockwise,
  Baby,
  CalendarX,
  Car,
  CreditCard,
  Gift,
  Headset,
  IdentificationCard,
  Medal,
  Receipt,
  Suitcase,
  TrolleySuitcase,
  UsersThree,
  Wheelchair,
  ArrowUUpLeft,
} from '@phosphor-icons/react'

export const formStageIds = ['all', 'beforeTravel', 'atAirport', 'onboard', 'others']

export const supportForms = [
  {
    id: 'bookingChange',
    categoryId: 'booking',
    stageId: 'beforeTravel',
    icon: ArrowsClockwise,
    keywords: ['booking', 'change', 'date', 'route', 'flight'],
  },
  {
    id: 'transportation',
    categoryId: 'booking',
    stageId: 'beforeTravel',
    icon: Car,
    keywords: ['booking', 'transfer', 'airport', 'driver', 'car'],
  },
  {
    id: 'nameCorrection',
    categoryId: 'booking',
    stageId: 'beforeTravel',
    icon: IdentificationCard,
    keywords: ['booking', 'name', 'correction', 'passport'],
  },
  {
    id: 'ancillaryService',
    categoryId: 'booking',
    stageId: 'beforeTravel',
    icon: Headset,
    keywords: ['booking', 'seat', 'baggage', 'ancillary', 'refund'],
  },
  {
    id: 'refund',
    categoryId: 'refundCancel',
    stageId: 'beforeTravel',
    icon: ArrowUUpLeft,
    keywords: ['refund', 'cancel', 'cancellation'],
  },
  {
    id: 'flightCancellation',
    categoryId: 'refundCancel',
    stageId: 'beforeTravel',
    icon: CalendarX,
    keywords: ['refund', 'cancel', 'cancellation', 'flight'],
  },
  {
    id: 'paymentIssue',
    categoryId: 'payment',
    stageId: 'beforeTravel',
    icon: CreditCard,
    keywords: ['payment', 'charge', 'transaction', 'card'],
  },
  {
    id: 'paymentReceipt',
    categoryId: 'payment',
    stageId: 'beforeTravel',
    icon: Receipt,
    keywords: ['payment', 'receipt', 'ticket', 'itinerary'],
  },
  {
    id: 'delayedBaggage',
    categoryId: 'baggage',
    stageId: 'atAirport',
    icon: TrolleySuitcase,
    keywords: ['baggage', 'delayed', 'luggage'],
  },
  {
    id: 'lostBaggage',
    categoryId: 'baggage',
    stageId: 'onboard',
    icon: Suitcase,
    keywords: ['baggage', 'lost', 'luggage'],
  },
  {
    id: 'unaccompaniedMinor',
    categoryId: 'specialAssistance',
    stageId: 'beforeTravel',
    icon: Baby,
    keywords: ['child', 'minor', 'assistance', 'um'],
  },
  {
    id: 'specialAssistance',
    categoryId: 'specialAssistance',
    stageId: 'atAirport',
    icon: Wheelchair,
    keywords: ['assistance', 'mobility', 'wheelchair', 'airport'],
  },
  {
    id: 'groupTravel',
    categoryId: 'groupTravel',
    stageId: 'beforeTravel',
    icon: UsersThree,
    keywords: ['group', 'quotation', 'travel'],
  },
  {
    id: 'missingMiles',
    categoryId: 'chamMiles',
    stageId: 'others',
    icon: Medal,
    keywords: ['miles', 'loyalty', 'cham'],
  },
  {
    id: 'compliment',
    categoryId: 'feedback',
    stageId: 'onboard',
    icon: Gift,
    keywords: ['feedback', 'compliment', 'review'],
  },
]

export function filterSupportForms(forms, query, getText, stageId = 'all') {
  const byStage = stageId === 'all' ? forms : forms.filter((form) => form.stageId === stageId)
  const normalized = query.trim().toLowerCase()
  if (!normalized) return byStage

  return byStage.filter((form) => {
    const fields = [
      form.id,
      ...(form.keywords || []),
      getText(`forms.items.${form.id}.title`),
      getText(`forms.items.${form.id}.description`),
      getText(`forms.categories.${form.categoryId}`),
      getText(`forms.filters.${form.stageId}`),
    ]

    return fields.some((value) => String(value).toLowerCase().includes(normalized))
  })
}
