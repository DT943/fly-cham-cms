import { CaretRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { getLinkHref } from '../utils/links.js'

const JourneyStep = ({ icon: Icon, stepLabel, links }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-100 flex items-center justify-center flex-shrink-0 text-700">
        <Icon size={20} weight="regular" />
      </div>
      <span className={`${typography.itemTitle} font-bold text-700`}>
        {stepLabel}
      </span>
    </div>
    <ul className="list-none m-0 ps-[52px] flex flex-col gap-2.5 md:gap-3">
      {links.map((link) => (
        <li key={link.text}>
          <a
            href={getLinkHref(link)}
            className={`${typography.itemDescription} font-medium text-primary-1 no-underline hover:underline inline-flex items-center gap-1`}
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
