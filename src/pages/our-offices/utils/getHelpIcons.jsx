import {
  Headset,
  ClipboardText,
  Phone,
  EnvelopeSimple,
  ChatCircleText,
  Info,
  Lifebuoy,
  Question,
} from '@phosphor-icons/react'

export const getHelpIcons = {
  headset: Headset,
  clipboard: ClipboardText,
  phone: Phone,
  envelope: EnvelopeSimple,
  chat: ChatCircleText,
  info: Info,
  lifebuoy: Lifebuoy,
  question: Question,
}

export function resolveGetHelpIcon(name) {
  return getHelpIcons[name] || Headset
}
