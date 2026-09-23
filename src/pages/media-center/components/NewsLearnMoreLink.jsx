import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

/**
 * News "Learn More" / "Read more" CTA — teal circle + label. On hover the
 * circle expands into a pill behind the label and the text turns white.
 */
const NewsLearnMoreLink = ({ href, label, className = '' }) => (
  <LocalizedLink
    href={href}
    className={`group/lm relative inline-flex h-[34px] items-center overflow-hidden rounded-full no-underline ${typography.button} ${className}`}
  >
    <span
      aria-hidden
      className="absolute inset-y-0 start-0 w-[34px] rounded-full bg-primary-1 transition-[width] duration-300 ease-out group-hover/lm:w-full"
    />
    <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
      <ArrowRight size={16} weight="bold" className="text-50 rtl:-scale-x-100" />
    </span>
    <span
      className="cms-lm-label relative z-10 pe-3 ps-2.5 transition-[color,font-weight] duration-300"
      style={{
        color: 'var(--color-primary-1)',
        fontWeight: 600,
        '--cms-hc': 'var(--color-50)',
        '--cms-hw': 600,
      }}
    >
      {label}
    </span>
  </LocalizedLink>
)

export default NewsLearnMoreLink
