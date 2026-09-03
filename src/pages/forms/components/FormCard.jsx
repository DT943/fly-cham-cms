import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const FormCard = ({ id, icon: Icon, category, title, description, onSelect }) => (
  <button
    type="button"
    id={id}
    onClick={onSelect}
    className="scroll-mt-28 bg-background rounded-2xl p-5 md:p-6 flex flex-col gap-4 h-full w-full text-start cursor-pointer border-0 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] transition-shadow"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-100 flex items-center justify-center text-700 shrink-0">
        <Icon size={22} weight="regular" />
      </div>
      <span className={`${typography.caption} text-primary-1 bg-primary-1/20 rounded-full px-3 py-1 font-medium whitespace-nowrap`}>
        {category}
      </span>
    </div>
    <h3 className={`${typography.itemTitle} font-semibold text-700 m-0`}>
      {title}
    </h3>
    <div className="flex items-end justify-between gap-3 mt-auto">
      <p className={`${typography.caption} text-600 m-0 leading-snug flex-1`}>
        {description}
      </p>
      <div className="w-8 h-8 bg-primary-1 rounded-full flex items-center justify-center shrink-0">
        <ArrowRight size={14} weight="bold" className="text-50 rtl:-scale-x-100" />
      </div>
    </div>
  </button>
)

export default FormCard
