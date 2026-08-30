import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const HelpCategoryCard = ({ icon: Icon, title, description }) => (
  <div className="bg-background rounded-xl cursor-pointer flex flex-row items-center gap-3 p-4 border border-200 md:flex-col md:items-stretch md:justify-between md:gap-0 md:p-4 md:min-h-[220px] lg:min-h-[247px] md:border-0 md:shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] transition-shadow">
    <div className="flex flex-row items-center gap-3 flex-1 min-w-0 md:flex-col md:items-start md:gap-5">
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-100 flex items-center justify-center text-700 flex-shrink-0">
        <Icon size={22} weight="regular" />
      </div>
      <div className="flex flex-col gap-1 md:gap-2 min-w-0">
        <h3 className={`${typography.itemTitle} font-bold text-700 m-0`}>
          {title}
        </h3>
        <p className={`${typography.caption} font-normal text-600 m-0 leading-snug`}>
          {description}
        </p>
      </div>
    </div>
    <div className="flex-shrink-0 md:self-end md:mt-6">
      <div className="w-8 h-8 bg-primary-1 rounded-full flex items-center justify-center">
        <ArrowRight size={14} weight="bold" className="text-50 rtl:-scale-x-100" />
      </div>
    </div>
  </div>
)

export default HelpCategoryCard
