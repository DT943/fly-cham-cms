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
      { id: 'offices', icon: Buildings, href: '/help/contact-us/our-offices' },
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
      { id: 'forms', icon: ClipboardText, href: '/help/contact-us/forms' },
      { id: 'trackRequest', icon: MagnifyingGlass, href: '/help/contact-us/forms' },
    ],
    ctaHref: '/help/contact-us/forms',
    quickLinks: [
      { id: 'forms', icon: ClipboardText, href: '/help/contact-us/forms' },
      { id: 'trackRequest', icon: MagnifyingGlass, href: '/help/contact-us/forms' },
    ],
  },
]
