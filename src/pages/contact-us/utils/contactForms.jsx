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

/** Request-a-form page. `?form=` selects the support form. */
export const REQUEST_FORM_PAGE = '/help/contact-us/forms/request-a-form'

const SUPPORT_FORM_IDS = [
  'bookingChange',
  'transportation',
  'nameCorrection',
  'paymentIssue',
  'unaccompaniedMinor',
  'groupTravel',
  'corporateTravel',
  'wheelchair',
  'oxygenService',
  'refund',
  'ancillaryRefund',
  'lostBaggage',
  'delayedBaggage',
  'claimMiles',
  'feedback',
  'apiIntegration',
  'partnerGsa',
  'cargo',
]

/** Contact-card ids and icons that are not the support-form id itself. */
const FORM_ALIASES = {
  payment: 'paymentIssue',
  baggage: 'delayedBaggage',
  assistance: 'wheelchair',
  specialassistance: 'wheelchair',
}

const TITLE_TO_FORM = {
  paymentissue: 'paymentIssue',
  مشكلةفوالدفع: 'paymentIssue',
  refundrequest: 'refund',
  refund: 'refund',
  طلباسترداد: 'refund',
  delayedbaggage: 'delayedBaggage',
  أمتعةمتأخرة: 'delayedBaggage',
  specialassistance: 'wheelchair',
  wheelchair: 'wheelchair',
  مساعدةخاصة: 'wheelchair',
}

const GENERIC_HREFS = new Set(['', '#', '/help/contact-us/forms', '/help/contact-us/forms/'])

function foldKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '')
}

/** Support-form id for a contact card, from its id, icon, or title. */
export function matchContactFormId(form) {
  for (const raw of [form?.id, form?.icon]) {
    const key = foldKey(raw)
    if (!key) continue
    if (FORM_ALIASES[key]) return FORM_ALIASES[key]
    const exact = SUPPORT_FORM_IDS.find((id) => foldKey(id) === key)
    if (exact) return exact
  }
  return TITLE_TO_FORM[foldKey(form?.title)] || null
}

export function contactFormRequestHref(formId) {
  return `${REQUEST_FORM_PAGE}?form=${encodeURIComponent(formId)}`
}

/**
 * Where a contact-form card should go. A placeholder link (`#` or the forms
 * index) becomes the request-a-form page for the matched form. A link that
 * already names a form is rewritten to that same page. Any other href is kept.
 */
export function resolveContactFormHref(form) {
  const href = String(form?.href || '').trim()
  if (href.includes('request-a-form')) {
    const query = href.match(/[?&]form=([^&#]+)/)
    if (query) return contactFormRequestHref(decodeURIComponent(query[1]))
    const matched = matchContactFormId(form)
    return matched ? contactFormRequestHref(matched) : href
  }
  const detail = href.match(/^\/help\/contact-us\/forms\/([^/?#]+)\/?$/)
  if (detail) {
    const id = matchContactFormId({ id: detail[1] }) || decodeURIComponent(detail[1])
    return contactFormRequestHref(id)
  }
  const matched = matchContactFormId(form)
  if (matched && GENERIC_HREFS.has(href)) return contactFormRequestHref(matched)
  return href
}

export function resolveContactFormIcon(name) {
  // Curated keys (incl. the composite paymentIssue) win; any other name resolves
  // from the full Phosphor library so newly-picked icons render.
  return contactFormIcons[name] || resolvePhosphorIcon(name)
}
