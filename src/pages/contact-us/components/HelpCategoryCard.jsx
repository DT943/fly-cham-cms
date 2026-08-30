import { ArrowRight } from '@phosphor-icons/react'

const HelpCategoryCard = ({ icon: Icon, title, description }) => (
  <div className="bg-background rounded-xl p-6 flex flex-col justify-between min-h-[220px] md:min-h-[247px] cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] transition-shadow">
    <div className="flex flex-col gap-5">
      <div className="w-11 h-11 rounded-full bg-100 flex items-center justify-center text-700">
        <Icon size={22} weight="regular" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-700 m-0">
          {title}
        </h3>
        <p className="text-sm font-normal text-600 m-0 leading-snug">
          {description}
        </p>
      </div>
    </div>
    <div className="flex justify-end mt-6">
      <div className="w-8 h-8 bg-primary-1 rounded-full flex items-center justify-center">
        <ArrowRight size={14} weight="bold" className="text-50" />
      </div>
    </div>
  </div>
)

export default HelpCategoryCard
