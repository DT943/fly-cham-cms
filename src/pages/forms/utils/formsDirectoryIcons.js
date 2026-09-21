import {
  ArrowsClockwise,
  ArrowUUpLeft,
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
} from '@phosphor-icons/react'

/**
 * Map a CMS "forms-directory" icon name to its Phosphor component. Mirrors
 * flychamadmin cms2's FORM_ICON_MAP so the public site renders the same icon the
 * editor picked. Unknown names fall back to the ticket icon.
 */
const FORM_ICON_MAP = {
  change: ArrowsClockwise,
  transport: Car,
  name: IdentificationCard,
  payment: CreditCard,
  minor: Baby,
  group: UsersThree,
  corporate: Briefcase,
  wheelchair: Wheelchair,
  medical: FirstAid,
  refund: ArrowUUpLeft,
  baggage: TrolleySuitcase,
  suitcase: Suitcase,
  feedback: ChatText,
  ticket: Ticket,
  package: Package,
  medal: Medal,
  plugs: Plugs,
  handshake: Handshake,
}

export const DEFAULT_FORM_ICON = Ticket

export function resolveFormIcon(iconName) {
  return FORM_ICON_MAP[iconName] || DEFAULT_FORM_ICON
}
