import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const ContactFormCard = ({ icon: Icon, title, description, href }) => (
  <LocalizedLink
    href={href}
    className="bg-background rounded-lg p-5 flex flex-col gap-3 no-underline text-inherit "
  >
    <div className="w-10 h-10 rounded-full bg-100 flex items-center justify-center text-700 shrink-0">
      <Icon size={22} weight="regular" />
    </div>
    <h3 className={`${typography.itemTitle} font-semibold text-700 m-0`}>
      {title}
    </h3>
    <div className="flex items-end justify-between gap-3">
      <p className={`${typography.caption} font-normal text-700 m-0 leading-snug flex-1`}>
        {description}
      </p>
      <div className="w-8 h-8 bg-primary-1 rounded-full flex items-center justify-center shrink-0">
        <ArrowRight size={14} weight="bold" className="text-50 rtl:-scale-x-100" />
      </div>
    </div>
  </LocalizedLink>
)

export default ContactFormCard
