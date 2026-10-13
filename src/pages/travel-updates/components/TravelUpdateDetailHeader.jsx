import { typography } from '../../../styles/typography.js'

/**
 * Detail page header — badge, title, subtitle.
 */
const TravelUpdateDetailHeader = ({ badge, title, subtitle }) => (
  <header className="flex flex-col gap-3 md:gap-4">
    {badge ? (
      <span
        className={`w-fit rounded-md bg-secondary px-2.5 py-1 font-semibold text-primary-1 ${typography.caption}`}
      >
        {badge}
      </span>
    ) : null}
    <h1 className={`font-bold text-primary-1 ${typography.pageTitle} lg:text-[36px]`}>
      {title}
    </h1>
    {subtitle ? (
      <p className={`m-0 font-normal text-700 ${typography.sectionDescription}`}>
        {subtitle}
      </p>
    ) : null}
  </header>
)

export default TravelUpdateDetailHeader
