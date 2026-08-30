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
        className="absolute -bottom-0.5 -right-1 rounded-full bg-[#f0f0f0]"
        {...props}
      />
    </span>
  )
}

export const helpCategories = [
  {
    icon: Question,
    title: 'FAQs',
    description: 'Find quick answers to common questions.',
  },
  {
    icon: ClipboardText,
    title: 'Forms & support requests',
    description: 'Submit a request or ask for help.',
  },
  {
    icon: Phone,
    title: 'Contact us',
    description: 'Get in touch with our customer support team.',
  },
  {
    icon: TrackRequestIcon,
    title: 'Track a request',
    description: 'Check the status of your existing request.',
  },
  {
    icon: MapPin,
    title: 'Offices & agents',
    description: 'Find Fly Cham offices and travel agents.',
  },
]
