import { CaretRight } from '@phosphor-icons/react'
import { getLinkHref } from '../utils/links.js'

const JourneyStep = ({ icon: Icon, stepLabel, links }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-100 flex items-center justify-center flex-shrink-0 text-700">
        <Icon size={20} weight="regular" />
      </div>
      <span className="text-base font-bold text-700">
        {stepLabel}
      </span>
    </div>
    <ul className="list-none m-0 ps-[52px] flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.text}>
          <a
            href={getLinkHref(link)}
            className="text-sm font-medium text-primary-1 no-underline hover:underline inline-flex items-center gap-1"
          >
            {link.text}
            <CaretRight size={12} weight="bold" className="flex-shrink-0 rtl:-scale-x-100" />
          </a>
        </li>
      ))}
    </ul>
  </div>
)

export default JourneyStep
