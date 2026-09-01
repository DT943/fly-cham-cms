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

export const supportForms = [
  {
    id: 'bookingChange',
    categoryId: 'booking',
    icon: ArrowsClockwise,
    keywords: ['booking', 'change', 'date', 'route', 'flight'],
  },
  {
    id: 'transportation',
    categoryId: 'booking',
    icon: Car,
    keywords: ['booking', 'transfer', 'airport', 'driver', 'car'],
  },
  {
    id: 'nameCorrection',
    categoryId: 'booking',
    icon: IdentificationCard,
    keywords: ['booking', 'name', 'correction', 'passport'],
  },
  {
    id: 'ancillaryService',
    categoryId: 'booking',
    icon: Headset,
    keywords: ['booking', 'seat', 'baggage', 'ancillary', 'refund'],
  },
  {
    id: 'refund',
    categoryId: 'refundCancel',
    icon: ArrowUUpLeft,
    keywords: ['refund', 'cancel', 'cancellation'],
  },
  {
    id: 'flightCancellation',
    categoryId: 'refundCancel',
    icon: CalendarX,
    keywords: ['refund', 'cancel', 'cancellation', 'flight'],
  },
  {
    id: 'paymentIssue',
    categoryId: 'payment',
    icon: CreditCard,
    keywords: ['payment', 'charge', 'transaction', 'card'],
  },
  {
    id: 'paymentReceipt',
    categoryId: 'payment',
    icon: Receipt,
    keywords: ['payment', 'receipt', 'ticket', 'itinerary'],
  },
  {
    id: 'delayedBaggage',
    categoryId: 'baggage',
    icon: TrolleySuitcase,
    keywords: ['baggage', 'delayed', 'luggage'],
  },
  {
    id: 'lostBaggage',
    categoryId: 'baggage',
    icon: Suitcase,
    keywords: ['baggage', 'lost', 'luggage'],
  },
  {
    id: 'unaccompaniedMinor',
    categoryId: 'specialAssistance',
    icon: Baby,
    keywords: ['child', 'minor', 'assistance', 'um'],
  },
  {
    id: 'specialAssistance',
    categoryId: 'specialAssistance',
    icon: Wheelchair,
    keywords: ['assistance', 'mobility', 'wheelchair', 'airport'],
  },
  {
    id: 'groupTravel',
    categoryId: 'groupTravel',
    icon: UsersThree,
    keywords: ['group', 'quotation', 'travel'],
  },
  {
    id: 'missingMiles',
    categoryId: 'chamMiles',
    icon: Medal,
    keywords: ['miles', 'loyalty', 'cham'],
  },
  {
    id: 'compliment',
    categoryId: 'feedback',
    icon: Gift,
    keywords: ['feedback', 'compliment', 'review'],
  },
]

export function filterSupportForms(forms, query, getText) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return forms

  return forms.filter((form) => {
    const fields = [
      form.id,
      ...(form.keywords || []),
      getText(`forms.items.${form.id}.title`),
      getText(`forms.items.${form.id}.description`),
      getText(`forms.categories.${form.categoryId}`),
    ]

    return fields.some((value) => String(value).toLowerCase().includes(normalized))
  })
}
