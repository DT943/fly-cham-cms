import {
  Question,
  ClipboardText,
  Phone,
  PaperPlaneTilt,
  MagnifyingGlass,
  MapPin,
} from '@phosphor-icons/react'

function TrackRequestIcon({ size = 22, weight = 'regular', ...props }) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <PaperPlaneTilt size={size} weight={weight} {...props} />
      <MagnifyingGlass
        size={Math.round(size * 0.48)}
        weight="bold"
        className="absolute -bottom-0.5 -end-1 rounded-full bg-100"
        {...props}
      />
    </span>
  )
}

export const helpCategoryIcons = {
  phone: Phone,
  question: Question,
  mapPin: MapPin,
  clipboard: ClipboardText,
  track: TrackRequestIcon,
}

export const helpCategories = [
  { id: 'contact', icon: 'phone', href: '/help/contact-us' },
  { id: 'faqs', icon: 'question', href: '/help/faqs' },
  { id: 'offices', icon: 'mapPin', href: '/help/contact-us/our-offices' },
  { id: 'forms', icon: 'clipboard', href: '/help/contact-us/forms' },
  { id: 'track', icon: 'track' },
]

export function resolveHelpCategoryIcon(name) {
  return helpCategoryIcons[name] || Question
}
