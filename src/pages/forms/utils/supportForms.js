import {
  ArrowsClockwise,
  Baby,
  Briefcase,
  Car,
  ChatText,
  CreditCard,
  FirstAid,
  Handshake,
  IdentificationCard,
  Medal,
  Package,
  Plugs,
  Suitcase,
  Ticket,
  TrolleySuitcase,
  UsersThree,
  Wheelchair,
  ArrowUUpLeft,
} from '@phosphor-icons/react'

export const formStageIds = ['all', 'beforeTravel', 'atAirport', 'afterTravel', 'others']

export const supportForms = [
  {
    id: 'bookingChange',
    stageId: 'beforeTravel',
    icon: ArrowsClockwise,
    keywords: ['booking', 'change', 'date', 'route', 'flight'],
  },
  {
    id: 'transportation',
    stageId: 'beforeTravel',
    icon: Car,
    keywords: ['transport', 'transfer', 'airport', 'driver', 'car'],
  },
  {
    id: 'nameCorrection',
    stageId: 'beforeTravel',
    icon: IdentificationCard,
    keywords: ['name', 'correction', 'passport'],
  },
  {
    id: 'paymentIssue',
    stageId: 'beforeTravel',
    icon: CreditCard,
    keywords: ['payment', 'charge', 'transaction', 'card'],
  },
  {
    id: 'unaccompaniedMinor',
    stageId: 'beforeTravel',
    icon: Baby,
    keywords: ['child', 'minor', 'unaccompanied', 'um'],
  },
  {
    id: 'groupTravel',
    stageId: 'beforeTravel',
    icon: UsersThree,
    keywords: ['group', 'travel'],
  },
  {
    id: 'corporateTravel',
    stageId: 'beforeTravel',
    icon: Briefcase,
    keywords: ['corporate', 'business', 'company'],
  },
  {
    id: 'wheelchair',
    stageId: 'atAirport',
    icon: Wheelchair,
    keywords: ['wheelchair', 'assistance', 'mobility', 'airport'],
  },
  {
    id: 'oxygenService',
    stageId: 'atAirport',
    icon: FirstAid,
    keywords: ['oxygen', 'medical', 'assistance'],
  },
  {
    id: 'refund',
    stageId: 'afterTravel',
    icon: ArrowUUpLeft,
    keywords: ['refund'],
  },
  {
    id: 'ancillaryRefund',
    stageId: 'afterTravel',
    icon: Ticket,
    keywords: ['ancillary', 'seat', 'baggage', 'refund'],
  },
  {
    id: 'lostBaggage',
    stageId: 'afterTravel',
    icon: Suitcase,
    keywords: ['baggage', 'lost', 'luggage', 'onboard'],
  },
  {
    id: 'delayedBaggage',
    stageId: 'afterTravel',
    icon: TrolleySuitcase,
    keywords: ['baggage', 'delayed', 'luggage'],
  },
  {
    id: 'claimMiles',
    stageId: 'afterTravel',
    icon: Medal,
    keywords: ['miles', 'loyalty', 'cham'],
  },
  {
    id: 'feedback',
    stageId: 'afterTravel',
    icon: ChatText,
    keywords: ['feedback', 'review', 'experience'],
  },
  {
    id: 'apiIntegration',
    stageId: 'others',
    icon: Plugs,
    keywords: ['api', 'ota', 'integration'],
  },
  {
    id: 'partnerGsa',
    stageId: 'others',
    icon: Handshake,
    keywords: ['gsa', 'partner', 'agent'],
  },
  {
    id: 'cargo',
    stageId: 'others',
    icon: Package,
    keywords: ['cargo', 'freight', 'goods', 'documents'],
  },
]

export function getSupportForm(id) {
  return supportForms.find((form) => form.id === id) || null
}

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
      getText(`forms.filters.${form.stageId}`),
    ]

    return fields.some((value) => String(value).toLowerCase().includes(normalized))
  })
}
