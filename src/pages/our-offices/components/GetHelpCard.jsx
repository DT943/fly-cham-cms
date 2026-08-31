import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const GetHelpCard = ({ icon: Icon, title, description, href }) => (
  <a
    href={href}
    className="bg-background rounded-2xl border border-200 p-5 md:p-6 flex flex-col justify-between gap-6 no-underline text-inherit hover:border-300 transition-colors"
  >
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Icon size={22} weight="regular" className="text-700 shrink-0" />
        <h3 className={`${typography.itemTitle} font-semibold text-700 m-0`}>
          {title}
        </h3>
      </div>
      <p className={`${typography.itemDescription} text-800 m-0 leading-relaxed`}>
        {description}
      </p>
    </div>
    <div className="w-8 h-8 bg-primary-1 rounded-full flex items-center justify-center self-end shrink-0">
      <ArrowRight size={14} weight="bold" className="text-50 rtl:-scale-x-100" />
    </div>
  </a>
)

export default GetHelpCard
