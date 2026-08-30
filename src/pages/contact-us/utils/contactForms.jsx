import {
  CreditCard,
  WarningCircle,
  ArrowCounterClockwise,
  TrolleySuitcase,
  Wheelchair,
  ArrowUUpLeftIcon,
} from '@phosphor-icons/react'

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

export const contactForms = [
  { id: 'payment', icon: PaymentIssueIcon, href: '#' },
  { id: 'refund', icon: ArrowUUpLeftIcon , href: '#' },
  { id: 'baggage', icon: TrolleySuitcase, href: '#' },
  { id: 'assistance', icon: Wheelchair, href: '#' },
]
