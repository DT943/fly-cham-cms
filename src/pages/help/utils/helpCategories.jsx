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

export const helpCategories = [
  { id: 'contact', icon: Phone, href: '/help/contact-us' },
  { id: 'faqs', icon: Question },
  { id: 'offices', icon: MapPin, href: '/help/our-offices' },
  { id: 'forms', icon: ClipboardText },
  { id: 'track', icon: TrackRequestIcon },
]
