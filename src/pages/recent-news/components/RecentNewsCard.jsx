import { Clock } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

/**
 * Listing card for Recent News: image, metadata, and title only.
 * Matches the Media Center grid card without excerpt or learn-more CTA.
 */
const RecentNewsCard = ({ image, imageAlt, date, dateTime, category, title, href }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-200 bg-50">
    <LocalizedLink href={href} className="block no-underline">
      <img src={image} alt={imageAlt} className="aspect-[4/3] w-full object-cover" />
    </LocalizedLink>

    <div className="flex flex-1 flex-col gap-3 p-5 md:gap-4 md:p-6">
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-600 ${typography.caption}`}>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={16} weight="regular" className="shrink-0" aria-hidden />
          <time dateTime={dateTime}>{date}</time>
        </span>
        <span aria-hidden className="text-500">
          ·
        </span>
        <span
          className={`rounded-full bg-primary-1/10 px-3 py-1 font-medium text-primary-1 ${typography.caption}`}
        >
          {category}
        </span>
      </div>

      <h2 className={`m-0 font-semibold text-primary-1 ${typography.itemTitle}`}>
        <LocalizedLink href={href} className="text-inherit no-underline hover:underline">
          {title}
        </LocalizedLink>
      </h2>
    </div>
  </article>
)

export default RecentNewsCard
