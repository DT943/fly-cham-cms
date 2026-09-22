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
import { resolvePhosphorIcon } from '../../../cms/adapters/phosphorIcons'

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
  // Prefer the local curated overrides, then resolve any icon from the full
  // Phosphor library by name (matches the admin icon picker).
  return getHelpIcons[name] || resolvePhosphorIcon(name)
}
