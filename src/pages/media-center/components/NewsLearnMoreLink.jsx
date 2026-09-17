import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

const NewsLearnMoreLink = ({ href, label, className = '' }) => (
  <LocalizedLink
    href={href}
    className={`inline-flex items-center gap-2.5 font-semibold text-primary-1 no-underline ${typography.button} ${className}`}
  >
    <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-primary-1">
      <ArrowRight size={16} weight="bold" className="text-50 rtl:-scale-x-100" />
    </span>
    {label}
  </LocalizedLink>
)

export default NewsLearnMoreLink
