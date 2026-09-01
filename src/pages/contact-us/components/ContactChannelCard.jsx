import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const ContactChannelCard = ({ icon: Icon, title, description, cta, href }) => (
  <article className="bg-background rounded-2xl p-5 flex flex-col gap-4 border border-200 md:border-0 md:p-6 md:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
    <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
      <div className="w-11 h-11 rounded-full bg-100 flex items-center justify-center text-700 shrink-0">
        <Icon size={22} weight="regular" />
      </div>
      <h3 className={`${typography.itemTitle} font-bold text-700 m-0`}>
        {title}
      </h3>
    </div>
    <p className={`${typography.itemDescription} text-600 m-0 leading-relaxed flex-1`}>
      {description}
    </p>
    <LocalizedLink
      href={href}
      className={`${typography.button} font-medium text-50 bg-primary-1 hover:bg-primary-800 no-underline rounded-xl px-4 py-3 w-full inline-flex items-center justify-center gap-2 transition-colors`}
    >
      {cta}
      <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
    </LocalizedLink>
  </article>
)

export default ContactChannelCard
