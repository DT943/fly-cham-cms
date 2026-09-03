import {
  Buildings,
  ClipboardText,
  EnvelopeSimple,
  MagnifyingGlass,
  Question,
} from '@phosphor-icons/react'

export const helpMenuPanels = [
  {
    id: 'getHelp',
    icon: Question,
    links: [
      { id: 'faq', icon: Question, href: '/help/faqs' },
      { id: 'contactUs', icon: EnvelopeSimple, href: '/help/contact-us' },
      { id: 'offices', icon: Buildings, href: '/help/our-offices' },
    ],
    ctaHref: '/help',
    quickLinks: [
      { id: 'faq', icon: Question, href: '/help/faqs' },
      { id: 'contactUs', icon: EnvelopeSimple, href: '/help/contact-us' },
    ],
  },
  {
    id: 'requests',
    icon: ClipboardText,
    links: [
      { id: 'forms', icon: ClipboardText, href: '/help/forms' },
      { id: 'trackRequest', icon: MagnifyingGlass, href: '/help/forms' },
    ],
    ctaHref: '/help/forms',
    quickLinks: [
      { id: 'forms', icon: ClipboardText, href: '/help/forms' },
      { id: 'trackRequest', icon: MagnifyingGlass, href: '/help/forms' },
    ],
  },
]
