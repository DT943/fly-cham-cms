import { Clock } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const NewsDetailHeader = ({ image, imageAlt, date, dateTime, category, title }) => (
  <header className="flex flex-col gap-5 md:gap-6">
    <div className="overflow-hidden rounded-2xl">
      <img src={image} alt={imageAlt} className="aspect-[16/10] w-full object-cover sm:aspect-[2/1]" />
    </div>

    <div className="flex flex-col gap-4 md:gap-5">
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-600 ${typography.caption}`}>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={16} weight="regular" className="shrink-0" aria-hidden />
          <time dateTime={dateTime}>{date}</time>
        </span>
        <span aria-hidden className="text-500">
          ·
        </span>
        <span
          className={`rounded-full bg-secondary-1/15 px-3 py-1 font-medium text-primary-1 ${typography.caption}`}
        >
          {category}
        </span>
      </div>

      <h1 className={`m-0 font-semibold text-primary-1 ${typography.pageTitle}`}>{title}</h1>
    </div>
  </header>
)

export default NewsDetailHeader
