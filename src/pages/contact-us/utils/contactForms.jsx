import {
  CreditCard,
  WarningCircle,
  ArrowUUpLeftIcon,
  TrolleySuitcase,
  Wheelchair,
  ClipboardText,
  Buildings,
  GlobeHemisphereWest,
  Headset,
  Phone,
  EnvelopeSimple,
  ChatCircleText,
} from '@phosphor-icons/react'
import { resolvePhosphorIcon } from '../../../cms/adapters/phosphorIcons'

/** Composite "payment issue" glyph — a credit card with a small warning badge. */
function PaymentIssueIcon({ size = 22, weight = 'regular', ...props }) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <CreditCard size={size} weight={weight} {...props} />
      <WarningCircle
        size={Math.round(size * 0.48)}
        weight="fill"
        className="absolute -top-0.5 -end-0.5 bg-100 rounded-full"
        {...props}
      />
    </span>
  )
}

export const contactFormIcons = {
  paymentIssue: PaymentIssueIcon,
  refund: ArrowUUpLeftIcon,
  baggage: TrolleySuitcase,
  wheelchair: Wheelchair,
  clipboard: ClipboardText,
  buildings: Buildings,
  globe: GlobeHemisphereWest,
  headset: Headset,
  phone: Phone,
  envelope: EnvelopeSimple,
  chat: ChatCircleText,
}

export const contactForms = [
  { id: 'payment', icon: 'paymentIssue', href: '#' },
  { id: 'refund', icon: 'refund', href: '#' },
  { id: 'baggage', icon: 'baggage', href: '#' },
  { id: 'assistance', icon: 'wheelchair', href: '#' },
]

export function resolveContactFormIcon(name) {
  // Curated keys (incl. the composite paymentIssue) win; any other name resolves
  // from the full Phosphor library so newly-picked icons render.
  return contactFormIcons[name] || resolvePhosphorIcon(name)
}
