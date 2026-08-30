import { CaretRight } from '@phosphor-icons/react'
import { getLinkHref } from '../utils/links.js'

const JourneyStep = ({ icon: Icon, stepLabel, links }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0 text-[#3e3e3b]">
        <Icon size={20} weight="regular" />
      </div>
      <span className="font-montserrat text-base font-bold text-[#3e3e3b]">
        {stepLabel}
      </span>
    </div>
    <ul className="list-none m-0 pl-[52px] flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.text}>
          <a
            href={getLinkHref(link)}
            className="font-montserrat text-sm font-medium text-[#006080] no-underline hover:underline inline-flex items-center gap-1"
          >
            {link.text}
            <CaretRight size={12} weight="bold" className="flex-shrink-0" />
          </a>
        </li>
      ))}
    </ul>
  </div>
)

export default JourneyStep
