import { resolvePhosphorIcon } from '../../../cms/adapters/phosphorIcons'
import {
  Buildings,
  GlobeHemisphereWest,
  ClipboardText,
  Headset,
  Phone,
  EnvelopeSimple,
  ChatCircleText,
} from '@phosphor-icons/react'

export const contactChannelIcons = {
  buildings: Buildings,
  globe: GlobeHemisphereWest,
  clipboard: ClipboardText,
  headset: Headset,
  phone: Phone,
  envelope: EnvelopeSimple,
  chat: ChatCircleText,
}

export const contactChannels = [
  { id: 'salesOffices', icon: 'buildings', href: '/help/contact-us/our-offices' },
  { id: 'gsa', icon: 'globe', href: '/help/contact-us/our-gsa' },
  { id: 'request', icon: 'clipboard', href: '/help/contact-us/forms' },
]

export function resolveContactChannelIcon(name) {
  return contactChannelIcons[name] || resolvePhosphorIcon(name)
}
